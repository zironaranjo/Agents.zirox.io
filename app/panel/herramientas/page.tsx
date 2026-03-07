import Image from "next/image";
import {
  Bell,
  Bot,
  Code2,
  Copy,
  Database,
  EllipsisVertical,
  Puzzle,
  KeyRound,
  Mail,
  MemoryStick,
  Plus,
  Search,
  Server,
  Settings,
  TerminalSquare,
  Trash2,
  Webhook,
} from "lucide-react";

const apiConnections = [
  {
    name: "OpenAI",
    key: "sk-proj-••••••••••••••••",
    connected: true,
    iconBg: "bg-black",
    icon: <Bot className="h-5 w-5 text-white" />,
  },
  {
    name: "Anthropic",
    key: "ant-api-••••••••••••••••",
    connected: true,
    iconBg: "bg-orange-100",
    icon: <KeyRound className="h-5 w-5 text-amber-700" />,
  },
  {
    name: "Google Cloud",
    key: "No API key configured",
    connected: false,
    iconBg: "bg-slate-700",
    icon: <Server className="h-5 w-5 text-slate-300" />,
  },
] as const;

const tools = [
  {
    name: "Web Search",
    desc: "Performs live searches across Google and Bing for real-time info.",
    icon: <Search className="h-5 w-5" />,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    name: "Calculator",
    desc: "Advanced mathematical computation for precise values.",
    icon: <Puzzle className="h-5 w-5" />,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    name: "Python Interpreter",
    desc: "Execute secure code snippets for data analysis.",
    icon: <Code2 className="h-5 w-5" />,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    name: "Gmail Automator",
    desc: "Draft, read, and organize emails directly through the agent.",
    icon: <Mail className="h-5 w-5" />,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
] as const;

const logRows = [
  {
    time: "2023-10-27 14:20:12",
    source: "OpenAI",
    status: "success",
    message: "Generated response for agent 'CustomerSupport-01'",
  },
  {
    time: "2023-10-27 14:18:45",
    source: "PostgreSQL",
    status: "success",
    message: "Executed analytical query on 'sales_data'",
  },
  {
    time: "2023-10-27 14:15:30",
    source: "Anthropic",
    status: "error",
    message: "401: Unauthorized - Invalid API Key configuration",
  },
  {
    time: "2023-10-27 14:12:05",
    source: "Web Search",
    status: "pending",
    message: "Retrieving search results for 'latest AI trends 2024'...",
  },
] as const;

function StatusBadge({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-500">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Connected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-500">
      Disconnected
    </span>
  );
}

export default function PanelToolsPage() {
  return (
    <section className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0f1723]">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-white dark:bg-[#0f1723] lg:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0062ff] text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Nexus AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Enterprise</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <TerminalSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">Agents</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg bg-[#0062ff]/10 px-3 py-2 text-[#0062ff]">
            <Puzzle className="h-4 w-4" />
            <span className="text-sm font-medium">Tools &amp; Integrations</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <MemoryStick className="h-4 w-4" />
            <span className="text-sm font-medium">Models</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button className="mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="w-full rounded-lg bg-[#0062ff] py-2 text-sm font-bold text-white transition-colors hover:bg-[#0057e6]">
            New Agent
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-white px-4 dark:bg-[#0f1723]/80 md:px-8">
          <h2 className="text-lg font-bold">Tools &amp; Integrations</h2>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0062ff] dark:bg-slate-800"
                placeholder="Search components..."
              />
            </div>
            <button className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 md:flex">
              <TerminalSquare className="h-4 w-4" />
              <span>View Logs</span>
            </button>
            <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#0062ff]/20">
              <Image
                src="/Claw1.png"
                alt="User profile avatar"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-10 overflow-y-auto p-4 md:p-8">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">API Connections</h3>
                <p className="text-sm text-slate-500">
                  Manage your foundational AI model providers
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#0062ff]/10 px-4 py-2 text-sm font-bold text-[#0062ff] transition-colors hover:bg-[#0062ff]/20">
                <Plus className="h-4 w-4" />
                Add New API
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {apiConnections.map((api) => (
                <article
                  key={api.name}
                  className={`rounded-xl border border-slate-700 p-5 transition-all hover:border-[#0062ff]/50 ${
                    api.connected ? "bg-slate-800/50" : "bg-slate-800/40 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${api.iconBg}`}>
                      {api.icon}
                    </div>
                    <StatusBadge connected={api.connected} />
                  </div>
                  <h4 className={`mb-1 font-bold ${api.connected ? "" : "text-slate-400"}`}>
                    {api.name}
                  </h4>
                  <p
                    className={`mb-4 truncate text-xs font-mono ${
                      api.connected ? "text-slate-400" : "italic text-slate-500"
                    }`}
                  >
                    {api.key}
                  </p>
                  <div className="flex gap-2">
                    {api.connected ? (
                      <>
                        <button className="flex-1 rounded bg-slate-700 py-1.5 text-xs font-bold transition-colors hover:bg-slate-600">
                          Edit Key
                        </button>
                        <button className="rounded bg-slate-700 px-2 py-1.5 transition-colors hover:bg-slate-600">
                          <Settings className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <button className="flex-1 rounded bg-[#0062ff] py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#0057e6]">
                        Connect
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">MCP Servers</h3>
                <p className="text-sm text-slate-500">
                  Model Context Protocol connections for remote data access
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#0062ff]/10 px-4 py-2 text-sm font-bold text-[#0062ff] transition-colors hover:bg-[#0062ff]/20">
                <Server className="h-4 w-4" />
                Add Server
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700 bg-slate-800/80">
                  <tr>
                    <th className="px-6 py-3 font-bold">Server Name</th>
                    <th className="px-6 py-3 font-bold">Endpoint URL</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr>
                    <td className="flex items-center gap-3 px-6 py-4">
                      <Server className="h-4 w-4 text-[#0062ff]" />
                      <span className="font-medium">GitHub Repository Context</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      mcp://github-ctx.nexus.ai
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-green-500">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 transition-colors hover:text-white">
                        <EllipsisVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-center gap-3 px-6 py-4">
                      <Database className="h-4 w-4 text-[#0062ff]" />
                      <span className="font-medium">PostgreSQL Analytics</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      mcp://db-prod.internal.net:8080
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-green-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 transition-colors hover:text-white">
                        <EllipsisVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Tool Library</h3>
                <p className="text-sm text-slate-500">
                  Reusable functions and utilities for your agents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="mr-2 text-xs text-slate-500">Category:</span>
                <select className="rounded-lg border-none bg-slate-100 px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#0062ff] dark:bg-slate-800">
                  <option>All Tools</option>
                  <option>Computation</option>
                  <option>Data Processing</option>
                  <option>Search</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {tools.map((tool) => (
                <article
                  key={tool.name}
                  className="group cursor-pointer rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition-all hover:bg-slate-800/60"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tool.iconBg} ${tool.iconColor}`}
                  >
                    {tool.icon}
                  </div>
                  <h5 className="mb-1 text-sm font-bold">{tool.name}</h5>
                  <p className="mb-4 line-clamp-2 text-xs italic text-slate-500">{tool.desc}</p>
                  <button className="w-full rounded border border-slate-700 py-1.5 text-xs font-bold transition-all group-hover:border-[#0062ff] group-hover:bg-[#0062ff] group-hover:text-white">
                    Configure
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Webhooks</h3>
                <p className="text-sm text-slate-500">
                  Enable event-driven communication for your agents
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#0062ff]/10 px-4 py-2 text-sm font-bold text-[#0062ff] transition-colors hover:bg-[#0062ff]/20">
                <Webhook className="h-4 w-4" />
                Create Webhook
              </button>
            </div>

            <div className="space-y-4">
              <article className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <div className="min-w-[300px] flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-500">
                      Outgoing
                    </span>
                    <h4 className="font-bold">Salesforce Sync</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 truncate rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-400">
                      https://api.salesforce.com/hooks/v1/update-lead
                    </div>
                    <button className="text-slate-500 transition-colors hover:text-[#0062ff]">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex w-full items-center gap-8 sm:w-auto">
                  <div className="text-right">
                    <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Secret Key</p>
                    <p className="font-mono text-xs text-slate-300">••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-6 w-10 cursor-pointer rounded-full bg-[#0062ff]">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                    </div>
                    <button className="p-2 text-slate-400 transition-colors hover:text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>

              <article className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <div className="min-w-[300px] flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-500">
                      Incoming
                    </span>
                    <h4 className="font-bold">Slack Commands</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 truncate rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-400">
                      https://nexus.ai/webhooks/inbound/slack-329
                    </div>
                    <button className="text-slate-500 transition-colors hover:text-[#0062ff]">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex w-full items-center gap-8 sm:w-auto">
                  <div className="text-right">
                    <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Secret Key</p>
                    <p className="font-mono text-xs text-slate-300">••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-6 w-10 cursor-pointer rounded-full bg-slate-600">
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
                    </div>
                    <button className="p-2 text-slate-400 transition-colors hover:text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="pb-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Activity Logs</h3>
                <p className="text-sm text-slate-500">
                  Real-time execution history for tools and integrations
                </p>
              </div>
              <button className="text-xs font-bold text-[#0062ff] transition-all hover:underline">
                Clear All Logs
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1219] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/50 px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  nexus-terminal — bash
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-slate-800/50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Timestamp</th>
                      <th className="px-6 py-3 font-medium">Source</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {logRows.map((row) => (
                      <tr key={`${row.time}-${row.source}`} className="transition-colors hover:bg-white/5">
                        <td className="px-6 py-4 text-slate-400">{row.time}</td>
                        <td className="px-6 py-4 text-[#0062ff]">{row.source}</td>
                        <td className="px-6 py-4">
                          {row.status === "success" ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Success
                            </span>
                          ) : row.status === "error" ? (
                            <span className="inline-flex items-center gap-1.5 text-red-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                              Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-amber-400">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-6 py-4 ${
                            row.status === "error" ? "text-red-400/80" : "text-slate-300"
                          }`}
                        >
                          {row.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/30 px-6 py-3">
                <span className="text-[10px] text-slate-500">Showing 4 of 128 events</span>
                <div className="flex gap-4">
                  <button className="text-[10px] text-slate-400 transition-colors hover:text-white">
                    Previous
                  </button>
                  <button className="text-[10px] text-slate-400 transition-colors hover:text-white">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}
