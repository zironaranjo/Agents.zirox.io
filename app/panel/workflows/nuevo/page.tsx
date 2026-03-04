import Link from "next/link";

export default function NuevoWorkflowPage() {
  return (
    <main className="landing-bg min-h-screen px-6 py-8 text-slate-100 md:px-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="glass-panel rounded-2xl px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            Workflows
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Crear nuevo workflow</h1>
          <p className="mt-2 text-sm text-slate-300">
            Aquí armaremos el constructor visual para definir nodos, transiciones
            y reglas de ejecución entre agentes y subagentes.
          </p>
        </header>

        <section className="glass-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold">MVP siguiente (pendiente)</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>- Crear nodo de inicio.</li>
            <li>- Agregar nodos de agente y subagente.</li>
            <li>- Conectar condiciones de transición.</li>
            <li>- Guardar workflow en Supabase.</li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/panel"
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/70"
            >
              Volver al panel
            </Link>
            <Link
              href="/"
              className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Volver al landing
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
