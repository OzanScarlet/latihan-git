import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { formatCurrency, formatPlate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [zones, activeSessions, todayRange] = await Promise.all([
    prisma.zone.findMany({ include: { slots: true } }),
    prisma.session.findMany({
      where: { status: "active" },
      include: { vehicle: true, slot: true },
      orderBy: { timeIn: "desc" },
      take: 8,
    }),
    (async () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const [count, sumAgg] = await Promise.all([
        prisma.session.count({
          where: { status: "done", timeOut: { gte: start, lt: end } },
        }),
        prisma.session.aggregate({
          where: { status: "done", timeOut: { gte: start, lt: end } },
          _sum: { fee: true },
        }),
      ]);
      return { count, revenue: sumAgg._sum.fee ?? 0 };
    })(),
  ]);

  const totalSlots = zones.reduce((acc, z) => acc + z.slots.length, 0);
  const occupiedSlots = zones.reduce(
    (acc, z) => acc + z.slots.filter((s) => s.status === "occupied").length,
    0
  );
  const occupancy = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  const kpis = [
    { label: "Okupansi Slot", value: `${occupiedSlots}/${totalSlots}`, sub: `${occupancy}%` },
    { label: "Kendaraan Aktif", value: String(activeSessions.length), sub: "di lahan" },
    { label: "Selesai Hari Ini", value: String(todayRange.count), sub: "transaksi" },
    { label: "Pendapatan Hari Ini", value: formatCurrency(todayRange.revenue), sub: "total" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">{k.label}</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{k.value}</div>
              <div className="text-xs text-slate-400">{k.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Occupancy by zone */}
      <Card>
        <CardHeader>
          <CardTitle>Okupansi per Zona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {zones.map((z) => {
              const cap = z.slots.length;
              const occ = z.slots.filter((s) => s.status === "occupied").length;
              const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;
              return (
                <div key={z.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{z.name}</span>
                    <span className="text-slate-500">{occ}/{cap}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {zones.length === 0 && <p className="text-sm text-slate-500">Belum ada zona.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Recent active */}
      <Card>
        <CardHeader>
          <CardTitle>Kendaraan Aktif Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {activeSessions.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada kendaraan aktif.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeSessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{formatPlate(s.vehicle.plate)}</div>
                    <div className="text-xs text-slate-500">{formatTime(s.timeIn)} · {s.vehicle.type}</div>
                  </div>
                  {s.slot ? <Badge tone="blue">{s.slot.code}</Badge> : <Badge tone="gray">tanpa slot</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
