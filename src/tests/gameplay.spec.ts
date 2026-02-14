import { test, expect } from "@playwright/test";

test.describe("Gameplay", () => {
  test.beforeEach(async ({ page }) => {
    // Clear progress before each test for a clean slate
    await page.goto("/levels");
    await page.evaluate(() => localStorage.clear());
  });

  test("can start Space Journey and see a math problem", async ({ page }) => {
    await page.goto("/levels");
    await page.reload(); // Reload to pick up cleared localStorage

    // Click Space Journey
    await page.getByText("Space Journey").click();

    // Should see the level name and an addition problem
    await expect(page.getByText("Space Journey")).toBeVisible();
    await expect(page.getByText("easy difficulty")).toBeVisible();
    await expect(page.getByText("= ?")).toBeVisible();

    // Should see 4 answer buttons in the answer grid
    const answerButtons = page.locator(".grid button");
    await expect(answerButtons).toHaveCount(4);

    // Should show 0/10 stars
    await expect(page.getByText("⭐ 0/10")).toBeVisible();
  });

  test("correct answer earns a star and shows celebration", async ({ page }) => {
    await page.goto("/play/1");

    // Read the math problem to figure out the correct answer
    const problemText = await page.locator("h2").first().textContent();
    // Parse "X + Y" to get the answer
    const match = problemText?.match(/(\d+)\s*\+\s*(\d+)/);
    if (!match) throw new Error("Could not parse problem: " + problemText);
    const correctAnswer = parseInt(match[1]) + parseInt(match[2]);

    // Click the correct answer
    await page.getByRole("button", { name: String(correctAnswer), exact: true }).click();

    // Should show celebration feedback
    await expect(page.getByText("🎉")).toBeVisible();
    await expect(page.getByText("Awesome!")).toBeVisible();

    // Wait for next problem to load
    await page.waitForTimeout(1500);

    // Star count should increase to 1
    await expect(page.getByText("⭐ 1/10")).toBeVisible();
  });

  test("incorrect answer shows the right answer", async ({ page }) => {
    await page.goto("/play/1");

    // Read the math problem to figure out the correct answer
    const problemText = await page.locator("h2").first().textContent();
    const match = problemText?.match(/(\d+)\s*\+\s*(\d+)/);
    if (!match) throw new Error("Could not parse problem: " + problemText);
    const correctAnswer = parseInt(match[1]) + parseInt(match[2]);

    // Find and click a WRONG answer
    const buttons = page.locator("button").filter({ hasNotText: /back/i });
    const allButtons = await buttons.all();
    for (const btn of allButtons) {
      const text = await btn.textContent();
      if (text && parseInt(text) !== correctAnswer) {
        await btn.click();
        break;
      }
    }

    // Should show the correct answer
    await expect(page.getByText(`The answer is`)).toBeVisible();
    await expect(page.getByText("You'll get the next one!")).toBeVisible();
  });

  test("completing a level navigates to celebration screen", async ({ page }) => {
    await page.goto("/play/1");

    // Answer 10 problems correctly to complete the level
    for (let i = 0; i < 10; i++) {
      // Wait for the problem to be visible
      await page.waitForSelector("h2");

      const problemText = await page.locator("h2").first().textContent();
      const match = problemText?.match(/(\d+)\s*\+\s*(\d+)/);
      if (!match) throw new Error("Could not parse problem: " + problemText);
      const correctAnswer = parseInt(match[1]) + parseInt(match[2]);

      await page.getByRole("button", { name: String(correctAnswer), exact: true }).click();

      if (i < 9) {
        // Wait for the next problem to appear
        await page.waitForTimeout(1500);
      }
    }

    // Should navigate to the completion screen
    await expect(page.getByText("Level Complete!")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("You're a math superstar!")).toBeVisible();

    // Should offer to play the next level
    await expect(page.getByText(/Next:.*Ocean Explorer/)).toBeVisible();
  });
});
