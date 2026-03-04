import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/integrations/n8n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type TriggerPayload = {
  taskId?: string;
  webhookPathOrUrl: string;
  payload?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let runId = "";

  try {
    const body = (await request.json()) as TriggerPayload;
    if (!body.webhookPathOrUrl?.trim()) {
      return NextResponse.json(
        { error: "Debes enviar webhookPathOrUrl." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    if (body.taskId) {
      runId = crypto.randomUUID();
      const { error: createRunError } = await supabase.from("task_runs").insert({
        id: runId,
        task_id: body.taskId,
        executor: "n8n",
        estado: "ejecutando",
        input: body.payload ?? {},
      });

      if (createRunError) {
        return NextResponse.json(
          { error: `No se pudo crear task_run: ${createRunError.message}` },
          { status: 500 },
        );
      }
    }

    const n8nResponse = await triggerN8nWebhook({
      webhookPathOrUrl: body.webhookPathOrUrl,
      payload: body.payload ?? {},
    });

    if (runId) {
      await supabase
        .from("task_runs")
        .update({ estado: "completado", output: n8nResponse })
        .eq("id", runId);
    }

    return NextResponse.json({
      ok: true,
      runId: runId || null,
      source: "n8n",
      data: n8nResponse,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo disparar workflow en n8n.";

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
