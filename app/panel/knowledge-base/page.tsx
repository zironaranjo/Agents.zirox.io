import {
  ArrowUpDown,
  Bell,
  Bolt,
  Bot,
  Code2,
  Database,
  FileCode2,
  FileJson2,
  FileText,
  Filter,
  LayoutDashboard,
  MemoryStick,
  Plus,
  Search,
  Settings,
  Wrench,
} from "lucide-react";

const connectedSources = [
  {
    name: "Product Documentation",
    subtitle: "452 Files - PDF, Markdown",
    type: "Manual Upload",
    frequency: "v2.4",
    status: "Indexed",
    statusClass: "bg-emerald-500/10 text-emerald-500",
    iconClass: "bg-blue-500/10 text-blue-500",
    icon: FileText,
  },
  {
    name: "Customer Support Wiki",
    subtitle: "Notion workspace connection",
    type: "Integration",
    frequency: "Real-time",
    status: "Syncing",
    statusClass: "bg-amber-500/10 text-amber-500",
    iconClass: "bg-[#0062ff]/10 text-[#0062ff]",
    icon: Database,
  },
  {
    name: "Technical Specs",
    subtitle: "GitHub: nexus-ai/core-docs",
    type: "Webhook",
    frequency: "Daily Sync",
    status: "Active",
    statusClass: "bg-[#0062ff]/10 text-[#0062ff]",
    iconClass: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
    icon: Code2,
  },
] as const;

const recentDocs = [
  {
    name: "API_Authentication_v2.pdf",
    source: "Product Documentation",
    date: "Oct 24, 2023",
    tokens: "12,402",
    status: "Processed",
    statusClass: "bg-emerald-500/10 text-emerald-500",
    pulse: false,
    icon: FileText,
  },
  {
    name: "Enterprise_Onboarding_Guide",
    source: "Support Wiki",
    date: "Oct 24, 2023",
    tokens: "8,950",
    status: "Processing",
    statusClass: "bg-[#0062ff]/10 text-[#0062ff]",
    pulse: true,
    icon: FileText,
  },
  {
    name: "schema_definition.json",
    source: "Technical Specs",
    date: "Oct 23, 2023",
    tokens: "4,201",
    status: "Processed",
    statusClass: "bg-emerald-500/10 text-emerald-500",
    pulse: false,
    icon: FileJson2,
  },
  {
    name: "security_policy_2024.pdf",
    source: "Product Documentation",
    date: "Oct 22, 2023",
    tokens: "32,155",
    status: "Processed",
    statusClass: "bg-emerald-500/10 text-emerald-500",
    pulse: false,
    icon: FileCode2,
  },
] as const;

export default function PanelKnowledgeBasePage() {
  return (
    <section className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0f1723] text-slate-100">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0062ff] text-white">
            <Bolt className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Nexus AI</h1>
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">Agents</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Wrench className="h-4 w-4" />
            <span className="text-sm font-medium">Tools</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <MemoryStick className="h-4 w-4" />
            <span className="text-sm font-medium">Models</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg border-l-4 border-[#0062ff] bg-[#0062ff]/10 px-3 py-2 text-[#4f9dff]">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0062ff]/20 text-sm font-bold text-[#4f9dff]">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Jane Doe</span>
              <span className="text-xs text-slate-500">Enterprise Admin</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-8 backdrop-blur-md">
          <div className="flex max-w-xl flex-1 items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-[#0062ff]/50 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Search data points, sources, or documents..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#0062ff] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0062ff]/20 transition-all hover:bg-[#0057e6]">
              <Plus className="h-4 w-4" />
              New Data Source
            </button>
          </div>
        </header>

        <div className="space-y-8 overflow-y-auto p-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Knowledge Base</h2>
            <p className="mt-1 text-slate-400">
              Manage and sync organizational data to power your AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <span className="text-sm font-medium text-slate-400">Total Documents</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">1,284</span>
                <span className="text-xs font-bold text-emerald-500">+12 this week</span>
              </div>
            </article>
            <article className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <span className="text-sm font-medium text-slate-400">Total Tokens</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">42.5M</span>
                <span className="text-xs text-slate-400">Used in 14 agents</span>
              </div>
            </article>
            <article className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <span className="text-sm font-medium text-slate-400">Last Global Sync</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">12m ago</span>
                <span className="text-xs text-slate-400">All sources up to date</span>
              </div>
            </article>
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Connected Sources</h3>
              <button className="text-sm font-medium text-[#4f9dff] hover:underline">
                Manage Connections
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {connectedSources.map((source) => (
                <article
                  key={source.name}
                  className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-[#0062ff]/50"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${source.iconClass}`}>
                      <source.icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${source.statusClass} ${
                        source.status === "Syncing" ? "animate-pulse" : ""
                      }`}
                    >
                      {source.status}
                    </span>
                  </div>
                  <h4 className="font-bold transition-colors group-hover:text-[#4f9dff]">{source.name}</h4>
                  <p className="mt-1 text-xs text-slate-400">{source.subtitle}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{source.type}</span>
                    <span>{source.frequency}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent Documents</h3>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-800 p-1.5 hover:bg-slate-800">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="rounded-lg border border-slate-800 p-1.5 hover:bg-slate-800">
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4">Tokens</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentDocs.map((doc) => (
                    <tr key={doc.name} className="group transition-colors hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <doc.icon className="h-4 w-4 text-slate-400" />
                          <span className="truncate font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 italic text-slate-400">{doc.source}</td>
                      <td className="px-6 py-4 text-slate-400">{doc.date}</td>
                      <td className="px-6 py-4 text-slate-400">{doc.tokens}</td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${doc.statusClass}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              doc.status === "Processed" ? "bg-emerald-500" : "bg-[#0062ff]"
                            } ${doc.pulse ? "animate-pulse" : ""}`}
                          />
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between bg-slate-800/50 px-6 py-4 text-xs text-slate-500">
                <span>Showing 4 of 1,284 documents</span>
                <div className="flex gap-2">
                  <button
                    className="rounded border border-slate-800 bg-slate-900 px-3 py-1 opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button className="rounded border border-slate-800 bg-slate-900 px-3 py-1">
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
