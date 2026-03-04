export type AgentStatus = "idle" | "activo" | "ejecutando";

export type Agent = {
  id: string;
  nombre: string;
  rol: string;
  estado: AgentStatus;
  herramientas: string[];
  subagentes: string[];
  provider: "openrouter";
  model: string;
  systemPrompt: string;
  temperature: number;
};

export const agentesPrincipales: Agent[] = [
  {
    id: "claw",
    nombre: "CLAW",
    rol: "Orquestador principal",
    estado: "activo",
    herramientas: ["OpenClaw", "n8n", "Supabase"],
    subagentes: ["Nova", "Pulse"],
    provider: "openrouter",
    model: "openai/gpt-4o-mini",
    systemPrompt:
      "Eres CLAW, orquestador principal. Delegas tareas a otros agentes con claridad y trazabilidad.",
    temperature: 0.3,
  },
  {
    id: "nova",
    nombre: "NOVA",
    rol: "Marketing y crecimiento",
    estado: "ejecutando",
    herramientas: ["n8n", "LLM marketing"],
    subagentes: ["Content Bot", "SEO Bot", "Ads Bot"],
    provider: "openrouter",
    model: "anthropic/claude-3.5-sonnet",
    systemPrompt:
      "Eres NOVA, especialista en marketing de crecimiento. Propones estrategias accionables orientadas a conversion.",
    temperature: 0.7,
  },
  {
    id: "pulse",
    nombre: "PULSE",
    rol: "Ventas y prospeccion",
    estado: "idle",
    herramientas: ["CRM Connector", "n8n", "LLM ventas"],
    subagentes: ["Lead Bot", "Follow-Up Bot"],
    provider: "openrouter",
    model: "openai/gpt-4.1-mini",
    systemPrompt:
      "Eres PULSE, especialista en ventas B2B. Priorizas claridad, pipeline y seguimiento.",
    temperature: 0.5,
  },
];

export const estadoColor: Record<AgentStatus, string> = {
  idle: "bg-slate-500/20 text-slate-200",
  activo: "bg-emerald-500/20 text-emerald-300",
  ejecutando: "bg-amber-500/20 text-amber-300",
};
