"use client";

import { useMemo, useState } from "react";

type ExecutorType = "claw" | "n8n";
type PriorityType = "baja" | "media" | "alta";

type TaskRow = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: PriorityType;
};

type RunRow = {
  id: string;
  task_id: string;
  executor: ExecutorType | "agent";
  estado: string;
  input?: unknown;
  output?: unknown;
  error_message?: string | null;
};

const fieldClass =
  "w-full rounded-lg border border-slate-700/90 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20";

export function TaskOrchestrator() {
  const [titulo, setTitulo] = useState("Nueva tarea de orquestación");
  const [descripcion, setDescripcion] = useState(
    "Define la estrategia y delega ejecución entre marketing y ventas.",
  );
  const [prioridad, setPrioridad] = useState<PriorityType>("media");
  const [executor, setExecutor] = useState<ExecutorType>("claw");
  const [instructions, setInstructions] = useState(
    "Analiza la tarea y delega en NOVA y PULSE con pasos concretos.",
  );
  const [agentId, setAgentId] = useState("claw");
  const [webhookPathOrUrl, setWebhookPathOrUrl] = useState("/webhook/agents-orchestration");
  const [inputJson, setInputJson] = useState(
    JSON.stringify(
      {
        canal: "web",
        objetivo: "captar leads cualificados",
      },
      null,
      2,
    ),
  );
  const [createdTask, setCreatedTask] = useState<TaskRow | null>(null);
  const [runId, setRunId] = useState("");
  const [runData, setRunData] = useState<RunRow | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [isCheckingRun, setIsCheckingRun] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const parsedInput = useMemo(() => {
    try {
      return JSON.parse(inputJson) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [inputJson]);

  const createTask = async () => {
    if (!descripcion.trim()) {
      setErrorMessage("La descripcion de tarea es obligatoria.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setRunId("");
    setRunData(null);
    setIsCreatingTask(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descripcion,
          prioridad,
          requestedBy: "panel-ui",
          metadata: {
            createdFrom: "task-orchestrator",
          },
        }),
      });

      const payload: { task?: TaskRow; error?: string } = await response.json();
      if (!response.ok || !payload.task) {
        throw new Error(payload.error ?? "No se pudo crear la tarea.");
      }

      setCreatedTask(payload.task);
      setStatusMessage("Tarea creada. Ahora puedes delegarla a CLAW o n8n.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear la tarea.";
      setErrorMessage(message);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const delegateTask = async () => {
    if (!createdTask?.id) {
      setErrorMessage("Primero crea una tarea.");
      return;
    }
    if (!parsedInput) {
      setErrorMessage("El JSON de input no es valido.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setRunData(null);
    setIsDelegating(true);

    try {
      const endpoint =
        executor === "claw" ? "/api/claw/delegate" : "/api/integrations/n8n/trigger";

      const body =
        executor === "claw"
          ? {
              taskId: createdTask.id,
              agentId: agentId || undefined,
              instructions,
              input: parsedInput,
              context: {
                titulo: createdTask.titulo,
              },
            }
          : {
              taskId: createdTask.id,
              webhookPathOrUrl,
              payload: {
                taskId: createdTask.id,
                titulo: createdTask.titulo,
                descripcion: createdTask.descripcion,
                prioridad: createdTask.prioridad,
                ...parsedInput,
              },
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload: { runId?: string | null; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo delegar la tarea.");
      }

      if (payload.runId) {
        setRunId(payload.runId);
      }
      setStatusMessage(`Delegación enviada a ${executor.toUpperCase()}.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo delegar la tarea.";
      setErrorMessage(message);
    } finally {
      setIsDelegating(false);
    }
  };

  const checkRunStatus = async () => {
    if (!runId.trim()) {
      setErrorMessage("No hay runId para consultar.");
      return;
    }

    setErrorMessage("");
    setIsCheckingRun(true);

    try {
      const response = await fetch(`/api/runs/${runId}`);
      const payload: { run?: RunRow; error?: string } = await response.json();

      if (!response.ok || !payload.run) {
        throw new Error(payload.error ?? "No se pudo consultar el run.");
      }

      setRunData(payload.run);
      setStatusMessage(`Estado actual del run: ${payload.run.estado}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo consultar el run.";
      setErrorMessage(message);
    } finally {
      setIsCheckingRun(false);
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Orquestación</p>
          <h2 className="text-xl font-semibold">Flujo de tareas en tiempo real</h2>
          <p className="text-sm text-slate-300">
            Crea una tarea, delega a CLAW o n8n, y consulta el estado del run sin salir del panel.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <article className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 xl:col-span-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">1) Crear tarea</h3>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Titulo</span>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={fieldClass} />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Descripcion</span>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Prioridad</span>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as PriorityType)}
                className={fieldClass}
              >
                <option value="baja">baja</option>
                <option value="media">media</option>
                <option value="alta">alta</option>
              </select>
            </label>
            <button
              onClick={() => void createTask()}
              disabled={isCreatingTask}
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingTask ? "Creando..." : "Crear tarea"}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 xl:col-span-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">2) Delegar ejecución</h3>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Destino</span>
              <select
                value={executor}
                onChange={(e) => setExecutor(e.target.value as ExecutorType)}
                className={fieldClass}
              >
                <option value="claw">claw</option>
                <option value="n8n">n8n</option>
              </select>
            </label>

            {executor === "claw" ? (
              <>
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Agent ID (opcional)</span>
                  <input
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className={fieldClass}
                    placeholder="claw"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Instructions</span>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    className={fieldClass}
                  />
                </label>
              </>
            ) : (
              <label className="block space-y-1">
                <span className="text-sm text-slate-300">Webhook path o URL</span>
                <input
                  value={webhookPathOrUrl}
                  onChange={(e) => setWebhookPathOrUrl(e.target.value)}
                  className={fieldClass}
                  placeholder="/webhook/agents-orchestration"
                />
              </label>
            )}

            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Input JSON</span>
              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                rows={6}
                className={fieldClass}
              />
            </label>

            <button
              onClick={() => void delegateTask()}
              disabled={isDelegating || !createdTask}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDelegating ? "Delegando..." : `Delegar en ${executor.toUpperCase()}`}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 xl:col-span-3">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">3) Estado del run</h3>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Run ID</span>
              <input value={runId} onChange={(e) => setRunId(e.target.value)} className={fieldClass} />
            </label>
            <button
              onClick={() => void checkRunStatus()}
              disabled={isCheckingRun}
              className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingRun ? "Consultando..." : "Consultar run"}
            </button>

            {createdTask ? (
              <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-xs text-slate-300">
                <p className="text-slate-400">Task ID</p>
                <p className="break-all text-slate-100">{createdTask.id}</p>
                <p className="mt-2 text-slate-400">Estado</p>
                <p className="text-slate-100">{createdTask.estado}</p>
              </div>
            ) : null}

            {runData ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <p className="text-emerald-300">Executor: {runData.executor}</p>
                <p className="mt-1">Estado: {runData.estado}</p>
                {runData.error_message ? <p className="mt-1">Error: {runData.error_message}</p> : null}
              </div>
            ) : null}
          </div>
        </article>
      </div>

      {statusMessage ? (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {statusMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
}
