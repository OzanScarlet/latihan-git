# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Check-out Flow >> check-out kendaraan berhasil
- Location: e2e\checkout.spec.ts:17:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/petugas\/check-in/
Received string:  "http://localhost:3000/login?error=credentials"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    4 × locator resolved to <html lang="id">…</html>
      - unexpected value "http://localhost:3000/login"
    9 × locator resolved to <html lang="id">…</html>
      - unexpected value "http://localhost:3000/login?error=credentials"

```

```yaml
- status:
  - img
  - text: Static route
  - button "Hide static indicator":
    - img
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
  3  | test.describe("Check-out Flow", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login petugas + check-in kendaraan
  6  |     await page.goto("/login");
  7  |     await page.fill('input[name="email"]', "joko@parkir.id");
  8  |     await page.fill('input[name="password"]', "petugas123");
  9  |     await page.click('button[type="submit"]');
> 10 |     await expect(page).toHaveURL(/\/petugas\/check-in/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  11 | 
  12 |     await page.fill('input[name="plate"]', "G 7777 ZZ");
  13 |     await page.selectOption('select[name="type"]', "mobil");
  14 |     await page.click('button:has-text("Check-in")');
  15 |   });
  16 | 
  17 |   test("check-out kendaraan berhasil", async ({ page }) => {
  18 |     // Buka halaman check-out
  19 |     await page.click("a:has-text('Check-out')");
  20 | 
  21 |     // Klik tombol check-out untuk kendaraan
  22 |     await page.click('button:has-text("Check-out")');
  23 | 
  24 |     // Setelah check-out, halaman check-out reload — kendaraan sudah hilang
  25 |     await expect(page.locator("text=G 7777 ZZ")).not.toBeVisible();
  26 |   });
  27 | });
  28 | 
```