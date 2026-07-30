# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-zones.spec.ts >> Admin Zone CRUD >> tambah slot manual di zona existing
- Location: e2e\admin-zones.spec.ts:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Buat & generate slot")')

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
          - link "Petugas" [ref=e11] [cursor=pointer]:
            - /url: /admin/petugas
          - link "Laporan" [ref=e12] [cursor=pointer]:
            - /url: /admin/reports
        - button "Keluar" [ref=e14] [cursor=pointer]
    - main [ref=e15]:
      - generic [ref=e16]:
        - heading "Zona & Slot Parkir" [level=1] [ref=e17]
        - generic [ref=e18]:
          - heading "Tambah Zona" [level=3] [ref=e20]
          - generic [ref=e22]:
            - generic [ref=e23]:
              - generic [ref=e24]: Nama zona
              - textbox "Area Depan" [ref=e25]: Manual-1785404126284
            - generic [ref=e26]:
              - generic [ref=e27]: Jumlah slot
              - spinbutton [active] [ref=e28]: "3"
            - button "Buat" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - generic [ref=e32]:
            - heading "Area Depan" [level=3] [ref=e33]
            - generic [ref=e34]:
              - generic [ref=e35]: 10 kapasitas
              - generic [ref=e36]: 10 kosong
              - generic [ref=e37]: 10 slot
              - button "Hapus zona" [ref=e39] [cursor=pointer]
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]:
                - generic [ref=e43]: A-01
                - generic [ref=e44]: mobil
                - button "hapus" [ref=e47] [cursor=pointer]
              - generic [ref=e48]:
                - generic [ref=e49]: A-02
                - generic [ref=e50]: mobil
                - button "hapus" [ref=e53] [cursor=pointer]
              - generic [ref=e54]:
                - generic [ref=e55]: A-03
                - generic [ref=e56]: mobil
                - button "hapus" [ref=e59] [cursor=pointer]
              - generic [ref=e60]:
                - generic [ref=e61]: A-04
                - generic [ref=e62]: mobil
                - button "hapus" [ref=e65] [cursor=pointer]
              - generic [ref=e66]:
                - generic [ref=e67]: A-05
                - generic [ref=e68]: mobil
                - button "hapus" [ref=e71] [cursor=pointer]
              - generic [ref=e72]:
                - generic [ref=e73]: A-06
                - generic [ref=e74]: motor
                - button "hapus" [ref=e77] [cursor=pointer]
              - generic [ref=e78]:
                - generic [ref=e79]: A-07
                - generic [ref=e80]: motor
                - button "hapus" [ref=e83] [cursor=pointer]
              - generic [ref=e84]:
                - generic [ref=e85]: A-08
                - generic [ref=e86]: motor
                - button "hapus" [ref=e89] [cursor=pointer]
              - generic [ref=e90]:
                - generic [ref=e91]: A-09
                - generic [ref=e92]: motor
                - button "hapus" [ref=e95] [cursor=pointer]
              - generic [ref=e96]:
                - generic [ref=e97]: A-10
                - generic [ref=e98]: motor
                - button "hapus" [ref=e101] [cursor=pointer]
            - generic [ref=e102]:
              - generic [ref=e103]:
                - generic [ref=e104]: Kode
                - textbox [ref=e105]: A-11
              - generic [ref=e106]:
                - generic [ref=e107]: Tipe
                - combobox [ref=e108]:
                  - option "Mobil"
                  - option "Motor" [selected]
              - button "+ Tambah slot" [ref=e109] [cursor=pointer]
        - generic [ref=e110]:
          - generic [ref=e112]:
            - heading "Basement" [level=3] [ref=e113]
            - generic [ref=e114]:
              - generic [ref=e115]: 6 kapasitas
              - generic [ref=e116]: 5 kosong
              - generic [ref=e117]: 6 slot
              - button "Hapus zona" [ref=e119] [cursor=pointer]
          - generic [ref=e120]:
            - generic [ref=e121]:
              - generic [ref=e122]:
                - generic [ref=e123]: B-01
                - generic [ref=e124]: mobil
                - button "hapus" [ref=e127] [cursor=pointer]
              - generic [ref=e128]:
                - generic [ref=e129]: B-02
                - generic [ref=e130]: mobil
                - button "hapus" [ref=e133] [cursor=pointer]
              - generic [ref=e134]:
                - generic [ref=e135]: B-03
                - generic [ref=e136]: mobil
                - button "hapus" [ref=e139] [cursor=pointer]
              - generic [ref=e140]:
                - generic [ref=e141]: B-04
                - generic [ref=e142]: mobil
                - button "hapus" [ref=e145] [cursor=pointer]
              - generic [ref=e146]:
                - generic [ref=e147]: B-05
                - generic [ref=e148]: mobil
                - button "hapus" [ref=e151] [cursor=pointer]
              - generic [ref=e152]:
                - generic [ref=e153]: B-06
                - generic [ref=e154]: mobil
                - button "hapus" [ref=e157] [cursor=pointer]
            - generic [ref=e158]:
              - generic [ref=e159]:
                - generic [ref=e160]: Kode
                - textbox [ref=e161]: B-07
              - generic [ref=e162]:
                - generic [ref=e163]: Tipe
                - combobox [ref=e164]:
                  - option "Mobil" [selected]
                  - option "Motor"
              - button "+ Tambah slot" [ref=e165] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin Zone CRUD", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login admin
  6  |     await page.goto("/login");
  7  |     await page.fill('input[name="email"]', "admin@parkir.id");
  8  |     await page.fill('input[name="password"]', "admin123");
  9  |     await page.click('button[type="submit"]');
  10 |     await expect(page).toHaveURL(/\/admin\/dashboard/);
  11 | 
  12 |     await page.click("a:has-text('Zona & Slot')");
  13 |     await expect(page).toHaveURL(/\/admin\/zones/);
  14 |   });
  15 | 
  16 |   test("buat zona baru → slot ter-generate", async ({ page }) => {
  17 |     const zoneName = `TestZone-${Date.now()}`;
  18 | 
  19 |     await page.fill('input[name="name"]', zoneName);
  20 |     await page.fill('input[name="capacity"]', "5");
  21 |     await page.selectOption('select[name="type"]', "mobil");
  22 |     await page.click('button:has-text("Buat & generate slot")');
  23 | 
  24 |     // Zona muncul
  25 |     await expect(page.locator(`text=${zoneName}`)).toBeVisible();
  26 |     // Slot T-01 sampai T-05 muncul
  27 |     await expect(page.locator("text=T-01")).toBeVisible();
  28 |     await expect(page.locator("text=T-05")).toBeVisible();
  29 |   });
  30 | 
  31 |   test("tambah slot manual di zona existing", async ({ page }) => {
  32 |     // Asumsi zona "Area Depan" dari seed ada
  33 |     await page.fill('input[name="name"]', `Manual-${Date.now()}`);
  34 |     await page.fill('input[name="capacity"]', "3");
  35 |     await page.selectOption('select[name="type"]', "motor");
> 36 |     await page.click('button:has-text("Buat & generate slot")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  37 | 
  38 |     // Klik input kode slot terakhir lalu tambah
  39 |     const codeInput = page.locator('input[name="code"]').last();
  40 |     await codeInput.fill("TEST-99");
  41 |     await page.click('button:has-text("Tambah slot")');
  42 | 
  43 |     await expect(page.locator("text=TEST-99")).toBeVisible();
  44 |   });
  45 | });
```