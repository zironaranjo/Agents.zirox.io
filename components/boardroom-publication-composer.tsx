"use client";

import { useState } from "react";
import { Copy, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
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
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedImageUrl, setCopiedImageUrl] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);

  async function handleDraft() {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setOutput(null);
    setImageUrls(null);
    setCopiedDraft(false);
    setCopiedImageUrl(false);

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
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  function buildIllustrationPrompt(): string | null {
    const t = text.trim();
    const o = output?.trim();
    if (!t && !o) return null;
    const parts: string[] = [];
    if (t) parts.push(`Idea o briefing:\n${t}`);
    if (o) {
      parts.push(`Borrador del post a ilustrar:\n${o.slice(0, 2500)}`);
    }
    return parts.join("\n\n");
  }

  async function handleIllustration() {
    const prompt = buildIllustrationPrompt();
    if (!prompt || imageLoading || loading) return;

    setImageLoading(true);
    setError(null);
    setImageUrls(null);

    try {
      const res = await fetch("/api/boardroom/illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as {
        imageUrls?: string[];
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? `Error ${res.status}`);
        return;
      }

      if (!data.imageUrls?.length) {
        setError("La API no devolvió imágenes.");
        return;
      }

      setImageUrls(data.imageUrls);
    } catch {
      setError("No se pudo generar la imagen. Revisa la red o vuelve a intentar.");
    } finally {
      setImageLoading(false);
    }
  }

  async function handleCopyImageUrl() {
    const url = imageUrls?.[0];
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedImageUrl(true);
      setTimeout(() => setCopiedImageUrl(false), 2000);
    } catch {
      setError("No se pudo copiar la URL de la imagen.");
    }
  }

  return (
    <div className="rounded-2xl border border-[#0062ff]/30 bg-gradient-to-br from-[#0062ff]/10 to-slate-900/40 p-5 shadow-sm md:p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">{composerTitle}</h3>
          <p className="mt-1 text-xs text-slate-400">
            Describe canal (LinkedIn, Instagram…), tema, tono y CTA. Borrador con{" "}
            <strong className="text-slate-300">OpenRouter</strong> (
            <code className="rounded bg-slate-800 px-1 text-[10px]">OPENROUTER_API_KEY</code>
            ). Ilustración opcional con{" "}
            <strong className="text-slate-300">KIE</strong> (4o Image,{" "}
            <code className="rounded bg-slate-800 px-1 text-[10px]">KIE_API_KEY</code>
            ).
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase text-emerald-400">
            OpenRouter
          </span>
          <span className="rounded-lg bg-violet-500/15 px-2 py-1 text-[10px] font-bold uppercase text-violet-300">
            KIE
          </span>
        </div>
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

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {error ? (
            <p className="text-[11px] text-red-400">{error}</p>
          ) : (
            <p className="text-[11px] text-slate-500">
              La respuesta aparece abajo. Puedes copiarla y publicar manualmente o enlazar n8n después.
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={handleIllustration}
              disabled={
                imageLoading ||
                loading ||
                (!text.trim() && !output?.trim())
              }
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {imageLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              {imageLoading ? "Imagen…" : "Ilustración (imagen)"}
            </button>
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
        </div>
        <p className="text-[10px] text-slate-500">
          La ilustración usa tu texto y, si ya hay borrador, un extracto del mismo (puede tardar hasta ~2 min).
        </p>
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
              {copiedDraft ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre className="max-h-[360px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-200">
            {output}
          </pre>
        </div>
      ) : null}

      {imageUrls?.length ? (
        <div className="mt-5 rounded-xl border border-violet-500/30 bg-slate-950/60 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300/90">
              Ilustración generada (KIE)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyImageUrl}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-800"
              >
                <Copy className="h-3 w-3" />
                {copiedImageUrl ? "URL copiada" : "Copiar URL"}
              </button>
              <a
                href={imageUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-violet-500/50 px-2 py-1 text-[10px] font-semibold text-violet-200 hover:bg-violet-500/10"
              >
                Abrir imagen
              </a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- URL externa temporal de KIE */}
          <img
            src={imageUrls[0]}
            alt="Ilustración generada para el post"
            className="max-h-[420px] w-full rounded-lg border border-slate-700 object-contain"
          />
          <p className="mt-2 text-[10px] text-slate-500">
            Enlace temporal según política de KIE; descarga si la vas a usar más tarde.
          </p>
        </div>
      ) : null}
    </div>
  );
}
