import { NextResponse } from "next/server";
import { runOpenRouterPrompt } from "@/lib/integrations/openrouter";

type RunAgentPayload = {
  provider: "openrouter";
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RunAgentPayload;

    if (body.provider !== "openrouter") {
      return NextResponse.json(
        { error: "Provider no soportado en este MVP. Usa openrouter." },
        { status: 400 },
      );
    }

    if (!body.model?.trim() || !body.userPrompt?.trim()) {
      return NextResponse.json(
        { error: "Debes enviar model y userPrompt." },
        { status: 400 },
      );
    }

    const { output } = await runOpenRouterPrompt({
      model: body.model,
      systemPrompt: body.systemPrompt || "Eres un asistente útil.",
      userPrompt: body.userPrompt,
      temperature: body.temperature ?? 0.7,
      maxTokens: 700,
    });

    return NextResponse.json({ output });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo ejecutar el agente en este momento.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
