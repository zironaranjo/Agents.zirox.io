import { NextResponse } from "next/server";
import { delegateToClaw } from "@/lib/integrations/claw";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type DelegatePayload = {
  taskId: string;
  agentId?: string;
  instructions: string;
  input?: unknown;
  context?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let runId = "";

  try {
    const body = (await request.json()) as DelegatePayload;
    if (!body.taskId?.trim() || !body.instructions?.trim()) {
      return NextResponse.json(
        { error: "Debes enviar taskId e instructions." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    runId = crypto.randomUUID();

    const { error: createRunError } = await supabase.from("task_runs").insert({
      id: runId,
      task_id: body.taskId,
      executor: "claw",
      estado: "ejecutando",
      input: {
        agentId: body.agentId ?? null,
        instructions: body.instructions,
        input: body.input ?? null,
        context: body.context ?? {},
      },
    });

    if (createRunError) {
      return NextResponse.json(
        { error: `No se pudo crear task_run: ${createRunError.message}` },
        { status: 500 },
      );
    }

    await supabase.from("tasks").update({ estado: "en_ejecucion" }).eq("id", body.taskId);

    const clawResponse = await delegateToClaw({
      taskId: body.taskId,
      agentId: body.agentId,
      instructions: body.instructions,
      input: body.input,
      context: body.context,
    });

    await supabase
      .from("task_runs")
      .update({ estado: "completado", output: clawResponse })
      .eq("id", runId);

    await supabase.from("tasks").update({ estado: "completada" }).eq("id", body.taskId);

    return NextResponse.json({
      ok: true,
      runId,
      source: "claw",
      data: clawResponse,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo delegar tarea en CLAW.";

    if (runId) {
      const supabase = getSupabaseServerClient();
      await supabase
        .from("task_runs")
        .update({ estado: "error", error_message: message })
        .eq("id", runId);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
