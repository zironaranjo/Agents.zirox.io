import Image from "next/image";
import {
  Bell,
  CheckCircle2,
  Code2,
  Download,
  Plus,
  Search,
  Share2,
  Terminal,
  Trash2,
  WandSparkles,
  Wrench,
} from "lucide-react";
import { DEPARTMENT_TITLE_BY_SLUG, isDepartmentSlug } from "@/lib/departments";

const agents = [
  {
    name: "Pulse",
    status: "Analyzing",
    statusColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
    description: "Monitoring API latency...",
    image: "/Pulse.png",
    active: true,
  },
  {
    name: "Nova",
    status: "Planning",
    statusColor: "text-blue-400",
    dotColor: "bg-blue-500",
    description: "Drafting architecture...",
    image: "/Nova.png",
    active: false,
  },
  {
    name: "Claw",
    status: "Idle",
    statusColor: "text-slate-400",
    dotColor: "bg-slate-500",
    description: "Ready for tasking.",
    image: "/Claw.png",
    active: false,
  },
] as const;

const logs = [
  ["14:32:01", "INFO", "text-blue-500", "Nova", "text-purple-400", "Initiating cloud infrastructure analysis for us-east-1..."],
  ["14:32:15", "WARN", "text-orange-500", "Pulse", "text-blue-400", "Detected 15% latency spike in primary API gateway. Routing telemetry data to Nova."],
  ["14:33:04", "OK", "text-green-500", "System", "text-slate-400", "Token budget verification complete. Current utilization: 24%."],
  ["14:33:10", "DEBUG", "text-slate-500", "Claw", "text-orange-400", "Fetching security protocol schemas for VPC-992..."],
  ["14:34:22", "INFO", "text-blue-500", "Nova", "text-purple-400", "Proposed migration strategy generated: 14 non-critical services targeted for us-west-2."],
  ["14:34:45", "INFO", "text-blue-500", "Pulse", "text-blue-400", "Calculating cost-impact of temporary CPU spike during container migration."],
  ["14:35:12", "OK", "text-green-500", "Claw", "text-orange-400", "Security audit for migration plan initiated. All preliminary checks passed."],
] as const;

