import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("redirect ke /login saat belum auth", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login admin berhasil → redirect ke /admin/dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator("h1")).toContainText(/Dashboard/i);
  });

  test("login petugas berhasil → redirect ke /petugas/check-in", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "joko@parkir.id");
    await page.fill('input[name="password"]', "petugas123");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.toString().includes("/login"), { timeout: 10000 });
    await page.goto("/petugas/check-in");
    await expect(page).toHaveURL(/\/petugas\/check-in/);
    await expect(page.locator("h1")).toContainText(/Check-in/i);
  });

  test("logout admin kembali ke /login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Klik link "Keluar" di header
    await page.getByText("Keluar").click({ force: true });
    await expect(page).toHaveURL(/\/login/);
  });
});