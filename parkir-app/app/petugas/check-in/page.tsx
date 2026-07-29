import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkIn } from "@/lib/actions/session";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const slots = await prisma.slot.findMany({
    where: { status: "available" },
    include: { zone: true },
    orderBy: [{ zone: { name: "asc" } }, { code: "asc" }],
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Check-in Kendaraan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Masukkan Kendaraan</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={checkIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plat Nomor</label>
              <input
                name="plate"
                required
                autoFocus
                placeholder="B 1234 XYZ"
                className="flex h-12 w-full rounded-lg border border-slate-300 px-3 text-lg uppercase tracking-wide focus:border-slate-900 focus:outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">Format: huruf-angka-huruf</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
              <select
                name="type"
                className="flex h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
              >
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slot (opsional)</label>
              <select
                name="slotId"
                defaultValue=""
                className="flex h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
              >
                <option value="">— Tanpa slot —</option>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.zone.name} / {s.code} ({s.type})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex w-full h-12 items-center justify-center rounded-lg bg-slate-900 px-4 text-base font-medium text-white hover:bg-slate-800"
            >
              Check-in
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
