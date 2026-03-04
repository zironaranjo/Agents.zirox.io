import Link from "next/link";
import { PanelWorkspace } from "@/components/panel-workspace";
import { TaskOrchestrator } from "@/components/task-orchestrator";

export default function PanelPage() {
  return (
    <main className="landing-bg min-h-screen px-6 py-8 text-slate-100 md:px-10">
      <section className="mx-auto w-full max-w-[1700px] space-y-6">
        <header className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Panel</p>
            <h1 className="text-2xl font-semibold">Gestor de Agentes</h1>
            <p className="text-sm text-slate-300">
              Configura agentes, roles, estado, herramientas y subagentes.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/70"
          >
            Volver al landing
          </Link>
        </header>

        <PanelWorkspace />
        <TaskOrchestrator />
      </section>
    </main>
  );
}
