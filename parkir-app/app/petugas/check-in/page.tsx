import { prisma } from "@/lib/prisma";
import { CheckInForm } from "@/components/parking/check-in-form";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const slots = await prisma.slot.findMany({
    where: { status: "available" },
    include: { zone: true },
    orderBy: [{ zone: { name: "asc" } }, { code: "asc" }],
  });

  // Pilih data yang diperlukan saja untuk client component.
  const slotData = slots.map((s) => ({
    id: s.id,
    code: s.code,
    type: s.type,
    zone: { name: s.zone.name },
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Check-in Kendaraan</h1>
      <CheckInForm slots={slotData} />
    </div>
  );
}
