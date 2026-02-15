import { getNextLevelId } from "./levels";

export interface GameProgress {
  unlockedLevels: string[];
  stars: { [levelId: string]: number };
  completedLevels: string[];
}

function storageKey(playerName: string): string {
  return `zadieStella_progress_${playerName.toLowerCase()}`;
}

const defaultProgress: GameProgress = {
  unlockedLevels: ["1-1"],
  stars: {},
  completedLevels: [],
};

export function loadProgress(playerName: string): GameProgress {
  if (typeof window === "undefined") return { ...defaultProgress };
  try {
    const saved = localStorage.getItem(storageKey(playerName));
    if (saved) return JSON.parse(saved);
  } catch {
    // If anything goes wrong reading storage, start fresh
  }
  return { ...defaultProgress, stars: {} };
}

export function saveProgress(playerName: string, progress: GameProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(playerName), JSON.stringify(progress));
  } catch {
    // Storage might be full or unavailable — that's OK
  }
}

export function addStar(playerName: string, levelId: string): GameProgress {
  const progress = loadProgress(playerName);
  progress.stars[levelId] = (progress.stars[levelId] || 0) + 1;
  saveProgress(playerName, progress);
  return progress;
}

export function resetLevelStars(playerName: string, levelId: string): GameProgress {
  const progress = loadProgress(playerName);
  progress.stars[levelId] = 0;
  saveProgress(playerName, progress);
  return progress;
}

export function resetAllProgress(playerName: string): GameProgress {
  const fresh = { ...defaultProgress, stars: {} };
  saveProgress(playerName, fresh);
  return fresh;
}

export function completeLevel(playerName: string, levelId: string): GameProgress {
  const progress = loadProgress(playerName);
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
  }
  // Unlock next level
  const nextLevel = getNextLevelId(levelId);
  if (nextLevel && !progress.unlockedLevels.includes(nextLevel)) {
    progress.unlockedLevels.push(nextLevel);
  }
  saveProgress(playerName, progress);
  return progress;
}
