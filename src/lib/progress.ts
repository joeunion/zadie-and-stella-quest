export interface GameProgress {
  unlockedLevels: number[];
  stars: { [levelId: number]: number };
  completedLevels: number[];
}

const STORAGE_KEY = "zadieStella_progress";

const defaultProgress: GameProgress = {
  unlockedLevels: [1],
  stars: { 1: 0, 2: 0, 3: 0, 4: 0 },
  completedLevels: [],
};

export function loadProgress(): GameProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // If anything goes wrong reading storage, start fresh
  }
  return defaultProgress;
}

export function saveProgress(progress: GameProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage might be full or unavailable — that's OK
  }
}

export function addStar(levelId: number): GameProgress {
  const progress = loadProgress();
  progress.stars[levelId] = (progress.stars[levelId] || 0) + 1;
  saveProgress(progress);
  return progress;
}

export function resetLevelStars(levelId: number): GameProgress {
  const progress = loadProgress();
  progress.stars[levelId] = 0;
  saveProgress(progress);
  return progress;
}

export function resetAllProgress(): GameProgress {
  saveProgress(defaultProgress);
  return defaultProgress;
}

export function completeLevel(levelId: number): GameProgress {
  const progress = loadProgress();
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
  }
  // Unlock next level
  const nextLevel = levelId + 1;
  if (nextLevel <= 4 && !progress.unlockedLevels.includes(nextLevel)) {
    progress.unlockedLevels.push(nextLevel);
  }
  saveProgress(progress);
  return progress;
}
