import { NextResponse } from "next/server";

type RunAgentPayload = {
  provider: "openrouter";
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type OpenRouterContent = string | Array<{ type?: string; text?: string }> | undefined;

function extractContent(content: OpenRouterContent) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .join("")
      .trim();
  }

  return "";
}

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

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Falta OPENROUTER_API_KEY en variables de entorno del servidor.",
        },
        { status: 500 },
      );
    }

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Agentes Matrix",
      },
      body: JSON.stringify({
        model: body.model,
        temperature: body.temperature ?? 0.7,
        messages: [
          { role: "system", content: body.systemPrompt || "Eres un asistente útil." },
          { role: "user", content: body.userPrompt },
        ],
      }),
    });

    const data = (await upstream.json()) as OpenRouterResponse;

    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "Error de OpenRouter." },
        { status: upstream.status },
      );
    }

    const output = extractContent(data?.choices?.[0]?.message?.content);

    return NextResponse.json({ output });
  } catch {
    return NextResponse.json(
      { error: "No se pudo ejecutar el agente en este momento." },
      { status: 500 },
    );
  }
}
