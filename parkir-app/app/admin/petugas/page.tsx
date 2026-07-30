import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { createPetugas, togglePetugas, resetPassword } from "@/lib/actions/petugas";

export const dynamic = "force-dynamic";

export default async function PetugasPage() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Manajemen Petugas & Admin</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPetugas} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
              <input name="name" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input name="email" type="email" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input name="password" type="password" required minLength={6} className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select name="role" className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-900 focus:outline-none">
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">Simpan</button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-slate-900">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={u.role === "admin" ? "blue" : "gray"}>{u.role}</Badge>
                  <Badge tone={u.active ? "green" : "red"}>{u.active ? "aktif" : "nonaktif"}</Badge>
                  <form action={togglePetugas}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="text-xs text-slate-600 hover:underline" type="submit">
                      {u.active ? "nonaktifkan" : "aktifkan"}
                    </button>
                  </form>

                  <details className="relative inline-block">
                    <summary className="cursor-pointer text-xs text-blue-600 hover:underline select-none">
                      reset
                    </summary>
                    <form
                      action={async (formData) => {
                        "use server";
                        await resetPassword(formData);
                      }}
                      className="absolute right-0 top-6 z-10 flex gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
                    >
                      <input type="hidden" name="id" value={u.id} />
                      <input
                        name="newPassword"
                        type="password"
                        required
                        minLength={6}
                        placeholder="Password baru"
                        className="h-8 w-36 rounded-md border border-slate-300 px-2 text-xs focus:border-slate-900 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="h-8 rounded-md bg-slate-900 px-2 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        Simpan
                      </button>
                    </form>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
