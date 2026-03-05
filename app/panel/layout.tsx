"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/panel/workflows", label: "Workflows" },
  { href: "/panel/agentes", label: "Agentes" },
  { href: "/panel/arquitectura", label: "Arquitectura" },
  { href: "/panel/logs", label: "Logs" },
  { href: "/panel/settings", label: "Settings" },
] as const;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="landing-bg min-h-screen text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-[1700px]">
        <aside className="hidden w-72 border-r border-slate-800/90 bg-slate-950/45 p-5 lg:block">
          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Agents Matrix</p>
            <h1 className="mt-2 text-xl font-semibold">Panel Operativo</h1>
            <p className="mt-2 text-sm text-slate-300">
              Navega por módulos del software desde un solo workspace.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg border px-3 py-2 text-sm transition ${
                    isActive
                      ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
                      : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-slate-800 pt-4">
            <Link
              href="/"
              className="inline-flex rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800/70"
            >
              Volver al landing
            </Link>
          </div>
        </aside>

        <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
