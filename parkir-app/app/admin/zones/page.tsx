import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { createZone, createSlot, deleteZone, deleteSlot } from "@/lib/actions/zone";

export const dynamic = "force-dynamic";

export default async function ZonesPage() {
  const zones = await prisma.zone.findMany({
    include: { slots: { orderBy: { code: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Zona & Slot Parkir</h1>

      {/* Create zone + auto-generate slots */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Zona</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createZone} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama zona</label>
              <input name="name" required placeholder="Area Depan" className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah slot</label>
              <input name="capacity" type="number" min={1} defaultValue={10} required className="h-10 w-36 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe kendaraan</label>
              <select name="type" className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none">
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>
            </div>
            <button className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">
              Buat & generate slot
            </button>
          </form>
          <p className="mt-2 text-[11px] text-slate-400">
            Kode slot ter-generate otomatis: huruf depan nama zona + nomor urut (mis. &quot;Area Depan&quot; → A-01 s/d A-10).
          </p>
        </CardContent>
      </Card>

      {/* Zones list */}
      {zones.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada zona. Buat zona pertama di atas.</p>
      ) : (
        zones.map((z) => {
          const prefix = z.slots[0]?.code.split("-")[0] || z.name.charAt(0).toUpperCase();
          const nextCode = `${prefix}-${String(z.slots.length + 1).padStart(2, "0")}`;
          return (
            <Card key={z.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{z.name}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge tone="blue">{z.capacity} kapasitas</Badge>
                    <Badge tone="green">{z.slots.filter((s) => s.status === "available").length} kosong</Badge>
                    <Badge tone="gray">{z.slots.length} slot</Badge>
                    <form action={deleteZone}>
                      <input type="hidden" name="id" value={z.id} />
                      <button className="text-xs text-red-600 hover:underline" type="submit">Hapus zona</button>
                    </form>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Slots grid */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {z.slots.map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-lg border p-2 text-center text-xs ${
                        s.status === "available"
                          ? "border-green-200 bg-green-50"
                          : s.status === "occupied"
                          ? "border-red-200 bg-red-50"
                          : "border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      <div className="font-medium">{s.code}</div>
                      <div className="text-slate-500">{s.type}</div>
                      <div className="mt-1">
                        <form action={deleteSlot}>
                          <input type="hidden" name="id" value={s.id} />
                          <button className="text-[10px] text-red-600 hover:underline" type="submit">hapus</button>
                        </form>
                      </div>
                    </div>
                  ))}
                  {z.slots.length === 0 && (
                    <p className="col-span-full text-xs text-slate-400">Belum ada slot.</p>
                  )}
                </div>

                {/* Inline tambah 1 slot */}
                <form action={createSlot} className="mt-4 flex flex-wrap items-end gap-2 border-t border-slate-100 pt-4">
                  <input type="hidden" name="zoneId" value={z.id} />
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Kode</label>
                    <input name="code" required defaultValue={nextCode} className="h-9 w-24 rounded-lg border border-slate-300 px-2 text-sm focus:border-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Tipe</label>
                    <select name="type" className="h-9 rounded-lg border border-slate-300 px-2 text-sm focus:border-slate-900 focus:outline-none">
                      <option value="mobil">Mobil</option>
                      <option value="motor">Motor</option>
                    </select>
                  </div>
                  <button className="h-9 rounded-lg border border-slate-300 px-3 text-sm font-medium hover:bg-slate-100">+ Tambah slot</button>
                </form>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
