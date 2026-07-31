import { test, expect } from "@playwright/test";

test.describe("Role Guard", () => {
  test("petugas tidak bisa akses /admin", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "joko@parkir.id");
    await page.fill('input[name="password"]', "petugas123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/petugas\/check-in/);

    // Coba akses admin
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/petugas\/check-in/);
  });

  test("admin bisa akses /petugas/check-in", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Klik link Check-in di header admin
    await page.click("a:has-text('Check-in')");
    await expect(page).toHaveURL(/\/petugas\/check-in/);
    await expect(page.locator("h1")).toContainText(/Check-in/i);
  });
});
