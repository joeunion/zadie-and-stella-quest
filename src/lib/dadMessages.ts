// Dad's personal messages for Zadie and Stella 💜

export type DadMessageCategory =
  | "welcome"
  | "encouragement"
  | "comfort"
  | "celebration"
  | "milestone";

const messages: Record<DadMessageCategory, string[]> = {
  welcome: [
    "Hey {name}! Dad loves you! 💜",
    "{name}! Dad's thinking about you! 💜",
    "Hey superstar! Dad is SO proud of you!",
    "My favorite {name} in the whole world! Let's go! 💜",
    "Dad loves you more than anything! Have fun!",
    "Hi sweetheart! Dad's cheering for you! 💜",
  ],
  encouragement: [
    "I'm so proud of you, {name}! 💜",
    "{name}, you are SO smart!",
    "Dad is cheering for you right now!",
    "Look at you go, {name}! Amazing!",
    "You're doing incredible! Dad loves you!",
    "That's my girl! Keep it up! 💜",
    "Dad knew you could do it, {name}!",
  ],
  comfort: [
    "It's okay, {name}! Dad believes in you! 💜",
    "Don't worry — you'll get the next one!",
    "Dad still thinks you're amazing! 💜",
    "Mistakes help you learn! You've got this!",
    "That's okay, sweetheart! Try again! 💜",
    "Dad loves you no matter what! Keep going!",
  ],
  celebration: [
    "WOW! Dad is SO proud right now! 🎉💜",
    "YOU DID IT, {name}! Dad loves you SO much!",
    "AMAZING! I'm the proudest dad ever! 💜",
    "{name}, you are a superstar! Dad is so happy!",
    "INCREDIBLE! Wait till I tell everyone how smart you are! 💜",
    "That was AWESOME! Dad is giving you the biggest hug! 🤗💜",
  ],
  milestone: [
    "You're halfway there, {name}! Keep going! 💜",
    "Look how far you've come! Dad is amazed!",
    "Halfway done! {name}, you're unstoppable! 💜",
    "So close! Dad believes in you!",
  ],
};

// Name-specific bonus messages
const nameSpecific: Record<string, Record<DadMessageCategory, string[]>> = {
  Zadie: {
    welcome: ["Zadie Bear! Let's do some math! 💜"],
    encouragement: ["Zadie, you're a math wizard! 💜"],
    comfort: ["Zadie Bear, it's okay! You're still amazing! 💜"],
    celebration: ["ZADIE! You're incredible! Dad is so proud! 💜"],
    milestone: ["Go Zadie go! You're almost there! 💜"],
  },
  Stella: {
    welcome: ["Stella Star! Let's do some math! 💜"],
    encouragement: ["Stella, you're a math genius! 💜"],
    comfort: ["Stella Star, it's okay! You're still amazing! 💜"],
    celebration: ["STELLA! You're incredible! Dad is so proud! 💜"],
    milestone: ["Go Stella go! You're almost there! 💜"],
  },
};

// Track recently used messages to avoid repeats
const recentMessages: string[] = [];
const MAX_RECENT = 3;

export function getDadMessage(category: DadMessageCategory, name?: string): string {
  // Combine general + name-specific messages
  const pool = [...messages[category]];
  if (name && nameSpecific[name]?.[category]) {
    pool.push(...nameSpecific[name][category]);
  }

  // Filter out recently used messages (if pool is big enough)
  const available =
    pool.length > MAX_RECENT
      ? pool.filter((m) => !recentMessages.includes(m))
      : pool;

  let picked = available[Math.floor(Math.random() * available.length)];

  // Replace {name} placeholder
  if (name) {
    picked = picked.replace(/\{name\}/g, name);
  } else {
    picked = picked.replace(/\{name\}/g, "girls");
  }

  // Track it
  recentMessages.push(picked);
  if (recentMessages.length > MAX_RECENT) {
    recentMessages.shift();
  }

  return picked;
}
