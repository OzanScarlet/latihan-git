import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { checkOut } from "@/lib/actions/session";
import { formatPlate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckOutPage() {
  const sessions = await prisma.session.findMany({
    where: { status: "active" },
    include: { vehicle: true, slot: true },
    orderBy: { timeIn: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Check-out Kendaraan</h1>

      {sessions.length === 0 ? (
        <Card>
          <CardContent>
            <p className="py-8 text-center text-sm text-slate-500">
              Tidak ada kendaraan aktif.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {formatPlate(s.vehicle.plate)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Masuk {formatTime(s.timeIn)}
                    {s.slot && ` · ${s.slot.code}`}
                  </div>
                </div>
                <form action={checkOut}>
                  <input type="hidden" name="sessionId" value={s.id} />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-500"
                  >
                    Check-out
                  </button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
