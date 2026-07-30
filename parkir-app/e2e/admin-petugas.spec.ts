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

    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  test("nonaktifkan lalu aktifkan kembali akun", async ({ page }) => {
    // Ambil akun pertama (selain admin yang login) - misal Joko
    const jokoRow = page.locator("text=joko@parkir.id").locator("xpath=ancestor::div[contains(@class,'flex')]");

    await jokoRow.click("text=nonaktifkan");
    // Badge berubah merah
    await expect(page.locator("text=nonaktif").first()).toBeVisible();

    // Aktifkan kembali
    await page.click("text=aktifkan");
    await expect(page.locator("text=aktif").first()).toBeVisible();
  });

  test("reset password akun petugas", async ({ page }) => {
    // Cari baris Joko
    const jokoRow = page.locator("text=joko@parkir.id").locator("xpath=ancestor::div[contains(@class,'flex')]");

    // Klik "reset" untuk membuka input
    await jokoRow.locator("summary").filter({ hasText: "reset" }).click();

    // Isi password baru
    await jokoRow.fill('input[name="newPassword"]', "newpass123");
    await jokoRow.click('button:has-text("Simpan")');

    // Form harus tetap ada (tidak error)
    await expect(page.locator("text=joko@parkir.id")).toBeVisible();
  });
});