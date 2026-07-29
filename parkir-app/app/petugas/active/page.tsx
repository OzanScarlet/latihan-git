import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { formatPlate, formatTime, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActivePage() {
  const sessions = await prisma.session.findMany({
    where: { status: "active" },
    include: { vehicle: true, slot: true, petugasIn: true },
    orderBy: { timeIn: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Kendaraan Aktif</h1>
        <Badge tone="green">{sessions.length} aktif</Badge>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent>
            <p className="py-8 text-center text-sm text-slate-500">Lahan kosong.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-slate-900">
                    {formatPlate(s.vehicle.plate)}
                  </div>
                  <Badge tone="gray">{s.vehicle.type}</Badge>
                </div>
                <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                  <div>Masuk: {formatDateTime(s.timeIn)}</div>
                  {s.slot && <div>Slot: {s.slot.code}</div>}
                  <div>Petugas: {s.petugasIn.name}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
