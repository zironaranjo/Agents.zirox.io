"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useMemo, useRef, useState, type DragEvent } from "react";
import {
  Activity,
  AtSign,
  Bot,
  CloudUpload,
  Cog,
  Facebook,
  GitBranch,
  Globe,
  ImagePlus,
  Instagram,
  Linkedin,
  MessageSquare,
  Plus,
  Puzzle,
  Rocket,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Timer,
  Video,
  Webhook,
  Workflow,
  Youtube,
  type LucideIcon,
} from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

type WorkflowNode = {
  id: string;
  type: "trigger" | "agent" | "social" | "automation";
  label: string;
  subtitle: string;
  x: number;
  y: number;
  executor: "n8n" | "claw" | "social_api" | "agent";
  config: Record<string, unknown>;
};

type WorkflowEdge = {
  from: string;
  to: string;
};

type WorkflowDefinition = {
  version: string;
  entryNodeId: string;
  nodes: Array<{
    id: string;
    label: string;
    executor: "n8n" | "claw" | "social_api" | "agent";
    config: Record<string, unknown>;
  }>;
  edges: WorkflowEdge[];
};

type PaletteItem = {
  id: string;
  group: "Triggers" | "Agents" | "Social Channels" | "Automation & Apps";
  platform?: "LinkedIn" | "Instagram" | "TikTok" | "YouTube" | "Facebook";
  label: string;
  subtitle: string;
  icon: LucideIcon;
  type: WorkflowNode["type"];
  executor: WorkflowNode["executor"];
  config: Record<string, unknown>;
};

