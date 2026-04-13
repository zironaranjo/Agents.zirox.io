type OpenRouterContent = string | Array<{ type?: string; text?: string }> | undefined;

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: OpenRouterContent;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
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

  const referer =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL?.trim()
      ? `https://${process.env.VERCEL_URL.trim()}`
      : null) ||
    "http://localhost:3000";

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
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

  const rawText = await upstream.text();
  let data: OpenRouterResponse;
  try {
    data = JSON.parse(rawText) as OpenRouterResponse;
  } catch {
    throw new Error(
      `OpenRouter respondió sin JSON válido (HTTP ${upstream.status}). Primeros caracteres: ${rawText.slice(0, 160)}`,
    );
  }

  const err = data?.error;
  if (err?.message) {
    const code = err.code != null ? ` [código ${err.code}]` : "";
    throw new Error(`${err.message}${code}`);
  }

  if (!upstream.ok) {
    throw new Error(`OpenRouter HTTP ${upstream.status}. Revisa créditos, modelo y clave API.`);
  }

  const output = extractOpenRouterContent(data?.choices?.[0]?.message?.content);

  return {
    output,
    raw: data,
  };
}
