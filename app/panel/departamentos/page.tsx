import Link from "next/link";
import {
  BarChart3,
  Bell,
  Building2,
  CircleHelp,
  GitBranch,
  LayoutGrid,
  Lock,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { DEPARTMENTS, type DepartmentCard, type DepartmentStatus } from "@/lib/departments";

function statusBadge(status: DepartmentStatus) {
  if (status === "active") {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
        Activo
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="animate-pulse rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
        Procesando
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
      En espera
    </span>
  );
}

function MetricBlock({ dept }: { dept: DepartmentCard }) {
  switch (dept.metricVisual) {
    case "bars":
      return (
        <div className="mt-3 flex h-8 items-end gap-1">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-[#0062ff]/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
    case "progress-build":
      return (
        <div className="mt-3 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[62%] rounded-full bg-amber-500" />
          </div>
          <p className="text-[10px] text-slate-500">Estado build V2.4.0 — desplegando</p>
        </div>
      );
    case "progress-sync":
      return (
        <div className="mt-3 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/90">
            Sync conocimiento 100%
          </p>
        </div>
      );
    case "text":
      return (
        <p className="mt-3 text-[11px] leading-snug text-slate-400">
          Ciclo de optimización de rutas y mensajes completado.
        </p>
      );
    case "sentiment":
      return (
        <div className="mt-3 space-y-1">
          <div className="flex h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="w-[72%] bg-emerald-500" />
            <div className="w-[22%] bg-amber-500" />
            <div className="w-[6%] bg-rose-500" />
          </div>
          <p className="text-[10px] text-emerald-400/90">Mayormente positivo</p>
        </div>
      );
    case "text-audit":
      return (
        <p className="mt-3 text-[11px] leading-snug text-slate-400">
          Revisión GDPR y claims: sin bloqueos. Listo para publicar.
        </p>
      );
    default:
      return null;
  }
}

const feedItems = [
  {
    agent: "Agente DevOps",
    action: "Inicializó pipeline CI/CD para el cluster Producto & Desarrollo.",
    time: "Hace 2 min",
    accent: "text-blue-400",
  },
  {
    agent: "Agente Legal",
    action: "Completó revisión documental en protocolos de cumplimiento.",
    time: "Hace 14 min",
    accent: "text-violet-400",
  },
  {
    agent: "Agente Inteligencia",
    action: "Envió análisis de tendencias al departamento Marketing y crecimiento.",
    time: "Hace 28 min",
    accent: "text-cyan-400",
  },
  {
    agent: "Agente Soporte",
    action: "Escaló ticket prioritario a Operaciones y logística.",
    time: "Hace 41 min",
    accent: "text-orange-400",
  },
] as const;

export default function PanelDepartamentosPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 w-full overflow-hidden bg-[#0a0f18] text-slate-100">
      {/* Sidebar interna */}
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-slate-800/90 bg-[#0f1723] lg:flex">
        <div className="border-b border-slate-800/90 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0062ff]">
            Agentes Matrix
          </p>
          <p className="text-[10px] text-slate-500">Orquestación IA</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          <Link
            href="/panel/departamentos"
            className="flex items-center gap-2 rounded-lg bg-[#0062ff]/15 px-3 py-2 text-sm font-medium text-[#4f9dff]"
          >
            <Building2 className="h-4 w-4" />
            Departamentos
          </Link>
          <Link
            href="/panel/agentes"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800/80 hover:text-slate-200"
          >
            <Users className="h-4 w-4" />
            Agentes
          </Link>
          <Link
            href="/panel/boardroom"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800/80 hover:text-slate-200"
          >
            <BarChart3 className="h-4 w-4" />
            Sala / Boardroom
          </Link>
          <Link
            href="/panel/logs"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800/80 hover:text-slate-200"
          >
            <LayoutGrid className="h-4 w-4" />
            Logs
          </Link>
        </nav>
        <div className="p-3">
          <Link
            href="/panel/agentes"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0062ff] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0062ff]/20 transition hover:bg-[#0057e6]"
          >
            <Rocket className="h-4 w-4" />
            Añadir agente
          </Link>
        </div>
        <div className="mt-auto border-t border-slate-800/90 p-3">
          <Link
            href="/panel/settings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-slate-300"
          >
            <Lock className="h-3.5 w-3.5" />
            Seguridad
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800/90 bg-[#0f1723]/95 px-4 py-3 backdrop-blur-md md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-400 sm:inline">Nexus AI</span>
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Buscar departamentos, agentes o activos..."
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-[#0062ff]/50 focus:outline-none focus:ring-1 focus:ring-[#0062ff]/40"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4" />
            </button>
            <Link
              href="/panel/settings"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Ajustes"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 sm:block"
              aria-label="Ayuda"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#0062ff]/30 bg-[#0062ff]/15 text-xs font-bold text-[#4f9dff]">
              AM
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700">
          <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-6 lg:flex lg:gap-6 lg:px-8">
            <div className="min-w-0 flex-1 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0062ff]">
                    Cluster empresarial
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Departamentos</h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-400">
                    Tus agentes trabajan por equipos con el mismo contexto de proyecto: crear contenido,
                    publicar y responder de forma coordinada.
                  </p>
                </div>
                <Link
                  href="/panel/boardroom"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0062ff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0062ff]/25 transition hover:bg-[#0057e6]"
                >
                  <Sparkles className="h-4 w-4" />
                  Abrir sala conjunta
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {DEPARTMENTS.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <article
                      key={dept.slug}
                      className="group flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/40 p-5 shadow-sm transition hover:border-[#0062ff]/35"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0062ff]/15 text-[#4f9dff]">
                          <Icon className="h-5 w-5" />
                        </div>
                        {statusBadge(dept.status)}
                      </div>
                      <h2 className="text-base font-bold group-hover:text-[#4f9dff]">{dept.title}</h2>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{dept.shortDescription}</p>
                      <p className="mt-3 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-300">{dept.agentsActive}</span> agentes
                        asignables
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        {dept.metricLabel}
                      </p>
                      <MetricBlock dept={dept} />
                      <Link
                        href={`/panel/boardroom?dept=${dept.slug}`}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-[#0062ff]/50 hover:bg-slate-800"
                      >
                        Entrar al departamento
                      </Link>
                    </article>
                  );
                })}
              </div>

              {/* Rendimiento agregado */}
              <section className="rounded-2xl border border-slate-800/90 bg-slate-900/30 p-5 md:p-6">
                <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-sm font-bold">Rendimiento por cluster</h3>
                    <p className="text-xs text-slate-500">
                      Asignación de recursos y volumen en las últimas 24 horas (vista resumen).
                    </p>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Periodo: 24 h
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Uso de tokens
                    </p>
                    <div className="mt-2 flex h-16 items-end gap-1">
                      {[35, 55, 40, 70, 50, 85, 45, 60, 75, 55, 90, 65].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-[#0062ff]/70"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Tareas completadas
                    </p>
                    <div className="relative mt-2 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#0062ff]/40">
                      <span className="text-2xl font-black text-emerald-400">94.8%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Latencia respuesta
                    </p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-[10px] text-slate-400">Cluster DevOps</p>
                        <div className="mt-1 flex h-6 items-end gap-px">
                          {[3, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10].map((v, i) => (
                            <div key={i} className="flex-1 bg-cyan-500/60" style={{ height: `${v * 8}%` }} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Nodo inteligencia</p>
                        <div className="mt-1 flex h-6 items-end gap-px">
                          {[4, 4, 5, 5, 6, 6, 5, 7, 8, 7, 8, 9].map((v, i) => (
                            <div key={i} className="flex-1 bg-violet-500/60" style={{ height: `${v * 8}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Feed lateral */}
            <aside className="mt-6 w-full shrink-0 space-y-4 lg:mt-0 lg:w-80">
              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/40 p-5">
                <div className="mb-1 flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-[#0062ff]" />
                  <h3 className="text-sm font-bold">Protocolos entre equipos</h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Actividad reciente cuando un agente entrega contexto a otro departamento.
                </p>
                <ul className="mt-4 space-y-4">
                  {feedItems.map((item) => (
                    <li key={item.agent + item.time} className="border-b border-slate-800/80 pb-4 last:border-0 last:pb-0">
                      <p className={`text-xs font-bold ${item.accent}`}>{item.agent}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.action}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{item.time}</p>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/panel/boardroom"
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-700 py-2 text-xs font-semibold text-[#4f9dff] transition hover:bg-[#0062ff]/10"
                >
                  Ver todos los protocolos
                </Link>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/20 p-4 text-center">
                <Shield className="mx-auto h-6 w-6 text-slate-500" />
                <p className="mt-2 text-xs text-slate-400">
                  El contexto del <strong className="text-slate-200">proyecto activo</strong> se comparte en la
                  sala al entrar a un departamento.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
