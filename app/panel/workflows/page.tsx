import Link from "next/link";

export default function PanelWorkflowsPage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Workflows</p>
        <h1 className="mt-1 text-2xl font-semibold">Constructor visual</h1>
        <p className="mt-2 text-sm text-slate-300">
          Diseña y edita flujos de automatización para agentes, integraciones sociales y
          ejecución con n8n/CLAW.
        </p>
      </header>

      <article className="glass-panel rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Acceso al editor avanzado</h2>
        <p className="mt-2 text-sm text-slate-300">
          El editor completo vive en una vista dedicada para tener mejor espacio de
          canvas, drag and drop y panel de configuración por nodo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/workflows"
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Abrir Workflow Builder
          </Link>
        </div>
      </article>
    </section>
  );
}
