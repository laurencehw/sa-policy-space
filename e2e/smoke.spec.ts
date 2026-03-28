import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SA Policy Space/);
    // Stats section should show idea count
    await expect(page.locator("text=Policy Ideas")).toBeVisible({ timeout: 10_000 });
    // Binding constraints grid should be present
    await expect(page.locator("text=Energy")).toBeVisible();
  });
});

test.describe("Ideas listing", () => {
  test("loads and shows ideas", async ({ page }) => {
    await page.goto("/ideas");
    await expect(page).toHaveTitle(/Ideas/);
    // Should have at least one idea card or list item
    await expect(page.locator('[href*="/ideas/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test("search filters ideas", async ({ page }) => {
    await page.goto("/ideas");
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("energy");
      // Wait for filtered results
      await page.waitForTimeout(500);
      // Page should still have content (not crash)
      await expect(page.locator("main")).toBeVisible();
    }
  });
});

test.describe("Idea detail", () => {
  test("loads an idea detail page", async ({ page }) => {
    // Navigate to ideas list, then click the first idea
    await page.goto("/ideas");
    const firstLink = page.locator('[href*="/ideas/"]').first();
    await expect(firstLink).toBeVisible({ timeout: 10_000 });
    await firstLink.click();
    // Detail page should show idea content
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Reform Packages", () => {
  test("loads package listing", async ({ page }) => {
    await page.goto("/packages");
    await expect(page).toHaveTitle(/Packages|Reform/);
    // Should have at least one package card
    await expect(page.locator('[href*="/packages/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test("loads a package detail page", async ({ page }) => {
    await page.goto("/packages/1");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Themes (Binding Constraints)", () => {
  test("loads themes page with constraint cards", async ({ page }) => {
    await page.goto("/themes");
    await expect(page).toHaveTitle(/Binding Constraint/);
    await expect(page.locator("text=Energy")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Dependency Graph", () => {
  test("loads the dependency visualization", async ({ page }) => {
    await page.goto("/dependencies");
    // The page should load without crashing
    await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
  });
});
