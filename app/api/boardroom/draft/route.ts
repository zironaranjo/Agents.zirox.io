import { NextResponse } from "next/server";
import {
  getBoardroomDraftSystemPrompt,
  resolveBoardroomModel,
} from "@/lib/boardroom-draft";
import { runOpenRouterPrompt } from "@/lib/integrations/openrouter";
import { isDepartmentSlug } from "@/lib/departments";

type DraftBody = {
  departmentSlug?: string;
  userRequest?: string;
};

const MAX_LEN = 12_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as DraftBody;
    const userRequest = (body.userRequest ?? "").trim();

    if (!userRequest) {
      return NextResponse.json(
        { error: "Escribe qué necesitas (pedido vacío)." },
        { status: 400 },
      );
    }

    if (userRequest.length > MAX_LEN) {
      return NextResponse.json(
        { error: `El pedido es demasiado largo (máx. ${MAX_LEN} caracteres).` },
        { status: 400 },
      );
    }

    const slug =
      body.departmentSlug && isDepartmentSlug(body.departmentSlug)
        ? body.departmentSlug
        : null;

    const systemPrompt = getBoardroomDraftSystemPrompt(slug);
    const userPrompt = `Pedido del usuario:\n${userRequest}\n\nGenera el entregable siguiendo tu rol y formato.`;

    const model = resolveBoardroomModel();

    const { output } = await runOpenRouterPrompt({
      model,
      systemPrompt,
      userPrompt,
      temperature: 0.65,
      maxTokens: 1_600,
    });

    if (!output?.trim()) {
      return NextResponse.json(
        { error: "El modelo no devolvió texto. Prueba de nuevo o cambia de modelo en OPENROUTER_BOARDROOM_MODEL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ output: output.trim() });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo generar el borrador en este momento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
