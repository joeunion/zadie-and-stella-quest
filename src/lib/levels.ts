export type Operation = "addition" | "subtraction" | "multiplication" | "division";

export interface LevelConfig {
  id: number;
  name: string;
  operation: Operation;
  theme: string;
  emoji: string;
  bgGradient: string;
  description: string;
  starsToComplete: number;
}

export const levels: LevelConfig[] = [
  {
    id: 1,
    name: "Space Journey",
    operation: "addition",
    theme: "space",
    emoji: "🚀",
    bgGradient: "from-indigo-900 via-purple-900 to-black",
    description: "Travel planet to planet with addition!",
    starsToComplete: 10,
  },
  {
    id: 2,
    name: "Ocean Explorer",
    operation: "subtraction",
    theme: "ocean",
    emoji: "🐙",
    bgGradient: "from-cyan-600 via-blue-700 to-blue-900",
    description: "Dive deep with subtraction!",
    starsToComplete: 10,
  },
  {
    id: 3,
    name: "Enchanted Forest",
    operation: "multiplication",
    theme: "forest",
    emoji: "🌳",
    bgGradient: "from-green-600 via-emerald-700 to-green-900",
    description: "Explore the forest with multiplication!",
    starsToComplete: 10,
  },
  {
    id: 4,
    name: "Castle Quest",
    operation: "division",
    theme: "castle",
    emoji: "🏰",
    bgGradient: "from-amber-600 via-orange-700 to-red-900",
    description: "Unlock the castle with division!",
    starsToComplete: 10,
  },
];
