import { test, expect } from "@playwright/test";

test.describe("Check-out Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "joko@parkir.id");
    await page.fill('input[name="password"]', "petugas123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/petugas\/check-in/);

    const plate = "G 7777 ZZ";
    await page.fill('input[name="plate"]', plate);
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Check-in")');
  });

  test("check-out kendaraan → hilang dari daftar aktif", async ({ page }) => {
    await page.goto("/petugas/check-out");

    const plate = "G 7777 ZZ";
    await expect(page.locator(`text=${plate}`)).toBeVisible();

    // Klik tombol check-out di baris plat
    const row = page.locator(`text=${plate}`).locator("xpath=ancestor::div[contains(@class,'flex')][1]");
    await row.locator('button:has-text("Check-out")').click();

    // Refresh halaman, kendaraan sudah tidak ada
    await page.goto("/petugas/check-out");
    await expect(page.locator(`text=${plate}`)).not.toBeVisible();
  });
});
