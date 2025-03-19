import { TheOddsApiResponse, RapidApiResponse, NormalizedOpportunity, ArbitrageOpportunity } from '@/types/api';

const THE_ODDS_API_KEY = process.env.THE_ODDS_API_KEY;
const RAPID_API_KEY = process.env.RAPID_API_KEY;

if (!THE_ODDS_API_KEY || !RAPID_API_KEY) {
  throw new Error('Missing required API keys in environment variables');
}

const THE_ODDS_API_URL = 'https://api.the-odds-api.com/v4/sports/upcoming/odds/';
const RAPID_API_URL = 'https://sportsbook-api2.p.rapidapi.com/odds/';

async function fetchTheOddsApi(): Promise<TheOddsApiResponse[]> {
  const response = await fetch(
    `${THE_ODDS_API_URL}?regions=us&markets=h2h&apiKey=${THE_ODDS_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch from The Odds API');
  }
  
  return response.json();
}

async function fetchRapidApi(): Promise<RapidApiResponse[]> {
  if (!RAPID_API_KEY) {
    throw new Error('RapidAPI key is not defined');
  }

  const response = await fetch(RAPID_API_URL, {
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'sportsbook-api2.p.rapidapi.com'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch from RapidAPI');
  }
  
  return response.json();
}

function normalizeOpportunity(data: TheOddsApiResponse | RapidApiResponse): NormalizedOpportunity {
  return {
    id: data.id,
    homeTeam: data.home_team,
    awayTeam: data.away_team,
    sportKey: data.sport_key,
    sportTitle: data.sport_title,
    commenceTime: data.commence_time,
    bookmakers: data.bookmakers.map(bm => ({
      key: bm.key,
      title: bm.title,
      lastUpdate: bm.last_update,
      markets: bm.markets.map(market => ({
        key: market.key,
        lastUpdate: market.last_update,
        outcomes: market.outcomes.map(outcome => ({
          name: outcome.name,
          price: outcome.price
        }))
      }))
    }))
  };
}

function findArbitrageOpportunities(opportunities: NormalizedOpportunity[]): ArbitrageOpportunity[] {
  return opportunities
    .map(opportunity => {
      const h2hMarkets = opportunity.bookmakers
        .flatMap(bm => bm.markets.filter(m => m.key === 'h2h'))
        .filter(m => m.outcomes.length === 2);

      if (h2hMarkets.length < 2) return null;

      const arbitrageOpportunities: ArbitrageOpportunity[] = [];

      // Compare markets across different bookmakers
      for (let i = 0; i < h2hMarkets.length; i++) {
        for (let j = i + 1; j < h2hMarkets.length; j++) {
          const market1 = h2hMarkets[i];
          const market2 = h2hMarkets[j];
          const bookmaker1 = opportunity.bookmakers.find(bm => bm.markets.includes(market1))!;
          const bookmaker2 = opportunity.bookmakers.find(bm => bm.markets.includes(market2))!;

          // Check for arbitrage between outcomes
          for (const outcome1 of market1.outcomes) {
            for (const outcome2 of market2.outcomes) {
              if (outcome1.name === outcome2.name) continue;

              const totalReturn = (1 / outcome1.price + 1 / outcome2.price) * 100;
              if (totalReturn < 100) {
                // Found an arbitrage opportunity
                const stake = 100; // Base stake
                const stake1 = (stake * outcome2.price) / (outcome1.price + outcome2.price);
                const stake2 = stake - stake1;

                arbitrageOpportunities.push({
                  ...opportunity,
                  totalReturn: 100 - totalReturn,
                  bets: [
                    {
                      team: outcome1.name,
                      odds: outcome1.price,
                      bookmaker: bookmaker1.title,
                      stake: stake1
                    },
                    {
                      team: outcome2.name,
                      odds: outcome2.price,
                      bookmaker: bookmaker2.title,
                      stake: stake2
                    }
                  ]
                });
              }
            }
          }
        }
      }

      return arbitrageOpportunities;
    })
    .filter((opportunities): opportunities is ArbitrageOpportunity[] => opportunities !== null)
    .flat();
}

export async function fetchArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
  try {
    const [theOddsData, rapidData] = await Promise.all([
      fetchTheOddsApi(),
      fetchRapidApi()
    ]);

    const normalizedOpportunities = [
      ...theOddsData.map(normalizeOpportunity),
      ...rapidData.map(normalizeOpportunity)
    ];

    return findArbitrageOpportunities(normalizedOpportunities);
  } catch (error) {
    console.error('Error fetching arbitrage opportunities:', error);
    throw error;
  }
} 