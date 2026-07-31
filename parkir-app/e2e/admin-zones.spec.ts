import { test, expect } from "@playwright/test";

test.describe("Admin Zone CRUD", () => {
  test.beforeEach(async ({ page }) => {
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
    await page.click('button[type="submit"]');


    await page.waitForTimeout(1000);
    await page.reload();


    await expect(page.getByText(zoneName)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("T-01").first()).toBeVisible({ timeout: 15000 });
  });
});
