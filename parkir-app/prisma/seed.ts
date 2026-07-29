import { PrismaClient, Role, VehicleType, SlotStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Users
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
  console.log(`  users: ${admin.email} (admin), ${petugas.email} (petugas)`);

  // Zones + slots
  const zoneA = await prisma.zone.upsert({
    where: { name: "Area Depan" },
    update: {},
    create: { name: "Area Depan", capacity: 10 },
  });
  const zoneB = await prisma.zone.upsert({
    where: { name: "Basement" },
    update: {},
    create: { name: "Basement", capacity: 6 },
  });

  for (let i = 1; i <= 10; i++) {
    await prisma.slot.upsert({
      where: { zoneId_code: { zoneId: zoneA.id, code: `A-${String(i).padStart(2, "0")}` } },
      update: {},
      create: {
        zoneId: zoneA.id,
        code: `A-${String(i).padStart(2, "0")}`,
        type: i <= 5 ? VehicleType.mobil : VehicleType.motor,
        status: SlotStatus.available,
      },
    });
  }
  for (let i = 1; i <= 6; i++) {
    await prisma.slot.upsert({
      where: { zoneId_code: { zoneId: zoneB.id, code: `B-${String(i).padStart(2, "0")}` } },
      update: {},
      create: {
        zoneId: zoneB.id,
        code: `B-${String(i).padStart(2, "0")}`,
        type: VehicleType.mobil,
        status: SlotStatus.available,
      },
    });
  }
  console.log(`  zones: ${zoneA.name}, ${zoneB.name} — slots dibuat`);

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
