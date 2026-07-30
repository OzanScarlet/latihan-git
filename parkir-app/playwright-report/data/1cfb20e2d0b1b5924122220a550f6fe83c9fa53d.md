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
  - alert [ref=e2]: ParkirKu — Manajemen Parkir Kantor
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "ParkirKu Admin" [ref=e6] [cursor=pointer]:
          - /url: /admin/dashboard
        - navigation [ref=e7]:
          - link "Dashboard" [ref=e8] [cursor=pointer]:
            - /url: /admin/dashboard
          - link "Check-in" [ref=e9] [cursor=pointer]:
            - /url: /petugas/check-in
          - link "Zona & Slot" [ref=e10] [cursor=pointer]:
            - /url: /admin/zones
          - link "Petugas" [active] [ref=e11] [cursor=pointer]:
            - /url: /admin/petugas
          - link "Laporan" [ref=e12] [cursor=pointer]:
            - /url: /admin/reports
        - button "Keluar" [ref=e14] [cursor=pointer]
    - main [ref=e15]:
      - generic [ref=e16]:
        - heading "Manajemen Petugas & Admin" [level=1] [ref=e17]
        - generic [ref=e18]:
          - heading "Tambah Akun" [level=3] [ref=e20]
          - generic [ref=e22]:
            - generic [ref=e23]:
              - generic [ref=e24]: Nama
              - textbox [ref=e25]
            - generic [ref=e26]:
              - generic [ref=e27]: Email
              - textbox [ref=e28]
            - generic [ref=e29]:
              - generic [ref=e30]: Password
              - textbox [ref=e31]
            - generic [ref=e32]:
              - generic [ref=e33]: Role
              - combobox [ref=e34]:
                - option "Petugas" [selected]
                - option "Admin"
            - button "Simpan" [ref=e35] [cursor=pointer]
        - generic [ref=e36]:
          - heading "Daftar Akun (2)" [level=3] [ref=e38]
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]:
                - generic [ref=e43]: Admin Kantor
                - generic [ref=e44]: admin@parkir.id
              - generic [ref=e45]:
                - generic [ref=e46]: admin
                - generic [ref=e47]: aktif
                - button "nonaktifkan" [ref=e49] [cursor=pointer]
                - group [ref=e50]:
                  - generic "reset" [ref=e51] [cursor=pointer]
            - generic [ref=e52]:
              - generic [ref=e53]:
                - generic [ref=e54]: Joko Petugas
                - generic [ref=e55]: joko@parkir.id
              - generic [ref=e56]:
                - generic [ref=e57]: petugas
                - generic [ref=e58]: aktif
                - button "nonaktifkan" [ref=e60] [cursor=pointer]
                - group [ref=e61]:
                  - generic "reset" [ref=e62] [cursor=pointer]
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