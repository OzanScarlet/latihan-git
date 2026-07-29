import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import {
  formatCurrency,
  formatDateTime,
  formatPlate,
  normalizePlate,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Laporan — ParkirKu" };

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; plate?: string }>;
}) {
  const sp = await searchParams;
  const from = parseDate(sp.from ? `${sp.from}T00:00:00` : null);
  const to = parseDate(sp.to ? `${sp.to}T23:59:59` : null);
  const plate = sp.plate ? normalizePlate(sp.plate) : undefined;

  const where = {
    status: "done" as const,
    ...(from || to
      ? { timeOut: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
      : {}),
    ...(plate ? { vehicle: { plate: { contains: plate } } } : {}),
  };

  const [sessions, agg] = await Promise.all([
    prisma.session.findMany({
      where,
      include: { vehicle: true, slot: true, petugasIn: true, petugasOut: true },
      orderBy: { timeOut: "desc" },
      take: 200,
    }),
    prisma.session.aggregate({
      where,
      _sum: { fee: true },
      _count: true,
    }),
  ]);

  const totalFee = agg._sum.fee ?? 0;
  const totalTrx = agg._count;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Laporan Transaksi</h1>
        <a
          href={`/api/reports/export?from=${sp.from ?? ""}&to=${sp.to ?? ""}&plate=${sp.plate ?? ""}`}
          className="inline-flex h-9 items-center rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-100"
        >
          Export CSV
        </a>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Total Transaksi</div>
            <div className="mt-1 text-2xl font-bold">{totalTrx}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Total Pendapatan</div>
            <div className="mt-1 text-2xl font-bold">{formatCurrency(totalFee)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Rata-rata / Transaksi</div>
            <div className="mt-1 text-2xl font-bold">
              {formatCurrency(totalTrx > 0 ? totalFee / totalTrx : 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dari</label>
              <input
                name="from"
                type="date"
                defaultValue={sp.from}
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sampai</label>
              <input
                name="to"
                type="date"
                defaultValue={sp.to}
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plat</label>
              <input
                name="plate"
                defaultValue={sp.plate}
                placeholder="B 1234 XYZ"
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <button className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">
              Terapkan
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat ({sessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada data untuk filter ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                    <th className="py-2 pr-3">Plat</th>
                    <th className="py-2 pr-3">Tipe</th>
                    <th className="py-2 pr-3">Masuk</th>
                    <th className="py-2 pr-3">Keluar</th>
                    <th className="py-2 pr-3">Petugas</th>
                    <th className="py-2 pr-3 text-right">Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2 pr-3 font-medium">{formatPlate(s.vehicle.plate)}</td>
                      <td className="py-2 pr-3">
                        <Badge tone="gray">{s.vehicle.type}</Badge>
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{formatDateTime(s.timeIn)}</td>
                      <td className="py-2 pr-3 text-slate-600">
                        {s.timeOut ? formatDateTime(s.timeOut) : "—"}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{s.petugasOut?.name ?? s.petugasIn.name}</td>
                      <td className="py-2 pr-3 text-right font-medium">
                        {s.fee != null ? formatCurrency(s.fee) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