const paletteItems: PaletteItem[] = [
  {
    id: "trigger-linkedin",
    group: "Triggers",
    label: "LinkedIn Mention",
    subtitle: "Live feed trigger",
    icon: Linkedin,
    type: "trigger",
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/linkedin-mention" },
  },
  {
    id: "trigger-cron",
    group: "Triggers",
    label: "Schedule / Cron",
    subtitle: "Time-based trigger",
    icon: Timer,
    type: "trigger",
    executor: "n8n",
    config: { cron: "0 9 * * *" },
  },
  {
    id: "trigger-webhook",
    group: "Triggers",
    label: "Webhook URL",
    subtitle: "External event trigger",
    icon: Webhook,
    type: "trigger",
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/external-event" },
  },
  {
    id: "trigger-instagram-comment",
    group: "Triggers",
    label: "Instagram Comment",
    subtitle: "Comment event trigger",
    icon: Instagram,
    type: "trigger",
    executor: "social_api",
    config: { event: "instagram.comment.created" },
  },
  {
    id: "trigger-youtube-comment",
    group: "Triggers",
    label: "YouTube Comment",
    subtitle: "Comment event trigger",
    icon: Youtube,
    type: "trigger",
    executor: "social_api",
    config: { event: "youtube.comment.created" },
  },
  {
    id: "trigger-tiktok-comment",
    group: "Triggers",
    label: "TikTok Comment",
    subtitle: "Comment event trigger",
    icon: Video,
    type: "trigger",
    executor: "social_api",
    config: { event: "tiktok.comment.created" },
  },
  {
    id: "agent-analyst",
    group: "Agents",
    label: "Content Analyst",
    subtitle: "Reasoning + strategy",
    icon: Bot,
    type: "agent",
    executor: "claw",
    config: {
      instructions:
        "Analiza contexto, genera caption y CTA orientado a conversion.",
    },
  },
  {
    id: "agent-planner",
    group: "Agents",
    label: "Strategy Planner",
    subtitle: "Campaign planning",
    icon: Sparkles,
    type: "agent",
    executor: "claw",
    config: {
      instructions: "Define estrategia de contenidos para 7 dias por canal.",
    },
  },
  {
    id: "agent-copywriter",
    group: "Agents",
    label: "Copywriter",
    subtitle: "Conversion messaging",
    icon: MessageSquare,
    type: "agent",
    executor: "claw",
    config: {
      instructions:
        "Crea copies claros, directos y orientados a conversion por canal.",
    },
  },
  {
    id: "agent-qa",
    group: "Agents",
    label: "QA Agent",
    subtitle: "Validation + checks",
    icon: Activity,
    type: "agent",
    executor: "claw",
    config: {
      instructions:
        "Verifica consistencia, formato, compliance y calidad antes de publicar.",
    },
  },
  {
    id: "social-instagram",
    group: "Social Channels",
    platform: "Instagram",
    label: "Instagram: Create Post",
    subtitle: "Publish media post",
    icon: Instagram,
    type: "social",
    executor: "social_api",
    config: { account: "@agent_workflow_main", caption: "{{agent_output}}" },
  },
  {
    id: "social-youtube",
    group: "Social Channels",
    platform: "YouTube",
    label: "YouTube: Upload Video",
    subtitle: "Video publishing",
    icon: Youtube,
    type: "social",
    executor: "social_api",
    config: { channel: "main", title: "{{video_title}}" },
  },
  {
    id: "social-tiktok",
    group: "Social Channels",
    platform: "TikTok",
    label: "TikTok: Read Comments",
    subtitle: "Engagement monitoring",
    icon: Video,
    type: "social",
    executor: "social_api",
    config: { mode: "comments" },
  },
  {
    id: "social-linkedin-analytics",
    group: "Social Channels",
    platform: "LinkedIn",
    label: "LinkedIn: Get Analytics",
    subtitle: "Performance insights",
    icon: Linkedin,
    type: "social",
    executor: "social_api",
    config: { report: "weekly" },
  },
  {
    id: "social-linkedin-post",
    group: "Social Channels",
    platform: "LinkedIn",
    label: "LinkedIn: Create Post",
    subtitle: "Professional publishing",
    icon: Linkedin,
    type: "social",
    executor: "social_api",
    config: { account: "@agent_workflow_main", caption: "{{agent_output}}" },
  },
  {
    id: "social-facebook-post",
    group: "Social Channels",
    platform: "Facebook",
    label: "Facebook: Create Post",
    subtitle: "Community publishing",
    icon: Facebook,
    type: "social",
    executor: "social_api",
    config: { page: "main-page", caption: "{{agent_output}}" },
  },
  {
    id: "automation-n8n",
    group: "Automation & Apps",
    label: "n8n: Sync to CRM",
    subtitle: "External automation",
    icon: Workflow,
    type: "automation",
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/sync-crm" },
  },
  {
    id: "automation-capcut",
    group: "Automation & Apps",
    label: "CapCut Render",
    subtitle: "Video generation pipeline",
    icon: ImagePlus,
    type: "automation",
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/capcut-render" },
  },
  {
    id: "automation-slack",
    group: "Automation & Apps",
    label: "Slack: Notify Team",
    subtitle: "Ops notification",
    icon: MessageSquare,
    type: "automation",
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/slack-notify" },
  },
  {
    id: "automation-notion",
    group: "Automation & Apps",
    label: "Notion: Update DB",
    subtitle: "Knowledge sync",
    icon: Globe,
    type: "automation",
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/notion-sync" },
  },
];

const paletteSections: Array<{
  title: PaletteItem["group"];
  items: PaletteItem[];
}> = [
  {
    title: "Triggers",
    items: paletteItems.filter((item) => item.group === "Triggers"),
  },
  {
    title: "Agents",
    items: paletteItems.filter((item) => item.group === "Agents"),
  },
  {
    title: "Social Channels",
    items: paletteItems.filter((item) => item.group === "Social Channels"),
  },
  {
    title: "Automation & Apps",
    items: paletteItems.filter((item) => item.group === "Automation & Apps"),
  },
];

const sectionMeta: Record<
  PaletteItem["group"],
  { icon: LucideIcon; hint: string; tone: string }
> = {
  Triggers: {
    icon: Sparkles,
    hint: "Starts the workflow with an event",
    tone: "text-violet-300",
  },
  Agents: {
    icon: Bot,
    hint: "Thinks, plans and generates output",
    tone: "text-cyan-300",
  },
  "Social Channels": {
    icon: Share2,
    hint: "Publishes and reads social data",
    tone: "text-pink-300",
  },
  "Automation & Apps": {
    icon: Puzzle,
    hint: "Connects external platforms",
    tone: "text-amber-300",
  },
};

