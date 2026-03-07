import Image from "next/image";
import {
  Bolt,
  Bot,
  ChevronDown,
  Cpu,
  Database,
  Eye,
  Home,
  Lock,
  MemoryStick,
  Pencil,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const accentColors = ["#0062ff", "#10b981", "#9333ea", "#f97316", "#ec4899", "#64748b"] as const;

export default function PanelSettingsPage() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] bg-[#0f1723] text-slate-100">
      <aside className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0f1723] lg:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0062ff] text-white">
            <Bolt className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Nexus AI</h1>
            <p className="text-xs text-slate-400">Enterprise AI Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
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
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <MemoryStick className="h-4 w-4" />
            <span className="text-sm font-medium">Models</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Knowledge Base</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg bg-[#0062ff]/20 px-3 py-2 text-[#4f9dff]">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700">
              <Image
                src="/Claw1.png"
                alt="User profile"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">Alex Rivera</p>
              <p className="truncate text-xs text-slate-500">Pro Plan</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f1723] px-8">
          <h2 className="text-xl font-bold">Settings</h2>
          <div className="flex items-center gap-3">
            <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800">
              Cancel
            </button>
            <button className="rounded-lg bg-[#0062ff] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#0062ff]/20 transition-colors hover:bg-[#0057e6]">
              Save Changes
            </button>
          </div>
        </header>

        <div className="border-b border-slate-800 bg-[#0f1723] px-8">
          <nav className="flex gap-8">
            <button className="border-b-2 border-[#0062ff] py-4 text-sm font-medium text-[#4f9dff]">
              Profile
            </button>
            <button className="py-4 text-sm font-medium text-slate-400 transition-colors hover:text-[#4f9dff]">
              Appearance
            </button>
            <button className="py-4 text-sm font-medium text-slate-400 transition-colors hover:text-[#4f9dff]">
              Security
            </button>
            <button className="py-4 text-sm font-medium text-slate-400 transition-colors hover:text-[#4f9dff]">
              Billing
            </button>
          </nav>
        </div>

        <div className="mx-auto w-full max-w-5xl flex-1 space-y-12 overflow-y-auto p-8">
          <section className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <p className="text-sm text-slate-400">
                Update your personal details and professional identity.
              </p>
            </div>

            <div className="flex items-center gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="group relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-700">
                  <Image
                    src="/Claw1.png"
                    alt="User avatar large"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 rounded-full border-2 border-slate-900 bg-[#0062ff] p-1.5 text-white shadow-sm">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold">Alex Rivera</h4>
                <p className="text-sm text-slate-400">Lead AI Architect • San Francisco, CA</p>
                <div className="flex gap-2 pt-2">
                  <button className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold transition-colors hover:bg-slate-700">
                    Change Photo
                  </button>
                  <button className="rounded-full px-3 py-1 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/10">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  defaultValue="Alex Rivera"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none transition-all focus:border-[#0062ff] focus:ring-2 focus:ring-[#0062ff]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  defaultValue="alex.rivera@enterprise.ai"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none transition-all focus:border-[#0062ff] focus:ring-2 focus:ring-[#0062ff]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Role</label>
                <select className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none transition-all focus:border-[#0062ff] focus:ring-2 focus:ring-[#0062ff]/20">
                  <option>Lead AI Architect</option>
                  <option>Prompt Engineer</option>
                  <option>Data Scientist</option>
                  <option>Product Manager</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <select className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none transition-all focus:border-[#0062ff] focus:ring-2 focus:ring-[#0062ff]/20">
                  <option>Pacific Time (PT) - UTC-8</option>
                  <option>Eastern Time (ET) - UTC-5</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-6 border-t border-slate-800 pt-6">
            <div>
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-slate-400">
                Customize how Nexus AI looks on your screen.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative rounded-xl border-2 border-[#0062ff] bg-[#0062ff]/10 p-4">
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-slate-900">
                  <Settings className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-center text-sm font-bold">Dark Mode</p>
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0062ff] text-[10px] text-white">
                  ✓
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 p-4 transition-all hover:border-[#0062ff]/50">
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-slate-200">
                  <Settings className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-center text-sm font-medium">Light Mode</p>
              </div>
              <div className="rounded-xl border border-slate-800 p-4 transition-all hover:border-[#0062ff]/50">
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-slate-200 to-slate-900">
                  <Cpu className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-center text-sm font-medium">System Sync</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex gap-4">
                {accentColors.map((color, index) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full ${index === 0 ? "ring-2 ring-[#0062ff] ring-offset-2 ring-offset-[#0f1723]" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 border-t border-slate-800 pt-6">
            <div>
              <h3 className="text-lg font-semibold">Security &amp; Access</h3>
              <p className="text-sm text-slate-400">
                Manage your credentials and platform access keys.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-slate-500">Last changed 4 months ago</p>
                  </div>
                </div>
                <button className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-700">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-emerald-500">Enabled (Authenticator App)</p>
                  </div>
                </div>
                <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/20">
                  Disable
                </button>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Global API Key</p>
                  <p className="text-xs text-slate-500">
                    Used for programmatic access to your agents and models.
                  </p>
                </div>
                <button className="text-xs font-bold text-[#4f9dff] hover:underline">
                  Revoke all keys
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    readOnly
                    type="password"
                    value="sk_nexus_72918402938471029384"
                    className="w-full rounded-lg border-none bg-slate-800/50 px-4 py-2 font-mono text-sm tracking-wider"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <button className="rounded-lg bg-slate-800 px-4 py-2 transition-colors hover:bg-slate-700">
                  <Database className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6 border-t border-slate-800 pb-20 pt-6">
            <div>
              <h3 className="text-lg font-semibold">Billing &amp; Usage</h3>
              <p className="text-sm text-slate-400">
                Monitor your plan consumption and payment methods.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#0062ff]/10 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="rounded-full bg-[#0062ff]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4f9dff]">
                    Enterprise Plan
                  </span>
                  <span className="text-xl font-bold">
                    $499<span className="text-sm font-normal text-slate-400">/mo</span>
                  </span>
                </div>
                <p className="mb-6 text-sm text-slate-400">
                  Your plan renews on <span className="font-medium text-slate-100">October 24, 2024</span>.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Token Usage</span>
                      <span>24.5M / 50M</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[49%] bg-[#0062ff]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Agent Calls</span>
                      <span>8,402 / 10,000</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[84%] bg-[#0062ff]" />
                    </div>
                  </div>
                </div>
              </article>

              <article className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-6">
                <div className="space-y-4">
                  <p className="text-sm font-bold">Default Payment Method</p>
                  <div className="flex items-center gap-4 rounded-lg border border-slate-700 p-3">
                    <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-800 text-[10px] italic text-slate-400">
                      VISA
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-slate-500">Expires 08/27</p>
                    </div>
                    <button className="text-slate-400 transition-colors hover:text-white">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-lg border border-slate-800 py-2.5 text-sm font-bold transition-colors hover:bg-slate-800">
                  Manage Billing Portal
                </button>
              </article>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}
