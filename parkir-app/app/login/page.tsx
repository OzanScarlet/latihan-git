import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Login — ParkirKu" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "admin" ? "/admin/dashboard" : "/petugas/check-in");
  }

  const sp = await searchParams;
  const showErr = sp.error === "credentials";

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">ParkirKu</CardTitle>
          <p className="text-center text-sm text-slate-500 mt-1">
            Manajemen Parkir Kantor
          </p>
        </CardHeader>
        <CardContent>
          {/* Alert error */}
          {showErr && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              Username atau password salah.
            </div>
          )}

          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              try {
                await signIn("credentials", { email, password, redirectTo: "/" });
              } catch (error) {
                // Gagal kredensial → balik ke login dengan flag error.
                if (error instanceof AuthError) {
                  redirect("/login?error=credentials");
                }
                // NEXT_REDIRECT (sukses) dilempar ulang biar tetap jalan.
                throw error;
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="nama@kantor.id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
            >
              Masuk
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">
            Demo admin: admin@parkir.id / admin123 · petugas: joko@parkir.id / petugas123
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
