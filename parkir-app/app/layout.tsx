import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParkirKu — Manajemen Parkir Kantor",
  description: "Sistem manajemen parkir kantor: data rapi, terverifikasi, dapat diaudit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
