"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ExecutorType = "claw" | "n8n";
type PriorityType = "baja" | "media" | "alta";
type MatrixExecutorType = "claw" | "n8n" | "agent";

type TaskRow = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: PriorityType;
  created_at?: string;
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

type AgentRow = {
  id: string;
  nombre: string;
  rol: string;
  estado: string;
  model: string;
};

type MatrixExecutionResponse = {
  summary?: {
    total: number;
    completed: number;
    failed: number;
    executor: MatrixExecutorType;
    mode: string;
    order: string;
  };
  results?: Array<{
    taskId: string;
    runId: string | null;
    estado: "completada" | "error";
    error?: string;
  }>;
  error?: string;
};

type MatrixModeSettingsResponse = {
  enabled?: boolean;
  error?: string;
};

const fieldClass =
  "w-full rounded-lg border border-slate-700/90 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20";

export function TaskOrchestrator() {
  const matrixStorageKey = "agentes-matrix-mode-enabled";
  const [titulo, setTitulo] = useState("Nueva tarea de orquestación");
  const [descripcion, setDescripcion] = useState(
    "Define la estrategia y delega ejecución entre marketing y ventas.",
  );
  const [prioridad, setPrioridad] = useState<PriorityType>("media");
  const [executor, setExecutor] = useState<ExecutorType>("claw");
  const [instructions, setInstructions] = useState(
    "Analiza la tarea y delega en NOVA y PULSE con pasos concretos.",
  );
  const [agentId, setAgentId] = useState("");
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
  const [autoPollingEnabled, setAutoPollingEnabled] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<TaskRow[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [matrixExecutor, setMatrixExecutor] = useState<MatrixExecutorType>("claw");
  const [matrixAgentId, setMatrixAgentId] = useState("");
  const [matrixInstructions, setMatrixInstructions] = useState(
    "Ejecuta la tarea en orden, produce salida accionable y registra decisiones clave.",
  );
  const [matrixContinueOnError, setMatrixContinueOnError] = useState(true);
  const [matrixLimit, setMatrixLimit] = useState(50);
  const [isRunningMatrix, setIsRunningMatrix] = useState(false);
  const [matrixModeEnabled, setMatrixModeEnabled] = useState(false);
  const [isSavingMatrixMode, setIsSavingMatrixMode] = useState(false);
  const [matrixSummary, setMatrixSummary] = useState<
    MatrixExecutionResponse["summary"] | null
  >(null);
  const [matrixResults, setMatrixResults] = useState<
    NonNullable<MatrixExecutionResponse["results"]>
  >([]);

  const parsedInput = useMemo(() => {
    try {
      return JSON.parse(inputJson) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [inputJson]);

  const runIsTerminal = useMemo(() => {
    const status = runData?.estado?.toLowerCase();
    return status === "completado" || status === "error";
  }, [runData?.estado]);

  const loadAgents = useCallback(async () => {
    setIsLoadingAgents(true);
    try {
      const response = await fetch("/api/agents");
      const payload: { agents?: AgentRow[]; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudieron cargar agentes.");
      }

      const loaded = payload.agents ?? [];
      setAgents(loaded);

      if (loaded.length > 0) {
        setAgentId((prev) => prev || loaded[0].id);
        setMatrixAgentId((prev) => prev || loaded[0].id);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudieron cargar agentes.";
      setErrorMessage(message);
    } finally {
      setIsLoadingAgents(false);
    }
  }, []);

  const loadPendingTasks = useCallback(async () => {
    setIsLoadingPending(true);
    try {
      const response = await fetch("/api/tasks?estado=pendiente&limit=200");
      const payload: { tasks?: TaskRow[]; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudieron cargar tareas pendientes.");
      }
      setPendingTasks(payload.tasks ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar tareas pendientes.";
      setErrorMessage(message);
    } finally {
      setIsLoadingPending(false);
    }
  }, []);

  const loadMatrixModeSetting = useCallback(async () => {
    try {
      const response = await fetch("/api/settings/matrix-mode");
      const payload = (await response.json()) as MatrixModeSettingsResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo cargar Matrix Mode global.");
      }

      const enabled = Boolean(payload.enabled);
      setMatrixModeEnabled(enabled);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(matrixStorageKey, enabled ? "true" : "false");
      }
      return;
    } catch {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(matrixStorageKey);
        setMatrixModeEnabled(saved === "true");
      }
    }
  }, []);

  useEffect(() => {
    void loadAgents();
    void loadPendingTasks();
    void loadMatrixModeSetting();
  }, [loadAgents, loadPendingTasks, loadMatrixModeSetting]);

  const toggleMatrixMode = async () => {
    const previous = matrixModeEnabled;
    const next = !previous;

    setErrorMessage("");
    setMatrixModeEnabled(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(matrixStorageKey, next ? "true" : "false");
    }

    setIsSavingMatrixMode(true);
    try {
      const response = await fetch("/api/settings/matrix-mode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      const payload = (await response.json()) as MatrixModeSettingsResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo guardar Matrix Mode global.");
      }

      setStatusMessage(
        `Matrix Mode ${next ? "activado" : "desactivado"} globalmente.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar Matrix Mode global.";
      setErrorMessage(message);
      setMatrixModeEnabled(previous);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          matrixStorageKey,
          previous ? "true" : "false",
        );
      }
    } finally {
      setIsSavingMatrixMode(false);
    }
  };

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
      void loadPendingTasks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear la tarea.";
      setErrorMessage(message);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const delegateTask = async () => {
    if (matrixModeEnabled) {
      setErrorMessage(
        "Matrix Mode está activo. La delegación manual está bloqueada. Ejecuta la cola en el bloque 4.",
      );
      return;
    }

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
        setAutoPollingEnabled(true);
      }
      setStatusMessage(`Delegación enviada a ${executor.toUpperCase()}.`);
      void loadPendingTasks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo delegar la tarea.";
      setErrorMessage(message);
    } finally {
      setIsDelegating(false);
    }
  };

  const executeMatrixQueue = async () => {
    setErrorMessage("");
    setStatusMessage("");
    setMatrixSummary(null);
    setMatrixResults([]);

    if (matrixExecutor === "agent" && !matrixAgentId.trim()) {
      setErrorMessage("Selecciona un agente para ejecutar en modo Matrix.");
      return;
    }
    if (matrixExecutor === "claw" && !matrixInstructions.trim()) {
      setErrorMessage("Debes definir instrucciones para CLAW en modo Matrix.");
      return;
    }
    if (matrixExecutor === "n8n" && !webhookPathOrUrl.trim()) {
      setErrorMessage("Debes definir webhook para ejecutar con n8n.");
      return;
    }
    if (!parsedInput) {
      setErrorMessage("El JSON de input no es válido para modo Matrix.");
      return;
    }

    setIsRunningMatrix(true);
    try {
      const response = await fetch("/api/tasks/matrix/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executor: matrixExecutor,
          agentId:
            matrixExecutor === "agent"
              ? matrixAgentId
              : matrixExecutor === "claw"
                ? agentId || undefined
                : undefined,
          instructions: matrixExecutor === "claw" ? matrixInstructions : undefined,
          webhookPathOrUrl: matrixExecutor === "n8n" ? webhookPathOrUrl : undefined,
          inputTemplate: parsedInput,
          continueOnError: matrixContinueOnError,
          limit: matrixLimit,
        }),
      });

      const payload = (await response.json()) as MatrixExecutionResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo ejecutar la cola Matrix.");
      }

      setMatrixSummary(payload.summary ?? null);
      setMatrixResults(payload.results ?? []);
      setStatusMessage(
        `Modo Matrix ejecutado: ${payload.summary?.completed ?? 0} completadas, ${payload.summary?.failed ?? 0} con error.`,
      );
      setCreatedTask(null);
      setRunId("");
      setRunData(null);
      void loadPendingTasks();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo ejecutar la cola Matrix.";
      setErrorMessage(message);
    } finally {
      setIsRunningMatrix(false);
    }
  };

  const checkRunStatus = useCallback(async (options?: { silent?: boolean }) => {
    if (!runId.trim()) {
      setErrorMessage("No hay runId para consultar.");
      return;
    }

    if (!options?.silent) {
      setErrorMessage("");
      setIsCheckingRun(true);
    }

    try {
      const response = await fetch(`/api/runs/${runId}`);
      const payload: { run?: RunRow; error?: string } = await response.json();

      if (!response.ok || !payload.run) {
        throw new Error(payload.error ?? "No se pudo consultar el run.");
      }

      setRunData(payload.run);
      setLastCheckedAt(new Date().toLocaleTimeString());
      if (!options?.silent) {
        setStatusMessage(`Estado actual del run: ${payload.run.estado}`);
      }

      if (payload.run.estado.toLowerCase() === "completado" || payload.run.estado.toLowerCase() === "error") {
        setAutoPollingEnabled(false);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo consultar el run.";
      setErrorMessage(message);
    } finally {
      if (!options?.silent) {
        setIsCheckingRun(false);
      }
    }
  }, [runId]);

  useEffect(() => {
    if (!autoPollingEnabled || !runId.trim() || runIsTerminal) {
      return;
    }

    const timer = setInterval(() => {
      void checkRunStatus({ silent: true });
    }, 3000);

    return () => clearInterval(timer);
  }, [autoPollingEnabled, runId, runIsTerminal, checkRunStatus]);

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Orquestación</p>
          <h2 className="text-xl font-semibold">Flujo de tareas en tiempo real</h2>
          <p className="text-sm text-slate-300">
            Crea tareas, delega por agente o integración y ejecuta Modo Matrix en secuencia.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200">
            Matrix Mode
          </p>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleMatrixMode()}
              disabled={isSavingMatrixMode}
              className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition ${
                matrixModeEnabled ? "bg-cyan-400" : "bg-slate-700"
              } disabled:cursor-not-allowed disabled:opacity-60`}
              aria-pressed={matrixModeEnabled}
              aria-label="Alternar Matrix Mode"
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition ${
                  matrixModeEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-semibold ${
                matrixModeEnabled ? "text-cyan-200" : "text-slate-300"
              }`}
            >
              {matrixModeEnabled ? "ON · secuencial" : "OFF · manual"}
            </span>
          </div>
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
                  <span className="text-sm text-slate-300">Selector de agente</span>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className={fieldClass}
                    disabled={isLoadingAgents || agents.length === 0}
                  >
                    {agents.length === 0 ? (
                      <option value="">Sin agentes disponibles</option>
                    ) : (
                      agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.nombre} ({agent.estado})
                        </option>
                      ))
                    )}
                  </select>
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
              disabled={isDelegating || !createdTask || matrixModeEnabled}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {matrixModeEnabled
                ? "Delegación manual bloqueada por Matrix Mode"
                : isDelegating
                  ? "Delegando..."
                  : `Delegar en ${executor.toUpperCase()}`}
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
            <button
              onClick={() => setAutoPollingEnabled((value) => !value)}
              disabled={!runId.trim() || runIsTerminal}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {autoPollingEnabled ? "Pausar auto-polling" : "Reanudar auto-polling"}
            </button>
            <p className="text-xs text-slate-400">
              Auto-polling:{" "}
              <span className={autoPollingEnabled && !runIsTerminal ? "text-emerald-300" : "text-slate-300"}>
                {autoPollingEnabled && !runIsTerminal ? "activo (cada 3s)" : "inactivo"}
              </span>
              {lastCheckedAt ? ` · Última consulta: ${lastCheckedAt}` : ""}
            </p>

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

        <article className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 xl:col-span-12">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-cyan-200">
                4) Modo Matrix · Cola secuencial en orden
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Ejecuta tareas pendientes una por una, sin saltar el orden de creación.
              </p>
            </div>
            <button
              onClick={() => void loadPendingTasks()}
              disabled={isLoadingPending}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingPending ? "Actualizando..." : "Refrescar pendientes"}
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="block space-y-1 md:col-span-1">
                  <span className="text-sm text-slate-300">Executor</span>
                  <select
                    value={matrixExecutor}
                    onChange={(e) => setMatrixExecutor(e.target.value as MatrixExecutorType)}
                    className={fieldClass}
                  >
                    <option value="claw">claw</option>
                    <option value="agent">agent</option>
                    <option value="n8n">n8n</option>
                  </select>
                </label>

                <label className="block space-y-1 md:col-span-1">
                  <span className="text-sm text-slate-300">Límite tareas</span>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={matrixLimit}
                    onChange={(e) => setMatrixLimit(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-1 md:col-span-1">
                  <span className="text-sm text-slate-300">Continuar ante error</span>
                  <select
                    value={matrixContinueOnError ? "si" : "no"}
                    onChange={(e) => setMatrixContinueOnError(e.target.value === "si")}
                    className={fieldClass}
                  >
                    <option value="si">sí</option>
                    <option value="no">no</option>
                  </select>
                </label>
              </div>

              {(matrixExecutor === "agent" || matrixExecutor === "claw") && (
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Selector de agente</span>
                  <select
                    value={matrixExecutor === "agent" ? matrixAgentId : agentId}
                    onChange={(e) =>
                      matrixExecutor === "agent"
                        ? setMatrixAgentId(e.target.value)
                        : setAgentId(e.target.value)
                    }
                    className={fieldClass}
                    disabled={isLoadingAgents || agents.length === 0}
                  >
                    {agents.length === 0 ? (
                      <option value="">Sin agentes disponibles</option>
                    ) : (
                      agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.nombre} · {agent.rol}
                        </option>
                      ))
                    )}
                  </select>
                </label>
              )}

              {matrixExecutor === "claw" && (
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Instrucciones Matrix (CLAW)</span>
                  <textarea
                    value={matrixInstructions}
                    onChange={(e) => setMatrixInstructions(e.target.value)}
                    rows={3}
                    className={fieldClass}
                  />
                </label>
              )}

              {matrixExecutor === "n8n" && (
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Webhook n8n</span>
                  <input
                    value={webhookPathOrUrl}
                    onChange={(e) => setWebhookPathOrUrl(e.target.value)}
                    className={fieldClass}
                  />
                </label>
              )}

              <button
                onClick={() => void executeMatrixQueue()}
                disabled={isRunningMatrix || pendingTasks.length === 0}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunningMatrix
                  ? "Ejecutando cola Matrix..."
                  : matrixModeEnabled
                    ? "Ejecutar cola Matrix (modo global activo)"
                    : "Ejecutar tareas pendientes en orden"}
              </button>
            </div>

            <div className="space-y-3 lg:col-span-5">
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300">
                <p className="font-semibold text-slate-100">
                  Pendientes actuales: {pendingTasks.length}
                </p>
                <div className="mt-2 max-h-44 space-y-2 overflow-auto pr-1">
                  {pendingTasks.slice(0, 12).map((task) => (
                    <div key={task.id} className="rounded-md border border-slate-700/70 bg-slate-950/60 p-2">
                      <p className="line-clamp-1 text-slate-100">{task.titulo}</p>
                      <p className="line-clamp-1 text-[11px] text-slate-400">{task.descripcion}</p>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <p className="text-slate-400">No hay tareas pendientes.</p>
                  )}
                </div>
              </div>

              {matrixSummary && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                  <p className="font-semibold text-emerald-100">
                    Resumen Matrix ({matrixSummary.executor})
                  </p>
                  <p className="mt-1">
                    Total: {matrixSummary.total} · Completadas: {matrixSummary.completed} · Error:{" "}
                    {matrixSummary.failed}
                  </p>
                </div>
              )}

              {matrixResults.length > 0 && (
                <div className="max-h-44 space-y-2 overflow-auto pr-1 text-xs">
                  {matrixResults.map((item) => (
                    <div
                      key={`${item.taskId}-${item.runId ?? "none"}`}
                      className={`rounded-md border p-2 ${
                        item.estado === "completada"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                      }`}
                    >
                      <p className="break-all">Task: {item.taskId}</p>
                      <p>Estado: {item.estado}</p>
                      {item.error ? <p className="mt-1">{item.error}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
