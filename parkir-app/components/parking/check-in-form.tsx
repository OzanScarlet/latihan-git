"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkIn } from "@/lib/actions/session";

type SlotT = {
  id: string;
  code: string;
  type: "motor" | "mobil";
  zone: { name: string };
};

export function CheckInForm({ slots }: { slots: SlotT[] }) {
  const [type, setType] = useState<"mobil" | "motor">("mobil");
  const filtered = slots.filter((s) => s.type === type);

  return (
    <Card>
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
           
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as "mobil" | "motor")}
              className="flex h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="mobil">Mobil</option>
              <option value="motor">Motor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slot tersedia 
            </label>
            <select
              name="slotId"
              defaultValue=""
              className="flex h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="">— Tanpa slot —</option>
              {filtered.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.zone.name} / {s.code}
                </option>
              ))}
            </select>
            {filtered.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">Tidak ada slot tersedia untuk tipe {type}.</p>
            )}
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
  );
}
