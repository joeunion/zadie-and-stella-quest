import { test, expect } from "@playwright/test";

test.describe("Edge Cases", () => {
  test("cannot access locked levels directly by URL", async ({ page }) => {
    // Clear progress
    await page.goto("/levels");
    await page.evaluate(() => localStorage.clear());

    // Try to access level 3 directly (should redirect to levels page)
    await page.goto("/play/3");
    await expect(page.getByText("Choose Your World!")).toBeVisible({ timeout: 5000 });
  });

  test("invalid level number shows nothing / doesn't crash", async ({ page }) => {
    // Going to a non-existent level shouldn't crash the app
    const response = await page.goto("/play/99");
    // The page should load without a server error
    expect(response?.status()).toBeLessThan(500);
  });

  test("progress persists after page reload", async ({ page }) => {
    // Clear and start fresh
    await page.goto("/levels");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/play/1");

    // Answer one problem correctly
    await page.waitForSelector("h2");
    const problemText = await page.locator("h2").first().textContent();
    const match = problemText?.match(/(\d+)\s*\+\s*(\d+)/);
    if (!match) throw new Error("Could not parse problem: " + problemText);
    const correctAnswer = parseInt(match[1]) + parseInt(match[2]);
    await page.getByRole("button", { name: String(correctAnswer), exact: true }).click();

    // Wait for star to register
    await page.waitForTimeout(500);

    // Check that progress was saved in localStorage
    const progress = await page.evaluate(() => {
      const data = localStorage.getItem("zadieStella_progress");
      return data ? JSON.parse(data) : null;
    });

    expect(progress).not.toBeNull();
    expect(progress.stars[1]).toBe(1);
  });

  test("start over button resets all progress", async ({ page }) => {
    // Set up some completed progress
    await page.goto("/levels");
    await page.evaluate(() => {
      localStorage.setItem("zadieStella_progress", JSON.stringify({
        unlockedLevels: [1, 2, 3, 4],
        stars: { 1: 10, 2: 10, 3: 10, 4: 10 },
        completedLevels: [1, 2, 3, 4],
      }));
    });
    await page.reload();

    // Should see the Start Over button
    const startOverButton = page.getByText("🔄 Start Over");
    await expect(startOverButton).toBeVisible();

    await startOverButton.click();

    // After reset, only level 1 should be unlocked
    // Should see 3 lock icons again
    await expect(page.getByText("🔒")).toHaveCount(3);
  });
});
