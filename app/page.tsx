import { AgentCanvas } from "@/components/agent-canvas";
import { HeroGeometry } from "@/components/hero-geometry";
import { agentesPrincipales, estadoColor, type Agent } from "@/lib/agents";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

async function getAgentsForLanding() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("agents")
      .select(
        "id,nombre,rol,estado,herramientas,subagentes,provider,model,system_prompt,temperature",
      )
      .order("created_at", { ascending: true });

    if (error || !data) {
      return agentesPrincipales;
    }

    const mapped = data.map((row) => ({
      id: row.id as string,
      nombre: row.nombre as string,
      rol: row.rol as string,
      estado: row.estado as Agent["estado"],
      herramientas: (row.herramientas as string[] | null) ?? [],
      subagentes: (row.subagentes as string[] | null) ?? [],
      provider: (row.provider as Agent["provider"]) ?? "openrouter",
      model: (row.model as string) ?? "openai/gpt-4o-mini",
      systemPrompt:
        (row.system_prompt as string) ??
        "Eres un agente especializado. Responde de forma clara y accionable.",
      temperature: (row.temperature as number) ?? 0.6,
    }));

    return mapped.length > 0 ? mapped : agentesPrincipales;
  } catch {
    return agentesPrincipales;
  }
}

export default async function Home() {
  const agents = await getAgentsForLanding();

  return (
    <main className="landing-bg min-h-screen px-4 py-10 text-slate-100 md:px-8 xl:px-12">
      <section className="mx-auto w-full max-w-[1600px] space-y-10">
        <nav className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl border-orange-500/20 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/90 text-sm font-black text-slate-950">
              *
            </span>
            <p className="text-sm font-semibold tracking-wide">AGENTS MATRIX</p>
          </div>
          <div className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            <Link className="transition hover:text-white" href="/workflows">
              Workflows
            </Link>
            <a className="transition hover:text-white" href="#agentes">
              Agentes
            </a>
            <a className="transition hover:text-white" href="#arquitectura">
              Arquitectura
            </a>
            <a className="transition hover:text-white" href="#logs">
              Logs
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/panel"
              className="rounded-lg border border-orange-500/40 bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/25"
            >
              Acceso sistema
            </Link>
          </div>
        </nav>

        <header className="grid gap-8 border-t border-orange-500/15 pt-8 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-7">
            <p className="inline-flex rounded-full border border-orange-500/35 bg-orange-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-orange-300">
              V 4.0 Protocolo activo
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] md:text-6xl">
              Orquestación de{" "}
              <span className="bg-gradient-to-r from-orange-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Sistemas Multi-Agente
              </span>{" "}
              de Próxima Generación
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Diseña, monitorea y escala jerarquías de IA complejas con CLAW,
              NOVA y PULSE. Productividad y autonomía sin límites para equipos
              de ingeniería de datos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/workflows"
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
              >
                Crear workflow
              </Link>
              <a
                href="#arquitectura"
                className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-3 text-sm text-slate-200 transition hover:bg-slate-800/70"
              >
                Ver documentación
              </a>
            </div>

            <div className="grid max-w-2xl gap-3 border-t border-slate-700/60 pt-5 sm:grid-cols-3">
              <article>
                <p className="text-3xl font-semibold">99.9%</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Uptime sincrónico</p>
              </article>
              <article>
                <p className="text-3xl font-semibold">4ms</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Latencia nodo</p>
              </article>
              <article>
                <p className="text-3xl font-semibold">10k+</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Agentes activos</p>
              </article>
            </div>
          </div>

          <div className="xl:col-span-5">
            <HeroGeometry />
          </div>
        </header>

        <section id="workflows" className="space-y-3">
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
          <AgentCanvas agents={agents} />
        </section>

        <section id="arquitectura" className="grid gap-4 md:grid-cols-3">
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

        <section id="agentes" className="grid gap-4 lg:grid-cols-3">
          {agents.map((agente) => (
            <article key={agente.id} className="glass-panel space-y-4 rounded-2xl border border-slate-800 p-5">
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
