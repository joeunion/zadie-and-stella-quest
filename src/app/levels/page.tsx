"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { worlds, makeLevelId } from "@/lib/levels";
import { loadProgress, resetAllProgress, GameProgress } from "@/lib/progress";
import { usePlayer } from "@/lib/playerContext";

export default function LevelSelect() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const { player } = usePlayer();
  const router = useRouter();

  useEffect(() => {
    if (!player) {
      router.push("/");
      return;
    }
    setProgress(loadProgress(player.name));
  }, [player, router]);

  if (!progress || !player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-indigo-900 p-5 md:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="text-white/70 hover:text-white text-lg mb-4 inline-block">
          ← Home
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
          {player.avatar} {player.name}&apos;s Worlds {player.avatar}
        </h1>
        <p className="text-white/80 text-lg">
          Complete each level to unlock the next!
        </p>
        {progress.completedLevels.length > 0 && (
          <button
            onClick={() => {
              setProgress(resetAllProgress(player.name));
            }}
            className="mt-3 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm py-2 px-4 rounded-full border border-white/20 transition-all duration-200"
          >
            🔄 Start Over
          </button>
        )}
      </div>

      {/* World Map */}
      <div className="max-w-2xl mx-auto space-y-8">
        {worlds.map((world, worldIdx) => {
          const worldLevelIds = world.subLevels.map((s) => makeLevelId(world.worldId, s.subId));
          const anyUnlocked = worldLevelIds.some((id) => progress.unlockedLevels.includes(id));
          const allCompleted = worldLevelIds.every((id) => progress.completedLevels.includes(id));

          return (
            <div
              key={world.worldId}
              className="animate-slide-up"
              style={{ animationDelay: `${worldIdx * 0.1}s` }}
            >
              {/* World header */}
              <div className={`bg-gradient-to-r ${world.bgGradient} rounded-t-3xl px-6 py-4 border-2 border-b-0 ${anyUnlocked ? "border-white/20" : "border-gray-700/30 opacity-50"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{anyUnlocked ? world.emoji : "🔒"}</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      World {world.worldId}: {world.name}
                    </h2>
                    <p className="text-white/70 text-sm capitalize">{world.operation}</p>
                  </div>
                  {allCompleted && (
                    <span className="ml-auto bg-green-500/30 text-green-200 text-sm font-bold py-1 px-3 rounded-full">
                      ✓ Complete!
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-levels */}
              <div className={`bg-gradient-to-r ${world.bgGradient} rounded-b-3xl px-6 py-4 border-2 border-t-0 ${anyUnlocked ? "border-white/20" : "border-gray-700/30 opacity-50"}`}
                style={{ filter: anyUnlocked ? "none" : "grayscale(0.5)" }}
              >
                <div className="flex items-center gap-3">
                  {world.subLevels.map((sub, subIdx) => {
                    const lid = makeLevelId(world.worldId, sub.subId);
                    const isUnlocked = progress.unlockedLevels.includes(lid);
                    const isCompleted = progress.completedLevels.includes(lid);
                    const starCount = progress.stars[lid] || 0;

                    return (
                      <div key={lid} className="flex items-center flex-1">
                        {/* Connecting line between sub-levels */}
                        {subIdx > 0 && (
                          <div className="flex-shrink-0 w-6 h-0.5 bg-white/30 mx-1" />
                        )}

                        {isUnlocked ? (
                          <Link href={`/play/${lid}`} className="flex-1">
                            <div className={`bg-white/15 hover:bg-white/25 border-2 rounded-2xl p-4 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer ${
                              isCompleted ? "border-yellow-400/60" : "border-white/30 hover:border-white/50"
                            }`}>
                              <div className="text-lg font-bold text-white mb-1">
                                {world.worldId}-{sub.subId}
                              </div>
                              <div className="text-sm font-bold text-white/90 mb-2">
                                {sub.name}
                              </div>
                              {/* Mini stars */}
                              <div className="flex justify-center gap-0.5 flex-wrap">
                                {[...Array(sub.starsToComplete)].map((_, i) => (
                                  <span key={i} className="text-xs">
                                    {i < starCount ? "⭐" : "☆"}
                                  </span>
                                ))}
                              </div>
                              {isCompleted && (
                                <div className="mt-2 text-xs text-yellow-300 font-bold">
                                  🔄 Play Again
                                </div>
                              )}
                            </div>
                          </Link>
                        ) : (
                          <div className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-center opacity-50">
                            <div className="text-lg font-bold text-white/50 mb-1">
                              {world.worldId}-{sub.subId}
                            </div>
                            <div className="text-sm text-white/40 mb-2">
                              {sub.name}
                            </div>
                            <div className="text-2xl">🔒</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
