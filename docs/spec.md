# Zadie and Stella Quest

## What It Does
A math adventure game designed for 7-year-olds (and specifically for Zadie and Stella!). Kids travel through four unique worlds — space, ocean, enchanted forest, and a castle — solving math problems to progress. The game adapts its difficulty using AI so it's always challenging but never frustrating.

## Who It's For
Kids around age 7 who are learning math fundamentals — addition, subtraction, multiplication, and division. Built as a tablet-friendly web app with big, colorful, tap-friendly design.

## Core Features

### Four Themed Levels
Each level is a different world with a different math operation:

1. **Space Journey (Addition)** — Travel planet to planet, solving addition problems to fuel your rocket and explore the galaxy.
2. **Ocean Explorer (Subtraction)** — Dive deeper into the ocean, discovering sea creatures by solving subtraction problems.
3. **Enchanted Forest (Multiplication)** — Journey through a magical forest, helping friendly creatures with multiplication puzzles.
4. **Castle Quest (Division)** — Travel through a castle, solving division problems to unlock doors and find treasure.

### Adaptive Difficulty (AI-Powered)
- The game watches how the player is doing — tracking correct/incorrect answers and response time.
- If they're getting answers right quickly, problems get harder (bigger numbers, more steps).
- If they're struggling, problems get easier and the game offers encouragement.
- Difficulty adjusts within each level, so the game always feels "just right."

### Kid-Friendly Design
- Big, colorful buttons and text — easy to tap on a tablet.
- Fun animations or visual feedback when they answer (stars, sparkles, character reactions).
- Encouraging messages for both right and wrong answers (never punishing).
- Simple navigation — a 7-year-old should be able to use it without help.

### Progress Tracking
- Players earn stars or points for correct answers.
- Each level has a goal to reach (e.g., earn 10 stars to complete the level and unlock the next world).
- Visual progress indicator showing how far they are in each level.

## User Flow

1. **Open the app** — See a colorful welcome screen with "Zadie and Stella Quest" and a big "Play" button.
2. **Level select** — See the four worlds. Level 1 (Space) is unlocked. Others show as locked with a preview of the theme.
3. **Enter a level** — See a themed background with a math problem displayed prominently. Multiple choice answers shown as big, tappable buttons.
4. **Answer a problem** — Tap an answer.
   - **Correct**: Fun animation (stars, sparkles), encouraging message, earn a star, next problem appears.
   - **Incorrect**: Gentle feedback ("Not quite! Try again!" or show the correct answer), no penalty, move on.
5. **Complete a level** — After earning enough stars, see a celebration screen. Next level unlocks.
6. **Progress through all four levels** — Each world introduces a new math operation with its own theme and visuals.

## Data
- Current level/progress (which levels are unlocked, stars earned)
- Performance data for adaptive difficulty (recent correct/incorrect answers, response times)
- Stored locally in the browser (no accounts or login needed)

## External Services / APIs
- **Claude API (Anthropic)** — Powers the adaptive difficulty engine. Sends performance data to Claude and receives adjusted difficulty parameters and encouraging messages personalized to how the kid is doing.

## Out of Scope (For Now)
- Multiple player profiles (v1 is single player)
- Leaderboards or multiplayer
- Sound effects and music (would be great for v2!)
- Custom avatars or character creation
- Parent/teacher dashboard with analytics
- Offline mode (requires internet for AI features)
