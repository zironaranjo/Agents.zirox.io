import Image from "next/image";
import {
  Aperture,
  Bell,
  Bot,
  Database,
  Eye,
  FileText,
  Home,
  Leaf,
  MemoryStick,
  Mic,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Sparkles,
  TerminalSquare,
  Triangle,
  Wrench,
} from "lucide-react";

const providerFilters = ["All Providers", "OpenAI", "Anthropic", "Open Source"] as const;
const capabilityFilters = [
  { label: "Text", icon: FileText },
  { label: "Vision", icon: Eye },
  { label: "Audio", icon: Mic },
] as const;

const modelCards = [
  {
    name: "GPT-4o",
    vendor: "OpenAI",
    context: "128k Tokens",
    cost: "$5.00",
    enabled: true,
    accent: "border-l-emerald-500",
    icon: Sparkles,
    capabilities: ["TEXT", "VISION", "AUDIO"],
  },
  {
    name: "Claude 3.5 Sonnet",
    vendor: "Anthropic",
    context: "200k Tokens",
    cost: "$3.00",
    enabled: true,
    accent: "border-l-amber-500",
    icon: Triangle,
    capabilities: ["TEXT", "VISION"],
  },
  {
    name: "Llama 3.1 405B",
    vendor: "Meta / Open Source",
    context: "128k Tokens",
    cost: "$0.80",
    enabled: false,
    accent: "border-l-[#0062ff]",
    icon: Leaf,
    capabilities: ["TEXT", "CODE"],
  },
] as const;

export default function PanelModelsPage() {
  return (
    <section className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0f1723] text-slate-100">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0062ff] text-white">
              <Aperture className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Nexus AI</h1>
            <p className="text-xs text-slate-400">Enterprise Console</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Home className="h-4 w-4" />
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
          <button className="flex w-full items-center gap-3 rounded-lg bg-[#0062ff]/10 px-3 py-2 text-[#4f9dff]">
            <MemoryStick className="h-4 w-4" />
            <span className="text-sm font-medium">Models</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>
          <button className="mt-auto flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700">
              <Image
                src="/Claw1.png"
                alt="User avatar profile picture"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Alex Rivera</p>
              <p className="truncate text-xs text-slate-500">Pro Account</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0f1723]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-8 backdrop-blur-md">
          <h2 className="text-xl font-bold tracking-tight">Model Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-[#0062ff] dark:bg-slate-800 dark:text-slate-100"
                placeholder="Search models..."
              />
            </div>
            <button className="p-2 text-slate-500 transition-colors hover:text-[#4f9dff]">
              <Bell className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#0062ff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0057e6]">
              <Plus className="h-4 w-4" />
              Connect Provider
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto p-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Model Performance Matrix</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-[#0062ff]" /> High Quality
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low Latency
                </span>
              </div>
            </div>
            <div className="relative h-64 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="absolute inset-0 flex items-end justify-between px-10 pb-10">
                <div className="relative h-full w-px bg-slate-800">
                  <span className="absolute -left-8 top-0 origin-top-right -rotate-90 text-[10px] uppercase tracking-widest text-slate-500">
                    Quality Score
                  </span>
                </div>
                <div className="absolute bottom-10 left-10 right-10 h-px bg-slate-800">
                  <span className="absolute -bottom-6 right-0 text-[10px] uppercase tracking-widest text-slate-500">
                    Latency (ms)
                  </span>
                </div>
              </div>

              <div className="relative h-full w-full">
                <div className="absolute right-20 top-10 group">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-[#0062ff]" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    GPT-4o (98/120ms)
                  </span>
                </div>
                <div className="absolute right-48 top-24 group">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Claude 3.5 Sonnet (94/180ms)
                  </span>
                </div>
                <div className="absolute bottom-20 right-1/4 group">
                  <div className="h-3 w-3 rounded-full bg-slate-400" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Llama 3 70B (88/240ms)
                  </span>
                </div>
                <div className="absolute left-1/3 top-1/2 group">
                  <div className="h-3 w-3 rounded-full bg-indigo-500" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Mistral Large (91/310ms)
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            {providerFilters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  index === 0
                    ? "bg-[#0062ff] text-white"
                    : "border border-slate-800 bg-white text-slate-700 hover:border-[#0062ff] dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                {filter}
              </button>
            ))}
            <div className="mx-2 h-8 w-px bg-slate-800" />
            {capabilityFilters.map((filter) => (
              <button
                key={filter.label}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#0062ff] dark:bg-slate-900 dark:text-slate-100"
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>

          <section>
            <h3 className="mb-4 text-lg font-semibold">Available Models</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {modelCards.map((model) => (
                <article
                  key={model.name}
                  className={`rounded-xl border border-slate-800 border-l-4 ${model.accent} bg-white p-5 transition-all hover:shadow-lg dark:bg-slate-900`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        <model.icon className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-bold">{model.name}</h4>
                        <p className="text-xs text-slate-500">{model.vendor}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked={model.enabled} className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-[#0062ff] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Context</p>
                      <p className="text-sm font-semibold">{model.context}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Cost / 1M</p>
                      <p className="text-sm font-semibold text-[#0062ff]">{model.cost}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {model.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold dark:bg-slate-800"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Custom Model Endpoints</h3>
              <button className="inline-flex items-center gap-1 text-sm font-bold text-[#4f9dff] hover:underline">
                <Plus className="h-4 w-4" />
                Add Custom Endpoint
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-white dark:bg-slate-900">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3">Endpoint Name</th>
                    <th className="px-6 py-3">Base URL</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Latency</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TerminalSquare className="h-4 w-4 text-[#0062ff]" />
                        <span className="text-sm font-medium">Local-Llama-FineTune</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">http://192.168.1.45:8000/v1</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        ONLINE
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">42ms</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-[#0062ff]" />
                        <span className="text-sm font-medium">Corporate-Mistral-Proxy</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">https://ai-proxy.internal.co</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        STANDBY
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">--</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}
