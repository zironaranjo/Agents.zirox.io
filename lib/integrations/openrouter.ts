type OpenRouterContent = string | Array<{ type?: string; text?: string }> | undefined;

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: OpenRouterContent;
    };
  }>;
  error?: {
    message?: string;
  };
};

export function extractOpenRouterContent(content: OpenRouterContent) {
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

export async function runOpenRouterPrompt(params: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Falta OPENROUTER_API_KEY en variables de entorno del servidor.");
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
      model: params.model,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 700,
      messages: [
        { role: "system", content: params.systemPrompt || "Eres un asistente útil." },
        { role: "user", content: params.userPrompt },
      ],
    }),
  });

  const data = (await upstream.json()) as OpenRouterResponse;
  if (!upstream.ok) {
    throw new Error(data?.error?.message ?? "Error de OpenRouter.");
  }

  return {
    output: extractOpenRouterContent(data?.choices?.[0]?.message?.content),
    raw: data,
  };
}
