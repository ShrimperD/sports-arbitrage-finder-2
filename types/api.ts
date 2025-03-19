// The Odds API types
export interface TheOddsApiResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

// RapidAPI types
export interface RapidApiResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

// Normalized types for our application
export interface NormalizedOpportunity {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sportKey: string;
  sportTitle: string;
  commenceTime: string;
  bookmakers: Array<{
    key: string;
    title: string;
    lastUpdate: string;
    markets: Array<{
      key: string;
      lastUpdate: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

export interface ArbitrageOpportunity extends NormalizedOpportunity {
  totalReturn: number;
  bets: Array<{
    team: string;
    odds: number;
    bookmaker: string;
    stake: number;
  }>;
} 