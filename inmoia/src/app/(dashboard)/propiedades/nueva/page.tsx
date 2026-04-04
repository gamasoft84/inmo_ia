"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Steps } from "@/components/ui/Steps";
import { PropertyAIOnboarding, type AIOnboardingResult } from "@/components/properties/PropertyAIOnboarding";

const steps = [
  { id: "datos", label: "Datos" },
  { id: "fotos", label: "Fotos" },
  { id: "descripcion", label: "Descripcion" },
  { id: "publicar", label: "Publicar" },
];

export default function NuevaPropiedadPage() {
  const supabase = createClient();
  const [current, setCurrent] = useState("datos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [agencyId, setAgencyId] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id;
      if (!uid) return;
      supabase.from("users").select("agency_id").eq("id", uid).single().then(({ data: row }) => {
        if (row?.agency_id) setAgencyId(String(row.agency_id));
      });
    });
  }, [supabase]);

  const [form, setForm] = useState({
    type: "casa",
    operation: "sale",
    city: "",
    price_mxn: "",
    area_total: "",
    bedrooms: "",
    photos: "",
    title_es: "",
    desc_es: "",
    publish: true,
  });

  const stepIndex = steps.findIndex((step) => step.id === current);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAIOnboarding(result: AIOnboardingResult) {
    setForm((prev) => ({
      ...prev,
      type:      result.type || prev.type,
      bedrooms:  result.bedrooms ? String(result.bedrooms) : prev.bedrooms,
      area_total: prev.area_total,
      photos:    result.photoUrls.join("\n"),
      title_es:  result.title_es || prev.title_es,
      desc_es:   result.desc_es  || prev.desc_es,
      price_mxn: result.estimated_price_min ? String(result.estimated_price_min) : prev.price_mxn,
    }));
    setOk("✦ Claude Vision completó el formulario. Revisa y ajusta los datos.");
    setCurrent("datos");
  }

  const canNext = useMemo(() => {
    if (current === "datos") {
      return !!form.city && !!form.price_mxn;
    }
    if (current === "fotos") {
      return form.photos.trim().length > 0;
    }
    if (current === "descripcion") {
      return !!form.title_es && !!form.desc_es;
    }
    return true;
  }, [current, form.city, form.desc_es, form.photos, form.price_mxn, form.title_es]);

  async function generateDescription() {
    const city = form.city || "tu ciudad";
    const area = form.area_total || "amplia";
    const beds = form.bedrooms || "2";

    const ai = await fetch("/api/ai/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.type,
        operation: form.operation,
        city: form.city,
        area_total: form.area_total,
        bedrooms: form.bedrooms,
        photos: form.photos,
      }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as { title_es?: string; desc_es?: string; source?: string; fallback_reason?: string };
      })
      .catch(() => null);

    const title = ai?.title_es || `${form.type.toUpperCase()} en ${city}`;
    const desc = ai?.desc_es || `Propiedad en ${city} con ${area}m2 y ${beds} recamaras. Ideal para ${
      form.operation === "rent" ? "renta" : "venta"
    }. Contactanos para conocer disponibilidad y agendar visita.`;
    setForm((prev) => ({ ...prev, title_es: title, desc_es: desc }));
    if (ai?.source === "anthropic") {
      setOk("Descripcion generada con Claude.");
    } else if (ai?.fallback_reason === "missing_api_key") {
      setOk("Descripcion generada con fallback local (falta ANTHROPIC_API_KEY).");
    } else if (ai?.fallback_reason === "invalid_model_json") {
      setOk("Descripcion generada con fallback local (respuesta no valida de Claude).");
    } else {
      setOk("Descripcion generada con fallback local.");
    }
    setError("");
  }

  async function publishProperty() {
    setLoading(true);
    setError("");
    setOk("");

    try {
      // Obtén userId y email del cliente
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      const userEmail = authData.user?.email;

      if (!userId || !userEmail) {
        setError("Sesion no valida. Inicia sesion de nuevo.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/properties/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          userEmail,
          type: form.type,
          operation: form.operation,
          city: form.city,
          price_mxn: form.price_mxn,
          area_total: form.area_total,
          bedrooms: form.bedrooms,
          photos: form.photos,
          title_es: form.title_es,
          desc_es: form.desc_es,
          publish: form.publish,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "No se pudo guardar la propiedad.");
        setLoading(false);
        return;
      }

      setOk("Propiedad guardada correctamente.");
      setCurrent("publicar");
      window.setTimeout(() => {
        window.location.href = `/p/${result.slug || result.id}`;
      }, 600);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Error inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function goNext() {
    if (current === "datos") setCurrent("fotos");
    else if (current === "fotos") setCurrent("descripcion");
    else if (current === "descripcion") setCurrent("publicar");
  }

  function goBack() {
    if (current === "publicar") setCurrent("descripcion");
    else if (current === "descripcion") setCurrent("fotos");
    else if (current === "fotos") setCurrent("datos");
  }

  return (
    <PageWrapper
      title="Nueva propiedad"
      actions={
        <>
          <Button variant="brand-soft" ai onClick={generateDescription}>
            Generar descripcion
          </Button>
          <Button variant="primary" onClick={publishProperty}>
            Guardar borrador
          </Button>
        </>
      }
    >
      <div className="grid gap-3 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <div className="border-b-[0.5px] border-border-tertiary p-3">
            <Steps steps={steps} current={current} />
          </div>

          {error ? (
            <div className="mx-3 mt-3 rounded-[8px] border-[0.5px] border-error-border bg-error-light p-2 text-[11px] text-error">{error}</div>
          ) : null}
          {ok ? (
            <div className="mx-3 mt-3 rounded-[8px] border-[0.5px] border-success-border bg-success-light p-2 text-[11px] text-success">{ok}</div>
          ) : null}

          {current === "datos" ? (
            <div className="grid gap-3 p-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TIPO DE PROPIEDAD</label>
                <select className="input-base" value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="casa">Casa</option>
                  <option value="depto">Depto</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">OPERACION</label>
                <select className="input-base" value={form.operation} onChange={(e) => update("operation", e.target.value)}>
                  <option value="sale">Venta</option>
                  <option value="rent">Renta</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">CIUDAD</label>
                <input className="input-base" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">PRECIO (MXN)</label>
                <input className="input-base" value={form.price_mxn} onChange={(e) => update("price_mxn", e.target.value.replace(/\D/g, ""))} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SUPERFICIE</label>
                <input className="input-base" value={form.area_total} onChange={(e) => update("area_total", e.target.value.replace(/\D/g, ""))} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">RECAMARAS</label>
                <input className="input-base" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>
          ) : null}

          {current === "fotos" ? (
            <div className="grid gap-3 p-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">URLS DE FOTOS (una por linea)</label>
                <textarea
                  className="input-base min-h-[140px]"
                  value={form.photos}
                  onChange={(e) => update("photos", e.target.value)}
                  placeholder="https://.../foto1.jpg"
                />
              </div>
              <Button variant="brand-soft" ai onClick={generateDescription}>Analizar fotos ✦</Button>
            </div>
          ) : null}

          {current === "descripcion" ? (
            <div className="grid gap-3 p-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TITULO</label>
                <input className={`input-base ${form.title_es ? "ai-filled" : ""}`} value={form.title_es} onChange={(e) => update("title_es", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">DESCRIPCION</label>
                <textarea className={`input-base min-h-[140px] ${form.desc_es ? "ai-filled" : ""}`} value={form.desc_es} onChange={(e) => update("desc_es", e.target.value)} />
              </div>
              <Button variant="brand-soft" ai onClick={generateDescription}>Regenerar descripcion ✦</Button>
            </div>
          ) : null}

          {current === "publicar" ? (
            <div className="grid gap-3 p-3 text-[11px]">
              <div className="rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                <p className="text-text-tertiary">Resumen</p>
                <p className="mt-1 text-text-primary">{form.title_es || "Sin titulo"}</p>
                <p className="text-text-tertiary">{form.city} · ${Number(form.price_mxn || 0).toLocaleString("es-MX")}</p>
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.publish} onChange={(e) => update("publish", e.target.checked)} />
                Publicar como activa (si no, queda en borrador)
              </label>
              <Button variant="primary" onClick={publishProperty}>
                {loading ? "Guardando..." : "Guardar propiedad"}
              </Button>
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t-[0.5px] border-border-tertiary p-3">
            <Button variant="ghost" onClick={goBack} disabled={stepIndex <= 0}>← Anterior</Button>
            {current !== "publicar" ? (
              <Button variant="primary" onClick={goNext} disabled={!canNext}>Continuar →</Button>
            ) : (
              <Button variant="primary" onClick={publishProperty} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
            )}
          </div>
        </section>

        <section>
          <PropertyAIOnboarding
            agencyId={agencyId}
            onComplete={handleAIOnboarding}
          />
        </section>
      </div>
    </PageWrapper>
  );
}
