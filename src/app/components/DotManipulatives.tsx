"use client";

import { Operation } from "@/lib/levels";
import { Difficulty } from "@/lib/generateProblem";

interface DotManipulativesProps {
  operandA: number;
  operandB: number;
  operation: Operation;
  difficulty: Difficulty;
  showResult: boolean;
  isCorrect: boolean | null;
  theme: string;
}

const themeColors: Record<string, string> = {
  space: "bg-purple-400",
  ocean: "bg-cyan-400",
  forest: "bg-green-400",
  castle: "bg-amber-400",
};

const themeColorsB: Record<string, string> = {
  space: "bg-pink-400",
  ocean: "bg-blue-400",
  forest: "bg-emerald-400",
  castle: "bg-orange-400",
};

function DotGroup({
  count,
  color,
  label,
  animationClass,
  maxDisplay,
}: {
  count: number;
  color: string;
  label?: string;
  animationClass?: string;
  maxDisplay?: number;
}) {
  const max = maxDisplay || 30;
  const showAll = count <= max;
  const displayCount = showAll ? count : Math.min(10, max);

  // Chunk dots into groups of 5 for subitizing
  const dots = [...Array(displayCount)].map((_, i) => i);
  const chunks: number[][] = [];
  for (let i = 0; i < dots.length; i += 5) {
    chunks.push(dots.slice(i, i + 5));
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-wrap justify-center gap-2.5 max-w-[220px]">
        {chunks.map((chunk, ci) => (
          <div key={ci} className="flex flex-wrap justify-center gap-0.5">
            {chunk.map((dotIndex) => (
              <span
                key={dotIndex}
                className={`inline-block w-3.5 h-3.5 rounded-full ${color} ${animationClass || ""}`}
                style={{ animationDelay: `${dotIndex * 0.05}s` }}
              />
            ))}
          </div>
        ))}
      </div>
      {!showAll && (
        <span className="text-white/70 text-xs font-bold">{count}</span>
      )}
      {label && <span className="text-white/60 text-xs">{label}</span>}
    </div>
  );
}

function AdditionDots({ a, b, theme, showResult, isCorrect }: {
  a: number; b: number; theme: string; showResult: boolean; isCorrect: boolean | null;
}) {
  const colorA = themeColors[theme] || "bg-purple-400";
  const colorB = themeColorsB[theme] || "bg-pink-400";

  return (
    <div className="flex items-center justify-center gap-3">
      <DotGroup count={a} color={colorA} />
      <span className="text-white/80 text-xl font-bold">+</span>
      <DotGroup count={b} color={colorB} />
      {showResult && isCorrect && (
        <>
          <span className="text-white/80 text-xl font-bold">=</span>
          <DotGroup count={a + b} color={colorA} animationClass="animate-dot-appear" />
        </>
      )}
    </div>
  );
}

