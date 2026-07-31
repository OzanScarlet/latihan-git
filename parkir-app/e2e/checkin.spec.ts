import { test, expect } from "@playwright/test";

test.describe("Check-in Flow (Petugas)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "joko@parkir.id");
    await page.fill('input[name="password"]', "petugas123");
    await page.click('button[type="submit"]');
    // Tunggu redirect selesai ke check-in page
    await page.waitForURL(/\/petugas\/check-in/, { timeout: 10000 });
  });

  test("check-in mobil berhasil dan muncul di daftar aktif", async ({ page }) => {
    const plate = "B 9876 ABC";
    await page.fill('input[name="plate"]', plate);
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');

    // Server action tidak navigate, refresh manual ke halaman Aktif
    await page.goto("/petugas/active");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${plate}`)).toBeVisible({ timeout: 10000 });
  });

  test("check-in motor berhasil dan muncul di daftar aktif", async ({ page }) => {
    const plate = "D 1234 EF";
    await page.fill('input[name="plate"]', plate);
    await page.selectOption('select[name="type"]', "motor");
    await page.click('button:has-text("Check-in")');

    await page.goto("/petugas/active");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${plate}`)).toBeVisible({ timeout: 10000 });
  });

  test("double check-in → tetap di halaman check-in", async ({ page }) => {
    const plate = "F 5555 XX";

    // Pertama
    await page.fill('input[name="plate"]', plate);
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');

    // Kedua (refresh halaman, plat masih sama → server reject)
    await page.goto("/petugas/check-in");
    await page.fill('input[name="plate"]', plate);
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');

    // Tetap di check-in, tidak throw
    await expect(page).toHaveURL(/\/petugas\/check-in/);
    await expect(page.locator("h1")).toContainText(/Check-in/i);
  });
});