export default async function PanelBoardroomPage({
  searchParams,
}: {
  searchParams?: Promise<{ dept?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const deptSlug = typeof sp.dept === "string" ? sp.dept : undefined;
  const deptTitle =
    deptSlug && isDepartmentSlug(deptSlug) ? DEPARTMENT_TITLE_BY_SLUG[deptSlug] : null;

  return (
    <section className="flex h-[calc(100vh-4rem)] min-h-0 w-full flex-col overflow-hidden bg-[#0f1723] text-slate-100">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#0f1723] px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-[#0062ff]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0062ff] text-white">
              <WandSparkles className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Nexus AI</h2>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <button className="border-b-2 border-[#0062ff] pb-1 text-sm font-semibold text-[#4f9dff]">Boardroom</button>
            <button className="text-sm font-medium text-slate-400 transition-colors hover:text-[#4f9dff]">Projects</button>
            <button className="text-sm font-medium text-slate-400 transition-colors hover:text-[#4f9dff]">Resources</button>
            <button className="text-sm font-medium text-slate-400 transition-colors hover:text-[#4f9dff]">Settings</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-64 rounded-lg border-none bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-[#0062ff]"
              placeholder="Search strategy sessions..."
            />
          </div>
          <button className="rounded-lg bg-slate-800 p-2 text-slate-400">
            <Bell className="h-5 w-5" />
          </button>
          <div className="mx-1 h-8 w-px bg-slate-800" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold">Admin Ops</p>
              <p className="text-[10px] text-slate-500">Tier: Enterprise</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0062ff]/30 bg-[#0062ff]/20">
              <span className="text-sm font-semibold text-[#4f9dff]">A</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="flex w-full flex-shrink-0 flex-col border-r border-slate-800 bg-[#0f1723]/60 md:w-80">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Boardroom Agents</h3>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <article
                    key={agent.name}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                      agent.active
                        ? "border border-[#0062ff]/15 bg-[#0062ff]/5"
                        : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-700">
                        <Image
                          src={agent.image}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0f1723] ${agent.dotColor}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">{agent.name}</p>
                        <span className={`text-[10px] font-semibold ${agent.statusColor}`}>{agent.status}</span>
                      </div>
                      <p className="truncate text-[11px] text-slate-400">{agent.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Resource Monitor</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">CPU Compute</span>
                    <span className="font-mono text-[#4f9dff]">42%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[42%] bg-[#0062ff]" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">Token Quota</span>
                    <span className="font-mono text-orange-500">1.2M / 5M</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[24%] bg-orange-500" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
                  <Wrench className="h-3 w-3" /> n8n
                </div>
                <div className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
                  <Code2 className="h-3 w-3" /> GitHub
                </div>
                <div className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
                  <Terminal className="h-3 w-3" /> SSH
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-slate-800 bg-slate-900/50 p-6">
            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0062ff] py-3 font-bold text-white shadow-lg shadow-[#0062ff]/20 transition-all hover:bg-[#0057e6]">
              <span className="transition-transform group-hover:scale-110">▶</span>
              Deploy & Start
            </button>
          </div>
        </aside>

        <section className="min-h-0 flex-1 overflow-y-auto bg-[#0f1723]/20 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="border-b border-slate-800 bg-[#0f1723] p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#4f9dff]">
                    Sesi\u00f3n activa
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0062ff] animate-pulse" />
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  {deptTitle ? `Departamento: ${deptTitle}` : "Proyecto: Quantum Leap"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {deptTitle
                    ? "Los agentes coordinan creaci\u00f3n, publicaci\u00f3n y respuestas con el contexto compartido de este equipo."
                    : "Sesi\u00f3n multiagente para alinear estrategia y ejecuci\u00f3n (demo visual)."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white">
                  Save Board
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold">
                  <Share2 className="h-4 w-4" />
                  Share Session
                </button>
              </div>
            </div>
            <div className="mt-8 flex gap-8">
              <button className="pb-3 text-sm font-bold text-slate-500">Debate Feed</button>
              <button className="pb-3 text-sm font-bold text-slate-500 transition-colors hover:text-slate-300">Project Board</button>
              <button className="border-b-2 border-[#0062ff] pb-3 text-sm font-bold text-[#4f9dff]">Execution Log</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <Terminal className="h-3.5 w-3.5" /> Execution Log
                    </span>
                    <div className="h-4 w-px bg-slate-700" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase text-slate-500">Verbose Mode</span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="h-4 w-7 rounded-full bg-slate-700 after:absolute after:start-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-[#0062ff] peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                      <input
                        className="w-32 rounded-md border-none bg-slate-800 py-1 pl-7 pr-2 text-[10px] outline-none focus:ring-1 focus:ring-[#0062ff]"
                        placeholder="Filter logs..."
                      />
                    </div>
                    <button className="text-slate-500 transition-colors hover:text-[#4f9dff]">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto p-4 font-mono text-[12px] [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
                  {logs.map((log, idx) => (
                    <div
                      key={`${log[0]}-${idx}`}
                      className={`flex gap-3 border-b border-slate-800/50 py-1 ${log[1] === "DEBUG" ? "opacity-50" : ""}`}
                    >
                      <span className="w-[70px] shrink-0 text-slate-500">[{log[0]}]</span>
                      <span className={`w-12 shrink-0 font-bold ${log[2]}`}>{log[1]}</span>
                      <div className="flex-1">
                        <span className={`mr-1 font-bold ${log[4]}`}>{log[3]}:</span>
                        <span className="text-slate-300">{log[5]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 p-3 text-[10px] text-slate-500">
                  <div className="flex gap-4">
                    <span>Total Events: 1,242</span>
                    <span>Errors: 0</span>
                    <span>Warnings: 12</span>
                  </div>
                  <button className="flex items-center gap-1 transition-colors hover:text-[#4f9dff]">
                    <Trash2 className="h-3.5 w-3.5" /> Clear Logs
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Project Planning</h3>
                  <button className="rounded-md p-1 text-[#4f9dff] transition-colors hover:bg-[#0062ff]/10">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
                  <article className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-[#0062ff]/50">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-500">High Priority</span>
                      <span className="text-sm text-slate-500">...</span>
                    </div>
                    <h4 className="mb-3 text-sm font-semibold">Database Indexing Optimization</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-800 bg-blue-500 text-[10px]">P</div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-800 bg-purple-500 text-[10px]">N</div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">Due in 2h</span>
                    </div>
                  </article>

                  <article className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-500">Infrastructure</span>
                      <span className="text-sm text-slate-500">...</span>
                    </div>
                    <h4 className="mb-3 text-sm font-semibold">Deploy Kubernetes Sidecars</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-800 bg-orange-500 text-[10px]">C</div>
                      </div>
                      <span className="text-[10px] font-medium text-green-500">Ready to start</span>
                    </div>
                  </article>

                  <article className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 opacity-60">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded bg-slate-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">Low Priority</span>
                      <CheckCircle2 className="h-4 w-4 text-slate-500" />
                    </div>
                    <h4 className="mb-3 text-sm font-semibold line-through">Security Group Audit</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400">Completed by Claw</span>
                    </div>
                  </article>

                  <article className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-[#0062ff]/50">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-500">Analysis</span>
                      <span className="text-sm text-slate-500">...</span>
                    </div>
                    <h4 className="mb-3 text-sm font-semibold">Draft Regional Migration Plan</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-800 bg-purple-500 text-[10px]">N</div>
                      </div>
                      <span className="text-[10px] font-medium italic text-blue-500">In Progress</span>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </section>
  );
}
