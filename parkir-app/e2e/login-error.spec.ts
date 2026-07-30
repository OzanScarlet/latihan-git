import { test, expect } from "@playwright/test";

test.describe("Login Error Handling", () => {
  test("wrong password → alert muncul di halaman login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "salahpassword");
    await page.click('button[type="submit"]');

    // Harus tetap di /login dengan alert error
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("alert")).toContainText(/salah/i);
  });

  test("email tidak terdaftar → alert", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "tidakada@example.com");
    await page.fill('input[name="password"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("login lalu logout kembali ke /login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@parkir.id");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.click("text=Keluar");
    await expect(page).toHaveURL(/\/login/);
  });
});
