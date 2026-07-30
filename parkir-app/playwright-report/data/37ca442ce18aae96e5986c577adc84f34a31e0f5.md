# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-petugas.spec.ts >> Admin Petugas Management >> nonaktifkan lalu aktifkan kembali akun
- Location: e2e\admin-petugas.spec.ts:26:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('text=joko@parkir.id').locator('xpath=ancestor::div[contains(@class,\'flex\')]') resolved to 2 elements:
    1) <div class="min-h-screen flex flex-col">…</div> aka getByText('ParkirKu AdminDashboardCheck-inZona & SlotPetugasLaporanKeluarManajemen Petugas')
    2) <div class="flex items-center justify-between py-3">…</div> aka getByText('Joko Petugasjoko@parkir.idpetugasaktifnonaktifkanresetSimpan')

Call log:
  - waiting for locator('text=joko@parkir.id').locator('xpath=ancestor::div[contains(@class,\'flex\')]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - status [ref=e2]:
    - generic [ref=e7]:
      - text: Static route
      - button "Hide static indicator" [ref=e8] [cursor=pointer]
  - alert [ref=e12]: ParkirKu — Manajemen Parkir Kantor
  - generic [ref=e13]:
    - banner [ref=e14]:
      - generic [ref=e15]:
        - link "ParkirKu Admin" [ref=e16] [cursor=pointer]:
          - /url: /admin/dashboard
        - navigation [ref=e17]:
          - link "Dashboard" [ref=e18] [cursor=pointer]:
            - /url: /admin/dashboard
          - link "Check-in" [ref=e19] [cursor=pointer]:
            - /url: /petugas/check-in
          - link "Zona & Slot" [ref=e20] [cursor=pointer]:
            - /url: /admin/zones
          - link "Petugas" [active] [ref=e21] [cursor=pointer]:
            - /url: /admin/petugas
          - link "Laporan" [ref=e22] [cursor=pointer]:
            - /url: /admin/reports
        - button "Keluar" [ref=e24] [cursor=pointer]
    - main [ref=e25]:
      - generic [ref=e26]:
        - heading "Manajemen Petugas & Admin" [level=1] [ref=e27]
        - generic [ref=e28]:
          - heading "Tambah Akun" [level=3] [ref=e30]
          - generic [ref=e32]:
            - generic [ref=e33]:
              - generic [ref=e34]: Nama
              - textbox [ref=e35]
            - generic [ref=e36]:
              - generic [ref=e37]: Email
              - textbox [ref=e38]
            - generic [ref=e39]:
              - generic [ref=e40]: Password
              - textbox [ref=e41]
            - generic [ref=e42]:
              - generic [ref=e43]: Role
              - combobox [ref=e44]:
                - option "Petugas" [selected]
                - option "Admin"
            - button "Simpan" [ref=e45] [cursor=pointer]
        - generic [ref=e46]:
          - heading "Daftar Akun (3)" [level=3] [ref=e48]
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]:
                - generic [ref=e53]: Admin Kantor
                - generic [ref=e54]: admin@parkir.id
              - generic [ref=e55]:
                - generic [ref=e56]: admin
                - generic [ref=e57]: aktif
                - button "nonaktifkan" [ref=e59] [cursor=pointer]
                - group [ref=e60]:
                  - generic "reset" [ref=e61] [cursor=pointer]
            - generic [ref=e62]:
              - generic [ref=e63]:
                - generic [ref=e64]: Joko Petugas
                - generic [ref=e65]: joko@parkir.id
              - generic [ref=e66]:
                - generic [ref=e67]: petugas
                - generic [ref=e68]: aktif
                - button "nonaktifkan" [ref=e70] [cursor=pointer]
                - group [ref=e71]:
                  - generic "reset" [ref=e72] [cursor=pointer]
            - generic [ref=e73]:
              - generic [ref=e74]:
                - generic [ref=e75]: Petugas Test
                - generic [ref=e76]: testuser-1785404112843@parkir.id
              - generic [ref=e77]:
                - generic [ref=e78]: petugas
                - generic [ref=e79]: aktif
                - button "nonaktifkan" [ref=e81] [cursor=pointer]
                - group [ref=e82]:
                  - generic "reset" [ref=e83] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin Petugas Management", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/login");
  6  |     await page.fill('input[name="email"]', "admin@parkir.id");
  7  |     await page.fill('input[name="password"]', "admin123");
  8  |     await page.click('button[type="submit"]');
  9  |     await expect(page).toHaveURL(/\/admin\/dashboard/);
  10 | 
  11 |     await page.click("a:has-text('Petugas')");
  12 |     await expect(page).toHaveURL(/\/admin\/petugas/);
  13 |   });
  14 | 
  15 |   test("buat akun petugas baru", async ({ page }) => {
  16 |     const email = `testuser-${Date.now()}@parkir.id`;
  17 |     await page.fill('input[name="name"]', "Petugas Test");
  18 |     await page.fill('input[name="email"]', email);
  19 |     await page.fill('input[name="password"]', "test12345");
  20 |     await page.selectOption('select[name="role"]', "petugas");
  21 |     await page.click('button:has-text("Simpan")');
  22 | 
  23 |     await expect(page.locator(`text=${email}`)).toBeVisible();
  24 |   });
  25 | 
  26 |   test("nonaktifkan lalu aktifkan kembali akun", async ({ page }) => {
  27 |     // Ambil akun pertama (selain admin yang login) - misal Joko
  28 |     const jokoRow = page.locator("text=joko@parkir.id").locator("xpath=ancestor::div[contains(@class,'flex')]");
  29 | 
> 30 |     await jokoRow.click("text=nonaktifkan");
     |                   ^ Error: locator.click: Error: strict mode violation: locator('text=joko@parkir.id').locator('xpath=ancestor::div[contains(@class,\'flex\')]') resolved to 2 elements:
  31 |     // Badge berubah merah
  32 |     await expect(page.locator("text=nonaktif").first()).toBeVisible();
  33 | 
  34 |     // Aktifkan kembali
  35 |     await page.click("text=aktifkan");
  36 |     await expect(page.locator("text=aktif").first()).toBeVisible();
  37 |   });
  38 | 
  39 |   test("reset password akun petugas", async ({ page }) => {
  40 |     // Cari baris Joko
  41 |     const jokoRow = page.locator("text=joko@parkir.id").locator("xpath=ancestor::div[contains(@class,'flex')]");
  42 | 
  43 |     // Klik "reset" untuk membuka input
  44 |     await jokoRow.locator("summary").filter({ hasText: "reset" }).click();
  45 | 
  46 |     // Isi password baru
  47 |     await jokoRow.fill('input[name="newPassword"]', "newpass123");
  48 |     await jokoRow.click('button:has-text("Simpan")');
  49 | 
  50 |     // Form harus tetap ada (tidak error)
  51 |     await expect(page.locator("text=joko@parkir.id")).toBeVisible();
  52 |   });
  53 | });
```