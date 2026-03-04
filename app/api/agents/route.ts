import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/agents";

type AgentRow = {
  id: string;
  nombre: string;
  rol: string;
  estado: Agent["estado"];
  herramientas: string[] | null;
  subagentes: string[] | null;
  provider: Agent["provider"];
  model: string;
  system_prompt: string;
  temperature: number;
};

function toAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    nombre: row.nombre,
    rol: row.rol,
    estado: row.estado,
    herramientas: row.herramientas ?? [],
    subagentes: row.subagentes ?? [],
    provider: row.provider,
    model: row.model,
    systemPrompt: row.system_prompt,
    temperature: row.temperature,
  };
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("agents")
      .select(
        "id,nombre,rol,estado,herramientas,subagentes,provider,model,system_prompt,temperature",
      )
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: `No se pudo leer agents: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ agents: (data as AgentRow[]).map(toAgent) });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo conectar con Supabase.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<Agent>;
    const supabase = getSupabaseServerClient();

    const insertPayload = {
      id: payload.id ?? crypto.randomUUID(),
      nombre: payload.nombre ?? "Nuevo agente",
      rol: payload.rol ?? "Rol por definir",
      estado: payload.estado ?? "idle",
      herramientas: payload.herramientas ?? [],
      subagentes: payload.subagentes ?? [],
      provider: payload.provider ?? "openrouter",
      model: payload.model ?? "openai/gpt-4o-mini",
      system_prompt:
        payload.systemPrompt ??
        "Eres un agente especializado. Responde de forma clara y accionable.",
      temperature: payload.temperature ?? 0.6,
    };

    const { data, error } = await supabase
      .from("agents")
      .insert(insertPayload)
      .select(
        "id,nombre,rol,estado,herramientas,subagentes,provider,model,system_prompt,temperature",
      )
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo crear agente: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ agent: toAgent(data as AgentRow) }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo crear el agente.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
