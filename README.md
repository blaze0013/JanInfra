# JanInfra Insight

A multilingual citizen-development intelligence platform MVP.

## Setup & Startup
This project uses SQLite for the local MVP to avoid Docker setup blockers.

1. Ensure Node.js (v20+) is installed.
2. Run `npm install`
3. Configure your API key:
   Create a `.env` file in the root directory and add:
   `GEMINI_API_KEY=your_gemini_api_key_here`
   (Note: The Gemini API is called exclusively on the server side to power the AI categorization and summarization service.)
4. Run `npx prisma db push`
5. Run `node prisma/seed.js`
6. Run `npm run dev`

Access the application at `http://localhost:3000`.

## Demo Accounts (Password: `Pass@123`)
- `citizen1@demo.local`
- `analyst1@demo.local`
- `admin1@demo.local`

## Features
- **Citizen App:** Submit infrastructure problems via text or mock-voice recording. View submission status.
- **Analyst App:** Dashboard KPIs, request review interface, geographic hotspots calculator, automated AI recommendation view.
- **Admin App:** CSV Dataset upload tool.

## Demo Adapters
- `DemoAIService`: Deterministically maps "water/pani" to Drinking Water and "road/sadak" to Roads.
- `DemoSpeechService`: Returns a fixed transcript after a short processing delay.
- `Auth`: Simple cookie-based authentication bypassing Firebase.
