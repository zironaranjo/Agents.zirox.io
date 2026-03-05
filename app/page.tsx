import { AgentCanvas } from "@/components/agent-canvas";
import { HeroGeometry } from "@/components/hero-geometry";
import { agentesPrincipales, estadoColor, type Agent } from "@/lib/agents";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Image from "next/image";
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

const featuredAgents = [
  {
    id: "claw",
    nombre: "CLAW",
    imagen: "/Claw.png",
    imageClassName: "object-cover object-center",
    subtitulo: "Orquestador principal",
    capacidades: [
      "Coordina tareas entre NOVA y PULSE con delegacion trazable.",
      "Dispara ejecuciones en n8n y controla estados por run.",
      "Centraliza reglas, contexto y estrategia de workflow.",
    ],
  },
  {
    id: "nova",
    nombre: "NOVA",
    imagen: "/Nova.png",
    imageClassName: "object-contain object-top scale-125",
    subtitulo: "Marketing y crecimiento",
    capacidades: [
      "Genera contenido y campañas para canales sociales.",
      "Activa automatizaciones de publicacion via n8n.",
      "Analiza engagement, alcance y oportunidades de optimizacion.",
    ],
  },
  {
    id: "pulse",
    nombre: "PULSE",
    imagen: "/Pulse.png",
    imageClassName: "object-contain object-top",
    subtitulo: "Ventas y prospeccion",
    capacidades: [
      "Prioriza leads y organiza pipeline comercial.",
      "Ejecuta seguimientos y tareas CRM con n8n.",
      "Convierte output de agentes en acciones de cierre.",
    ],
  },
] as const;

export default async function Home() {
  const agents = await getAgentsForLanding();
  const agentsById = new Map(agents.map((agent) => [agent.id.toLowerCase(), agent]));

  return (
    <main className="landing-bg min-h-screen px-4 py-10 text-slate-100 md:px-8 xl:px-12">
      <section className="mx-auto w-full max-w-[1600px] space-y-10">
        <section
          id="claw-hero"
          className="relative left-1/2 w-screen -translate-x-1/2 space-y-3"
        >
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-end justify-between gap-2 px-4 md:px-8 xl:px-12">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-orange-300">
                Hero del sistema
              </p>
              <h2 className="text-2xl font-semibold">CLAW · núcleo orquestador</h2>
            </div>
          </div>

          <article className="relative overflow-hidden bg-slate-950">
            <div className="relative min-h-[92vh] w-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.14),transparent_48%),linear-gradient(180deg,#020617_0%,#020617_100%)]" />

              <Image
                src="/Claw.png"
                alt="CLAW entorno de fondo"
                fill
                className="object-cover object-top opacity-10 blur-[3px] saturate-60"
                sizes="100vw"
                priority
              />

              <div className="absolute inset-y-0 right-0 hidden w-[68vw] md:block">
                <Image
                  src="/Claw1.png"
                  alt="CLAW primer plano"
                  fill
                  className="object-contain object-bottom drop-shadow-[0_20px_48px_rgba(0,0,0,0.62)]"
                  sizes="68vw"
                  priority
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/58 to-slate-950/24" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/94 via-transparent to-slate-950/10" />

              <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-5 p-6 md:p-10 lg:ml-14 xl:ml-24">
                <p className="inline-flex w-fit rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-orange-300">
                  CLAW online
                </p>
                <h3 className="text-4xl font-semibold leading-[1.02] md:text-6xl">
                  No despliegas prompts.
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    Despliegas agentes que ejecutan.
                  </span>
                </h3>
                <p className="max-w-xl text-base leading-7 text-slate-200 md:text-lg">
                  CLAW coordina decisiones, delega tareas en NOVA y PULSE, y conecta
                  automatizaciones con n8n para transformar estrategia en resultados.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/panel/agentes"
                    className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
                  >
                    Entrar al dashboard
                  </Link>
                  <Link
                    href="/workflows"
                    className="rounded-xl border border-slate-600 bg-slate-900/55 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-800/80"
                  >
                    Ver workflows
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </section>

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

        <section id="agentes" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">
                Agentes principales
              </p>
              <h2 className="text-2xl font-semibold">CLAW · NOVA · PULSE</h2>
            </div>
            <p className="text-sm text-slate-300">
              Núcleo operativo del sistema multiagente con enfoque en orquestacion,
              marketing y ventas.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredAgents.map((item) => {
              const runtimeAgent = agentsById.get(item.id);
              const status = runtimeAgent?.estado ?? "idle";
              const role = runtimeAgent?.rol ?? item.subtitulo;
              const tools = runtimeAgent?.herramientas ?? [];
              const workers = runtimeAgent?.subagentes ?? [];

              return (
                <article
                  key={item.id}
                  className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800"
                >
                  <div className="relative h-[460px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950" />
                    <Image
                      src={item.imagen}
                      alt={`Agente ${item.nombre}`}
                      fill
                      className={item.imageClassName}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-2xl font-semibold">{item.nombre}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${estadoColor[status]}`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-200">{role}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Capacidades
                      </p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-200">
                        {item.capacidades.map((cap) => (
                          <li key={cap}>- {cap}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Herramientas activas
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-1 text-xs text-slate-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-300">
                      Workers vinculados:{" "}
                      {workers.length > 0 ? workers.join(", ") : "Sin asignar"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
