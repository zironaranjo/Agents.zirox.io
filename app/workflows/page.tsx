"use client";

import Link from "next/link";
import { useState } from "react";

type Category =
  | "all"
  | "marketing"
  | "sales"
  | "support"
  | "devops";

const categories: Array<{ id: Category; label: string }> = [
  { id: "all", label: "All Blueprints" },
  { id: "marketing", label: "Marketing Automation" },
  { id: "sales", label: "Sales Funnels" },
  { id: "support", label: "Support Operations" },
  { id: "devops", label: "DevOps Agents" },
];

const templates = [
  {
    id: "lead-nurture",
    category: "marketing",
    title: "Omni-Channel Lead Nurture",
    subtitle: "Marketing Automation",
    metricLabel: "Efficiency",
    metricValue: "+85%",
    description:
      "Cluster multi-agente para identificar, calificar y nutrir leads en Email, LinkedIn y canales de mensajería.",
  },
  {
    id: "support-scale",
    category: "support",
    title: "Customer Support Scale",
    subtitle: "Support Operations",
    metricLabel: "Response Time",
    metricValue: "12x",
    description:
      "Automatiza triage, clasificación y redacción asistida para equipos de soporte de alto volumen.",
  },
  {
    id: "sales-accelerator",
    category: "sales",
    title: "Sales Pipeline Accelerator",
    subtitle: "Sales Funnels",
    metricLabel: "Conversion",
    metricValue: "+40%",
    description:
      "Integra CRM y playbooks de outreach para detección de prospectos con alta intención y follow-up.",
  },
];

export default function WorkflowsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [view, setView] = useState<"library" | "builder">("library");

  const visibleTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((template) => template.category === activeCategory);

  return (
    <main className="landing-bg min-h-screen px-4 py-8 text-slate-100 md:px-8 xl:px-10">
      <section className="mx-auto w-full max-w-[1800px] space-y-6">
        <header className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl border-orange-500/20 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/90 text-sm font-black text-slate-950">
              *
            </span>
            <p className="text-sm font-semibold tracking-wide">AGENTS MATRIX</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("library")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "library"
                  ? "bg-orange-500 text-slate-950"
                  : "border border-slate-700 bg-slate-900/50 text-slate-200"
              }`}
            >
              Template Library
            </button>
            <button
              onClick={() => setView("builder")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "builder"
                  ? "bg-orange-500 text-slate-950"
                  : "border border-slate-700 bg-slate-900/50 text-slate-200"
              }`}
            >
              Workflow Builder
            </button>
            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Volver
            </Link>
          </div>
        </header>

        {view === "library" ? (
          <section className="glass-panel rounded-2xl border-orange-500/15 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                  Template Library
                </p>
                <h1 className="mt-1 text-4xl font-semibold">Workflow Blueprints</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Despliega clústeres AI preconfigurados por caso de uso.
                  Máxima eficiencia, mínima fricción operativa.
                </p>
              </div>
              <button className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">
                + Create from Scratch
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    activeCategory === category.id
                      ? "bg-orange-500 text-slate-950"
                      : "border border-slate-700 bg-slate-900/55 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {visibleTemplates.map((template) => (
                <article
                  key={template.id}
                  className="rounded-2xl border border-orange-500/15 bg-[linear-gradient(160deg,rgba(40,18,8,0.45),rgba(12,8,24,0.35))] p-5"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-orange-500/30 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-orange-300">
                      Premium
                    </span>
                    <p className="text-right text-xs text-orange-300">
                      <span className="text-lg font-semibold">{template.metricValue}</span>
                      <br />
                      {template.metricLabel}
                    </p>
                  </div>
                  <h3 className="text-2xl font-semibold">{template.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                    {template.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {template.description}
                  </p>
                  <button className="mt-6 rounded-lg border border-orange-500/30 px-3 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/15">
                    Deploy Template &rarr;
                  </button>
                </article>
              ))}

              <article className="flex min-h-[290px] flex-col items-center justify-center rounded-2xl border border-dashed border-orange-500/30 bg-slate-900/40 p-5 text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20 text-3xl text-orange-300">
                  +
                </div>
                <h3 className="text-xl font-semibold">Custom Cluster</h3>
                <p className="mt-2 max-w-[240px] text-sm text-slate-300">
                  Crea un workflow multiagente desde cero y define tu arquitectura de ejecución.
                </p>
              </article>
            </div>
          </section>
        ) : (
          <section className="grid gap-0 overflow-hidden rounded-2xl border border-orange-500/20 lg:grid-cols-[1fr_360px]">
            <article className="relative min-h-[720px] bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.14),rgba(2,6,23,0.95)_58%)] p-6">
              <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full border border-orange-500/30 bg-slate-950/80 px-3 py-2 text-xs">
                <span className="text-orange-300">⚡ Workflow: Lead Gen Pipeline</span>
                <span className="text-slate-400">v2.4</span>
              </div>

              <div className="absolute left-10 top-32 w-[170px] rounded-xl border border-emerald-400/50 bg-slate-900/75 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-300">Trigger</p>
                <p className="mt-2 text-sm font-semibold">Webhook: New CRM Lead</p>
              </div>

              <div className="absolute left-[280px] top-[220px] w-[260px] rounded-xl border border-orange-400/60 bg-slate-900/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-orange-300">Processor Node</p>
                <p className="mt-1 text-base font-semibold">Clasificación de Leads</p>
                <p className="text-xs text-slate-400">GPT-4o · Activo</p>
              </div>

              <div className="absolute left-[280px] top-[310px] w-[220px] rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <p className="text-xs text-slate-300">Action</p>
                <p className="text-sm font-semibold">Slack Notification</p>
              </div>

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 720" fill="none">
                <path d="M180 205 L280 205 L280 250" stroke="#22d3ee" strokeDasharray="6 6" />
                <path d="M540 250 L760 250" stroke="#fb923c" />
              </svg>

              <div className="absolute bottom-6 left-6 flex items-center gap-4">
                <div className="rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs text-slate-300">
                  100%
                </div>
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                  Live syncing
                </div>
              </div>
            </article>

            <aside className="min-h-[720px] border-l border-orange-500/20 bg-[linear-gradient(180deg,rgba(40,18,8,0.36),rgba(4,10,26,0.95))] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Configurar Nodo</h3>
                  <p className="text-xs text-orange-300">Clasificación de Leads</p>
                </div>
                <button className="text-slate-300">✕</button>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Estado del nodo</p>
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-slate-950">
                      ON
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Modelo de IA</p>
                  <select className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm">
                    <option>GPT-4o (Omni) - Recomendado</option>
                    <option>Claude Sonnet 4.5</option>
                    <option>Gemini 1.5 Flash</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Input / Output Mapping</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm" value="crm_payload" readOnly />
                    <input className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm" value="lead_score" readOnly />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Instrucciones del sistema</p>
                  <textarea
                    rows={9}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm"
                    defaultValue={
                      "Eres un experto en clasificación de leads B2B.\nAnaliza presupuesto, urgencia y fit técnico para puntuar de 0 a 100."
                    }
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-xs text-slate-300">
                  <p>[14:22:03] NODE_START: Init clasificación...</p>
                  <p>[14:22:09] API_REQ: Sent GPT-4o call...</p>
                  <p>[14:22:11] NODE_OK: Output lead_score=81</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">
                    Guardar cambios
                  </button>
                  <button className="rounded-xl border border-orange-500/30 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/15">
                    Probar
                  </button>
                </div>
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
