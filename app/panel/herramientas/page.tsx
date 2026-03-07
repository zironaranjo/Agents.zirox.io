export default function PanelToolsPage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Herramientas</p>
        <h1 className="mt-1 text-2xl font-semibold">Integraciones y conectores</h1>
        <p className="mt-2 text-sm text-slate-300">
          Administra herramientas externas y su disponibilidad para los agentes.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Automation</p>
          <h2 className="mt-2 text-lg font-semibold">n8n</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Configura webhooks, credenciales y flujos operativos para campañas y ventas.
          </p>
        </article>

        <article className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Orquestador</p>
          <h2 className="mt-2 text-lg font-semibold">CLAW API</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Controla endpoints de delegación, tokens y estados de ejecución centralizados.
          </p>
        </article>

        <article className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Model Providers</p>
          <h2 className="mt-2 text-lg font-semibold">LLMs / OpenRouter</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Define modelos disponibles por agente y reglas de uso para cada entorno.
          </p>
        </article>
      </div>
    </section>
  );
}
