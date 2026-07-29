import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;
  const role = req.auth?.user?.role;

  // Public paths
  const publicPaths = ["/login"];
  const isPublic = publicPaths.includes(pathname) || pathname.startsWith("/api/auth");

  // Not logged in → redirect to /login (kecuali halaman public)
  if (!isAuthed && !isPublic) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in & akses /login → arahkan sesuai role
  if (isAuthed && pathname === "/login") {
    const target = role === "admin" ? "/admin/dashboard" : "/petugas/check-in";
    return NextResponse.redirect(new URL(target, req.nextUrl.origin));
  }

  // Role guard: area admin hanya untuk admin
  if (isAuthed && pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/petugas/check-in", req.nextUrl.origin));
  }

  // Role guard: area petugas untuk petugas & admin (admin bisa lihat)
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
