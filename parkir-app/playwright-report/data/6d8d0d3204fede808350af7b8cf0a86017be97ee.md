# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-error.spec.ts >> Login Error Handling >> wrong password → alert muncul di halaman login
- Location: e2e\login-error.spec.ts:4:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('alert')
Expected pattern: /salah/i
Error: strict mode violation: getByRole('alert') resolved to 2 elements:
    1) <div role="alert" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Username atau password salah.</div> aka getByText('Username atau password salah.')
    2) <div role="alert" aria-live="assertive" id="__next-route-announcer__"></div> aka locator('[id="__next-route-announcer__"]')

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('alert')
    7 × locator resolved to <div role="alert" aria-live="assertive" id="__next-route-announcer__"></div>
      - unexpected value ""

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "ParkirKu" [level=3] [ref=e6]
        - paragraph [ref=e7]: Manajemen Parkir Kantor
      - generic [ref=e8]:
        - alert [ref=e9]: Username atau password salah.
        - generic [ref=e10]:
          - generic [ref=e11]:
            - generic [ref=e12]: Email
            - textbox "nama@kantor.id" [ref=e13]
          - generic [ref=e14]:
            - generic [ref=e15]: Password
            - textbox "••••••••" [ref=e16]
          - button "Masuk" [ref=e17] [cursor=pointer]
        - paragraph [ref=e18]: "Demo admin: admin@parkir.id / admin123 · petugas: joko@parkir.id / petugas123"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Login Error Handling", () => {
  4  |   test("wrong password → alert muncul di halaman login", async ({ page }) => {
  5  |     await page.goto("/login");
  6  |     await page.fill('input[name="email"]', "admin@parkir.id");
  7  |     await page.fill('input[name="password"]', "salahpassword");
  8  |     await page.click('button[type="submit"]');
  9  | 
  10 |     // Harus tetap di /login dengan alert error
  11 |     await expect(page).toHaveURL(/\/login/);
> 12 |     await expect(page.getByRole("alert")).toContainText(/salah/i);
     |                                           ^ Error: expect(locator).toContainText(expected) failed
  13 |   });
  14 | 
  15 |   test("email tidak terdaftar → alert", async ({ page }) => {
  16 |     await page.goto("/login");
  17 |     await page.fill('input[name="email"]', "tidakada@example.com");
  18 |     await page.fill('input[name="password"]', "123456");
  19 |     await page.click('button[type="submit"]');
  20 | 
  21 |     await expect(page).toHaveURL(/\/login/);
  22 |     await expect(page.getByRole("alert")).toBeVisible();
  23 |   });
  24 | 
  25 |   test("login lalu logout kembali ke /login", async ({ page }) => {
  26 |     await page.goto("/login");
  27 |     await page.fill('input[name="email"]', "admin@parkir.id");
  28 |     await page.fill('input[name="password"]', "admin123");
  29 |     await page.click('button[type="submit"]');
  30 |     await expect(page).toHaveURL(/\/admin\/dashboard/);
  31 | 
  32 |     await page.click("text=Keluar");
  33 |     await expect(page).toHaveURL(/\/login/);
  34 |   });
  35 | });
  36 | 
```