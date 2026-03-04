"use client";

import { useEffect, useMemo, useState } from "react";
import type { Agent, AgentStatus } from "@/lib/agents";
import { agentesPrincipales, estadoColor } from "@/lib/agents";

type EditableAgent = Agent;

const estados: AgentStatus[] = ["idle", "activo", "ejecutando"];
const baseFieldClass =
  "w-full rounded-lg border border-slate-700/90 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20";

function normalizeAgentError(message: string) {
  if (message.toLowerCase().includes("requires more credits")) {
    return "OpenRouter indica créditos insuficientes para esta solicitud. Baja el consumo (prompt más corto/modelo más barato) o añade créditos en tu cuenta.";
  }

  return message;
}

export function PanelWorkspace() {
  const [agents, setAgents] = useState<EditableAgent[]>(agentesPrincipales);
  const [selectedId, setSelectedId] = useState<string>(agentesPrincipales[0]?.id ?? "");
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [dataError, setDataError] = useState("");
  const [testPrompt, setTestPrompt] = useState(
    "Crea una estrategia rápida para lanzar una campaña esta semana.",
  );
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedId),
    [agents, selectedId],
  );

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoadingAgents(true);
      setDataError("");

      try {
        const response = await fetch("/api/agents", { method: "GET" });
        const payload: { agents?: Agent[]; error?: string } = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "No se pudieron cargar agentes.");
        }

        const loadedAgents = payload.agents ?? [];
        if (loadedAgents.length > 0) {
          setAgents(loadedAgents);
          setSelectedId(loadedAgents[0].id);
          setSyncMessage("Datos cargados desde Supabase.");
        } else {
          setSyncMessage("No hay agentes en Supabase todavía.");
        }
      } catch (unknownError) {
        const message =
          unknownError instanceof Error
            ? unknownError.message
            : "No se pudo cargar Supabase.";
        setDataError(message);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    void loadAgents();
  }, []);

  const updateSelectedAgent = (updates: Partial<EditableAgent>) => {
    if (!selectedAgent) return;
    setAgents((current) =>
      current.map((agent) => (agent.id === selectedAgent.id ? { ...agent, ...updates } : agent)),
    );
  };

  const createAgent = async () => {
    const timestamp = Date.now().toString().slice(-5);
    const nuevo: EditableAgent = {
      id: `agent-${timestamp}`,
      nombre: `AGENTE-${timestamp}`,
      rol: "Nuevo rol por definir",
      estado: "idle",
      herramientas: [],
      subagentes: [],
      provider: "openrouter",
      model: "openai/gpt-4o-mini",
      systemPrompt: "Eres un agente especializado. Responde de forma clara y accionable.",
      temperature: 0.6,
    };

    setIsCreatingAgent(true);
    setDataError("");
    setSyncMessage("");

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevo),
      });

      const payload: { agent?: Agent; error?: string } = await response.json();
      if (!response.ok || !payload.agent) {
        throw new Error(payload.error ?? "No se pudo crear el agente.");
      }

      setAgents((current) => [payload.agent as EditableAgent, ...current]);
      setSelectedId(payload.agent.id);
      setSyncMessage("Agente creado y guardado en Supabase.");
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : "No se pudo crear el agente.";
      setDataError(message);
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const saveSelectedAgent = async () => {
    if (!selectedAgent) return;

    setIsSavingAgent(true);
    setDataError("");
    setSyncMessage("");

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAgent),
      });

      const payload: { agent?: Agent; error?: string } = await response.json();
      if (!response.ok || !payload.agent) {
        throw new Error(payload.error ?? "No se pudo guardar el agente.");
      }

      setAgents((current) =>
        current.map((agent) =>
          agent.id === payload.agent?.id ? (payload.agent as EditableAgent) : agent,
        ),
      );
      setSyncMessage("Cambios guardados en Supabase.");
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : "No se pudo guardar el agente.";
      setDataError(message);
    } finally {
      setIsSavingAgent(false);
    }
  };

  const runAgentTest = async () => {
    if (!selectedAgent) return;
    if (!testPrompt.trim()) {
      setError("Escribe un prompt de prueba.");
      return;
    }

    setIsRunning(true);
    setError("");
    setRespuesta("");

    try {
      const response = await fetch("/api/agents/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedAgent.provider,
          model: selectedAgent.model,
          systemPrompt: selectedAgent.systemPrompt,
          userPrompt: testPrompt,
          temperature: selectedAgent.temperature,
        }),
      });

      const payload: { output?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo ejecutar el agente.");
      }

      setRespuesta(payload.output ?? "");
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : "Error desconocido en la prueba.";
      setError(normalizeAgentError(message));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <aside className="glass-panel rounded-2xl p-4 lg:col-span-3 lg:max-h-[78vh] lg:overflow-auto">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Workspace</p>
            <h2 className="text-lg font-semibold">Agentes</h2>
          </div>
          <button
            onClick={() => void createAgent()}
            disabled={isCreatingAgent || isLoadingAgents}
            className="rounded-md bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingAgent ? "Creando..." : "+ Nuevo"}
          </button>
        </div>

        <div className="space-y-2 pr-1">
          {isLoadingAgents ? (
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
              Cargando agentes desde Supabase...
            </div>
          ) : null}

          {agents.map((agent) => {
            const isSelected = selectedId === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedId(agent.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  isSelected
                    ? "border-cyan-300/70 bg-slate-800/90 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                    : "border-slate-700 bg-slate-900/60 hover:bg-slate-800/65"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{agent.nombre}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] uppercase ${estadoColor[agent.estado]}`}
                  >
                    {agent.estado}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-300">{agent.rol}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <article className="glass-panel rounded-2xl p-5 lg:col-span-5 lg:max-h-[78vh] lg:overflow-auto">
        {!selectedAgent ? (
          <p className="text-sm text-slate-300">Selecciona un agente para editarlo.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Editor</p>
                <h2 className="text-xl font-semibold">{selectedAgent.nombre}</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${estadoColor[selectedAgent.estado]}`}
              >
                {selectedAgent.estado}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-400">Sincroniza cambios manualmente con Supabase.</p>
              <button
                onClick={() => void saveSelectedAgent()}
                disabled={isSavingAgent}
                className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAgent ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

            {syncMessage ? (
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                {syncMessage}
              </div>
            ) : null}
            {dataError ? (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                {dataError}
              </div>
            ) : null}

            <section className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
              <h3 className="text-sm font-semibold text-slate-200">Identidad del agente</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Nombre</span>
                  <input
                    value={selectedAgent.nombre}
                    onChange={(event) => updateSelectedAgent({ nombre: event.target.value })}
                    className={baseFieldClass}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Estado</span>
                  <select
                    value={selectedAgent.estado}
                    onChange={(event) =>
                      updateSelectedAgent({ estado: event.target.value as AgentStatus })
                    }
                    className={baseFieldClass}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-sm text-slate-300">Rol</span>
                <input
                  value={selectedAgent.rol}
                  onChange={(event) => updateSelectedAgent({ rol: event.target.value })}
                  className={baseFieldClass}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Herramientas (coma separada)</span>
                  <input
                    value={selectedAgent.herramientas.join(", ")}
                    onChange={(event) =>
                      updateSelectedAgent({
                        herramientas: event.target.value
                          .split(",")
                          .map((tool) => tool.trim())
                          .filter(Boolean),
                      })
                    }
                    className={baseFieldClass}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Subagentes (coma separada)</span>
                  <input
                    value={selectedAgent.subagentes.join(", ")}
                    onChange={(event) =>
                      updateSelectedAgent({
                        subagentes: event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                    className={baseFieldClass}
                  />
                </label>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
              <h3 className="text-sm font-semibold text-slate-200">Configuración LLM</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Provider</span>
                  <select
                    value={selectedAgent.provider}
                    onChange={() => updateSelectedAgent({ provider: "openrouter" })}
                    className={baseFieldClass}
                  >
                    <option value="openrouter">openrouter</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-slate-300">Modelo</span>
                  <input
                    value={selectedAgent.model}
                    onChange={(event) => updateSelectedAgent({ model: event.target.value })}
                    className={baseFieldClass}
                    placeholder="openai/gpt-4o-mini"
                  />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-sm text-slate-300">System Prompt</span>
                <textarea
                  value={selectedAgent.systemPrompt}
                  onChange={(event) => updateSelectedAgent({ systemPrompt: event.target.value })}
                  rows={5}
                  className={baseFieldClass}
                />
              </label>

              <label className="block max-w-[220px] space-y-1">
                <span className="text-sm text-slate-300">Temperatura</span>
                <input
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={selectedAgent.temperature}
                  onChange={(event) =>
                    updateSelectedAgent({
                      temperature: Number(event.target.value),
                    })
                  }
                  className={baseFieldClass}
                />
              </label>
            </section>

            <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              Siguiente paso: conectar este editor a Supabase para persistir configuración por
              agente.
            </p>
          </div>
        )}
      </article>

      <aside className="glass-panel rounded-2xl p-5 lg:col-span-4 lg:max-h-[78vh] lg:overflow-auto">
        {!selectedAgent ? (
          <p className="text-sm text-slate-300">Selecciona un agente para iniciar una prueba.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Testing</p>
              <h3 className="text-lg font-semibold">Prueba rápida de agente</h3>
              <p className="text-sm text-slate-300">
                Ejecuta prompts de validación sin salir del panel.
              </p>
            </div>

            <textarea
              value={testPrompt}
              onChange={(event) => setTestPrompt(event.target.value)}
              rows={7}
              className={baseFieldClass}
              placeholder="Escribe una tarea para validar el agente..."
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={runAgentTest}
                disabled={isRunning}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunning ? "Ejecutando..." : "Probar agente"}
              </button>
              <p className="text-xs text-slate-400">Usa prompts cortos para bajar costo.</p>
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-rose-300">Error</p>
                <p className="mt-1 text-sm text-rose-200">{error}</p>
              </div>
            ) : null}

            {respuesta ? (
              <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/5 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Respuesta</p>
                <pre className="mt-2 max-h-[38vh] overflow-auto whitespace-pre-wrap text-sm text-slate-100">
                  {respuesta}
                </pre>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm text-slate-300">
                La respuesta aparecerá aquí después de ejecutar la prueba.
              </div>
            )}
          </div>
        )}
      </aside>
    </section>
  );
}
