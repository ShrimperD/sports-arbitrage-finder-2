# Sports Arbitrage Finder

A web application that finds arbitrage opportunities across different sports betting platforms. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Real-time arbitrage opportunity detection
- Integration with multiple sports betting APIs
- Hedge calculator for optimal bet sizing
- Filter by minimum return percentage
- Sort by date or profit percentage
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Radix UI Components
- The Odds API
- RapidAPI Sports API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sports-arbitrage-finder-2.git
cd sports-arbitrage-finder-2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
THE_ODDS_API_KEY=your_the_odds_api_key
RAPID_API_KEY=your_rapid_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Render.com. The deployment process is automatic when you push to the main branch.

## License

MIT 