import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Download,
  ListOrdered,
  Plus,
  Search,
  Share2,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { BoardroomPublicationComposer } from "@/components/boardroom-publication-composer";
import {
  DEPARTMENT_TITLE_BY_SLUG,
  boardroomTaskAvatarClass,
  getBoardroomContext,
  isDepartmentSlug,
} from "@/lib/departments";

export default async function PanelBoardroomPage({
  searchParams,
}: {
  searchParams?: Promise<{ dept?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const deptSlug = typeof sp.dept === "string" ? sp.dept : undefined;
  const deptKey = deptSlug && isDepartmentSlug(deptSlug) ? deptSlug : undefined;
  const deptTitle = deptKey ? DEPARTMENT_TITLE_BY_SLUG[deptKey] : null;
  const ctx = getBoardroomContext(deptKey);

  return (
    <section className="flex h-[calc(100vh-4rem)] min-h-0 w-full flex-col overflow-hidden bg-[#0f1723] text-slate-100">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#0f1723] px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-[#0062ff]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0062ff] text-white">
              <WandSparkles className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Nexus AI</h2>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <span className="border-b-2 border-[#0062ff] pb-1 text-sm font-semibold text-[#4f9dff]">
              Sala / Boardroom
            </span>
            <span className="cursor-not-allowed text-sm font-medium text-slate-600">Proyectos</span>
            <span className="cursor-not-allowed text-sm font-medium text-slate-600">Recursos</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-64 rounded-lg border-none bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-[#0062ff]"
              placeholder="Buscar en la sesión..."
            />
          </div>
          <button type="button" className="rounded-lg bg-slate-800 p-2 text-slate-400">
            <Bell className="h-5 w-5" />
          </button>
          <div className="mx-1 h-8 w-px bg-slate-800" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold">Admin Ops</p>
              <p className="text-[10px] text-slate-500">Tier: Enterprise</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0062ff]/30 bg-[#0062ff]/20">
              <span className="text-sm font-semibold text-[#4f9dff]">A</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="flex w-full flex-shrink-0 flex-col border-r border-slate-800 bg-[#0f1723]/60 md:w-80">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Agentes en esta sala
              </h3>
              <div className="space-y-4">
                {ctx.agents.map((agent) => (
                  <article
                    key={agent.name}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                      agent.active
                        ? "border border-[#0062ff]/15 bg-[#0062ff]/5"
                        : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-700">
                        <Image
                          src={agent.image}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0f1723] ${agent.dotColor}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold">{agent.name}</p>
                        <span className={`shrink-0 text-[10px] font-semibold ${agent.statusColor}`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-slate-400">{agent.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Recursos del departamento
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">{ctx.resourcePrimaryLabel}</span>
                    <span className="font-mono text-[#4f9dff]">{ctx.resourcePrimaryPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-[#0062ff]"
                      style={{ width: `${ctx.resourcePrimaryPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">{ctx.resourceSecondaryLabel}</span>
                    <span className="font-mono text-orange-500">{ctx.resourceSecondaryPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${ctx.resourceSecondaryPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {ctx.integrationChips.map((label) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400"
                  >
                    <Share2 className="h-3 w-3 opacity-70" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-slate-800 bg-slate-900/50 p-6">
            <button
              type="button"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0062ff] py-3 font-bold text-white shadow-lg shadow-[#0062ff]/20 transition-all hover:bg-[#0057e6]"
            >
              <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
              {ctx.primaryCtaLabel}
            </button>
          </div>
        </aside>

        <section className="min-h-0 flex-1 overflow-y-auto bg-[#0f1723]/20 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="border-b border-slate-800 bg-[#0f1723] p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Link
                href="/panel/departamentos"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-[#4f9dff]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver a departamentos
              </Link>
              {deptTitle ? (
                <span className="rounded-full bg-[#0062ff]/15 px-2 py-0.5 text-[10px] font-semibold text-[#4f9dff]">
                  Contexto: {deptTitle}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="max-w-3xl">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#4f9dff]">
                    Sesión activa
                  </span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0062ff]" />
                </div>
                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  {deptTitle ? `Departamento: ${deptTitle}` : "Sala general"}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{ctx.sessionSubtitle}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 md:gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                >
                  Guardar sala
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir sesión
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-800/80 pt-6">
              <span className="text-sm font-bold text-[#4f9dff]">Actividad</span>
              <span className="text-sm font-bold text-slate-500">Calendario de entregas</span>
              <span className="text-sm font-bold text-slate-500">Historial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              {ctx.showPublicationComposer ? (
                <BoardroomPublicationComposer
                  departmentSlug={deptKey ?? null}
                  composerTitle={ctx.composerTitle}
                  composerPlaceholder={ctx.composerPlaceholder}
                />
              ) : null}

              <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-sm md:min-h-[520px]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <ListOrdered className="h-3.5 w-3.5" />
                      {ctx.activityPanelTitle}
                    </span>
                    <div className="hidden h-4 w-px bg-slate-700 sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase text-slate-500">
                        Detalle técnico
                      </span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="relative h-4 w-7 rounded-full bg-slate-700 after:absolute after:start-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-[#0062ff] peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                      <input
                        className="w-28 rounded-md border-none bg-slate-800 py-1 pl-7 pr-2 text-[10px] outline-none focus:ring-1 focus:ring-[#0062ff] md:w-32"
                        placeholder="Filtrar..."
                      />
                    </div>
                    <button
                      type="button"
                      className="text-slate-500 transition-colors hover:text-[#4f9dff]"
                      aria-label="Descargar registro"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto p-4 font-mono text-[12px] [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
                  {ctx.logs.map((log, idx) => (
                    <div
                      key={`${log.time}-${idx}`}
                      className={`flex gap-3 border-b border-slate-800/50 py-1.5 ${
                        log.level === "DEBUG" ? "opacity-50" : ""
                      }`}
                    >
                      <span className="w-[52px] shrink-0 text-slate-500">[{log.time}]</span>
                      <span className={`w-11 shrink-0 font-bold ${log.levelClass}`}>{log.level}</span>
                      <div className="min-w-0 flex-1">
                        <span className={`mr-1 font-bold ${log.agentClass}`}>{log.agent}:</span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 p-3 text-[10px] text-slate-500">
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <span>{ctx.activityFooterLeft}</span>
                    <span>{ctx.activityFooterMid}</span>
                    <span>{ctx.activityFooterRight}</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 transition-colors hover:text-[#4f9dff]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Limpiar vista
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Tareas del equipo
                  </h3>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#4f9dff] transition-colors hover:bg-[#0062ff]/10"
                    aria-label="Añadir tarea"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
                  {ctx.tasks.map((task, taskIdx) => (
                    <article
                      key={`${task.title}-${taskIdx}`}
                      className={`rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-[#0062ff]/40 ${
                        task.done ? "opacity-60" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${task.tagClass}`}>
                          {task.tag}
                        </span>
                        {task.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <span className="text-slate-600">···</span>
                        )}
                      </div>
                      <h4
                        className={`mb-3 text-sm font-semibold leading-snug ${
                          task.done ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex -space-x-2">
                          {task.avatars.map((k, avIdx) => (
                            <div
                              key={`${taskIdx}-${k}-${avIdx}`}
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-800 text-[10px] text-white ${boardroomTaskAvatarClass(k)}`}
                            >
                              {k}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{task.footer}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4 text-center">
                <p className="text-xs text-slate-400">
                  ¿Necesitas automatizar publicación? Usa{" "}
                  <Link href="/workflows" className="font-semibold text-[#4f9dff] hover:underline">
                    automatizaciones (avanzado)
                  </Link>{" "}
                  o integra n8n desde Herramientas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
}
