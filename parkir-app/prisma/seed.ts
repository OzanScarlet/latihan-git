import { PrismaClient, Role, VehicleType, SlotStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // 1. Users (Tetap pakai upsert karena email sudah @unique)
  const pw = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@parkir.id" },
    update: {},
    create: { name: "Admin Kantor", email: "admin@parkir.id", password: pw, role: Role.admin },
  });

  const pw2 = await bcrypt.hash("petugas123", 10);
  const petugas = await prisma.user.upsert({
    where: { email: "joko@parkir.id" },
    update: {},
    create: { name: "Joko Petugas", email: "joko@parkir.id", password: pw2, role: Role.petugas },
  });
  console.log(`   users: ${admin.email} (admin), ${petugas.email} (petugas)`);

  // 2. Zones (Ganti ke findFirst / create agar tidak menuntut @unique)
  let zoneA = await prisma.zone.findFirst({ where: { name: "Area Depan" } });
  if (!zoneA) {
    zoneA = await prisma.zone.create({
      data: { name: "Area Depan", capacity: 10 },
    });
  }

  let zoneB = await prisma.zone.findFirst({ where: { name: "Basement" } });
  if (!zoneB) {
    zoneB = await prisma.zone.create({
      data: { name: "Basement", capacity: 6 },
    });
  }

  // 3. Slots
  for (let i = 1; i <= 10; i++) {
    const code = `A-${String(i).padStart(2, "0")}`;
    await prisma.slot.upsert({
      where: { zoneId_code: { zoneId: zoneA.id, code: code } },
      update: {},
      create: {
        zoneId: zoneA.id,
        code: code,
        type: i <= 5 ? VehicleType.mobil : VehicleType.motor,
        status: SlotStatus.available,
      },
    });
  }

  for (let i = 1; i <= 6; i++) {
    const code = `B-${String(i).padStart(2, "0")}`;
    await prisma.slot.upsert({
      where: { zoneId_code: { zoneId: zoneB.id, code: code } },
      update: {},
      create: {
        zoneId: zoneB.id,
        code: code,
        type: VehicleType.mobil,
        status: SlotStatus.available,
      },
    });
  }

  console.log(`   zones: ${zoneA.name}, ${zoneB.name} — slots dibuat`);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });