import { Operation } from "./levels";

export type Difficulty = "easy" | "medium" | "hard";

export interface MathProblem {
  question: string;
  answer: number;
  choices: number[];
  operation: Operation;
  difficulty: Difficulty;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(correctAnswer: number): number[] {
  const choices = new Set<number>([correctAnswer]);

  while (choices.size < 4) {
    // Generate wrong answers close to the correct one
    const offset = randomInt(1, Math.max(3, Math.abs(correctAnswer) + 2));
    const wrong = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    // Only add positive whole numbers for kid-friendliness
    if (wrong >= 0 && Number.isInteger(wrong) && wrong !== correctAnswer) {
      choices.add(wrong);
    }
  }

  // Shuffle the choices
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

function generateAddition(difficulty: Difficulty): MathProblem {
  let a: number, b: number;
  switch (difficulty) {
    case "easy":
      a = randomInt(1, 5);
      b = randomInt(1, 5);
      break;
    case "medium":
      a = randomInt(5, 15);
      b = randomInt(5, 15);
      break;
    case "hard":
      a = randomInt(10, 50);
      b = randomInt(10, 50);
      break;
  }
  const answer = a + b;
  return {
    question: `${a} + ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "addition",
    difficulty,
  };
}

function generateSubtraction(difficulty: Difficulty): MathProblem {
  let a: number, b: number;
  switch (difficulty) {
    case "easy":
      a = randomInt(3, 10);
      b = randomInt(1, a); // ensure positive result
      break;
    case "medium":
      a = randomInt(10, 25);
      b = randomInt(5, a);
      break;
    case "hard":
      a = randomInt(25, 50);
      b = randomInt(10, a);
      break;
  }
  const answer = a - b;
  return {
    question: `${a} - ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "subtraction",
    difficulty,
  };
}

function generateMultiplication(difficulty: Difficulty): MathProblem {
  let a: number, b: number;
  switch (difficulty) {
    case "easy":
      a = randomInt(1, 5);
      b = randomInt(1, 5);
      break;
    case "medium":
      a = randomInt(2, 8);
      b = randomInt(2, 8);
      break;
    case "hard":
      a = randomInt(3, 12);
      b = randomInt(3, 12);
      break;
  }
  const answer = a * b;
  return {
    question: `${a} × ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "multiplication",
    difficulty,
  };
}

function generateDivision(difficulty: Difficulty): MathProblem {
  let a: number, b: number, answer: number;
  switch (difficulty) {
    case "easy":
      b = randomInt(1, 5);
      answer = randomInt(1, 5);
      a = b * answer; // ensures whole number division
      break;
    case "medium":
      b = randomInt(2, 8);
      answer = randomInt(2, 8);
      a = b * answer;
      break;
    case "hard":
      b = randomInt(2, 10);
      answer = randomInt(3, 12);
      a = b * answer;
      break;
  }
  return {
    question: `${a} ÷ ${b}`,
    answer,
    choices: generateChoices(answer),
    operation: "division",
    difficulty,
  };
}

export function generateProblem(operation: Operation, difficulty: Difficulty): MathProblem {
  switch (operation) {
    case "addition":
      return generateAddition(difficulty);
    case "subtraction":
      return generateSubtraction(difficulty);
    case "multiplication":
      return generateMultiplication(difficulty);
    case "division":
      return generateDivision(difficulty);
  }
}
