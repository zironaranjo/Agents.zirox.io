import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type WorkflowNode = {
  id: string;
  label: string;
  executor: "n8n" | "claw" | "agent";
  config?: Record<string, unknown>;
};

type WorkflowEdge = {
  from: string;
  to: string;
  condition?: string;
};

type WorkflowDefinition = {
  version: string;
  entryNodeId?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

type CreateWorkflowPayload = {
  nombre: string;
  descripcion?: string;
  categoria?: "general" | "marketing" | "sales" | "support" | "devops";
  estado?: "draft" | "active" | "archived";
  isTemplate?: boolean;
  createdBy?: string;
  definition: WorkflowDefinition;
};

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `No se pudieron listar workflows: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ workflows: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudieron listar workflows.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateWorkflowPayload;

    if (!body.nombre?.trim()) {
      return NextResponse.json(
        { error: "Debes enviar nombre para crear workflow." },
        { status: 400 },
      );
    }

    if (!body.definition || !Array.isArray(body.definition.nodes)) {
      return NextResponse.json(
        { error: "Debes enviar definition con nodos validos." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const workflowId = crypto.randomUUID();

    const { data, error } = await supabase
      .from("workflows")
      .insert({
        id: workflowId,
        nombre: body.nombre.trim(),
        descripcion: body.descripcion ?? "",
        categoria: body.categoria ?? "general",
        estado: body.estado ?? "draft",
        is_template: body.isTemplate ?? false,
        created_by: body.createdBy ?? "ui",
        definition: body.definition,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo crear workflow: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ workflow: data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo crear workflow.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
