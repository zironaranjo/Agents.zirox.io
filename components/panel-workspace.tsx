"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  ChevronDown,
  CloudUpload,
  Mic,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  SlidersHorizontal,
  User,
  Volume2,
} from "lucide-react";
import type { Agent } from "@/lib/agents";
import { agentesPrincipales } from "@/lib/agents";

type EditableAgent = Agent;
type ConfigTab = "settings" | "history" | "analytics";

const skillOptions = ["Video Editing", "Copywriting", "SEO Optimization"] as const;
const platformOptions = [
  "n8n Workflow",
  "Email",
  "CapCut",
  "TikTok",
  "Instagram",
  "LinkedIn",
  "Facebook",
  "YouTube",
  "Notion",
  "Stitch",
  "WhatsApp",
  "Telegram",
] as const;

const avatarByAgent: Record<string, string> = {
  claw: "/Claw.png",
  nova: "/Nova.png",
  pulse: "/Pulse.png",
};

export function PanelWorkspace() {
  const [agents, setAgents] = useState<EditableAgent[]>(agentesPrincipales);
  const [selectedId, setSelectedId] = useState<string>(agentesPrincipales[0]?.id ?? "");
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [dataError, setDataError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [searchLogs, setSearchLogs] = useState("");
  const [activeTab, setActiveTab] = useState<ConfigTab>("settings");
  const [targetPlatform, setTargetPlatform] = useState("n8n Workflow");
  const [activeSkills, setActiveSkills] = useState<string[]>([
    "Video Editing",
    "Copywriting",
    "SEO Optimization",
  ]);
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
        ? selectedAgent.herramientas.slice(0, 3)
        : ["Video Editing", "Copywriting", "SEO Optimization"],
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

  const toggleSkill = (skill: (typeof skillOptions)[number]) => {
    setActiveSkills((current) => {
      if (current.includes(skill)) return current.filter((item) => item !== skill);
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

  const activeAgentDisplayName = selectedAgent?.nombre ?? "Claw";
  const normalizedAgentId = selectedAgent?.id?.toLowerCase() ?? "claw";
  const selectedAvatar = avatarByAgent[normalizedAgentId] ?? "/Claw.png";

  return (
    <section className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0f1723] text-slate-100">
      <aside className="flex w-20 shrink-0 flex-col border-r border-slate-800 bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px] lg:w-64">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0062ff]">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-lg font-bold leading-tight">AgentOS</p>
            <p className="text-xs text-slate-500">v2.4.0-pro</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4">
          <p className="mb-2 hidden px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:block">
            Active Agents
          </p>
          {isLoadingAgents ? (
            <p className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-2 text-center text-xs text-slate-400">
              Cargando...
            </p>
          ) : null}
          {agents.map((agent) => {
            const selected = selectedId === agent.id;
            const avatar = avatarByAgent[agent.id.toLowerCase()] ?? "/Claw.png";
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedId(agent.id)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                  selected
                    ? "border border-[#0062ff]/30 bg-[#0062ff]/10 text-[#4f9dff]"
                    : "hover:bg-slate-800/70"
                }`}
              >
                <div className="relative">
                  <Image
                    src={avatar}
                    alt={`Avatar de ${agent.nombre}`}
                    width={40}
                    height={40}
                    className={`h-10 w-10 rounded-full border-2 ${
                      selected ? "border-[#0062ff]" : "border-transparent"
                    } object-cover`}
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f1723] ${
                      selected ? "bg-green-500" : "bg-slate-500"
                    }`}
                  />
                </div>
                <div className="hidden min-w-0 lg:block">
                  <p className="truncate text-sm font-semibold text-slate-100">{agent.nombre}</p>
                  <p className="truncate text-[10px] text-slate-500">{agent.rol}</p>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => void createAgent()}
            disabled={isCreatingAgent}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-700 p-2 text-slate-500 transition hover:border-[#0062ff] hover:text-[#4f9dff] lg:justify-start disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden text-sm font-medium lg:block">
              {isCreatingAgent ? "Creando..." : "Create New Agent"}
            </span>
          </button>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/Claw1.png"
              alt="Usuario admin"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="hidden min-w-0 flex-1 lg:block">
              <p className="truncate text-sm font-medium">Admin User</p>
              <p className="text-[10px] text-slate-500">Pro Account</p>
            </div>
            <Settings className="hidden h-4 w-4 text-slate-500 lg:block" />
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[rgba(255,255,255,0.03)] px-4 backdrop-blur-[10px] md:px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Chat with {activeAgentDisplayName}</h2>
            <span className="rounded bg-[#0062ff]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#4f9dff]">
              Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                value={searchLogs}
                onChange={(event) => setSearchLogs(event.target.value)}
                className="w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 focus:ring-1 focus:ring-[#0062ff] dark:bg-slate-900 dark:text-slate-100"
                placeholder="Search logs..."
              />
            </div>
            <button className="rounded-lg p-2 transition-colors hover:bg-slate-800">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 transition-colors hover:bg-slate-800">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <section className="flex min-w-0 flex-1 flex-col bg-slate-50/40 dark:bg-transparent">
            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
              <div className="flex max-w-3xl gap-4">
                <Image
                  src={selectedAvatar}
                  alt="Avatar agente IA"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="space-y-2">
                  <div className="rounded-2xl rounded-tl-none border border-slate-700/60 bg-slate-800 p-4 shadow-sm">
                    <p className="text-sm leading-relaxed">
                      Hello! I&apos;m Claw. I&apos;ve been monitoring your multi-platform engagement
                      today. I noticed a 15% drop in engagement on LinkedIn. Should I generate a
                      new set of Reels and Shorts to boost visibility?
                    </p>
                  </div>
                  <span className="ml-1 text-[10px] text-slate-500">10:42 AM</span>
                </div>
              </div>

              <div className="ml-auto flex max-w-3xl justify-end">
                <div className="rounded-2xl rounded-tr-none bg-[#0062ff] p-4 text-sm leading-relaxed text-white shadow-lg shadow-[#0062ff]/20">
                  Yes, let&apos;s do that. I have a raw video file here. Can you replicate the style
                  of our top-performing content from last month?
                </div>
              </div>

              <div className="flex max-w-3xl gap-4">
                <Image
                  src={selectedAvatar}
                  alt="Avatar agente IA"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mx-auto max-w-4xl space-y-4">
                <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-white/5 p-8 transition-colors hover:border-[#0062ff]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0062ff]/10 transition-transform group-hover:scale-110">
                    <CloudUpload className="h-5 w-5 text-[#4f9dff]" />
                  </div>
                  <p className="text-sm font-semibold">Drag video or image to replicate</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Supports Reels, Shorts, and High-Res Images
                  </p>
                </div>

                <div className="relative flex items-center">
                  <textarea
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    className="custom-scrollbar h-16 w-full resize-none rounded-2xl border border-slate-700 bg-white p-4 pr-32 text-sm text-slate-900 shadow-lg focus:border-transparent focus:ring-2 focus:ring-[#0062ff] dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Type your instruction..."
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    <button className="p-2 text-slate-500 transition-colors hover:text-[#4f9dff]">
                      <Mic className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#0062ff] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#0062ff]/30">
                      Send <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="hidden w-80 flex-col border-l border-slate-800 bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px] lg:flex">
            <div className="border-b border-slate-800 p-6">
              <h3 className="mb-4 font-bold">Agent Configuration</h3>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
                {(["settings", "history", "analytics"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                        : "text-slate-500"
                    }`}
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
              {activeTab === "settings" ? (
                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-slate-500">
                      Target Platforms
                    </label>
                    <div className="relative">
                      <select
                        value={targetPlatform}
                        onChange={(event) => setTargetPlatform(event.target.value)}
                        className="w-full appearance-none rounded-xl border-none bg-slate-100 px-4 py-3 text-sm dark:bg-slate-900"
                      >
                        {platformOptions.map((platform) => (
                          <option key={platform}>{platform}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Active Skills
                      </label>
                      <button className="text-xs font-semibold text-[#4f9dff]">Edit</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            activeSkills.includes(skill)
                              ? "border-[#0062ff]/20 bg-[#0062ff]/10 text-[#4f9dff]"
                              : "border-slate-700 bg-slate-800 text-slate-400"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                        + Add Skill
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-slate-500">
                      Agent Voice
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#0062ff]/20 p-2">
                          <Volume2 className="h-4 w-4 text-[#4f9dff]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">Professional Male (US)</p>
                          <p className="text-[10px] text-slate-500">Tone: Confident &amp; Direct</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={voiceTone}
                          onChange={(event) => setVoiceTone(Number(event.target.value))}
                          className="w-full accent-[#0062ff]"
                        />
                        <span className="text-[10px] font-bold">{voiceTone}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-slate-500">
                      Connections
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-2 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 text-xs">
                          <Bell className="h-3.5 w-3.5 text-blue-400" />
                          <span>Google Drive</span>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-2 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 text-xs">
                          <Share2 className="h-3.5 w-3.5 text-pink-400" />
                          <span>Zapier</span>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3 text-xs text-slate-400">
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

            <div className="p-6">
              <button
                onClick={() => void saveSelectedAgent()}
                disabled={!selectedAgent || isSavingAgent}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0062ff] py-3 font-bold text-white shadow-lg shadow-[#0062ff]/30 transition-all hover:bg-[#0062ff]/90 disabled:opacity-60"
              >
                <User className="h-4 w-4" />
                {isSavingAgent ? "Aplicando..." : "Apply Configuration"}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </section>
  );
}
