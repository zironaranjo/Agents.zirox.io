"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  CloudUpload,
  Mic,
  Plus,
  Settings2,
  Share2,
  SlidersHorizontal,
  User,
} from "lucide-react";
import type { Agent } from "@/lib/agents";
import { agentesPrincipales } from "@/lib/agents";

type EditableAgent = Agent;
type ConfigTab = "settings" | "history" | "analytics";

const skillOptions = ["Video Editing", "Copywriting", "SEO Optimization", "Ad Sales"] as const;

export function PanelWorkspace() {
  const [agents, setAgents] = useState<EditableAgent[]>(agentesPrincipales);
  const [selectedId, setSelectedId] = useState<string>(agentesPrincipales[0]?.id ?? "");
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [dataError, setDataError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<ConfigTab>("settings");
  const [targetPlatform, setTargetPlatform] = useState("n8n Workflow");
  const [activeSkills, setActiveSkills] = useState<string[]>(["Video Editing", "Copywriting"]);
  const [voiceTone, setVoiceTone] = useState(75);

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
        }
      } catch (unknownError) {
        const message =
          unknownError instanceof Error ? unknownError.message : "No se pudo cargar Supabase.";
        setDataError(message);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    void loadAgents();
  }, []);

  useEffect(() => {
    if (!selectedAgent) return;
    setActiveSkills(
      selectedAgent.herramientas.length > 0
        ? selectedAgent.herramientas.slice(0, 4)
        : ["Video Editing", "Copywriting"],
    );
  }, [selectedAgent]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      const payload: { agent?: Agent; error?: string } = await response.json();
      if (!response.ok || !payload.agent) {
        throw new Error(payload.error ?? "No se pudo crear el agente.");
      }

      setAgents((current) => [payload.agent as EditableAgent, ...current]);
      setSelectedId(payload.agent.id);
      setSyncMessage("Agente creado.");
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : "No se pudo crear el agente.";
      setDataError(message);
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setActiveSkills((current) => {
      if (current.includes(skill)) {
        return current.filter((item) => item !== skill);
      }
      return [...current, skill];
    });
  };

  const saveSelectedAgent = async () => {
    if (!selectedAgent) return;
    setIsSavingAgent(true);
    setSyncMessage("");
    setDataError("");

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedAgent,
          herramientas: activeSkills,
        }),
      });

      const payload: { agent?: Agent; error?: string } = await response.json();
      if (!response.ok || !payload.agent) {
        throw new Error(payload.error ?? "No se pudo aplicar configuración.");
      }

      setAgents((current) =>
        current.map((agent) =>
          agent.id === payload.agent?.id ? (payload.agent as EditableAgent) : agent,
        ),
      );
      setSyncMessage("Configuración aplicada.");
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : "No se pudo aplicar configuración.";
      setDataError(message);
    } finally {
      setIsSavingAgent(false);
    }
  };

  return (
    <section className="grid h-[calc(100vh-4rem)] grid-cols-1 overflow-hidden bg-[#070f1d] md:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_300px]">
      <aside className="border-r border-[#1e2a40] bg-[#0c1728]">
        <div className="border-b border-[#1e2a40] px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/20 text-blue-300">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-100">AgentOS</p>
              <p className="text-[10px] text-slate-500">v4.0.0-pro</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Active Agents</p>
          <div className="space-y-1.5">
            {isLoadingAgents ? (
              <p className="rounded-md border border-[#23314a] bg-[#111d30] px-2 py-2 text-xs text-slate-400">
                Cargando...
              </p>
            ) : null}
            {agents.map((agent) => {
              const selected = selectedId === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedId(agent.id)}
                  className={`flex w-full items-center justify-between rounded-md border px-2.5 py-2 text-left transition ${
                    selected
                      ? "border-blue-500/45 bg-blue-500/15"
                      : "border-transparent bg-transparent hover:border-[#23314a] hover:bg-[#101a2c]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{agent.nombre}</p>
                    <p className="truncate text-[10px] text-slate-500">{agent.rol}</p>
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                </button>
              );
            })}
            <button
              onClick={() => void createAgent()}
              disabled={isCreatingAgent}
              className="flex w-full items-center gap-2 rounded-md border border-dashed border-[#23314a] px-2.5 py-2 text-xs text-slate-300 transition hover:bg-[#101a2c] disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" />
              {isCreatingAgent ? "Creando..." : "Create New Agent"}
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 hidden border-t border-[#1e2a40] bg-[#0c1728] p-3 md:block xl:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                A
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-200">Admin User</p>
                <p className="text-[10px] text-slate-500">Pro Account</p>
              </div>
            </div>
            <Settings2 className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      <article className="flex min-w-0 flex-col border-r border-[#1e2a40] bg-[#0a1424]">
        <div className="flex h-14 items-center justify-between border-b border-[#1e2a40] px-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-100">Chat with Claw</p>
            <span className="rounded bg-blue-500/25 px-1.5 py-0.5 text-[10px] font-semibold text-blue-200">
              ACTIVE
            </span>
          </div>
          <div className="relative hidden md:block">
            <input
              className="w-48 rounded-md border border-[#26344d] bg-[#0d1a2e] px-7 py-1.5 text-xs text-slate-200 outline-none"
              placeholder="Search logs..."
            />
            <SlidersHorizontal className="pointer-events-none absolute left-2 top-1.5 h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-auto p-4">
          <div className="max-w-[80%] rounded-xl border border-[#2a3953] bg-[#101e34] px-3 py-2">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-700">
                <User className="h-3 w-3 text-slate-200" />
              </span>
              <p className="text-xs text-slate-300">Hello! I&apos;m Claw.</p>
            </div>
            <p className="text-xs leading-5 text-slate-300">
              I&apos;ve been monitoring your multi-platform engagement today. Should I generate a
              new set of Reels and Shorts to boost visibility?
            </p>
            <p className="mt-1 text-[10px] text-slate-500">9:42 AM</p>
          </div>

          <div className="ml-auto max-w-[78%] rounded-xl bg-blue-600 px-3 py-2 text-xs leading-5 text-white shadow-[0_8px_30px_rgba(37,99,235,0.35)]">
            Yes let&apos;s do that. I have a raw video file here. Can you replicate the style of our
            top-performing content from last month?
          </div>

          <div className="max-w-[50%] rounded-full border border-[#2a3953] bg-[#101e34] px-3 py-2 text-xs text-slate-400">
            ...
          </div>
        </div>

        <div className="border-t border-[#1e2a40] p-4">
          <div className="mb-3 rounded-xl border border-dashed border-[#31415f] bg-[#121f34] p-6 text-center">
            <CloudUpload className="mx-auto mb-2 h-4 w-4 text-blue-300" />
            <p className="text-xs font-medium text-slate-200">Drag video or image to replicate</p>
            <p className="text-[10px] text-slate-500">Supports PNG, Chrome, and high-res JPEG</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#2a3953] bg-[#111d30] p-1.5">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Type your instruction..."
              className="flex-1 bg-transparent px-2 text-xs text-slate-200 outline-none placeholder:text-slate-500"
            />
            <Mic className="h-3.5 w-3.5 text-slate-400" />
            <button className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-500">
              Send
            </button>
          </div>
        </div>
      </article>

      <aside className="hidden bg-[#0c1728] xl:flex xl:flex-col">
        <div className="border-b border-[#1e2a40] px-4 py-4">
          <p className="text-sm font-semibold text-slate-100">Agent Configuration</p>
          <div className="mt-3 inline-flex rounded-md border border-[#26344d] bg-[#101d31] p-1">
            {(["settings", "history", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded px-2 py-1 text-[10px] uppercase tracking-wide transition ${
                  activeTab === tab
                    ? "bg-blue-500/25 text-blue-200"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-auto px-4 py-4">
          {activeTab === "settings" ? (
            <>
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Target Platforms</p>
                <select
                  value={targetPlatform}
                  onChange={(event) => setTargetPlatform(event.target.value)}
                  className="w-full rounded-md border border-[#26344d] bg-[#111d30] px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option>n8n Workflow</option>
                  <option>Social API</option>
                  <option>CLAW Direct</option>
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Active Skills</p>
                  <button className="text-[10px] text-blue-300">Edit</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const active = activeSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-full border px-2.5 py-1 text-[10px] transition ${
                          active
                            ? "border-blue-500/50 bg-blue-500/20 text-blue-200"
                            : "border-[#2a3953] bg-[#101d31] text-slate-400"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Agent Voice</p>
                <div className="rounded-lg border border-[#2a3953] bg-[#111d30] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-200">Professional Male (US)</p>
                    <p className="text-[10px] text-slate-500">{voiceTone}%</p>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={voiceTone}
                    onChange={(event) => setVoiceTone(Number(event.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Connections</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border border-[#2a3953] bg-[#111d30] px-3 py-2 text-xs text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-slate-400" />
                      Google Drive
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-[#2a3953] bg-[#111d30] px-3 py-2 text-xs text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <Share2 className="h-3.5 w-3.5 text-pink-300" />
                      Zapier
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-md border border-[#2a3953] bg-[#101d31] p-3 text-xs text-slate-400">
              Panel {activeTab} en preparación.
            </div>
          )}

          {syncMessage ? (
            <p className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1.5 text-[11px] text-emerald-200">
              {syncMessage}
            </p>
          ) : null}
          {dataError ? (
            <p className="rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-1.5 text-[11px] text-rose-200">
              {dataError}
            </p>
          ) : null}
        </div>

        <div className="border-t border-[#1e2a40] p-4">
          <button
            onClick={() => void saveSelectedAgent()}
            disabled={!selectedAgent || isSavingAgent}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingAgent ? "Aplicando..." : "Apply Configuration"}
          </button>
        </div>
      </aside>
    </section>
  );
}
