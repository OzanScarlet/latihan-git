# ParkirKu — Sistem Manajemen Parkir Kantor

Sistem parkir kantor berbasis **Next.js (App Router)** agar data tercatat rapi, menggantikan tukang parkir liar, dan menyediakan laporan terpadu. Implementasi sesuai `../PARKIR_IMPLEMENTASI.md`.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + komponen UI ringan (tanpa shadcn CLI)
- Auth.js (NextAuth) — Credentials + JWT, role `admin`/`petugas`
- Prisma + SQLite (dev) — ganti ke PostgreSQL untuk production
- Zod untuk validasi

## Quick start

```bash
cd parkir-app
npm install
cp .env.example .env          # sesuaikan DATABASE_URL & AUTH_SECRET
npx prisma generate
npx prisma db push
npm run db:seed               # akun + zona + slot contoh
npm run dev                  # http://localhost:3000
```

## Akun demo (dari seed)

| Role    | Email             | Password    |
|---------|-------------------|-------------|
| Admin   | admin@parkir.id   | admin123    |
| Petugas | joko@parkir.id    | petugas123  |

## Fitur (MVP)

**Admin**
- Dashboard: KPI okupansi, kendaraan aktif, pendapatan harian
- Zona & Slot: CRUD zona + slot, status real-time
- Petugas: kelola akun admin/petugas, aktif/nonaktif
- Laporan: filter tanggal + plat, ringkasan, export CSV

**Petugas** (mobile-first)
- Check-in: plat + tipe + slot opsional, validasi format plat
- Check-out: hitung biaya otomatis, bebaskan slot
- Daftar kendaraan aktif

## Aturan bisnis

- 1 plat = maks 1 sesi aktif (dicegah saat check-in)
- Hanya petugas/admin aktif yang boleh check-in/out
- Tarif: jam pertama + jam berikutnya, dengan daily max (lihat `lib/parking/fee.ts`)
- Plat dinormalisasi (`B 1234 XYZ` → `B1234XYZ`) sebelum disimpan

## Struktur

```
app/
  (auth)/login/            # halaman login
  admin/                   # dashboard, zones, petugas, reports
  petugas/                 # check-in, check-out, active
  api/
    auth/[...nextauth]/    # handler NextAuth
    reports/export/        # CSV export
auth.ts                    # konfigurasi NextAuth
middleware.ts              # role guard + redirect
lib/
  prisma.ts                # Prisma client singleton
  utils.ts                 # cn, format/normalize plat, currency
  parking/fee.ts           # konfigurasi + hitung tarif
  actions/                 # server actions (zone, petugas, session)
prisma/
  schema.prisma
  seed.ts
components/ui/             # Button, Input, Card, Badge ringan
```

## Pindah ke PostgreSQL (production)

1. `schema.prisma`: ganti `provider = "sqlite"` → `"postgresql"`
2. `.env`: `DATABASE_URL="postgresql://user:pass@host:port/dbname"`
3. `npx prisma migrate dev --name init`
4. Set `AUTH_SECRET` ke string acak yang kuat
5. Deploy ke Vercel (atau platform Node)

## Tarif default (ubah sesuai kebijakan kantor)

`lib/parking/fee.ts`:

| Tipe  | Jam pertama | Jam berikutnya | Harian maks |
|-------|-------------|----------------|-------------|
| Mobil | Rp 5.000    | Rp 3.000       | Rp 30.000   |
| Motor | Rp 2.000    | Rp 1.000       | Rp 10.000   |

## Roadmap (di luar MVP)

- Shift petugas + audit log
- QR ticket
- Booking/self check-in karyawan
- Pembayaran digital
- Multi-lokasi
- Kamera/ANPR (opsional hardware)
