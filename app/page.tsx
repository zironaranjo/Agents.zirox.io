import { AgentCanvas } from "@/components/agent-canvas";
import { agentesPrincipales, estadoColor } from "@/lib/agents";
import Link from "next/link";

export default function Home() {
  const totalSubagentes = agentesPrincipales.reduce(
    (acumulado, agente) => acumulado + agente.subagentes.length,
    0,
  );

  return (
    <main className="landing-bg min-h-screen px-4 py-10 text-slate-100 md:px-8 xl:px-12">
      <section className="mx-auto w-full max-w-[1600px] space-y-10">
        <nav className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Agentes Matrix
            </p>
            <p className="text-sm text-slate-300">
              OpenClaw + n8n + Supabase
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/80">
              Ver Demo
            </button>
            <Link
              href="/panel"
              className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
            >
              Entrar al Panel
            </Link>
          </div>
        </nav>

        <header className="grid gap-6 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Workflows Inteligentes
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Interfaz visual para coordinar tu sistema multiagente jerarquico
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Diseña, monitorea y escala agentes como CLAW, NOVA y PULSE desde
              una sola vista. Mapea tareas, delegacion y ejecucion con una
              experiencia de producto estilo landing premium.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/panel/workflows/nuevo"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Crear workflow
              </Link>
              <button className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-3 text-sm text-slate-200 transition hover:bg-slate-800/70">
                Explorar arquitectura
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-2">
            <article className="glass-panel rounded-2xl p-4">
              <p className="text-sm text-slate-400">Agentes principales</p>
              <p className="mt-2 text-3xl font-semibold">{agentesPrincipales.length}</p>
            </article>
            <article className="glass-panel rounded-2xl p-4">
              <p className="text-sm text-slate-400">Subagentes</p>
              <p className="mt-2 text-3xl font-semibold">{totalSubagentes}</p>
            </article>
            <article className="glass-panel rounded-2xl p-4 sm:col-span-2">
              <p className="text-sm text-slate-400">Integraciones</p>
              <p className="mt-2 text-lg font-semibold">OpenClaw + n8n + Supabase</p>
            </article>
          </div>
        </header>

        <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">
                Workflows
              </p>
              <h2 className="text-2xl font-semibold">Mapa jerarquico en vivo</h2>
            </div>
            <p className="text-sm text-slate-300">
              Flujo visual de delegacion entre agentes y subagentes.
            </p>
          </div>
          <AgentCanvas agents={agentesPrincipales} />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="glass-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Diseñador de agentes
            </p>
            <h3 className="mt-2 text-lg font-semibold">Configurable por rol</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Define instrucciones, herramientas y limites de autonomia por
              cada agente o subagente.
            </p>
          </article>
          <article className="glass-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Orquestacion
            </p>
            <h3 className="mt-2 text-lg font-semibold">Delegacion inteligente</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              CLAW distribuye tareas a NOVA y PULSE, quienes a su vez gestionan
              sus workers especializados.
            </p>
          </article>
          <article className="glass-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Observabilidad
            </p>
            <h3 className="mt-2 text-lg font-semibold">Logs y estado en tiempo real</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Monitorea ejecuciones, errores y resultados con visibilidad total
              del flujo completo.
            </p>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {agentesPrincipales.map((agente) => (
            <article
              key={agente.id}
              className="glass-panel space-y-4 rounded-2xl border border-slate-800 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{agente.nombre}</h3>
                  <p className="text-sm text-slate-300">{agente.rol}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${estadoColor[agente.estado]}`}
                >
                  {agente.estado}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {agente.herramientas.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-1 text-xs text-slate-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <p className="text-sm text-slate-300">
                Subagentes: {agente.subagentes.join(", ")}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
