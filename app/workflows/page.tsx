"use client";

import Link from "next/link";
import { useState } from "react";

type WorkflowNode = {
  id: string;
  type: "trigger" | "agent" | "social" | "automation";
  label: string;
  subtitle: string;
  x: number;
  y: number;
  executor: "n8n" | "claw" | "social_api";
  config: Record<string, unknown>;
};

type WorkflowDefinition = {
  version: string;
  entryNodeId: string;
  nodes: Array<{
    id: string;
    label: string;
    executor: "n8n" | "claw" | "social_api";
    config: Record<string, unknown>;
  }>;
  edges: Array<{ from: string; to: string }>;
};

const paletteSections = [
  {
    title: "Triggers",
    items: ["LinkedIn Mention", "Cron Schedule", "Webhook URL"],
  },
  {
    title: "Agents",
    items: ["Content Analyst", "Strategy Planner"],
  },
  {
    title: "Social Media",
    items: [
      "Post to Instagram",
      "Upload YouTube Video",
      "Read TikTok Comments",
      "Get LinkedIn Analytics",
      "Post to Facebook",
    ],
  },
  {
    title: "Automation",
    items: ["n8n: Sync to CRM", "n8n: Publish Scheduler", "CapCut Render"],
  },
];

const canvasNodes: WorkflowNode[] = [
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

const canvasEdges = [
  { from: "trigger-linkedin", to: "agent-content" },
  { from: "agent-content", to: "n8n-sync" },
  { from: "agent-content", to: "social-ig" },
];

export default function WorkflowsPage() {
  const [selectedNodeId, setSelectedNodeId] = useState("social-ig");
  const [activeTab, setActiveTab] = useState<
    "editor" | "templates" | "logs" | "settings"
  >("editor");
  const [deploying, setDeploying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"idle" | "ok" | "error">("idle");

  const selectedNode =
    canvasNodes.find((node) => node.id === selectedNodeId) ?? canvasNodes[0];

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
        entryNodeId: "trigger-linkedin",
        nodes: canvasNodes.map((node) => ({
          id: node.id,
          label: node.label,
          executor: node.executor,
          config: node.config,
        })),
        edges: canvasEdges,
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

  return (
    <main className="h-screen overflow-hidden bg-[#0b1022] text-slate-100">
      <header className="flex h-16 items-center justify-between border-b border-[#2a3556] bg-[#0f152a] px-4 md:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-blue-400">
            <span className="text-xl font-black">✦</span>
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
                      ? "border-blue-500 text-blue-400"
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
          <Link
            href="/"
            className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
          >
            Volver
          </Link>
          <button
            onClick={handleDeployAgent}
            disabled={deploying}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deploying ? "Desplegando..." : "Deploy Agent"}
          </button>
        </div>
      </header>

      <section className="flex h-[calc(100vh-64px)]">
        <aside className="hidden w-72 flex-col border-r border-[#2a3556] bg-[#0d1327] lg:flex">
          <div className="p-4">
            <input
              className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
              placeholder="Search components..."
            />
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
            {paletteSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className="w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-left text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a3556] p-4">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-blue-300">
                Usage Limit
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                <div className="h-1.5 w-[65%] rounded-full bg-blue-500" />
              </div>
              <p className="mt-2 text-xs text-slate-400">650 / 1000 tasks used</p>
            </div>
          </div>
        </aside>

        <section className="relative flex-1 overflow-hidden bg-[#090f20]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(45,63,114,0.7)_1px,transparent_1px)] [background-size:28px_28px]" />
          <svg
            className="absolute inset-0 z-[1] h-full w-full"
            viewBox="0 0 1200 760"
            fill="none"
          >
            <path
              d="M 190 160 C 300 160, 300 300, 420 300"
              stroke="#2f62ff"
              strokeDasharray="6 6"
              strokeWidth="2"
            />
            <path
              d="M 630 300 C 760 300, 770 360, 860 360"
              stroke="#2f62ff"
              strokeDasharray="6 6"
              strokeWidth="2"
            />
            <path
              d="M 630 300 C 760 300, 760 170, 860 170"
              stroke="#2f62ff"
              strokeDasharray="6 6"
              strokeWidth="2"
            />
          </svg>

          {canvasNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`absolute z-[2] w-[250px] rounded-xl border p-4 text-left shadow-2xl transition ${
                selectedNodeId === node.id
                  ? "border-blue-500 bg-[#1a2445] ring-2 ring-blue-500/30"
                  : "border-[#2a3556] bg-[#141e39]"
              }`}
              style={{ left: node.x, top: node.y }}
            >
              <p className="text-sm font-semibold">{node.label}</p>
              <p className="mt-2 rounded-md border border-[#2a3556] bg-[#0e162d] px-2 py-1 text-xs text-slate-300">
                {node.subtitle}
              </p>
            </button>
          ))}

          <div className="absolute bottom-5 right-5 z-[2] flex flex-col gap-2">
            <button className="h-10 w-10 rounded-full border border-[#2a3556] bg-[#0f152a]/85 text-lg text-slate-200 transition hover:bg-[#1a2445]">
              +
            </button>
            <button className="h-10 w-10 rounded-full border border-[#2a3556] bg-[#0f152a]/85 text-lg text-slate-200 transition hover:bg-[#1a2445]">
              -
            </button>
            <button className="h-10 w-10 rounded-full border border-[#2a3556] bg-[#0f152a]/85 text-xs text-slate-200 transition hover:bg-[#1a2445]">
              Fit
            </button>
          </div>
        </section>

        <aside className="hidden w-80 flex-col border-l border-[#2a3556] bg-[#0d1327] xl:flex">
          <div className="border-b border-[#2a3556] px-5 py-4">
            <p className="text-sm font-semibold">Node Settings</p>
            <p className="text-xs text-slate-400">{selectedNode.label}</p>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Account
              </p>
              <select className="w-full rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-blue-500">
                <option>@agent_workflow_main</option>
                <option>@creative_studio_llc</option>
              </select>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Caption
              </p>
              <textarea
                className="min-h-[130px] w-full resize-none rounded-lg border border-[#2a3556] bg-[#111a33] px-3 py-2 text-sm outline-none focus:border-blue-500"
                defaultValue={"{{agent_output}}\n\n#AI #Workflows #Automation #Tech"}
              />
              <button className="text-xs text-blue-400 hover:text-blue-300">
                Insert Variable
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Media Upload
              </p>
              <div className="rounded-xl border border-dashed border-[#2a3556] bg-[#111a33] px-4 py-8 text-center text-xs text-slate-400">
                Click or drag media file
                <br />
                JPG, PNG, MP4 up to 50MB
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[#2a3556] bg-[#111a33] p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">Auto-hashtag</span>
                <div className="h-5 w-10 rounded-full bg-blue-600 p-0.5">
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
              <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                Save Changes
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
