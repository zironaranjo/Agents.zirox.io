"use client";

import { useMemo, useState } from "react";
import type { Agent, AgentStatus } from "@/lib/agents";
import { agentesPrincipales, estadoColor } from "@/lib/agents";

type EditableAgent = Agent;

const estados: AgentStatus[] = ["idle", "activo", "ejecutando"];

export function PanelWorkspace() {
  const [agents, setAgents] = useState<EditableAgent[]>(agentesPrincipales);
  const [selectedId, setSelectedId] = useState<string>(agentesPrincipales[0]?.id ?? "");
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

  const updateSelectedAgent = (updates: Partial<EditableAgent>) => {
    if (!selectedAgent) return;
    setAgents((current) =>
      current.map((agent) => (agent.id === selectedAgent.id ? { ...agent, ...updates } : agent)),
    );
  };

  const createAgent = () => {
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

    setAgents((current) => [nuevo, ...current]);
    setSelectedId(nuevo.id);
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
      setError(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="glass-panel rounded-2xl p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Agentes</h2>
          <button
            onClick={createAgent}
            className="rounded-md bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + Nuevo
          </button>
        </div>

        <div className="space-y-2">
          {agents.map((agent) => {
            const isSelected = selectedId === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedId(agent.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  isSelected
                    ? "border-cyan-300/70 bg-slate-800/80"
                    : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/60"
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
                <p className="mt-1 text-xs text-slate-300">{agent.rol}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <article className="glass-panel rounded-2xl p-5">
        {!selectedAgent ? (
          <p className="text-sm text-slate-300">Selecciona un agente para editarlo.</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Editor de agente</h2>

            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Nombre</span>
              <input
                value={selectedAgent.nombre}
                onChange={(event) => updateSelectedAgent({ nombre: event.target.value })}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Rol</span>
              <input
                value={selectedAgent.rol}
                onChange={(event) => updateSelectedAgent({ rol: event.target.value })}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-slate-300">Estado</span>
              <select
                value={selectedAgent.estado}
                onChange={(event) =>
                  updateSelectedAgent({ estado: event.target.value as AgentStatus })
                }
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </label>

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
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
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
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm text-slate-300">Provider</span>
                <select
                  value={selectedAgent.provider}
                  onChange={() =>
                    updateSelectedAgent({
                      provider: "openrouter",
                    })
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
                >
                  <option value="openrouter">openrouter</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-sm text-slate-300">Modelo</span>
                <input
                  value={selectedAgent.model}
                  onChange={(event) => updateSelectedAgent({ model: event.target.value })}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
                  placeholder="openai/gpt-4o-mini"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm text-slate-300">System Prompt</span>
              <textarea
                value={selectedAgent.systemPrompt}
                onChange={(event) => updateSelectedAgent({ systemPrompt: event.target.value })}
                rows={4}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
              />
            </label>

            <label className="block space-y-1">
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
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
              />
            </label>

            <div className="space-y-2 rounded-md border border-cyan-400/20 bg-cyan-500/5 p-4">
              <p className="text-sm font-semibold text-cyan-200">Probar agente (OpenRouter)</p>
              <textarea
                value={testPrompt}
                onChange={(event) => setTestPrompt(event.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300/50 focus:ring"
                placeholder="Escribe una tarea para validar el agente..."
              />
              <button
                onClick={runAgentTest}
                disabled={isRunning}
                className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunning ? "Ejecutando..." : "Probar agente"}
              </button>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              {respuesta ? (
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
                  {respuesta}
                </pre>
              ) : null}
            </div>

            <p className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              Siguiente paso: conectar este editor a Supabase para persistir configuración por agente.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}
