"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { levels } from "@/lib/levels";
import { generateProblem, MathProblem, Difficulty } from "@/lib/generateProblem";
import { loadProgress, addStar, completeLevel, resetLevelStars } from "@/lib/progress";
import { getDadMessage } from "@/lib/dadMessages";

interface PerformanceData {
  correct: number;
  total: number;
  times: number[];
}

export default function PlayLevel({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = use(params);
  const levelId = parseInt(levelParam);
  const levelConfig = levels.find((l) => l.id === levelId);
  const router = useRouter();

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
  const dadMessageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use a ref for difficulty so generating problems doesn't cause re-renders
  const difficultyRef = useRef<Difficulty>("easy");
  difficultyRef.current = difficulty;

  const showDadBubble = useCallback((category: "encouragement" | "comfort" | "milestone") => {
    setDadMessage(getDadMessage(category));
    // Clear after 8 seconds
    if (dadMessageTimer.current) clearTimeout(dadMessageTimer.current);
    dadMessageTimer.current = setTimeout(() => setDadMessage(""), 8000);
  }, []);

  function showNextProblem() {
    if (!levelConfig) return;
    setProblem(generateProblem(levelConfig.operation, difficultyRef.current));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    setProblemStartTime(Date.now());
  }

  // One-time setup when the page loads
  useEffect(() => {
    if (!levelConfig || initialized) return;
    const progress = loadProgress();
    if (!progress.unlockedLevels.includes(levelId)) {
      router.push("/levels");
      return;
    }
    // Reset stars for this level so replays start fresh
    resetLevelStars(levelId);
    setStars(0);
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelConfig, levelId]);

  // Generate first problem once initialized and show a Dad greeting
  useEffect(() => {
    if (initialized && levelConfig) {
      showNextProblem();
      showDadBubble("encouragement");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // Check difficulty with AI every 5 problems
  useEffect(() => {
    if (performance.total > 0 && performance.total % 5 === 0 && levelConfig) {
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
          operation: levelConfig.operation,
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
        .catch(() => {
          // If AI call fails, just continue with current difficulty
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performance.total]);

  if (!levelConfig || !problem) return null;

  const handleAnswer = (choice: number) => {
    if (showResult) return; // Prevent double-tap

    const timeSpent = (Date.now() - problemStartTime) / 1000;
    const correct = choice === problem.answer;

    setSelectedAnswer(choice);
    setIsCorrect(correct);
    setShowResult(true);

    setPerformance((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
      times: [...prev.times.slice(-9), timeSpent], // Keep last 10 times
    }));

    if (correct) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);

      const newProgress = addStar(levelId);
      const newStars = newProgress.stars[levelId] || 0;
      setStars(newStars);

      // Dad message: after every 3rd correct answer in a row
      if (newStreak > 0 && newStreak % 3 === 0) {
        showDadBubble("encouragement");
      }

      // Dad message: halfway through the level
      const halfway = Math.floor(levelConfig.starsToComplete / 2);
      if (newStars === halfway) {
        showDadBubble("milestone");
      }

      // Check if level is complete
      if (newStars >= levelConfig.starsToComplete) {
        completeLevel(levelId);
        setTimeout(() => {
          router.push(`/complete/${levelId}`);
        }, 1500);
        return;
      }
    } else {
      setCorrectStreak(0);
      // Dad comfort message every time they get one wrong
      showDadBubble("comfort");
    }

    // Move to next problem after a delay
    setTimeout(() => {
      showNextProblem();
    }, correct ? 1200 : 2000);
  };

  const starsToComplete = levelConfig.starsToComplete;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${levelConfig.bgGradient} flex flex-col p-4 md:p-8`}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/levels" className="text-white/70 hover:text-white text-lg font-bold">
          ← Back
        </Link>
        <div className="text-center">
          <span className="text-2xl mr-2">{levelConfig.emoji}</span>
          <span className="text-white font-bold text-lg">{levelConfig.name}</span>
        </div>
        <div className="text-white font-bold">
          ⭐ {stars}/{starsToComplete}
        </div>
      </div>

      {/* Star progress bar */}
      <div className="max-w-lg mx-auto w-full mb-6">
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
        <div className="max-w-lg mx-auto w-full mb-4 text-center">
          <div className="bg-white/20 rounded-2xl py-2 px-4 text-white font-bold animate-bounce-in">
            {aiMessage}
          </div>
        </div>
      )}

      {/* Dad's speech bubble */}
      {dadMessage && (
        <div className="max-w-lg mx-auto w-full mb-4 flex justify-center" key={dadMessage}>
          <div
            className="text-lg md:text-xl font-bold text-white text-center animate-bounce-in"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              borderRadius: "1.5rem",
              padding: "0.875rem 1.75rem",
              boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            💜 Dad says: {dadMessage}
          </div>
        </div>
      )}

      {/* Math Problem */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 md:p-12 w-full text-center mb-8 border-2 border-white/20">
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
                className={`${buttonStyle} border-2 rounded-2xl p-6 text-3xl md:text-4xl font-bold transition-all duration-200 active:scale-95 shadow-lg`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <div className="mt-6 animate-bounce-in">
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
