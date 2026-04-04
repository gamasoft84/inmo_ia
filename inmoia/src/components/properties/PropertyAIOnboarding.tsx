"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { AnalyzePhotosResult } from "@/app/api/ai/analyze-photos/route";

export type AIOnboardingResult = AnalyzePhotosResult & {
  photoUrls: string[];
};

interface Props {
  agencyId: string;
  onComplete: (result: AIOnboardingResult) => void;
}

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

const FINISH_LABELS: Record<string, string> = {
  Básico:   "Acabados básicos",
  Estándar: "Acabados estándar",
  Premium:  "Acabados premium",
  Lujo:     "Acabados de lujo",
};

export function PropertyAIOnboarding({ agencyId, onComplete }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalyzePhotosResult | null>(null);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setState("uploading");
    setProgress(10);

    const uploaded: string[] = [];
    const total = Math.min(files.length, 5);

    for (let i = 0; i < total; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("agencyId", agencyId || "general");

      const res = await fetch("/api/properties/upload-photo", {
        method: "POST",
        body: fd,
      }).catch(() => null);

      if (!res?.ok) continue;

      const data = await res.json().catch(() => null) as { url?: string } | null;
      if (data?.url) uploaded.push(data.url);
      setProgress(10 + Math.round(((i + 1) / total) * 50));
    }

    if (uploaded.length === 0) {
      setError("No se pudieron subir las fotos. Revisa la consola del servidor para más detalles.");
      setState("error");
      return;
    }

    setPhotoUrls(uploaded);
    setState("analyzing");
    setProgress(65);

    try {
      const res = await fetch("/api/ai/analyze-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrls: uploaded }),
      });

      const data = await res.json() as AnalyzePhotosResult & { source?: string };
      setProgress(100);
      setAnalysis(data);
      setState("done");
    } catch {
      setError("Error al analizar las fotos con Claude Vision.");
      setState("error");
    }
  }

  function handleApply() {
    if (!analysis) return;
    onComplete({ ...analysis, photoUrls });
  }

  return (
    <div className="rounded-[12px] border-[0.5px] border-brand-border bg-brand-light p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-medium text-brand-text">✦ Onboarding con IA</h3>
          <p className="text-[11px] text-brand-dark">Sube 3–5 fotos y Claude llena el formulario por ti</p>
        </div>
        <span className="badge-ai">✦ Claude Vision</span>
      </div>

      {/* Drop zone */}
      {state === "idle" && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-[8px] border-[1.5px] border-dashed border-brand-border bg-bg-primary py-8 text-center transition hover:bg-brand-light"
        >
          <span className="text-[28px]">📸</span>
          <span className="text-[12px] font-medium text-brand-dark">Haz clic o arrastra fotos aquí</span>
          <span className="text-[10px] text-text-tertiary">JPG, PNG · máx. 5 fotos · Claude las analiza con visión</span>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Progress */}
      {(state === "uploading" || state === "analyzing") && (
        <div className="space-y-3 py-4">
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-[12px] text-brand-dark">
              {state === "uploading" ? "Subiendo fotos..." : "✦ Claude Vision analizando..."}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-text-tertiary">
            {state === "analyzing"
              ? "Detectando tipo, recámaras, amenidades, acabados y generando descripciones..."
              : `Subiendo fotos (${progress - 10}%)...`}
          </p>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="space-y-2">
          <div className="rounded-[8px] border-[0.5px] border-error-border bg-error-light px-3 py-2 text-[11px] text-error">{error}</div>
          <Button variant="ghost" onClick={() => { setState("idle"); setError(""); }}>Intentar de nuevo</Button>
        </div>
      )}

      {/* Results */}
      {state === "done" && analysis && (
        <div className="space-y-3">
          {/* Photo thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photoUrls.map((url, i) => (
              <div key={i} className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[6px] border-[0.5px] border-brand-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          {/* Detected fields */}
          <div className="grid gap-2 rounded-[8px] border-[0.5px] border-brand-border bg-bg-primary p-3 text-[11px]">
            <p className="text-[10px] font-medium uppercase tracking-wide text-text-tertiary">Detectado por Claude Vision</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <Row label="Tipo"        value={analysis.type} />
              <Row label="Recámaras"   value={String(analysis.bedrooms)} />
              <Row label="Baños"       value={String(analysis.bathrooms)} />
              <Row label="Cajones"     value={String(analysis.parking)} />
              <Row label="Acabados"    value={FINISH_LABELS[analysis.finishes] ?? analysis.finishes} />
              <Row label="Condición"   value={analysis.condition} />
              {analysis.estimated_price_min && (
                <Row
                  label="Precio estimado"
                  value={`$${analysis.estimated_price_min.toLocaleString("es-MX")} – $${(analysis.estimated_price_max ?? 0).toLocaleString("es-MX")}`}
                />
              )}
              <Row
                label="Score IA"
                value={`${analysis.ai_score}/100`}
                badge={analysis.ai_score >= 70 ? "success" : "neutral"}
              />
            </div>
            {analysis.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {analysis.amenities.map((a) => (
                  <span key={a} className="rounded-full bg-brand-light px-2 py-[2px] text-[9px] font-medium text-brand-dark">
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Confidence badge */}
          <div className="flex items-center justify-between text-[10px] text-text-tertiary">
            <span>Confianza del análisis: {Math.round((analysis.confidence ?? 0) * 100)}%</span>
            <button
              type="button"
              onClick={() => { setState("idle"); setPhotoUrls([]); setAnalysis(null); }}
              className="text-brand-dark underline"
            >
              Cambiar fotos
            </button>
          </div>

          <Button variant="brand-soft" ai onClick={handleApply} className="w-full justify-center">
            ✦ Aplicar al formulario
          </Button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, badge }: { label: string; value: string; badge?: "success" | "neutral" }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-text-tertiary">{label}</span>
      <span className={`font-medium ${badge === "success" ? "text-success" : "text-text-primary"}`}>{value}</span>
    </div>
  );
}
