import { test, expect } from "@playwright/test";

test.describe("Admin Petugas Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.click("a:has-text('Petugas')");
    await expect(page).toHaveURL(/\/admin\/petugas/);
  });

  test("buat akun petugas baru", async ({ page }) => {
    const email = `testuser-${Date.now()}@parkir.id`;
    await page.fill('input[name="name"]', "Petugas Test");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "test12345");
    await page.selectOption('select[name="role"]', "petugas");
    await page.click('button:has-text("Simpan")');

    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  test("toggle aktif/nonaktif akun", async ({ page }) => {
    // Klik tombol toggle untuk Joko
    const jokoRow = page.locator("text=joko@parkir.id").locator("xpath=ancestor::div[contains(@class,'flex')][1]");

    // Nonaktifkan
    await jokoRow.locator('button:has-text("nonaktifkan")').click();
    await page.waitForLoadState("networkidle");
    await expect(jokoRow.locator("text=nonaktif")).toBeVisible();

    // Aktifkan kembali
    await jokoRow.locator('button:has-text("aktifkan")').click();
    await page.waitForLoadState("networkidle");
    await expect(jokoRow.locator("text=aktif").first()).toBeVisible();
  });

  test("reset password akun petugas", async ({ page }) => {
    const jokoRow = page.locator("text=joko@parkir.id").locator("xpath=ancestor::div[contains(@class,'flex')][1]");

    // Buka input reset
    await jokoRow.locator("summary").filter({ hasText: "reset" }).click();

    // Isi password baru
    await jokoRow.locator('input[name="newPassword"]').fill("newpass123");
    await jokoRow.locator('button:has-text("Simpan")').click();

    await page.waitForLoadState("networkidle");
    // Pastikan tidak ada error, akun tetap terlihat
    await expect(page.locator("text=joko@parkir.id")).toBeVisible();
  });
});
