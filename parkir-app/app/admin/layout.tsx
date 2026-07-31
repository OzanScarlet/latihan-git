import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="font-semibold text-slate-900">
            ParkirKu <span className="text-xs font-normal text-slate-400">Admin</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/admin/dashboard"
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/petugas/check-in"
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Check-in
            </Link>
            <Link
              href="/admin/zones"
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Zona & Slot
            </Link>
            <Link
              href="/admin/petugas"
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Petugas
            </Link>
            <Link
              href="/admin/reports"
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Laporan
            </Link>
          </nav>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
              Keluar
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-4">{children}</main>
    </div>
  );
}
