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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Partial<Agent>;
    const supabase = getSupabaseServerClient();

    const updatePayload: Record<string, unknown> = {};

    if (typeof payload.nombre === "string") updatePayload.nombre = payload.nombre;
    if (typeof payload.rol === "string") updatePayload.rol = payload.rol;
    if (typeof payload.estado === "string") updatePayload.estado = payload.estado;
    if (Array.isArray(payload.herramientas)) updatePayload.herramientas = payload.herramientas;
    if (Array.isArray(payload.subagentes)) updatePayload.subagentes = payload.subagentes;
    if (typeof payload.provider === "string") updatePayload.provider = payload.provider;
    if (typeof payload.model === "string") updatePayload.model = payload.model;
    if (typeof payload.systemPrompt === "string") {
      updatePayload.system_prompt = payload.systemPrompt;
    }
    if (typeof payload.temperature === "number") {
      updatePayload.temperature = payload.temperature;
    }

    const { data, error } = await supabase
      .from("agents")
      .update(updatePayload)
      .eq("id", id)
      .select(
        "id,nombre,rol,estado,herramientas,subagentes,provider,model,system_prompt,temperature",
      )
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo actualizar agente: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ agent: toAgent(data as AgentRow) });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo actualizar el agente.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
