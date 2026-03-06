import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type CreateTaskPayload = {
  titulo?: string;
  descripcion: string;
  requestedBy?: string;
  prioridad?: "baja" | "media" | "alta";
  metadata?: Record<string, unknown>;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const estado = url.searchParams.get("estado");
    const limitParam = Number(url.searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 200)
      : 50;

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (estado) {
      query = query.eq("estado", estado);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json(
        { error: `No se pudieron listar tasks: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ tasks: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudieron listar las tareas.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTaskPayload;

    if (!body.descripcion?.trim()) {
      return NextResponse.json(
        { error: "Debes enviar descripcion para crear la tarea." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const taskId = crypto.randomUUID();

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        id: taskId,
        titulo: body.titulo ?? "Nueva tarea",
        descripcion: body.descripcion,
        estado: "pendiente",
        prioridad: body.prioridad ?? "media",
        requested_by: body.requestedBy ?? "ui",
        metadata: body.metadata ?? {},
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo crear task: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ task: data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo crear la tarea.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
