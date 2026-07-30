import { test, expect } from "@playwright/test";

test.describe("Admin Zone CRUD", () => {
  test.beforeEach(async ({ page }) => {
    // Login admin
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.click("a:has-text('Zona & Slot')");
    await expect(page).toHaveURL(/\/admin\/zones/);
  });

  test("buat zona baru → slot ter-generate", async ({ page }) => {
    const zoneName = `TestZone-${Date.now()}`;

    await page.fill('input[name="name"]', zoneName);
    await page.fill('input[name="capacity"]', "5");
    await page.selectOption('select[name="type"]', "mobil");
    await page.click('button:has-text("Buat & generate slot")');

    // Zona muncul
    await expect(page.locator(`text=${zoneName}`)).toBeVisible();
    // Slot T-01 sampai T-05 muncul
    await expect(page.locator("text=T-01")).toBeVisible();
    await expect(page.locator("text=T-05")).toBeVisible();
  });

  test("tambah slot manual di zona existing", async ({ page }) => {
    // Asumsi zona "Area Depan" dari seed ada
    await page.fill('input[name="name"]', `Manual-${Date.now()}`);
    await page.fill('input[name="capacity"]', "3");
    await page.selectOption('select[name="type"]', "motor");
    await page.click('button:has-text("Buat & generate slot")');

    // Klik input kode slot terakhir lalu tambah
    const codeInput = page.locator('input[name="code"]').last();
    await codeInput.fill("TEST-99");
    await page.click('button:has-text("Tambah slot")');

    await expect(page.locator("text=TEST-99")).toBeVisible();
  });
});