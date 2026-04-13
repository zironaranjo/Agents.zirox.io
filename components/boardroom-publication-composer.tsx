"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import type { DepartmentSlug } from "@/lib/departments";

type Props = {
  departmentSlug: DepartmentSlug | null;
  composerTitle?: string;
  composerPlaceholder?: string;
};

export function BoardroomPublicationComposer({
  departmentSlug,
  composerTitle = "Nueva publicación",
  composerPlaceholder,
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleDraft() {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setOutput(null);
    setCopied(false);

    try {
      const res = await fetch("/api/boardroom/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentSlug: departmentSlug ?? undefined,
          userRequest: trimmed,
        }),
      });
      const data = (await res.json()) as { output?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? `Error ${res.status}`);
        return;
      }

      if (!data.output?.trim()) {
        setError("Respuesta vacía del servidor.");
        return;
      }

      setOutput(data.output.trim());
    } catch {
      setError("No se pudo conectar. Revisa tu red o vuelve a intentar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  return (
    <div className="rounded-2xl border border-[#0062ff]/30 bg-gradient-to-br from-[#0062ff]/10 to-slate-900/40 p-5 shadow-sm md:p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">{composerTitle}</h3>
          <p className="mt-1 text-xs text-slate-400">
            Describe canal (LinkedIn, Instagram…), tema, tono y CTA. Se usa{" "}
            <strong className="text-slate-300">OpenRouter</strong> en el servidor (clave{" "}
            <code className="rounded bg-slate-800 px-1 text-[10px]">OPENROUTER_API_KEY</code>
            ). Modelo por defecto gratuito: Llama 3.2 3B (
            <code className="rounded bg-slate-800 px-1 text-[10px]">:free</code>).
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase text-emerald-400">
          OpenRouter
        </span>
      </div>

      <label className="sr-only" htmlFor="boardroom-composer-input">
        Pedido de contenido
      </label>
      <textarea
        id="boardroom-composer-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        disabled={loading}
        placeholder={composerPlaceholder}
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#0062ff]/50 focus:outline-none focus:ring-1 focus:ring-[#0062ff]/40 disabled:opacity-60"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {error ? (
          <p className="text-[11px] text-red-400">{error}</p>
        ) : (
          <p className="text-[11px] text-slate-500">
            La respuesta aparece abajo. Puedes copiarla y publicar manualmente o enlazar n8n después.
          </p>
        )}
        <button
          type="button"
          onClick={handleDraft}
          disabled={loading || !text.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0062ff] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0062ff]/20 hover:bg-[#0057e6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Generando…" : "Pedir borrador al equipo"}
        </button>
      </div>

      {output ? (
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Borrador generado
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Copy className="h-3 w-3" />
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre className="max-h-[360px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-200">
            {output}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