const socialPlatformOrder: Array<
  NonNullable<PaletteItem["platform"]>
> = ["LinkedIn", "Instagram", "TikTok", "YouTube", "Facebook"];

const socialPlatformMeta: Record<
  NonNullable<PaletteItem["platform"]>,
  { icon: LucideIcon; tone: string }
> = {
  LinkedIn: { icon: Linkedin, tone: "text-sky-400" },
  Instagram: { icon: Instagram, tone: "text-fuchsia-400" },
  TikTok: { icon: Video, tone: "text-cyan-300" },
  YouTube: { icon: Youtube, tone: "text-red-400" },
  Facebook: { icon: Facebook, tone: "text-blue-400" },
};

const initialCanvasNodes: WorkflowNode[] = [
  {
    id: "trigger-linkedin",
    type: "trigger",
    label: "New Mention",
    subtitle: "LinkedIn Feed",
    x: 56,
    y: 64,
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/linkedin-mention" },
  },
  {
    id: "agent-content",
    type: "agent",
    label: "AI Content Analyst",
    subtitle: "GPT-4o (Reasoning)",
    x: 360,
    y: 210,
    executor: "claw",
    config: {
      instructions:
        "Analiza el mention, genera caption y CTA orientado a conversion.",
    },
  },
  {
    id: "n8n-sync",
    type: "automation",
    label: "n8n: Sync to CRM",
    subtitle: "Salesforce Pro",
    x: 680,
    y: 280,
    executor: "n8n",
    config: { webhookPathOrUrl: "/webhook/sync-crm" },
  },
  {
    id: "social-ig",
    type: "social",
    label: "Post to Instagram",
    subtitle: "Account @agent_workflow_main",
    x: 680,
    y: 72,
    executor: "social_api",
    config: {
      account: "@agent_workflow_main",
      caption: "{{agent_output}}",
      autoHashtag: true,
      approvalRequired: false,
    },
  },
];

const initialCanvasEdges: WorkflowEdge[] = [
  { from: "trigger-linkedin", to: "agent-content" },
  { from: "agent-content", to: "n8n-sync" },
  { from: "agent-content", to: "social-ig" },
];

function nodeIconForType(type: WorkflowNode["type"]) {
  if (type === "trigger") return Webhook;
  if (type === "agent") return Bot;
  if (type === "social") return AtSign;
  return Workflow;
}

