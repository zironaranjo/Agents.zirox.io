export default function PanelWorkflowsPage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Workflows</p>
        <h1 className="mt-1 text-2xl font-semibold">Flujos de automatización</h1>
        <p className="mt-2 text-sm text-slate-300">
          Diseña flujos, orquesta tareas y conecta agentes con herramientas externas.
        </p>
      </header>

      <article className="glass-panel rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Módulo en evolución</h2>
        <p className="mt-2 text-sm text-slate-300">
          Próximamente este espacio tendrá el builder completo integrado dentro del panel.
        </p>
      </article>
    </section>
  );
}
