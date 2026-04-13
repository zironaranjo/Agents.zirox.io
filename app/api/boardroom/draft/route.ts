import { NextResponse } from "next/server";
import {
  getBoardroomDraftSystemPrompt,
  getBoardroomModelCandidates,
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

    const candidates = getBoardroomModelCandidates();
    let lastError = "Sin respuesta";

    for (const model of candidates) {
      try {
        const { output } = await runOpenRouterPrompt({
          model,
          systemPrompt,
          userPrompt,
          temperature: 0.65,
          maxTokens: 1_200,
        });

        if (output?.trim()) {
          return NextResponse.json({ output: output.trim() });
        }

        lastError = `El modelo ${model} devolvió texto vacío.`;
      } catch (err) {
        lastError =
          err instanceof Error ? err.message : "Error desconocido al llamar a OpenRouter.";
      }
    }

    return NextResponse.json(
      {
        error: `${lastError} Si usas modelos :free, el proveedor a veces se satura: espera un minuto, vuelve a intentar o define OPENROUTER_BOARDROOM_MODEL con otro modelo en openrouter.ai/models.`,
      },
      { status: 502 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo generar el borrador en este momento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
