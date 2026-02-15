"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLevelConfig, getNextLevelId } from "@/lib/levels";
import { getDadMessage } from "@/lib/dadMessages";
import { usePlayer } from "@/lib/playerContext";

export default function LevelComplete({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = use(params);
  const levelId = levelParam;
  const resolved = getLevelConfig(levelId);
  const nextLevelId = getNextLevelId(levelId);
  const nextResolved = nextLevelId ? getLevelConfig(nextLevelId) : null;
  const router = useRouter();
  const { player } = usePlayer();

  const [dadCelebration, setDadCelebration] = useState("");

  useEffect(() => {
    if (!player) {
      router.push("/");
      return;
    }
    setDadCelebration(getDadMessage("celebration", player.name));
  }, [player, router]);

  if (!resolved || !player) return null;

  const { world, subLevel } = resolved;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${world.bgGradient} flex flex-col items-center justify-center p-8 text-white`}>
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              fontSize: `${(i % 3) * 10 + 15}px`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          >
            {["⭐", "🌟", "✨", "🎉", "🎊"][i % 5]}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Dad's celebration speech bubble */}
        {dadCelebration && (
          <div className="mb-8 flex justify-center animate-bounce-in" style={{ animationDelay: "0.2s" }}>
            <div
              className="text-xl md:text-2xl font-bold text-white text-center"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                borderRadius: "1.5rem",
                padding: "1rem 2rem",
                boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              💜 Dad says: {dadCelebration}
            </div>
          </div>
        )}

        {/* Big emoji */}
        <div className="text-8xl mb-6 animate-bounce-in">
          {world.emoji}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
          Level Complete!
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold mb-2 opacity-90 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {subLevel.name}
        </h2>

        <p className="text-lg mb-4 opacity-70 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          {player.avatar} {player.name} {player.avatar}
        </p>

        <div className="text-4xl mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {[...Array(subLevel.starsToComplete)].map((_, i) => (
            <span key={i} className="animate-star-pop inline-block" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              ⭐
            </span>
          ))}
        </div>

        <p className="text-xl mb-8 opacity-80 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          You&apos;re a math superstar!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          {nextResolved ? (
            <Link href={`/play/${nextLevelId}`}>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-2xl font-bold py-4 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 w-full">
                Next: {nextResolved.subLevel.name} {nextResolved.world.emoji}
              </button>
            </Link>
          ) : (
            <div className="bg-yellow-400/20 text-yellow-200 text-2xl font-bold py-4 px-12 rounded-full border-2 border-yellow-400/50">
              🏆 All Worlds Complete! 🏆
            </div>
          )}

          <Link href="/levels">
            <button className="bg-white/20 hover:bg-white/30 text-white text-lg font-bold py-3 px-8 rounded-full border-2 border-white/30 transition-all duration-200 w-full">
              Back to Worlds
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
