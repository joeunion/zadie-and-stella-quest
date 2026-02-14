// Dad's personal messages for Zadie and Stella 💜

export type DadMessageCategory =
  | "welcome"
  | "encouragement"
  | "comfort"
  | "celebration"
  | "milestone";

const messages: Record<DadMessageCategory, string[]> = {
  welcome: [
    "Hey girls! Dad loves you! 💜",
    "Zadie & Stella! Dad's thinking about you! 💜",
    "Hey superstars! Dad is SO proud of you!",
    "My favorite girls in the whole world! Let's go! 💜",
    "Dad loves you both more than anything! Have fun!",
    "Hi sweethearts! Dad's cheering for you! 💜",
  ],
  encouragement: [
    "I'm so proud of you two! 💜",
    "You girls are SO smart!",
    "Dad is cheering for you right now!",
    "Look at you go! Amazing!",
    "You're doing incredible! Dad loves you!",
    "That's my girls! Keep it up! 💜",
    "Dad knew you could do it!",
  ],
  comfort: [
    "It's okay! Dad believes in you! 💜",
    "Don't worry — you'll get the next one!",
    "Dad still thinks you're amazing! 💜",
    "Mistakes help you learn! You've got this!",
    "That's okay, sweethearts! Try again! 💜",
    "Dad loves you no matter what! Keep going!",
  ],
  celebration: [
    "WOW! Dad is SO proud right now! 🎉💜",
    "YOU DID IT! Dad loves you SO much!",
    "AMAZING! I'm the proudest dad ever! 💜",
    "You girls are superstars! Dad is so happy!",
    "INCREDIBLE! Wait till I tell everyone how smart you are! 💜",
    "That was AWESOME! Dad is giving you the biggest hug! 🤗💜",
  ],
  milestone: [
    "You're halfway there! Keep going, girls! 💜",
    "Look how far you've come! Dad is amazed!",
    "Halfway done! You two are unstoppable! 💜",
    "So close! Dad believes in you!",
  ],
};

// Track recently used messages to avoid repeats
const recentMessages: string[] = [];
const MAX_RECENT = 3;

export function getDadMessage(category: DadMessageCategory): string {
  const pool = messages[category];
  // Filter out recently used messages (if pool is big enough)
  const available =
    pool.length > MAX_RECENT
      ? pool.filter((m) => !recentMessages.includes(m))
      : pool;

  const picked = available[Math.floor(Math.random() * available.length)];

  // Track it
  recentMessages.push(picked);
  if (recentMessages.length > MAX_RECENT) {
    recentMessages.shift();
  }

  return picked;
}
