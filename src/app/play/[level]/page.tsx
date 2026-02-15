"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLevelConfig } from "@/lib/levels";
import { generateProblem, MathProblem, Difficulty } from "@/lib/generateProblem";
import { loadProgress, addStar, completeLevel, resetLevelStars } from "@/lib/progress";
import { getDadMessage } from "@/lib/dadMessages";
import { usePlayer } from "@/lib/playerContext";
import WorldEnvironment from "@/app/components/WorldEnvironment";
import DotManipulatives from "@/app/components/DotManipulatives";

interface PerformanceData {
  correct: number;
  total: number;
  times: number[];
}

export default function PlayLevel({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = use(params);
  const levelId = levelParam; // Now a string like "1-1"
  const resolved = getLevelConfig(levelId);
  const router = useRouter();
  const { player } = usePlayer();

  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [stars, setStars] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiMessage, setAiMessage] = useState("");
  const [performance, setPerformance] = useState<PerformanceData>({
    correct: 0,
    total: 0,
    times: [],
  });
  const [problemStartTime, setProblemStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [dadMessage, setDadMessage] = useState("");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [celebrateCorrect, setCelebrateCorrect] = useState(false);
  const dadMessageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const difficultyRef = useRef<Difficulty>("easy");
  difficultyRef.current = difficulty;

  const playerName = player?.name;

  const showDadBubble = useCallback((category: "encouragement" | "comfort" | "milestone") => {
    setDadMessage(getDadMessage(category, playerName));
    if (dadMessageTimer.current) clearTimeout(dadMessageTimer.current);
    dadMessageTimer.current = setTimeout(() => setDadMessage(""), 8000);
  }, [playerName]);

  function showNextProblem() {
    if (!resolved) return;
    const { world, subLevel } = resolved;
    setProblem(
      generateProblem(
        world.operation,
        difficultyRef.current,
        subLevel.rangesA,
        subLevel.rangesB,
      )
    );
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    setCelebrateCorrect(false);
    setProblemStartTime(Date.now());
  }

  // Redirect if no player selected
  useEffect(() => {
    if (!player) {
      router.push("/");
    }
  }, [player, router]);

  // One-time setup when the page loads
  useEffect(() => {
    if (!resolved || initialized || !playerName) return;
    const progress = loadProgress(playerName);
    if (!progress.unlockedLevels.includes(levelId)) {
      router.push("/levels");
      return;
    }
    resetLevelStars(playerName, levelId);
    setStars(0);
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved, levelId, playerName]);

  // Generate first problem once initialized
  useEffect(() => {
    if (initialized && resolved) {
      showNextProblem();
      showDadBubble("encouragement");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // Check difficulty with AI every 5 problems
  useEffect(() => {
    if (performance.total > 0 && performance.total % 5 === 0 && resolved) {
      const avgTime =
        performance.times.length > 0
          ? performance.times.reduce((a, b) => a + b, 0) / performance.times.length
          : 5;

      fetch("/api/difficulty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correctCount: performance.correct,
          totalCount: performance.total,
          averageTime: Math.round(avgTime * 10) / 10,
          currentDifficulty: difficultyRef.current,
          operation: resolved.world.operation,
          levelId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.difficulty) {
            setDifficulty(data.difficulty);
            difficultyRef.current = data.difficulty;
          }
          if (data.message) setAiMessage(data.message);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performance.total]);

  if (!resolved || !problem || !player) return null;

  const { world, subLevel } = resolved;

  const handleAnswer = (choice: number) => {
    if (showResult) return;

    const timeSpent = (Date.now() - problemStartTime) / 1000;
    const correct = choice === problem.answer;

    setSelectedAnswer(choice);
    setIsCorrect(correct);
    setShowResult(true);

    setPerformance((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
      times: [...prev.times.slice(-9), timeSpent],
    }));

    if (correct) {
      setCelebrateCorrect(true);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);

      const newProgress = addStar(player.name, levelId);
      const newStars = newProgress.stars[levelId] || 0;
      setStars(newStars);

      if (newStreak > 0 && newStreak % 3 === 0) {
        showDadBubble("encouragement");
      }

      const halfway = Math.floor(subLevel.starsToComplete / 2);
      if (newStars === halfway) {
        showDadBubble("milestone");
      }

      if (newStars >= subLevel.starsToComplete) {
        completeLevel(player.name, levelId);
        setTimeout(() => {
          router.push(`/complete/${levelId}`);
        }, 1500);
        return;
      }
    } else {
      setCorrectStreak(0);
      showDadBubble("comfort");
    }

    setTimeout(() => {
      showNextProblem();
    }, correct ? 2500 : 2000);
  };

  const starsToComplete = subLevel.starsToComplete;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${world.bgGradient} flex flex-col p-4 md:p-8 relative overflow-hidden`}>
      {/* World Environment — animated themed elements */}
      <WorldEnvironment theme={world.theme} currentStars={stars} celebrateCorrect={celebrateCorrect} />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <Link href="/levels" className="text-white/70 hover:text-white text-lg font-bold">
          ← Back
        </Link>
        <div className="text-center">
          <span className="text-2xl mr-2">{world.emoji}</span>
          <span className="text-white font-bold text-lg">{subLevel.name}</span>
        </div>
        <div className="flex items-center gap-2 text-white font-bold">
          <span>{player.avatar}</span>
          <span>⭐ {stars}/{starsToComplete}</span>
        </div>
      </div>

      {/* Star progress bar */}
      <div className="max-w-lg mx-auto w-full mb-4 relative z-10">
        <div className="bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-yellow-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${(stars / starsToComplete) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {[...Array(starsToComplete)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < stars ? "animate-star-pop" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {i < stars ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>

      {/* AI encouragement message */}
      {aiMessage && (
        <div className="max-w-lg mx-auto w-full mb-3 text-center relative z-10">
          <div className="bg-white/20 rounded-2xl py-2 px-4 text-white font-bold animate-bounce-in">
            {aiMessage}
          </div>
        </div>
      )}

      {/* Dad's speech bubble */}
      {dadMessage && (
        <div className="max-w-lg mx-auto w-full mb-3 flex justify-center relative z-10" key={dadMessage}>
          <div
            className="text-base md:text-lg font-bold text-white text-center animate-bounce-in"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              borderRadius: "1.5rem",
              padding: "0.75rem 1.5rem",
              boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            💜 Dad says: {dadMessage}
          </div>
        </div>
      )}

      {/* Math Problem */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full relative z-10">
        {/* Dot manipulatives — visual math support */}
        <DotManipulatives
          operandA={problem.operandA}
          operandB={problem.operandB}
          operation={world.operation}
          difficulty={difficulty}
          showResult={showResult}
          isCorrect={isCorrect}
          theme={world.theme}
        />

        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 md:p-10 w-full text-center mb-6 border-2 border-white/20">
          <p className="text-white/60 text-sm mb-2 uppercase tracking-wide">
            {difficulty} difficulty
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">
            {problem.question}
          </h2>
          <p className="text-white/60 text-xl">= ?</p>
        </div>

        {/* Answer choices */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {problem.choices.map((choice, i) => {
            let buttonStyle = "bg-white/20 border-white/30 text-white hover:bg-white/30";

            if (showResult && choice === problem.answer) {
              buttonStyle = "bg-green-500 border-green-400 text-white scale-105";
            } else if (showResult && choice === selectedAnswer && !isCorrect) {
              buttonStyle = "bg-red-400 border-red-300 text-white";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(choice)}
                disabled={showResult}
                className={`${buttonStyle} border-2 rounded-2xl p-5 text-3xl md:text-4xl font-bold transition-all duration-200 active:scale-95 shadow-lg`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <div className="mt-4 animate-bounce-in">
            {isCorrect ? (
              <div className="text-center">
                <div className="text-5xl mb-2">🎉</div>
                <p className="text-green-300 text-2xl font-bold">Awesome!</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white text-xl">
                  The answer is <span className="font-bold text-yellow-300 text-2xl">{problem.answer}</span>
                </p>
                <p className="text-white/70 mt-1">You&apos;ll get the next one!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
