"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayer, PlayerName } from "@/lib/playerContext";
import { getDadMessage } from "@/lib/dadMessages";

const avatars = [
  { emoji: "🦄", label: "Unicorn" },
  { emoji: "🐉", label: "Dragon" },
  { emoji: "🚀", label: "Astronaut" },
  { emoji: "🧜‍♀️", label: "Mermaid" },
  { emoji: "🦊", label: "Fox" },
  { emoji: "🐱", label: "Cat" },
  { emoji: "🦋", label: "Butterfly" },
  { emoji: "🐼", label: "Panda" },
];

export default function Home() {
  const router = useRouter();
  const { setPlayer } = usePlayer();
  const [step, setStep] = useState<"name" | "avatar">("name");
  const [selectedName, setSelectedName] = useState<PlayerName | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [dadGreeting, setDadGreeting] = useState("");

  useEffect(() => {
    setDadGreeting(getDadMessage("welcome"));
  }, []);

  // Update greeting when name is picked
  useEffect(() => {
    if (selectedName) {
      setDadGreeting(getDadMessage("welcome", selectedName));
    }
  }, [selectedName]);

  function handleNamePick(name: PlayerName) {
    setSelectedName(name);
    setStep("avatar");
  }

  function handleAvatarPick(emoji: string) {
    setSelectedAvatar(emoji);
  }

  function handlePlay() {
    if (!selectedName || !selectedAvatar) return;
    setPlayer({ name: selectedName, avatar: selectedAvatar });
    router.push("/levels");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-6 text-white">
      {/* Stars background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-sparkle"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              fontSize: `${(i % 3) * 8 + 12}px`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Dad's welcome speech bubble */}
        {dadGreeting && (
          <div className="mb-6 flex justify-center animate-bounce-in">
            <div
              className="text-lg md:text-xl font-bold text-white text-center animate-float"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                borderRadius: "1.5rem",
                padding: "0.875rem 1.5rem",
                boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              💜 Dad says: {dadGreeting}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="animate-float mb-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg">
            🌟 Zadie & Stella 🌟
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
            Quest
          </h2>
        </div>

        {/* Step 1: Pick your name */}
        {step === "name" && (
          <div className="animate-bounce-in">
            <p className="text-xl md:text-2xl mb-6 font-bold">Who&apos;s playing?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleNamePick("Zadie")}
                className="bg-white/20 hover:bg-white/30 border-4 border-white/30 hover:border-white/50 text-white text-2xl md:text-3xl font-bold py-5 px-10 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                Zadie
              </button>
              <button
                onClick={() => handleNamePick("Stella")}
                className="bg-white/20 hover:bg-white/30 border-4 border-white/30 hover:border-white/50 text-white text-2xl md:text-3xl font-bold py-5 px-10 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                Stella
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pick your avatar */}
        {step === "avatar" && (
          <div className="animate-bounce-in">
            <p className="text-xl md:text-2xl mb-4 font-bold">
              Pick your character, {selectedName}!
            </p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {avatars.map((av) => (
                <button
                  key={av.emoji}
                  onClick={() => handleAvatarPick(av.emoji)}
                  className={`flex flex-col items-center py-3 px-2 rounded-2xl border-4 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    selectedAvatar === av.emoji
                      ? "bg-yellow-400/30 border-yellow-400 scale-105 shadow-lg shadow-yellow-400/30"
                      : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40"
                  }`}
                >
                  <span className="text-4xl md:text-5xl">{av.emoji}</span>
                  <span className="text-xs mt-1 opacity-80">{av.label}</span>
                </button>
              ))}
            </div>

            {/* Selected state + Play button */}
            {selectedAvatar && (
              <div className="animate-bounce-in">
                <div className="mb-4 text-2xl font-bold">
                  {selectedAvatar} {selectedName} {selectedAvatar}
                </div>
                <button
                  onClick={handlePlay}
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-3xl md:text-4xl font-bold py-5 px-14 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200 active:scale-95"
                >
                  ▶ PLAY!
                </button>
              </div>
            )}

            {/* Back to name pick */}
            <button
              onClick={() => { setStep("name"); setSelectedName(null); setSelectedAvatar(null); }}
              className="mt-4 text-white/60 hover:text-white text-sm underline"
            >
              ← Pick a different name
            </button>
          </div>
        )}

        {/* Fun decorative emojis */}
        <div className="mt-8 text-3xl flex gap-5 justify-center">
          <span className="animate-float" style={{ animationDelay: "0s" }}>🚀</span>
          <span className="animate-float" style={{ animationDelay: "0.5s" }}>🐙</span>
          <span className="animate-float" style={{ animationDelay: "1s" }}>🌳</span>
          <span className="animate-float" style={{ animationDelay: "1.5s" }}>🏰</span>
        </div>
      </div>
    </div>
  );
}
