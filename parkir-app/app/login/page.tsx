import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Login — ParkirKu" };

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "admin" ? "/admin/dashboard" : "/petugas/check-in");
  }

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
          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              await signIn("credentials", { email, password, redirectTo: "/" });
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
