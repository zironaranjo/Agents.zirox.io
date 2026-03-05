export default function PanelArchitecturePage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Arquitectura</p>
        <h1 className="mt-1 text-2xl font-semibold">Mapa técnico del sistema</h1>
        <p className="mt-2 text-sm text-slate-300">
          Visión operacional de servicios y responsabilidades dentro del stack multiagente.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Workflow Engine</p>
          <h3 className="mt-2 text-lg font-semibold">Ejecución por nodos</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Interpreta definición de workflows, secuencia nodos y enruta ejecuciones a
            CLAW o n8n.
          </p>
        </article>
        <article className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Integration Layer
          </p>
          <h3 className="mt-2 text-lg font-semibold">Conectores externos</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Gestiona llamadas a APIs de herramientas y automatizaciones vía webhooks o
            endpoints seguros.
          </p>
        </article>
        <article className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Observabilidad</p>
          <h3 className="mt-2 text-lg font-semibold">Runs y logs persistentes</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Mantiene histórico de ejecuciones, estados y errores para diagnóstico y mejora
            continua.
          </p>
        </article>
      </div>
    </section>
  );
}
