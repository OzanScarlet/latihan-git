# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Flow >> login admin berhasil → redirect ke /admin/dashboard
- Location: e2e\auth.spec.ts:9:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin\/dashboard/
Received string:  "http://localhost:3000/"

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    5 × locator resolved to <html lang="id">…</html>
      - unexpected value "http://localhost:3000/login"
    2 × locator resolved to <html lang="id">…</html>
      - unexpected value "http://localhost:3000/"
  - Target page, context or browser has been closed

```

```yaml
- status:
  - img
  - text: Static route
  - button "Hide static indicator":
    - img
- alert: ParkirKu — Manajemen Parkir Kantor
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Auth Flow", () => {
  4  |   test("redirect ke /login saat belum auth", async ({ page }) => {
  5  |     await page.goto("/admin/dashboard");
  6  |     await expect(page).toHaveURL(/\/login/);
  7  |   });
  8  | 
  9  |   test("login admin berhasil → redirect ke /admin/dashboard", async ({ page }) => {
  10 |     await page.goto("/login");
  11 |     await page.fill('input[name="email"]', "admin@parkir.id");
  12 |     await page.fill('input[name="password"]', "admin123");
  13 |     await page.click('button[type="submit"]');
> 14 |     await expect(page).toHaveURL(/\/admin\/dashboard/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  15 |     await expect(page.locator("h1")).toContainText(/Dashboard/i);
  16 |   });
  17 | 
  18 |   test("login petugas berhasil → redirect ke /petugas/check-in", async ({ page }) => {
  19 |     await page.goto("/login");
  20 |     await page.fill('input[name="email"]', "joko@parkir.id");
  21 |     await page.fill('input[name="password"]', "petugas123");
  22 |     await page.click('button[type="submit"]');
  23 |     await expect(page).toHaveURL(/\/petugas\/check-in/);
  24 |     await expect(page.locator("h1")).toContainText(/Check-in/i);
  25 |   });
  26 | });
  27 | 
```