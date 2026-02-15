import { Operation, NumberRanges } from "./levels";

export type Difficulty = "easy" | "medium" | "hard";

export interface MathProblem {
  question: string;
  answer: number;
  choices: number[];
  operation: Operation;
  difficulty: Difficulty;
  operandA: number;
  operandB: number;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(correctAnswer: number): number[] {
  const choices = new Set<number>([correctAnswer]);

  while (choices.size < 4) {
    const offset = randomInt(1, Math.max(3, Math.abs(correctAnswer) + 2));
    const wrong = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    if (wrong >= 0 && Number.isInteger(wrong) && wrong !== correctAnswer) {
      choices.add(wrong);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}

function getRangeForDifficulty(ranges: NumberRanges, difficulty: Difficulty) {
  return ranges[difficulty];
}

function generateAddition(difficulty: Difficulty, rangesA: NumberRanges, rangesB: NumberRanges): MathProblem {
  const rA = getRangeForDifficulty(rangesA, difficulty);
  const rB = getRangeForDifficulty(rangesB, difficulty);
  const a = randomInt(rA.min, rA.max);
  const b = randomInt(rB.min, rB.max);
  const answer = a + b;
  return {
    question: `${a} + ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "addition",
    difficulty,
    operandA: a,
    operandB: b,
  };
}

function generateSubtraction(difficulty: Difficulty, rangesA: NumberRanges, rangesB: NumberRanges): MathProblem {
  const rA = getRangeForDifficulty(rangesA, difficulty);
  const rB = getRangeForDifficulty(rangesB, difficulty);
  let a = randomInt(rA.min, rA.max);
  let b = randomInt(rB.min, Math.min(rB.max, a)); // ensure positive result
  if (b > a) { const tmp = a; a = b; b = tmp; }
  const answer = a - b;
  return {
    question: `${a} - ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "subtraction",
    difficulty,
    operandA: a,
    operandB: b,
  };
}

function generateMultiplication(difficulty: Difficulty, rangesA: NumberRanges, rangesB: NumberRanges): MathProblem {
  const rA = getRangeForDifficulty(rangesA, difficulty);
  const rB = getRangeForDifficulty(rangesB, difficulty);
  const a = randomInt(rA.min, rA.max);
  const b = randomInt(rB.min, rB.max);
  const answer = a * b;
  return {
    question: `${a} × ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "multiplication",
    difficulty,
    operandA: a,
    operandB: b,
  };
}

function generateDivision(difficulty: Difficulty, rangesA: NumberRanges, rangesB: NumberRanges): MathProblem {
  const rA = getRangeForDifficulty(rangesA, difficulty);
  const rB = getRangeForDifficulty(rangesB, difficulty);
  const b = randomInt(rB.min, rB.max);
  const answer = randomInt(rA.min, rA.max);
  const a = b * answer; // ensures whole number division
  return {
    question: `${a} ÷ ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "division",
    difficulty,
    operandA: a,
    operandB: b,
  };
}

export function generateProblem(
  operation: Operation,
  difficulty: Difficulty,
  rangesA: NumberRanges,
  rangesB: NumberRanges,
): MathProblem {
  switch (operation) {
    case "addition":
      return generateAddition(difficulty, rangesA, rangesB);
    case "subtraction":
      return generateSubtraction(difficulty, rangesA, rangesB);
    case "multiplication":
      return generateMultiplication(difficulty, rangesA, rangesB);
    case "division":
      return generateDivision(difficulty, rangesA, rangesB);
  }
}
