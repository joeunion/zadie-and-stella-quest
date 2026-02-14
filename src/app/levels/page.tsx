"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { levels } from "@/lib/levels";
import { loadProgress, resetAllProgress, GameProgress } from "@/lib/progress";

export default function LevelSelect() {
  const [progress, setProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-indigo-900 p-6 md:p-12">
      {/* Header */}
      <div className="text-center mb-10">
        <Link href="/" className="text-white/70 hover:text-white text-lg mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Choose Your World!
        </h1>
        <p className="text-white/80 text-lg">
          Complete each world to unlock the next adventure
        </p>
        {progress.completedLevels.length > 0 && (
          <button
            onClick={() => {
              setProgress(resetAllProgress());
            }}
            className="mt-4 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm py-2 px-4 rounded-full border border-white/20 transition-all duration-200"
          >
            🔄 Start Over
          </button>
        )}
      </div>

      {/* Level Cards */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level) => {
          const isUnlocked = progress.unlockedLevels.includes(level.id);
          const isCompleted = progress.completedLevels.includes(level.id);
          const stars = progress.stars[level.id] || 0;

          return (
            <div key={level.id} className="animate-slide-up" style={{ animationDelay: `${level.id * 0.1}s` }}>
              {isUnlocked ? (
                <Link href={`/play/${level.id}`}>
                  <div className={`bg-gradient-to-br ${level.bgGradient} rounded-3xl p-6 md:p-8 shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer border-4 border-white/20 hover:border-white/40`}>
                    <div className="text-6xl mb-4">{level.emoji}</div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {level.name}
                    </h2>
                    <p className="text-white/80 text-sm mb-3">
                      {level.description}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(level.starsToComplete)].map((_, i) => (
                        <span key={i} className="text-lg">
                          {i < stars ? "⭐" : "☆"}
                        </span>
                      ))}
                    </div>
                    {isCompleted && (
                      <div className="mt-2 bg-green-500/30 text-green-200 text-sm font-bold py-1 px-3 rounded-full inline-block">
                        ✓ Complete!
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="bg-gray-800/50 rounded-3xl p-6 md:p-8 shadow-xl border-4 border-gray-700/30 opacity-60">
                  <div className="text-6xl mb-4 grayscale">🔒</div>
                  <h2 className="text-2xl font-bold text-gray-400 mb-1">
                    {level.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Complete the previous world to unlock!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