function SubtractionDots({ a, b, theme, showResult, isCorrect }: {
  a: number; b: number; theme: string; showResult: boolean; isCorrect: boolean | null;
}) {
  const colorA = themeColors[theme] || "bg-purple-400";
  const colorFade = "bg-red-400/60";

  const displayCount = Math.min(a, 30);
  const dots = [...Array(displayCount)].map((_, i) => i);
  const chunks: number[][] = [];
  for (let i = 0; i < dots.length; i += 5) {
    chunks.push(dots.slice(i, i + 5));
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-wrap justify-center gap-2.5 max-w-[220px]">
          {chunks.map((chunk, ci) => (
            <div key={ci} className="flex flex-wrap justify-center gap-0.5">
              {chunk.map((dotIndex) => {
                const isRemoving = dotIndex >= a - b;
                return (
                  <span
                    key={dotIndex}
                    className={`inline-block w-3.5 h-3.5 rounded-full ${
                      showResult && isCorrect && isRemoving
                        ? `${colorFade} animate-dot-fade-out`
                        : isRemoving
                        ? colorFade
                        : colorA
                    }`}
                    style={{ animationDelay: `${dotIndex * 0.03}s` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        {a > 30 && <span className="text-white/70 text-xs font-bold">{a}</span>}
      </div>
    </div>
  );
}

function MultiplicationDots({ a, b, theme, showResult, isCorrect }: {
  a: number; b: number; theme: string; showResult: boolean; isCorrect: boolean | null;
}) {
  const colorA = themeColors[theme] || "bg-purple-400";
  const maxRows = Math.min(a, 6);
  const maxCols = Math.min(b, 6);
  const showGrid = a <= 6 && b <= 6;

  if (!showGrid) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-white/70 text-sm font-bold">{a} groups of {b}</span>
        {showResult && isCorrect && (
          <>
            <span className="text-white/80 text-lg font-bold">=</span>
            <DotGroup count={a * b} color={colorA} animationClass="animate-dot-appear" />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {[...Array(maxRows)].map((_, row) => (
        <div key={row} className="flex gap-1 animate-dot-appear" style={{ animationDelay: `${row * 0.15}s` }}>
          {[...Array(maxCols)].map((_, col) => (
            <span
              key={col}
              className={`inline-block w-3.5 h-3.5 rounded-full ${colorA}`}
            />
          ))}
        </div>
      ))}
      <span className="text-white/60 text-xs mt-1">{a} rows × {b} columns</span>
    </div>
  );
}

function DivisionDots({ a, b, theme, showResult, isCorrect }: {
  a: number; b: number; theme: string; showResult: boolean; isCorrect: boolean | null;
}) {
  const colorA = themeColors[theme] || "bg-purple-400";
  const answer = a / b;
  const showGroups = a <= 20 && b <= 5;

  if (!showGroups) {
    return (
      <div className="flex items-center justify-center gap-2">
        <DotGroup count={a} color={colorA} />
        <span className="text-white/70 text-sm font-bold">÷ {b} groups</span>
        {showResult && isCorrect && (
          <span className="text-white/80 text-sm font-bold">= {answer} each</span>
        )}
      </div>
    );
  }

  if (showResult && isCorrect) {
    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[...Array(b)].map((_, group) => (
          <div key={group} className="flex flex-col items-center animate-dot-appear" style={{ animationDelay: `${group * 0.15}s` }}>
            <div className="flex flex-wrap justify-center gap-1 bg-white/10 rounded-lg p-1.5 max-w-[60px]">
              {[...Array(answer)].map((_, dot) => (
                <span key={dot} className={`inline-block w-3 h-3 rounded-full ${colorA}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <DotGroup count={a} color={colorA} />
    </div>
  );
}

export default function DotManipulatives({
  operandA,
  operandB,
  operation,
  difficulty,
  showResult,
  isCorrect,
  theme,
}: DotManipulativesProps) {
  // Hard difficulty: no dots
  if (difficulty === "hard") return null;

  // Medium difficulty: only show result dots after answer
  const showOnMedium = difficulty === "medium" && showResult;
  const showFull = difficulty === "easy";

  if (!showFull && !showOnMedium) return null;

  return (
    <div className="w-full mb-4 py-3 px-4 bg-white/10 rounded-2xl border border-white/15">
      {operation === "addition" && (
        <AdditionDots a={operandA} b={operandB} theme={theme} showResult={showResult} isCorrect={isCorrect} />
      )}
      {operation === "subtraction" && (
        <SubtractionDots a={operandA} b={operandB} theme={theme} showResult={showResult} isCorrect={isCorrect} />
      )}
      {operation === "multiplication" && (
        <MultiplicationDots a={operandA} b={operandB} theme={theme} showResult={showResult} isCorrect={isCorrect} />
      )}
      {operation === "division" && (
        <DivisionDots a={operandA} b={operandB} theme={theme} showResult={showResult} isCorrect={isCorrect} />
      )}
    </div>
  );
}
