# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkin.spec.ts >> Check-in Flow (Petugas) >> check-in mobil tanpa slot berhasil
- Location: e2e\checkin.spec.ts:13:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/petugas\/check-in/
Received string:  "http://localhost:3000/login?error=credentials"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    5 × locator resolved to <html lang="id">…</html>
      - unexpected value "http://localhost:3000/login"
    8 × locator resolved to <html lang="id">…</html>
      - unexpected value "http://localhost:3000/login?error=credentials"

```

```yaml
- alert
- main:
  - heading "ParkirKu" [level=3]
  - paragraph: Manajemen Parkir Kantor
  - alert: Username atau password salah.
  - text: Email
  - textbox "nama@kantor.id"
  - text: Password
  - textbox "••••••••"
  - button "Masuk"
  - paragraph: "Demo admin: admin@parkir.id / admin123 · petugas: joko@parkir.id / petugas123"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Check-in Flow (Petugas)", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login sebagai petugas
  6  |     await page.goto("/login");
  7  |     await page.fill('input[name="email"]', "joko@parkir.id");
  8  |     await page.fill('input[name="password"]', "petugas123");
  9  |     await page.click('button[type="submit"]');
> 10 |     await expect(page).toHaveURL(/\/petugas\/check-in/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  11 |   });
  12 | 
  13 |   test("check-in mobil tanpa slot berhasil", async ({ page }) => {
  14 |     await page.fill('input[name="plate"]', "B 9876 ABC");
  15 |     await page.selectOption('select[name="type"]', "mobil");
  16 |     await page.click('button:has-text("Check-in")');
  17 | 
  18 |     // Redirect/buka halaman check-out → kendaraan aktif
  19 |     await page.click("a:has-text('Aktif')");
  20 |     await expect(page.locator("text=B 9876 ABC")).toBeVisible();
  21 |   });
  22 | 
  23 |   test("check-in motor tanpa slot berhasil", async ({ page }) => {
  24 |     await page.fill('input[name="plate"]', "D 1234 EF");
  25 |     await page.selectOption('select[name="type"]', "motor");
  26 |     await page.click('button:has-text("Check-in")');
  27 | 
  28 |     await page.click("a:has-text('Aktif')");
  29 |     await expect(page.locator("text=D 1234 EF")).toBeVisible();
  30 |   });
  31 | 
  32 |   test("double check-in → error (plat sama 2x)", async ({ page }) => {
  33 |     // Check-in pertama
  34 |     await page.fill('input[name="plate"]', "F 5555 XX");
  35 |     await page.selectOption('select[name="type"]', "mobil");
  36 |     await page.click('button:has-text("Check-in")');
  37 | 
  38 |     // Check-in kedua
  39 |     await page.goto("/petugas/check-in");
  40 |     await page.fill('input[name="plate"]', "F 5555 XX");
  41 |     await page.selectOption('select[name="type"]', "mobil");
  42 |     await page.click('button:has-text("Check-in")');
  43 | 
  44 |     // Harusnya muncul error (masih di halaman check-in)
  45 |     // Karena server action return error, tapi <form> tidak pindah halaman
  46 |     await expect(page.locator("h1")).toContainText(/Check-in/);
  47 |   });
  48 | });
  49 | 
```