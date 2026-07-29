import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PetugasLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const nav = [
    { href: "/petugas/check-in", label: "Check-in" },
    { href: "/petugas/check-out", label: "Check-out" },
    { href: "/petugas/active", label: "Aktif" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-md flex h-14 items-center justify-between px-4">
          <span className="font-semibold text-slate-900">ParkirKu</span>
          <nav className="flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="text-xs text-slate-400 hover:text-slate-900">Keluar</button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 p-4">{children}</main>
    </div>
  );
}