export function WorkflowsPageContent({
  embeddedInPanel = false,
}: {
  embeddedInPanel?: boolean;
} = {}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState("social-ig");
  const [activeTab, setActiveTab] = useState<
    "editor" | "templates" | "logs" | "settings"
  >("editor");
  const [nodeSettingsTab, setNodeSettingsTab] = useState<
    "config" | "mapping" | "validation"
  >("config");
  const [deploying, setDeploying] = useState(false);
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialCanvasNodes);
  const [edges] = useState<WorkflowEdge[]>(initialCanvasEdges);
  const [draggingItem, setDraggingItem] = useState<PaletteItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"idle" | "ok" | "error">("idle");

  const selectedNode =
    nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return paletteSections;
    return paletteSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          `${item.label} ${item.subtitle}`.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  async function createWorkflow(payload: {
    nombre: string;
    descripcion: string;
    categoria: "general" | "marketing" | "sales" | "support" | "devops";
    isTemplate: boolean;
    definition: WorkflowDefinition;
  }) {
    const response = await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        estado: "draft",
        createdBy: "ui-workflows",
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      workflow?: { id: string; nombre: string };
    };

    if (!response.ok || !data.workflow) {
      throw new Error(data.error ?? "No se pudo crear el workflow.");
    }

    return data.workflow;
  }

  async function handleDeployAgent() {
    try {
      setDeploying(true);
      setStatusType("idle");
      setStatusMessage("");

      const definition: WorkflowDefinition = {
        version: "1.0",
        entryNodeId: nodes[0]?.id ?? "start",
        nodes: nodes.map((node) => ({
          id: node.id,
          label: node.label,
          executor: node.executor,
          config: node.config,
        })),
        edges,
      };

      const created = await createWorkflow({
        nombre: "Social Automation Pipeline",
        descripcion:
          "Workflow visual con nodos de trigger, analisis, n8n y publicacion social.",
        categoria: "marketing",
        isTemplate: true,
        definition,
      });

      setStatusType("ok");
      setStatusMessage(`Workflow desplegado. ID: ${created.id}`);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "No se pudo desplegar el workflow.",
      );
    } finally {
      setDeploying(false);
    }
  }

  function handlePaletteDragStart(item: PaletteItem) {
    setDraggingItem(item);
  }

  function handleCanvasDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleCanvasDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!draggingItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const nextNode: WorkflowNode = {
      id: `${draggingItem.id}-${Date.now()}`,
      type: draggingItem.type,
      label: draggingItem.label,
      subtitle: draggingItem.subtitle,
      x: Math.max(16, event.clientX - rect.left - 120),
      y: Math.max(16, event.clientY - rect.top - 32),
      executor: draggingItem.executor,
      config: { ...draggingItem.config },
    };

    setNodes((prev) => [...prev, nextNode]);
    setSelectedNodeId(nextNode.id);
    setDraggingItem(null);
  }

  function edgePath(edge: WorkflowEdge) {
    const source = nodes.find((node) => node.id === edge.from);
    const target = nodes.find((node) => node.id === edge.to);
    if (!source || !target) return null;

    const sx = source.x + 250;
    const sy = source.y + 50;
    const tx = target.x;
    const ty = target.y + 50;
    const c1x = sx + 100;
    const c2x = tx - 100;

    return `M ${sx} ${sy} C ${c1x} ${sy}, ${c2x} ${ty}, ${tx} ${ty}`;
  }

  return (
    <main
      className={`${embeddedInPanel ? "h-[calc(100vh-4rem)]" : "h-screen"} overflow-hidden bg-[#0b1022] text-slate-100 ${inter.className}`}
    >
      {!embeddedInPanel && (
        <header className="flex h-16 items-center justify-between border-b border-[#2a3556] bg-[#0f152a] px-4 md:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-orange-300">
            <GitBranch className="h-5 w-5" />
            <h1 className="text-base font-semibold">AI Agent Workflow Builder</h1>
          </div>
          <nav className="hidden items-center gap-5 md:flex">
            {(["editor", "templates", "logs", "settings"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 pb-1 text-sm font-medium transition ${
                    activeTab === tab
                      ? "border-orange-500 text-orange-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60 text-slate-200">
            <span className="text-xs">🧑</span>
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
          >
            Volver
          </Link>
          <button
            onClick={handleDeployAgent}
            disabled={deploying}
            className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-1">
              <Rocket className="h-3.5 w-3.5" />
              {deploying ? "Desplegando..." : "Deploy Agent"}
            </span>
          </button>
        </div>
        </header>
      )}

      <section className={`flex ${embeddedInPanel ? "h-full" : "h-[calc(100vh-64px)]"}`}>
        <aside className="hidden w-72 flex-col border-r border-[#2a3556] bg-[#0d1327] lg:flex">
          <div className="p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Search components..."
              />
            </label>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <div className="mb-2 px-1">
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {(() => {
                      const MetaIcon = sectionMeta[section.title].icon;
                      return (
                        <>
                          <MetaIcon
                            className={`h-3.5 w-3.5 ${sectionMeta[section.title].tone}`}
                          />
                          {section.title}
                        </>
                      );
                    })()}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {sectionMeta[section.title].hint}
                  </p>
                </div>
                {section.title === "Social Channels" ? (
                  <div className="space-y-2">
                    {socialPlatformOrder.map((platform) => {
                      const platformItems = section.items.filter(
                        (item) => item.platform === platform,
                      );
                      if (platformItems.length === 0) return null;

                      const PlatformIcon = socialPlatformMeta[platform].icon;
                      return (
                        <details
                          key={platform}
                          open
                          className="rounded-lg border border-[#2a3556] bg-[#101936]"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200">
                            <span className="inline-flex items-center gap-2">
                              <PlatformIcon
                                className={`h-4 w-4 ${socialPlatformMeta[platform].tone}`}
                              />
                              {platform}
                            </span>
                            <span className="rounded-md bg-[#0b1022] px-1.5 py-0.5 text-[10px] text-slate-400">
                              {platformItems.length}
                            </span>
                          </summary>
                          <div className="space-y-1 px-2 pb-2">
                            {platformItems.map((item) => (
                              <button
                                key={item.id}
                                draggable
                                onDragStart={() => handlePaletteDragStart(item)}
                                className="w-full rounded-lg border border-transparent bg-transparent px-2.5 py-2 text-left text-sm text-slate-300 transition hover:border-orange-500/40 hover:bg-orange-500/10"
                              >
                                <span className="inline-flex items-center gap-2.5">
                                  <item.icon
                                    className={`h-4 w-4 ${
                                      item.platform
                                        ? socialPlatformMeta[item.platform].tone
                                        : "text-pink-300"
                                    }`}
                                  />
                                  <span>
                                    <span className="block leading-tight">
                                      {item.label}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                      {item.subtitle}
                                    </span>
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        draggable
                        onDragStart={() => handlePaletteDragStart(item)}
                        className="w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-left text-sm text-slate-300 transition hover:border-orange-500/40 hover:bg-orange-500/10"
                      >
                        <span className="inline-flex items-center gap-2.5">
                          <item.icon
                            className={`h-4 w-4 ${
                              item.group === "Triggers"
                                ? "text-violet-300"
                                : item.group === "Agents"
                                  ? "text-cyan-300"
                                  : "text-amber-300"
                            }`}
                          />
                          <span>
                            <span className="block leading-tight">{item.label}</span>
                            <span className="text-[11px] text-slate-500">
                              {item.subtitle}
                            </span>
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a3556] p-4">
            <div className="rounded-lg bg-orange-500/10 p-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-orange-300">
                Usage Limit
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                <div className="h-1.5 w-[65%] rounded-full bg-orange-500" />
              </div>
              <p className="mt-2 text-xs text-slate-400">650 / 1000 tasks used</p>
            </div>
          </div>
        </aside>

        <section
          ref={canvasRef}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className="relative flex-1 overflow-hidden bg-[#090f20]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(45,63,114,0.7)_1px,transparent_1px)] [background-size:28px_28px]" />
          <svg
            className="absolute inset-0 z-[1] h-full w-full"
            viewBox="0 0 1200 760"
            fill="none"
          >
            {edges.map((edge) => {
              const d = edgePath(edge);
              if (!d) return null;
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={d}
                  stroke="#fb923c"
                  strokeDasharray="6 6"
                  strokeWidth="2"
                  fill="none"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const Icon = nodeIconForType(node.type);
            return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`absolute z-[2] w-[250px] rounded-xl border p-4 text-left shadow-2xl transition ${
                selectedNodeId === node.id
                  ? "border-orange-500 bg-[#231b17] ring-2 ring-orange-500/25"
                  : "border-[#2a3556] bg-[#141e39]"
              }`}
              style={{ left: node.x, top: node.y }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-orange-500/20 p-1.5">
                  <Icon className="h-3.5 w-3.5 text-orange-300" />
                </span>
                <p className="text-sm font-semibold">{node.label}</p>
              </div>
              <p className="rounded-md border border-[#2a3556] bg-[#0e162d] px-2 py-1 text-xs text-slate-300">
                {node.subtitle}
              </p>
              <span className="absolute -left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#0b1022] bg-slate-500" />
              <span className="absolute -right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#0b1022] bg-orange-500" />
            </button>
            );
          })}

          <div className="absolute bottom-5 right-5 z-[2] flex flex-col gap-2">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a3556] bg-[#0f152a]/85 text-lg text-slate-200 transition hover:bg-[#1a2445]">
              <Plus className="h-4 w-4" />
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a3556] bg-[#0f152a]/85 text-lg text-slate-200 transition hover:bg-[#1a2445]">
              <span className="text-sm">−</span>
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a3556] bg-[#0f152a]/85 text-xs text-slate-200 transition hover:bg-[#1a2445]">
              <Cog className="h-4 w-4" />
            </button>
          </div>
        </section>

        <aside className="hidden w-80 flex-col border-l border-[#2a3556] bg-[#0d1327] xl:flex">
          <div className="border-b border-[#2a3556] px-5 py-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4 text-slate-300" />
              Node Settings
            </p>
            <p className="text-xs text-slate-400">{selectedNode.label}</p>
            <div className="mt-3 inline-flex rounded-lg border border-[#2a3556] bg-[#111a33] p-1 text-xs">
              {(["config", "mapping", "validation"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setNodeSettingsTab(tab)}
                  className={`rounded-md px-2.5 py-1 transition ${
                    nodeSettingsTab === tab
                      ? "bg-orange-500 text-slate-950"
                      : "text-slate-300 hover:bg-[#1a2445]"
                  }`}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {nodeSettingsTab === "config" && (
              <>
                {selectedNode.type === "social" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Account
                      </p>
                      <select className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20">
                        <option>@agent_workflow_main</option>
                        <option>@creative_studio_llc</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Caption
                      </p>
                      <textarea
                        className="min-h-[130px] w-full resize-none rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                        defaultValue={
                          "{{agent_output}}\n\n#AI #Workflows #Automation #Tech"
                        }
                      />
                      <button className="text-xs text-cyan-300 hover:text-cyan-200">
                        Insert Variable
                      </button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Media Upload
                      </p>
                      <div className="rounded-xl border border-dashed border-[#2a3556] bg-[#111a33] px-4 py-8 text-center text-xs text-slate-400">
                        <CloudUpload className="mx-auto mb-2 h-6 w-6 text-slate-500" />
                        Click or drag media file
                        <br />
                        JPG, PNG, MP4 up to 50MB
                      </div>
                    </div>

                    <div className="space-y-3 rounded-lg border border-[#2a3556] bg-[#111a33] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-200">Auto-hashtag</span>
                        <div className="h-5 w-10 rounded-full bg-orange-500 p-0.5">
                          <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-200">Approval Required</span>
                        <div className="h-5 w-10 rounded-full bg-slate-700 p-0.5">
                          <div className="h-4 w-4 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedNode.type === "agent" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Model
                      </p>
                      <select className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20">
                        <option>GPT-4o</option>
                        <option>GPT-4o mini</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Instructions
                      </p>
                      <textarea
                        className="min-h-[180px] w-full resize-none rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                        defaultValue="Analyze input context and return a concise output for the next node."
                      />
                    </div>
                  </>
                )}

                {selectedNode.type === "trigger" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Trigger Source
                      </p>
                      <input
                        className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                        defaultValue="/webhook/external-event"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Retry policy
                      </p>
                      <select className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20">
                        <option>3 retries / exponential backoff</option>
                        <option>1 retry / fixed delay</option>
                        <option>No retry</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedNode.type === "automation" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Platform
                      </p>
                      <select className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20">
                        <option>n8n</option>
                        <option>Make</option>
                        <option>Zapier</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Endpoint
                      </p>
                      <input
                        className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                        defaultValue="/webhook/sync-crm"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {nodeSettingsTab === "mapping" && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Input/Output Mapping
                </p>
                <textarea
                  className="min-h-[220px] w-full resize-none rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 font-mono text-xs outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  defaultValue={`{\n  "input": "{{previous_node.output}}",\n  "output": "{{current_node.result}}"\n}`}
                />
                <button className="text-xs text-cyan-300 hover:text-cyan-200">
                  Validate mapping schema
                </button>
              </div>
            )}

            {nodeSettingsTab === "validation" && (
              <div className="space-y-3 rounded-lg border border-[#2a3556] bg-[#111a33] p-3 text-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Node health
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Configured</span>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Auth required</span>
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-200">
                    Check account
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Last test</span>
                  <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                    Not run
                  </span>
                </div>
              </div>
            )}

            {statusType !== "idle" && statusMessage && (
              <div
                className={`rounded-lg border px-3 py-2 text-xs ${
                  statusType === "ok"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>

          <div className="border-t border-[#2a3556] p-5">
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-[#1b2747]">
                Test Node
              </button>
              <button className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">
                Save Changes
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function WorkflowsPage() {
  return <WorkflowsPageContent />;
}
