import { PanelWorkspace } from "@/components/panel-workspace";

export default function PanelAgentsPage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Agentes</p>
        <h1 className="mt-1 text-2xl font-semibold">Gestor de agentes</h1>
        <p className="mt-2 text-sm text-slate-300">
          Configura roles, estado, herramientas, subagentes y parámetros LLM.
        </p>
      </header>

      <PanelWorkspace />
    </section>
  );
}
