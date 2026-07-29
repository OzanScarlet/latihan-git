# Sistem Manajemen Parkir Kantor — Breakdown Implementasi

> Solusi digitalisasi lahan parkir kantor dengan **Next.js** agar data tercatat rapi, menggantikan tukang parkir liar, dan menyediakan laporan terpadu.

---

## 1. Latar Belakang Masalah

| Masalah | Dampak |
|---|---|
| Lahan parkir tidak dikelola rapi | Slot acak, kendaraan bertumpuk |
| Tukang parkir liar | Uang & data bocor, tidak terverifikasi |
| Tidak terintegrasi | Laporan manual, sulit audit |
| Tidak ada pencatatan | Tidak ada jejak masuk/keluar |

**Tujuan:** setiap kendaraan masuk/keluar tercatat oleh petugas resmi → data lengkap, bisa diaudit, menghapus ruang okupasi liar.

---

## 2. Kenapa Next.js

- **Full-stack 1 repo**: UI petugas + API + dashboard admin dalam satu proyek
- **App Router + Server Actions / Route Handlers**: CRUD tanpa backend terpisah
- **SSR**: dashboard laporan cepat & aman (data tidak bocor ke klien)
- **Mobile-friendly**: petugas lapangan akses via browser HP
- **Ekosistem matang**: Auth, ORM, deploy (Vercel) mudah

---

## 3. Stack yang Direkomendasikan

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router) | full-stack modern |
| Bahasa | TypeScript | data sensitif → type-safe |
| UI | Tailwind + shadcn/ui | cepat, konsisten, mobile-ready |
| Auth | Auth.js (NextAuth) | role: `admin`, `petugas` |
| ORM | Prisma | schema jelas, migrasi rapi |
| DB | PostgreSQL (Supabase/Neon) | relasi & laporan, gratis tier |
| Validasi | Zod | form plat, slot, tarif |
| Deploy | Vercel + managed DB | cocok prototype/magang |

**Hindari dulu (di luar scope MVP):** aplikasi mobile native, gate hardware, kamera ANPR — mahal & belum perlu untuk "data rapi".

---

## 4. Arsitektur Sistem

```
┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│ Petugas(HP) │  │ Admin/Kantor │  │ Karyawan*    │
│ check-in/out│  │ dashboard    │  │ (fase 2-3)   │
└──────┬──────┘  └──────┬───────┘  └──────┬──────┘
       └────────────────┼─────────────────┘
                        ▼
              Next.js (App Router)
              ├─ UI (React)
              ├─ Server Actions / API
              └─ Auth (session)
                        ▼
              PostgreSQL + Prisma
```

\*Karyawan self-service = fase lanjutan, bukan MVP.

---

## 5. Model Data Inti (MVP)

```
User      → id, name, email, role (admin|petugas), active
Zone      → id, name, capacity          // "Gedung A", "Basement"
Slot      → id, zoneId, code, type (motor|mobil), status
Vehicle   → id, plate, type, ownerName? (opsional)
Session   → id, vehicleId, slotId?, petugasIn, petugasOut?,
            timeIn, timeOut?, fee?, status (active|done|void)
Shift     → id, petugasId, start, end   // audit petugas resmi
```

**Aturan bisnis:**
- 1 plat = maksimal 1 sesi `active` (unique constraint)
- Hanya `petugas` aktif yang boleh check-in/out
- Void/batal = admin only + wajib alasan
- Tarif: durasi × tipe kendaraan (bisa flat di awal)

---

## 6. Fitur per Prioritas

### P0 — MVP (wajib)
1. Login role admin / petugas
2. CRUD zona & slot
3. Check-in: plat + tipe + slot (opsional) + petugas
4. Check-out: hitung durasi + fee
5. Daftar kendaraan aktif (real-time)
6. Laporan harian: total masuk, keluar, pendapatan

### P1 — Stabil operasi
7. Manajemen petugas + shift
8. Filter/search plat
9. Export CSV/Excel
10. Soft-delete / void transaksi
11. Notifikasi slot penuh

