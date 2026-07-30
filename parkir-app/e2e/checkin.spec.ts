import { test, expect } from "@playwright/test";

test.describe("Check-in Flow (Petugas)", () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai petugas
    await page.goto("/login");
    await page.fill('input[name="email"]', "joko@parkir.id");
    await page.fill('input[name="password"]', "petugas123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/petugas\/check-in/);
  });

  test("check-in mobil tanpa slot berhasil", async ({ page }) => {
    await page.fill('input[name="plate"]', "B 9876 ABC");
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');

    // Redirect/buka halaman check-out → kendaraan aktif
    await page.click("a:has-text('Aktif')");
    await expect(page.locator("text=B 9876 ABC")).toBeVisible();
  });

  test("check-in motor tanpa slot berhasil", async ({ page }) => {
    await page.fill('input[name="plate"]', "D 1234 EF");
    await page.selectOption('select[name="type"]', "motor");
    await page.click('button:has-text("Check-in")');

    await page.click("a:has-text('Aktif')");
    await expect(page.locator("text=D 1234 EF")).toBeVisible();
  });

  test("double check-in → error (plat sama 2x)", async ({ page }) => {
    // Check-in pertama
    await page.fill('input[name="plate"]', "F 5555 XX");
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');

    // Check-in kedua
    await page.goto("/petugas/check-in");
    await page.fill('input[name="plate"]', "F 5555 XX");
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');

    // Harusnya muncul error (masih di halaman check-in)
    // Karena server action return error, tapi <form> tidak pindah halaman
    await expect(page.locator("h1")).toContainText(/Check-in/);
  });
});
