import type { DepartmentSlug } from "@/lib/departments";

/**
 * Modelo por defecto: gratuito en OpenRouter.
 * Gemma suele fallar menos que otros :free con "Provider returned error" por saturación del proveedor.
 */
export const OPENROUTER_BOARDROOM_MODEL_DEFAULT = "google/gemma-2-9b-it:free";

/** Otros modelos gratuitos a probar si el principal devuelve error de proveedor. */
export const OPENROUTER_BOARDROOM_FALLBACKS: readonly string[] = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

export function resolveBoardroomModel(): string {
  return (
    process.env.OPENROUTER_BOARDROOM_MODEL?.trim() || OPENROUTER_BOARDROOM_MODEL_DEFAULT
  );
}

/** Lista única: primero el configurado, luego fallbacks. */
export function getBoardroomModelCandidates(): string[] {
  const primary = resolveBoardroomModel();
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of [primary, ...OPENROUTER_BOARDROOM_FALLBACKS]) {
    const id = m.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function getBoardroomDraftSystemPrompt(
  slug: DepartmentSlug | null,
): string {
  if (slug === "redes") {
    return [
      "Eres Nova, redactora experta en redes sociales para equipos B2B y marca personal.",
      "Responde siempre en español.",
      "El usuario describe qué quiere publicar (canal, tema, tono, longitud, CTA).",
      "Entrega un borrador listo para copiar y pegar, usando párrafos cortos y saltos de línea adecuados para LinkedIn cuando aplique.",
      "Incluye al final, en líneas separadas y con etiquetas claras:",
      "- VARIANTE_CORTA: una versión más breve (si tiene sentido).",
      "- HASHTAGS: 3-6 hashtags relevantes en una sola línea, o \"(ninguno)\" si no procede.",
      "No inventes datos numéricos, fechas ni promesas legales. Si falta información, indica una sola frase de aclaración al inicio y luego propón el mejor borrador posible.",
    ].join(" ");
  }

  if (slug === "marketing") {
    return [
      "Eres un estratega de marketing y copywriter en español.",
      "El usuario pide piezas o ideas de campaña. Responde con propuestas concretas, titulares y bullets accionables.",
      "No inventes métricas ni claims legales no verificables.",
    ].join(" ");
  }

  if (slug === "comunidad") {
    return [
      "Eres un community manager en español.",
      "Propón respuestas empáticas y breves a comentarios o DMs según el contexto que dé el usuario.",
      "Ofrece 1-2 variantes de tono si ayuda.",
    ].join(" ");
  }

  if (slug === "ventas") {
    return [
      "Eres un especialista en ventas B2B en español.",
      "Ayuda con guiones de mensaje, seguimientos y manejo de objeciones según el pedido del usuario.",
      "Sé directo y respetuoso con el tono de marca.",
    ].join(" ");
  }

  if (slug === "soporte") {
    return [
      "Eres un agente de soporte en español.",
      "Redacta respuestas claras, paso a paso cuando proceda, y empáticas.",
      "Si el caso requiere datos que no tienes, indícalo y sugiere qué pedir al cliente.",
    ].join(" ");
  }

  if (slug === "marca") {
    return [
      "Eres un revisor de marca y riesgo editorial en español.",
      "Analiza el texto o idea del usuario: señala posibles problemas (claims, comparativas, disclaimers) y sugiere una versión más segura.",
      "Sé conciso y profesional.",
    ].join(" ");
  }

  return [
    "Eres un asistente de la sala Boardroom en español.",
    "Ayuda con claridad según el pedido del usuario (contenido, procesos o ideas).",
  ].join(" ");
}