### P2 — Integrasi lanjut
12. Karyawan booking / self check-in
13. QR ticket
14. Pembayaran digital
15. Multi-lokasi
16. Kamera/ANPR (opsional hardware)

---

## 7. Alur Operasional Target

```
Kendaraan datang
  → Petugas login (HP)
  → Input plat / scan
  → Sistem cek: plat sudah active? slot tersedia?
  → Buat Session (timeIn, petugasIn, slot)
  → Tiket/struk digital

Kendaraan keluar
  → Cari plat / session active
  → timeOut, hitung fee
  → Bebaskan slot
  → Catat petugasOut

Admin
  → Lihat okupansi real-time
  → Laporan harian/mingguan
  → Kelola petugas & slot
```

Ini mematikan tukang parkir liar: **hanya akun resmi** bisa catat transaksi, semua jejak tersimpan.

---

## 8. Struktur Folder Rekomendasi

```
app/
  (auth)/login/
  (admin)/
    dashboard/
    zones/
    slots/
    petugas/
    reports/
  (petugas)/
    check-in/
    check-out/
    active/
  api/            # bila butuh REST (atau full Server Actions)
components/
  ui/             # shadcn
  parking/
lib/
  auth.ts
  db.ts
  parking/        # hitung fee, validasi plat
prisma/
  schema.prisma
  seed.ts
```

---

## 9. Tahapan Pengembangan

### Tahap 0 — Fondasi (1–2 hari)
- `create-next-app` + TypeScript + Tailwind + ESLint
- Struktur folder awal
- Setup DB + Prisma schema
- Auth dasar + role

**Deliverable:** app jalan, login dummy, DB terhubung.

### Tahap 1 — Master Data (2–3 hari)
- CRUD Zone, Slot, User (petugas)
- UI admin: tabel + form
- Seed data contoh

**Deliverable:** admin bisa setup lahan.

### Tahap 2 — Transaksi Parkir (4–5 hari)
- Halaman petugas: check-in / check-out
- Validasi plat (format Indonesia: `B 1234 XYZ`)
- Daftar sesi aktif
- Hitung fee sederhana

**Deliverable:** alur parkir end-to-end di HP.

### Tahap 3 — Dashboard & Laporan (2–3 hari)
- KPI: slot terisi, sesi hari ini, pendapatan
- Filter tanggal
- Export CSV

**Deliverable:** data rapi & bisa diaudit.

### Tahap 4 — Hardening (2–3 hari)
- Role guard (middleware)
- Audit log (siapa ubah apa)
- Error handling, empty states
- Mobile polish untuk petugas
- README + seed + instruksi deploy

**Deliverable:** MVP siap demo ke kantor.

### Tahap 5+ — Iterasi (opsional)
- Shift petugas, QR, booking karyawan, payment

---

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Petugas malas input | UI 2–3 tap, plat autofocus |
| Plat salah ketik | normalisasi + konfirmasi sebelum submit |
| Double check-in | unique constraint per plat aktif |
| Resistensi tukang liar | kebijakan kantor + sistem = sumber kebenaran |
| Offline lapangan | P1: queue offline (IndexedDB) — bukan MVP |
| Scope creep hardware | batasi software dulu |

---

## 11. Estimasi Kasar (1 developer)

| Tahap | Durasi |
|---|---|
| 0 Fondasi | 1–2 hari |
| 1 Master data | 2–3 hari |
| 2 Transaksi | 4–5 hari |
| 3 Laporan | 2–3 hari |
| 4 Hardening | 2–3 hari |
| **Total MVP** | **~2–3 minggu** |

---

## 12. Rekomendasi Keputusan

1. **Bangun MVP software dulu** — data rapi > hardware
2. **2 role saja**: `admin` + `petugas`
3. **PostgreSQL + Prisma + Next.js App Router + shadcn**
4. **Check-in/out manual via HP** = ganti tukang parkir liar
5. **Laporan harian** = bukti ke manajemen
