import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Global setup - jalan sekali sebelum SEMUA test.
 * Urutan:
 *  1. Prisma db push (schema sync)
 *  2. Truncate semua tabel (child → parent)
 *  3. Seed ulang data awal (admin, petugas, zones, slots)
 */
export default async function globalSetup() {
  console.log("[global-setup] Starting...");

  // 1. Push schema
  console.log("[global-setup] Push schema...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env },
  });

  // 2. Reset & seed
  const prisma = new PrismaClient();
  try {
    console.log("[global-setup] Reset database...");

    // Urutan FK: child dulu
    await prisma.resetToken.deleteMany().catch(() => {});
    await prisma.shift.deleteMany().catch(() => {});
    await prisma.session.deleteMany().catch(() => {});
    await prisma.slot.deleteMany().catch(() => {});
    await prisma.vehicle.deleteMany().catch(() => {});
    await prisma.zone.deleteMany().catch(() => {});
    await prisma.user.deleteMany().catch(() => {});

    console.log("[global-setup] Seeding...");

 

    // Admin
    const adminHash = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@parkir.id" },
      update: { password: adminHash, role: "admin", active: true, name: "Admin Kantor" },
      create: { email: "admin@parkir.id", password: adminHash, name: "Admin Kantor", role: "admin", active: true },
    });

    // Petugas
    const petugasHash = await bcrypt.hash("petugas123", 10);
    await prisma.user.upsert({
      where: { email: "joko@parkir.id" },
      update: { password: petugasHash, role: "petugas", active: true, name: "Joko Petugas" },
      create: { email: "joko@parkir.id", password: petugasHash, name: "Joko Petugas", role: "petugas", active: true },
    });

    // Zones + slots
    const zoneA = await prisma.zone.create({ data: { name: "Area Depan", capacity: 10 } });
    const zoneB = await prisma.zone.create({ data: { name: "Basement", capacity: 6 } });

    for (let i = 1; i <= 10; i++) {
      await prisma.slot.create({
        data: {
          zoneId: zoneA.id,
          code: `A-${String(i).padStart(2, "0")}`,
          type: i <= 5 ? "mobil" : "motor",
          status: "available",
        },
      });
    }
    for (let i = 1; i <= 6; i++) {
      await prisma.slot.create({
        data: {
          zoneId: zoneB.id,
          code: `B-${String(i).padStart(2, "0")}`,
          type: "mobil",
          status: "available",
        },
      });
    }

    console.log("[global-setup] Seed selesai.");
  } finally {
    await prisma.$disconnect();
  }

  console.log("[global-setup] Done.");
}