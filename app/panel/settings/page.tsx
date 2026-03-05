export default function PanelSettingsPage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Settings</p>
        <h1 className="mt-1 text-2xl font-semibold">Configuración del software</h1>
        <p className="mt-2 text-sm text-slate-300">
          Espacio para variables operativas, conexiones y parámetros globales del panel.
        </p>
      </header>

      <article className="glass-panel rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Módulo en preparación</h2>
        <p className="mt-2 text-sm text-slate-300">
          Próximamente podrás administrar credenciales OAuth, llaves de integración y
          límites de ejecución desde esta sección.
        </p>
      </article>
    </section>
  );
}
