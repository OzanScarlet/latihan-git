import { test, expect } from "@playwright/test";

test.describe("Check-out Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login petugas + check-in kendaraan
    await page.goto("/login");
    await page.fill('input[name="email"]', "joko@parkir.id");
    await page.fill('input[name="password"]', "petugas123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/petugas\/check-in/);

    await page.fill('input[name="plate"]', "G 7777 ZZ");
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');
  });

  test("check-out kendaraan berhasil", async ({ page }) => {
    // Buka halaman check-out
    await page.click("a:has-text('Check-out')");

    // Klik tombol check-out untuk kendaraan
    await page.click('button:has-text("Check-out")');

    // Setelah check-out, halaman check-out reload — kendaraan sudah hilang
    await expect(page.locator("text=G 7777 ZZ")).not.toBeVisible();
  });
});
