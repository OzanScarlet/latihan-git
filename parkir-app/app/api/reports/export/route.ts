import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatPlate, normalizePlate } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const plate = searchParams.get("plate");

  const fromD = from ? new Date(`${from}T00:00:00`) : null;
  const toD = to ? new Date(`${to}T23:59:59`) : null;
  const plateN = plate ? normalizePlate(plate) : undefined;

  const where = {
    status: "done" as const,
    ...(fromD || toD
      ? { timeOut: { ...(fromD ? { gte: fromD } : {}), ...(toD ? { lte: toD } : {}) } }
      : {}),
    ...(plateN ? { vehicle: { plate: { contains: plateN } } } : {}),
  };

  const sessions = await prisma.session.findMany({
    where,
    include: { vehicle: true, slot: true, petugasIn: true, petugasOut: true },
    orderBy: { timeOut: "desc" },
    take: 1000,
  });

  const header = [
    "Plat",
    "Tipe",
    "Slot",
    "Waktu Masuk",
    "Waktu Keluar",
    "Petugas Masuk",
    "Petugas Keluar",
    "Biaya",
    "Status",
  ].join(",");

  const rows = sessions.map((s) =>
    [
      `"${formatPlate(s.vehicle.plate)}"`,
      s.vehicle.type,
      s.slot?.code ?? "",
      s.timeIn.toISOString(),
      s.timeOut?.toISOString() ?? "",
      `"${s.petugasIn.name}"`,
      `"${s.petugasOut?.name ?? ""}"`,
      s.fee ?? 0,
      s.status,
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="laporan-parkir-${Date.now()}.csv"`,
    },
  });
}
