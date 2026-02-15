import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { correctCount, totalCount, averageTime, currentDifficulty, operation, levelId } =
      await request.json();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `You are the difficulty engine for a kids' math game. A child just answered ${correctCount} out of ${totalCount} ${operation} problems correctly on level ${levelId || "unknown"}. Their average response time was ${averageTime} seconds. Current difficulty is "${currentDifficulty}".

Rules:
- If they got 80%+ right AND answered fast (under 5 seconds avg), increase difficulty
- If they got less than 50% right OR are slow (over 10 seconds avg), decrease difficulty
- Otherwise keep the same difficulty
- The message should be enthusiastic and fun for a kid (max 10 words)
- Never use the word "wrong" — always be encouraging`,
        },
      ],
      tools: [
        {
          name: "set_difficulty",
          description: "Set the game difficulty and encouragement message",
          input_schema: {
            type: "object" as const,
            properties: {
              difficulty: {
                type: "string",
                enum: ["easy", "medium", "hard"],
                description: "The new difficulty level",
              },
              message: {
                type: "string",
                description: "A short, fun encouraging message for the kid (max 10 words)",
              },
            },
            required: ["difficulty", "message"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "set_difficulty" },
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      const input = toolUse.input as { difficulty: string; message: string };
      return NextResponse.json({
        difficulty: input.difficulty,
        message: input.message,
      });
    }

    return NextResponse.json({
      difficulty: currentDifficulty,
      message: "Keep going, you're doing great!",
    });
  } catch (error) {
    console.error("Difficulty API error:", error);
    return NextResponse.json({
      difficulty: "easy",
      message: "You're doing awesome! Keep it up!",
    });
  }
}
