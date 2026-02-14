import { test, expect } from "@playwright/test";

test.describe("Welcome Screen", () => {
  test("shows the game title and play button", async ({ page }) => {
    await page.goto("/");

    // Should show the game title
    await expect(page.getByText("Zadie & Stella")).toBeVisible();
    await expect(page.getByText("Quest")).toBeVisible();
    await expect(page.getByText("A Math Adventure!")).toBeVisible();

    // Should have a Play button
    const playButton = page.getByRole("button", { name: /play/i });
    await expect(playButton).toBeVisible();
  });

  test("play button navigates to level select", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /play/i }).click();

    // Should be on the level select page
    await expect(page.getByText("Choose Your World!")).toBeVisible();
  });
});

test.describe("Level Select", () => {
  test("shows Space Journey as unlocked and others as locked on fresh start", async ({ page }) => {
    // Clear saved progress for a fresh start
    await page.goto("/levels");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Space Journey should be clickable
    await expect(page.getByText("Space Journey")).toBeVisible();
    await expect(page.getByText("Travel planet to planet with addition!")).toBeVisible();

    // Other levels should show as locked
    const lockIcons = page.getByText("🔒");
    await expect(lockIcons).toHaveCount(3);
  });

  test("back button returns to welcome screen", async ({ page }) => {
    await page.goto("/levels");

    await page.getByText("← Back").click();

    await expect(page.getByText("Zadie & Stella")).toBeVisible();
  });
});
