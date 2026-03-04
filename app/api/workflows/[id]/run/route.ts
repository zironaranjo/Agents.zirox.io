import { NextResponse } from "next/server";
import { delegateToClaw } from "@/lib/integrations/claw";
import { triggerN8nWebhook } from "@/lib/integrations/n8n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type RunWorkflowPayload = {
  input?: Record<string, unknown>;
};

type WorkflowNode = {
  id: string;
  label: string;
  executor: "n8n" | "claw" | "agent";
  config?: Record<string, unknown>;
};

type WorkflowDefinition = {
  version?: string;
  entryNodeId?: string;
  nodes: WorkflowNode[];
  edges?: Array<{ from: string; to: string; condition?: string }>;
};

async function appendRunLog(params: {
  runId: string;
  nivel: "info" | "warning" | "error";
  mensaje: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getSupabaseServerClient();
  await supabase.from("workflow_run_logs").insert({
    id: crypto.randomUUID(),
    workflow_run_id: params.runId,
    nivel: params.nivel,
    mensaje: params.mensaje,
    metadata: params.metadata ?? {},
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let runId = "";

  try {
    const body = (await request.json().catch(() => ({}))) as RunWorkflowPayload;
    const { id: workflowId } = await params;

    const supabase = getSupabaseServerClient();
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: "Workflow no encontrado." },
        { status: 404 },
      );
    }

    const definition = workflow.definition as WorkflowDefinition;
    if (!definition?.nodes?.length) {
      return NextResponse.json(
        { error: "Workflow sin nodos configurados." },
        { status: 400 },
      );
    }

    runId = crypto.randomUUID();
    const runInput = body.input ?? {};

    const { error: runError } = await supabase.from("workflow_runs").insert({
      id: runId,
      workflow_id: workflowId,
      estado: "ejecutando",
      input: runInput,
      started_at: new Date().toISOString(),
    });

    if (runError) {
      return NextResponse.json(
        { error: `No se pudo crear workflow_run: ${runError.message}` },
        { status: 500 },
      );
    }

    await appendRunLog({
      runId,
      nivel: "info",
      mensaje: "Inicio de ejecución de workflow",
      metadata: { workflowId, totalNodes: definition.nodes.length },
    });

    const stepResults: Array<Record<string, unknown>> = [];
    let runtimeContext: Record<string, unknown> = { ...runInput };

    for (const node of definition.nodes) {
      await appendRunLog({
        runId,
        nivel: "info",
        mensaje: `Ejecutando nodo ${node.label}`,
        metadata: { nodeId: node.id, executor: node.executor },
      });

      if (node.executor === "n8n") {
        const webhookPathOrUrl = String(node.config?.webhookPathOrUrl ?? "");
        if (!webhookPathOrUrl) {
          throw new Error(`Nodo ${node.label} requiere webhookPathOrUrl para n8n.`);
        }

        const response = await triggerN8nWebhook({
          webhookPathOrUrl,
          payload: {
            ...runtimeContext,
            ...(node.config?.payload as Record<string, unknown> | undefined),
          },
        });

        stepResults.push({
          nodeId: node.id,
          nodeLabel: node.label,
          executor: node.executor,
          output: response,
        });
        runtimeContext = { ...runtimeContext, [node.id]: response };
      } else if (node.executor === "claw") {
        const instructions = String(node.config?.instructions ?? "");
        if (!instructions) {
          throw new Error(`Nodo ${node.label} requiere instructions para CLAW.`);
        }

        const response = await delegateToClaw({
          taskId: runId,
          agentId: node.config?.agentId ? String(node.config.agentId) : undefined,
          instructions,
          input: runtimeContext,
          context: {
            workflowId,
            workflowName: workflow.nombre as string,
            nodeId: node.id,
            nodeLabel: node.label,
          },
        });

        stepResults.push({
          nodeId: node.id,
          nodeLabel: node.label,
          executor: node.executor,
          output: response,
        });
        runtimeContext = { ...runtimeContext, [node.id]: response };
      } else {
        // `agent` queda reservado para ejecución directa futura contra /api/agents/run.
        const placeholder = {
          status: "pending_executor",
          message: "Executor agent pendiente de implementación funcional.",
        };
        stepResults.push({
          nodeId: node.id,
          nodeLabel: node.label,
          executor: node.executor,
          output: placeholder,
        });
        runtimeContext = { ...runtimeContext, [node.id]: placeholder };
      }
    }

    const finalOutput = {
      workflowId,
      workflowName: workflow.nombre,
      steps: stepResults,
      context: runtimeContext,
    };

    await supabase
      .from("workflow_runs")
      .update({
        estado: "completado",
        output: finalOutput,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);

    await appendRunLog({
      runId,
      nivel: "info",
      mensaje: "Workflow completado correctamente",
      metadata: { totalSteps: stepResults.length },
    });

    return NextResponse.json({
      ok: true,
      runId,
      data: finalOutput,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo ejecutar workflow.";

    if (runId) {
      const supabase = getSupabaseServerClient();
      await supabase
        .from("workflow_runs")
        .update({
          estado: "error",
          error_message: message,
          finished_at: new Date().toISOString(),
        })
        .eq("id", runId);

      await appendRunLog({
        runId,
        nivel: "error",
        mensaje: "Workflow finalizado con error",
        metadata: { error: message },
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
