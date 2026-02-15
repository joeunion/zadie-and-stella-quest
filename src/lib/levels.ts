export type Operation = "addition" | "subtraction" | "multiplication" | "division";

export interface NumberRanges {
  easy: { min: number; max: number };
  medium: { min: number; max: number };
  hard: { min: number; max: number };
}

export interface SubLevel {
  subId: number; // 1 or 2 within the world
  name: string;
  description: string;
  starsToComplete: number;
  rangesA: NumberRanges;
  rangesB: NumberRanges;
}

export interface WorldConfig {
  worldId: number;
  name: string;
  operation: Operation;
  theme: string;
  emoji: string;
  bgGradient: string;
  subLevels: SubLevel[];
}

export const worlds: WorldConfig[] = [
  {
    worldId: 1,
    name: "Space Journey",
    operation: "addition",
    theme: "space",
    emoji: "🚀",
    bgGradient: "from-indigo-900 via-purple-900 to-black",
    subLevels: [
      {
        subId: 1,
        name: "Liftoff!",
        description: "Small numbers to start your journey",
        starsToComplete: 8,
        rangesA: { easy: { min: 1, max: 5 }, medium: { min: 3, max: 10 }, hard: { min: 5, max: 15 } },
        rangesB: { easy: { min: 1, max: 5 }, medium: { min: 3, max: 10 }, hard: { min: 5, max: 15 } },
      },
      {
        subId: 2,
        name: "Deep Space",
        description: "Bigger numbers among the stars",
        starsToComplete: 10,
        rangesA: { easy: { min: 5, max: 15 }, medium: { min: 10, max: 30 }, hard: { min: 15, max: 50 } },
        rangesB: { easy: { min: 5, max: 15 }, medium: { min: 10, max: 30 }, hard: { min: 15, max: 50 } },
      },
    ],
  },
  {
    worldId: 2,
    name: "Ocean Explorer",
    operation: "subtraction",
    theme: "ocean",
    emoji: "🐙",
    bgGradient: "from-cyan-600 via-blue-700 to-blue-900",
    subLevels: [
      {
        subId: 1,
        name: "Shallow Reef",
        description: "Gentle subtraction in the shallows",
        starsToComplete: 8,
        rangesA: { easy: { min: 3, max: 10 }, medium: { min: 8, max: 18 }, hard: { min: 12, max: 25 } },
        rangesB: { easy: { min: 1, max: 5 }, medium: { min: 3, max: 10 }, hard: { min: 5, max: 15 } },
      },
      {
        subId: 2,
        name: "Deep Dive",
        description: "Bigger numbers in the deep blue",
        starsToComplete: 10,
        rangesA: { easy: { min: 10, max: 20 }, medium: { min: 15, max: 35 }, hard: { min: 25, max: 50 } },
        rangesB: { easy: { min: 3, max: 10 }, medium: { min: 5, max: 20 }, hard: { min: 10, max: 30 } },
      },
    ],
  },
  {
    worldId: 3,
    name: "Enchanted Forest",
    operation: "multiplication",
    theme: "forest",
    emoji: "🌳",
    bgGradient: "from-green-600 via-emerald-700 to-green-900",
    subLevels: [
      {
        subId: 1,
        name: "Mushroom Grove",
        description: "Small times tables in the grove",
        starsToComplete: 8,
        rangesA: { easy: { min: 1, max: 5 }, medium: { min: 2, max: 6 }, hard: { min: 3, max: 8 } },
        rangesB: { easy: { min: 1, max: 5 }, medium: { min: 2, max: 6 }, hard: { min: 3, max: 8 } },
      },
      {
        subId: 2,
        name: "Ancient Trees",
        description: "Bigger multiplications among ancient trees",
        starsToComplete: 10,
        rangesA: { easy: { min: 2, max: 8 }, medium: { min: 3, max: 10 }, hard: { min: 4, max: 12 } },
        rangesB: { easy: { min: 2, max: 8 }, medium: { min: 3, max: 10 }, hard: { min: 4, max: 12 } },
      },
    ],
  },
  {
    worldId: 4,
    name: "Castle Quest",
    operation: "division",
    theme: "castle",
    emoji: "🏰",
    bgGradient: "from-amber-600 via-orange-700 to-red-900",
    subLevels: [
      {
        subId: 1,
        name: "Castle Gate",
        description: "Simple sharing at the gate",
        starsToComplete: 8,
        rangesA: { easy: { min: 1, max: 5 }, medium: { min: 2, max: 6 }, hard: { min: 2, max: 8 } },
        rangesB: { easy: { min: 1, max: 5 }, medium: { min: 2, max: 6 }, hard: { min: 2, max: 8 } },
      },
      {
        subId: 2,
        name: "Throne Room",
        description: "Bigger divisions to claim the throne",
        starsToComplete: 10,
        rangesA: { easy: { min: 2, max: 8 }, medium: { min: 3, max: 10 }, hard: { min: 3, max: 12 } },
        rangesB: { easy: { min: 2, max: 8 }, medium: { min: 3, max: 10 }, hard: { min: 3, max: 12 } },
      },
    ],
  },
];

// Level ID helpers — format: "worldId-subId" e.g. "1-1", "1-2", "2-1"
export function makeLevelId(worldId: number, subId: number): string {
  return `${worldId}-${subId}`;
}

export function parseLevelId(levelId: string): { worldId: number; subId: number } {
  const [w, s] = levelId.split("-").map(Number);
  return { worldId: w, subId: s };
}

export function getAllLevelIds(): string[] {
  const ids: string[] = [];
  for (const world of worlds) {
    for (const sub of world.subLevels) {
      ids.push(makeLevelId(world.worldId, sub.subId));
    }
  }
  return ids;
}

export function getNextLevelId(levelId: string): string | null {
  const all = getAllLevelIds();
  const idx = all.indexOf(levelId);
  if (idx === -1 || idx === all.length - 1) return null;
  return all[idx + 1];
}

export interface ResolvedLevel {
  levelId: string;
  world: WorldConfig;
  subLevel: SubLevel;
}

export function getLevelConfig(levelId: string): ResolvedLevel | null {
  const { worldId, subId } = parseLevelId(levelId);
  const world = worlds.find((w) => w.worldId === worldId);
  if (!world) return null;
  const subLevel = world.subLevels.find((s) => s.subId === subId);
  if (!subLevel) return null;
  return { levelId, world, subLevel };
}
