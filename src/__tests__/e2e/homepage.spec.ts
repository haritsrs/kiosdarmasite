import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/KiosDarma Marketplace/);
  });

  test("should have accessible navigation", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeVisible({ visible: false });
    
    // Test skip link functionality
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });
});


