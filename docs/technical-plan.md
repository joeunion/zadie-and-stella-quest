# Technical Plan: Zadie and Stella Quest

## Tech Stack

### Next.js (our main framework)
Next.js is a popular tool for building web apps. Think of it as the foundation of the house — it handles showing pages to the user (the "frontend") and talking to external services like the Claude AI (the "backend"). We're using it because:
- It handles both the visual game and the behind-the-scenes AI logic in one project
- It works great on tablets and phones out of the box
- It's easy to deploy (put on the internet) when we're ready

### React (comes with Next.js)
React is how we build the visual parts of the app — buttons, screens, animations. It lets us build the game as small reusable pieces (called "components") that snap together.

### CSS / Tailwind CSS (styling)
This is how we make the game look good — colors, sizes, layouts, animations. Tailwind CSS is a tool that makes styling faster by giving us shortcuts.

### Claude API (AI-powered adaptive difficulty)
This is the "brain" of the game. We'll send the player's performance data (how many right/wrong, how fast) to Claude, and it will send back adjusted difficulty settings and encouraging messages. An API is just a way for our app to talk to another service over the internet.

### Local Storage (saving progress)
The browser has a built-in way to save small amounts of data on the device. We'll use this to remember which levels are unlocked and how the player is doing — no account or login needed.

## Project Structure

```
src/
├── app/                        # Pages and routes
│   ├── page.js                 # Welcome/home screen
│   ├── levels/
│   │   └── page.js             # Level select screen
│   ├── play/
│   │   └── [level]/
│   │       └── page.js         # The actual game screen (works for any level)
│   ├── complete/
│   │   └── [level]/
│   │       └── page.js         # Level completion celebration screen
│   └── api/
│       └── difficulty/
│           └── route.js        # Backend: talks to Claude API for adaptive difficulty
├── components/                 # Reusable visual pieces
│   ├── MathProblem.js          # Displays a math problem with answer choices
│   ├── StarProgress.js         # Shows stars earned / progress bar
│   ├── LevelCard.js            # A clickable card for each level on the select screen
│   ├── Celebration.js          # Fun animations when they get an answer right
│   └── ThemeBackground.js      # The themed background for each world
├── lib/                        # Helper code
│   ├── generateProblem.js      # Creates math problems based on operation + difficulty
│   ├── adaptiveDifficulty.js   # Manages difficulty state and talks to the API
│   └── progress.js             # Saves/loads progress from local storage
└── styles/                     # Visual styling
    └── globals.css             # Global styles and theme colors
```

**What all this means**: The `app/` folder contains the different screens of the game. The `components/` folder has the building blocks we reuse across screens. The `lib/` folder has the "logic" — generating math problems, managing difficulty, saving progress.

## How It Works

### Welcome Screen
A colorful landing page with the game title and a big "Play" button. Simple and inviting.

### Level Select
Shows four cards — one per world. Each card has the theme art and name. Level 1 is unlocked by default. Others unlock as you complete the previous level. Locked levels are visually dimmed with a lock icon.

### The Game (core loop)
1. A math problem appears with 4 multiple-choice answers (big, tappable buttons)
2. The player taps an answer
3. **Correct**: Stars/sparkles animation, encouraging message, earn a star
4. **Incorrect**: Gentle message ("Almost! The answer is X"), no penalty
5. Next problem appears (difficulty may adjust based on performance)
6. After earning 10 stars, the level is complete — celebration screen!

### Adaptive Difficulty (Claude API)
- Every few problems, the game sends performance data to our backend
- The backend sends it to Claude with a prompt like: "This 7-year-old got 8/10 addition problems right in an average of 4 seconds. Current difficulty is 'medium'. What should the next difficulty be?"
- Claude responds with a new difficulty level and an encouraging message
- The game adjusts: harder problems use bigger numbers, easier ones use smaller numbers

### Math Problem Generation
Problems are generated based on operation and difficulty:
- **Addition**: Easy (1+1 to 5+5), Medium (5+5 to 15+15), Hard (10+10 to 50+50)
- **Subtraction**: Easy (1-1 to 10-5), Medium (10-5 to 25-10), Hard (25-10 to 50-25)
- **Multiplication**: Easy (1×1 to 5×5), Medium (2×2 to 8×8), Hard (3×3 to 12×12)
- **Division**: Easy (basic facts like 6÷2), Medium (up to 50÷5), Hard (up to 100÷10)
- All division problems produce whole number answers (no decimals for 7-year-olds!)

### Progress System
- Stars earned and levels unlocked saved to browser local storage
- Progress persists between sessions (close and reopen = still there)
- 10 stars per level to complete it

## APIs & External Services

### Claude API (Anthropic)
- **What it does**: Powers adaptive difficulty and generates encouraging messages
- **How to get a key**: Sign up at console.anthropic.com, create an API key
- **Authentication**: API key sent in request headers
- **Cost**: Very low — small text requests, probably pennies for hundreds of games
- **Security**: API key stored in a `.env` file (never in the code, never committed to git)
- **Rate limits**: Generous for our use case — we only call it every few problems

### Environment Variables
We'll create a `.env.local` file with:
```
ANTHROPIC_API_KEY=your_key_here
```
This file is automatically ignored by git (Next.js does this by default) so your secret key never gets uploaded to the internet.

## Data Storage

All data stored locally in the browser using Local Storage:
- `zadieStella_progress`: Which levels are unlocked, stars per level
- `zadieStella_difficulty`: Current difficulty settings per level
- `zadieStella_performance`: Recent performance data for adaptive difficulty

No database needed. No accounts. No login. Simple.

## Deployment

We'll use **Vercel** to put the app on the internet:
- Vercel is made by the same team that makes Next.js, so it works perfectly
- Free tier is more than enough for this project
- Gives you a URL you can open on any tablet
- We'll set the API key as an environment variable in Vercel so it works in production too
- Deploy right from the terminal using the Vercel CLI
