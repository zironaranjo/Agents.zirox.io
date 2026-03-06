import { NextResponse } from "next/server";
import { delegateToClaw } from "@/lib/integrations/claw";
import { triggerN8nWebhook } from "@/lib/integrations/n8n";
import { runOpenRouterPrompt } from "@/lib/integrations/openrouter";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type MatrixExecutor = "claw" | "n8n" | "agent";

type MatrixPayload = {
  executor: MatrixExecutor;
  agentId?: string;
  instructions?: string;
  webhookPathOrUrl?: string;
  inputTemplate?: Record<string, unknown>;
  continueOnError?: boolean;
  limit?: number;
};

type TaskRow = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "en_ejecucion" | "completada" | "error";
  prioridad: "baja" | "media" | "alta";
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type AgentRow = {
  id: string;
  nombre: string;
  rol: string;
  provider: "openrouter";
  model: string;
  system_prompt: string;
  temperature: number;
};

function normalizeLimit(value?: number) {
  if (!value || Number.isNaN(value)) return 50;
  return Math.min(Math.max(value, 1), 200);
}

function buildAgentPrompt(task: TaskRow, inputTemplate: Record<string, unknown>) {
  return [
    "Resuelve la siguiente tarea en modo Matrix, de forma clara y accionable.",
    "",
    `Titulo: ${task.titulo}`,
    `Descripcion: ${task.descripcion}`,
    `Prioridad: ${task.prioridad}`,
    "",
    "Contexto JSON:",
    JSON.stringify(
      {
        taskId: task.id,
        metadata: task.metadata ?? {},
        inputTemplate,
      },
      null,
      2,
    ),
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MatrixPayload;
    const executor = body.executor;

    if (!executor || !["claw", "n8n", "agent"].includes(executor)) {
      return NextResponse.json(
        { error: "Debes enviar un executor valido: claw, n8n o agent." },
        { status: 400 },
      );
    }

    if (executor === "claw" && !body.instructions?.trim()) {
      return NextResponse.json(
        { error: "En modo CLAW debes enviar instructions." },
        { status: 400 },
      );
    }

    if (executor === "n8n" && !body.webhookPathOrUrl?.trim()) {
      return NextResponse.json(
        { error: "En modo n8n debes enviar webhookPathOrUrl." },
        { status: 400 },
      );
    }

    if (executor === "agent" && !body.agentId?.trim()) {
      return NextResponse.json(
        { error: "En modo agent debes seleccionar agentId." },
        { status: 400 },
      );
    }

    const inputTemplate = body.inputTemplate ?? {};
    const continueOnError = body.continueOnError ?? true;
    const limit = normalizeLimit(body.limit);
    const supabase = getSupabaseServerClient();

    const { data: pendingTasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("estado", "pendiente")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (tasksError) {
      return NextResponse.json(
        { error: `No se pudieron leer tareas pendientes: ${tasksError.message}` },
        { status: 500 },
      );
    }

    const queue = (pendingTasks ?? []) as TaskRow[];
    if (queue.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "No hay tareas pendientes para ejecutar en modo Matrix.",
        summary: {
          total: 0,
          completed: 0,
          failed: 0,
          executor,
        },
        results: [],
      });
    }

    let selectedAgent: AgentRow | null = null;
    if (executor === "agent") {
      const { data: agent, error: agentError } = await supabase
        .from("agents")
        .select("id,nombre,rol,provider,model,system_prompt,temperature")
        .eq("id", body.agentId)
        .single();

      if (agentError || !agent) {
        return NextResponse.json(
          { error: `No se encontró el agente seleccionado: ${agentError?.message ?? "unknown"}` },
          { status: 404 },
        );
      }

      selectedAgent = agent as AgentRow;
    }

    const results: Array<{
      taskId: string;
      runId: string | null;
      estado: "completada" | "error";
      error?: string;
    }> = [];

    for (const task of queue) {
      let runId: string | null = null;

      try {
        await supabase.from("tasks").update({ estado: "en_ejecucion" }).eq("id", task.id);

        runId = crypto.randomUUID();
        const { error: createRunError } = await supabase.from("task_runs").insert({
          id: runId,
          task_id: task.id,
          executor,
          estado: "ejecutando",
          input: {
            task,
            inputTemplate,
            config: {
              agentId: body.agentId ?? null,
              instructions: body.instructions ?? null,
              webhookPathOrUrl: body.webhookPathOrUrl ?? null,
            },
          },
        });

        if (createRunError) {
          throw new Error(`No se pudo crear task_run para ${task.id}: ${createRunError.message}`);
        }

        let output: unknown;
        if (executor === "claw") {
          output = await delegateToClaw({
            taskId: task.id,
            agentId: body.agentId ?? undefined,
            instructions: body.instructions!,
            input: {
              titulo: task.titulo,
              descripcion: task.descripcion,
              prioridad: task.prioridad,
              metadata: task.metadata ?? {},
              ...inputTemplate,
            },
            context: {
              mode: "matrix",
              order: "sequential",
            },
          });
        } else if (executor === "n8n") {
          output = await triggerN8nWebhook({
            webhookPathOrUrl: body.webhookPathOrUrl!,
            payload: {
              taskId: task.id,
              titulo: task.titulo,
              descripcion: task.descripcion,
              prioridad: task.prioridad,
              metadata: task.metadata ?? {},
              mode: "matrix",
              ...inputTemplate,
            },
          });
        } else {
          const agent = selectedAgent as AgentRow;
          const { output: agentOutput } = await runOpenRouterPrompt({
            model: agent.model,
            systemPrompt: agent.system_prompt,
            userPrompt: buildAgentPrompt(task, inputTemplate),
            temperature: agent.temperature,
          });

          output = {
            agentId: agent.id,
            agentName: agent.nombre,
            output: agentOutput,
          };
        }

        await supabase
          .from("task_runs")
          .update({ estado: "completado", output })
          .eq("id", runId);

        await supabase.from("tasks").update({ estado: "completada" }).eq("id", task.id);

        results.push({ taskId: task.id, runId, estado: "completada" });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error desconocido ejecutando tarea en modo Matrix.";

        if (runId) {
          await supabase
            .from("task_runs")
            .update({ estado: "error", error_message: message })
            .eq("id", runId);
        }

        await supabase.from("tasks").update({ estado: "error" }).eq("id", task.id);
        results.push({ taskId: task.id, runId, estado: "error", error: message });

        if (!continueOnError) {
          break;
        }
      }
    }

    const completed = results.filter((item) => item.estado === "completada").length;
    const failed = results.filter((item) => item.estado === "error").length;

    return NextResponse.json({
      ok: true,
      summary: {
        total: results.length,
        completed,
        failed,
        executor,
        mode: "matrix",
        order: "sequential",
      },
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo ejecutar el modo Matrix.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
