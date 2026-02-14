"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDadMessage } from "@/lib/dadMessages";

export default function Home() {
  const [dadGreeting, setDadGreeting] = useState("");

  useEffect(() => {
    setDadGreeting(getDadMessage("welcome"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-8 text-white">
      {/* Stars background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Dad's welcome speech bubble */}
        {dadGreeting && (
          <div className="mb-8 flex justify-center animate-bounce-in">
            <div
              className="text-xl md:text-2xl font-bold text-white text-center animate-float"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                borderRadius: "1.5rem",
                padding: "1rem 2rem",
                boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              💜 Dad says: {dadGreeting}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="animate-float mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            🌟 Zadie & Stella 🌟
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
            Quest
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 opacity-90">
          A Math Adventure!
        </p>

        {/* Play Button */}
        <Link href="/levels">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-3xl md:text-4xl font-bold py-6 px-16 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200 active:scale-95">
            ▶ PLAY!
          </button>
        </Link>

        {/* Fun decorative emojis */}
        <div className="mt-12 text-4xl flex gap-6 justify-center">
          <span className="animate-float" style={{ animationDelay: "0s" }}>🚀</span>
          <span className="animate-float" style={{ animationDelay: "0.5s" }}>🐙</span>
          <span className="animate-float" style={{ animationDelay: "1s" }}>🌳</span>
          <span className="animate-float" style={{ animationDelay: "1.5s" }}>🏰</span>
        </div>
      </div>
    </div>
  );
}
