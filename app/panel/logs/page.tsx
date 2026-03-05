import { TaskOrchestrator } from "@/components/task-orchestrator";

export default function PanelLogsPage() {
  return (
    <section className="space-y-5">
      <header className="glass-panel rounded-2xl px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Logs</p>
        <h1 className="mt-1 text-2xl font-semibold">Orquestación y ejecuciones</h1>
        <p className="mt-2 text-sm text-slate-300">
          Crea tareas, delega en CLAW/n8n y monitorea estado de runs en tiempo real.
        </p>
      </header>

      <TaskOrchestrator />
    </section>
  );
}
