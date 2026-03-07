"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  Bot,
  CircleUserRound,
  House,
  MemoryStick,
  Settings,
  Wrench,
  Workflow,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: House, exact: true },
  { href: "/panel/workflows", label: "Workflows", icon: Workflow },
  { href: "/panel/agentes", label: "Agentes", icon: Bot },
  { href: "/panel/herramientas", label: "Herramientas", icon: Wrench },
  { href: "/panel/models", label: "Models", icon: MemoryStick },
  { href: "/panel/settings", label: "Settings", icon: Settings },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullBleedRoute =
    pathname === "/panel/workflows" ||
    pathname.startsWith("/panel/workflows/") ||
    pathname === "/panel/herramientas" ||
    pathname.startsWith("/panel/herramientas/") ||
    pathname === "/panel/models" ||
    pathname.startsWith("/panel/models/") ||
    pathname === "/panel/settings" ||
    pathname.startsWith("/panel/settings/");

  return (
    <main className="landing-bg min-h-screen text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Link
              href="/panel/agentes"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1.5 transition hover:bg-slate-800/80"
              aria-label="Ir al panel principal"
            >
              <Image src="/logo.svg" alt="Agentes Matrix" width={22} height={22} />
              <span className="hidden text-xs font-semibold tracking-[0.08em] text-slate-200 md:inline">
                AGENTES MATRIX
              </span>
            </Link>
            <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    isActive
                      ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
                      : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            </nav>
          </div>
          <button
            type="button"
            aria-label="Usuario activo"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200"
          >
            <CircleUserRound className="h-5 w-5" />
          </button>
        </div>
      </header>
      <section
        className={
          isFullBleedRoute
            ? "w-full"
            : "w-full px-4 pb-6 pt-0 md:px-6 lg:px-8"
        }
      >
        {children}
      </section>
    </main>
  );
}
