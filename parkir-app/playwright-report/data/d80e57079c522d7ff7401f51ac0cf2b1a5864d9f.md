# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: role-guard.spec.ts >> Role Guard >> petugas tidak bisa akses /admin
- Location: e2e\role-guard.spec.ts:4:7

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
  3  | test.describe("Role Guard", () => {
  4  |   test("petugas tidak bisa akses /admin", async ({ page }) => {
  5  |     await page.goto("/login");
  6  |     await page.fill('input[name="email"]', "joko@parkir.id");
  7  |     await page.fill('input[name="password"]', "petugas123");
  8  |     await page.click('button[type="submit"]');
> 9  |     await expect(page).toHaveURL(/\/petugas\/check-in/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  10 | 
  11 |     // Coba akses admin
  12 |     await page.goto("/admin/dashboard");
  13 |     await expect(page).toHaveURL(/\/petugas\/check-in/);
  14 |   });
  15 | 
  16 |   test("admin bisa akses /petugas/check-in", async ({ page }) => {
  17 |     await page.goto("/login");
  18 |     await page.fill('input[name="email"]', "admin@parkir.id");
  19 |     await page.fill('input[name="password"]', "admin123");
  20 |     await page.click('button[type="submit"]');
  21 |     await expect(page).toHaveURL(/\/admin\/dashboard/);
  22 | 
  23 |     // Klik link Check-in di header admin
  24 |     await page.click("a:has-text('Check-in')");
  25 |     await expect(page).toHaveURL(/\/petugas\/check-in/);
  26 |     await expect(page.locator("h1")).toContainText(/Check-in/i);
  27 |   });
  28 | });
  29 | 
```