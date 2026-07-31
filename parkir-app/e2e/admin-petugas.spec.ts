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
    // Pakai akun sendiri, jangan ganggu joko@parkir.id
    const email = `toggle-${Date.now()}@parkir.id`;
    await page.fill('input[name="name"]', "Petugas Toggle");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "temp12345");
    await page.selectOption('select[name="role"]', "petugas");
    await page.click('button:has-text("Simpan")');
    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${email}`)).toBeVisible();

    const row = page.locator(`text=${email}`).locator("xpath=ancestor::div[contains(@class,'flex')][1]");

    // Nonaktifkan
    await row.locator('button:has-text("nonaktifkan")').click();
    await page.waitForLoadState("networkidle");
    await expect(row.locator("text=nonaktif")).toBeVisible();

    // Aktifkan kembali
    await row.locator('button:has-text("aktifkan")').click();
    await page.waitForLoadState("networkidle");
    await expect(row.locator("text=aktif").first()).toBeVisible();
  });

  test("reset password akun petugas", async ({ page }) => {
    // Pakai akun sendiri supaya joko@parkir.id (dipakai spec lain) tetap petugas123
    const email = `reset-${Date.now()}@parkir.id`;
    await page.fill('input[name="name"]', "Petugas Reset");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "temp12345");
    await page.selectOption('select[name="role"]', "petugas");
    await page.click('button:has-text("Simpan")');
    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${email}`)).toBeVisible();

    const row = page.locator(`text=${email}`).locator("xpath=ancestor::div[contains(@class,'flex')][1]");

    // Buka input reset
    await row.locator("summary").filter({ hasText: "reset" }).click();

    // Isi password baru
    await row.locator('input[name="newPassword"]').fill("newpass123");
    await row.locator('button:has-text("Simpan")').click();

    await page.waitForLoadState("networkidle");
    // Pastikan tidak ada error, akun tetap terlihat
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });
});
