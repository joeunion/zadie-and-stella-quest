"use client";

import { worldElements } from "@/lib/worldAnimations";

interface WorldEnvironmentProps {
  theme: string;
  currentStars: number;
  celebrateCorrect: boolean;
}

export default function WorldEnvironment({ theme, currentStars, celebrateCorrect }: WorldEnvironmentProps) {
  const elements = worldElements[theme] || [];
  const visibleElements = elements.filter((el) => el.appearsAtStar <= currentStars);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {visibleElements.map((el, i) => (
        <div
          key={`${el.emoji}-${el.x}-${el.y}`}
          className={`absolute ${el.animation} ${celebrateCorrect ? "animate-wiggle-celebrate" : ""}`}
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}rem`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          <span className="animate-bounce-in inline-block" style={{ animationDelay: `${i * 0.05}s` }}>
            {el.emoji}
          </span>
        </div>
      ))}

      {/* Emoji burst on correct answer */}
      {celebrateCorrect && (
        <div className="absolute inset-0 flex items-center justify-center">
          {["✨", "🌟", "⭐", "💫", "✨"].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-3xl animate-celebration-burst"
              style={{
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 72}deg) translateY(-60px)`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
