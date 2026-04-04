"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { Property, PropertyStatus } from "@/types";

const PROPERTY_STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "draft",    label: "Borrador"  },
  { value: "active",   label: "Activa"    },
  { value: "paused",   label: "Pausada"   },
  { value: "sold",     label: "Vendida"   },
  { value: "rented",   label: "Rentada"   },
  { value: "archived", label: "Archivada" },
];

type FormState = {
  type: string;
  operation: string;
  status: PropertyStatus;
  title_es: string;
  title_en: string;
  desc_es: string;
  desc_en: string;
  desc_whatsapp_es: string;
  desc_instagram_es: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  price_mxn: string;
  price_usd: string;
  area_total: string;
  area_built: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  photos: string;
  is_featured: boolean;
  publish_portals: boolean;
};

function propertyToForm(p: Property): FormState {
  return {
    type:             p.type ?? "casa",
    operation:        p.operation ?? "sale",
    status:           p.status ?? "draft",
    title_es:         p.title_es ?? "",
    title_en:         p.title_en ?? "",
    desc_es:          p.desc_es ?? "",
    desc_en:          p.desc_en ?? "",
    desc_whatsapp_es: p.desc_whatsapp_es ?? "",
    desc_instagram_es:p.desc_instagram_es ?? "",
    city:             p.city ?? "",
    state:            p.state ?? "",
    neighborhood:     p.neighborhood ?? "",
    address:          p.address ?? "",
    price_mxn:        p.price_mxn != null ? String(p.price_mxn) : "",
    price_usd:        p.price_usd != null ? String(p.price_usd) : "",
    area_total:       p.area_total != null ? String(p.area_total) : "",
    area_built:       p.area_built != null ? String(p.area_built) : "",
    bedrooms:         String(p.bedrooms ?? ""),
    bathrooms:        String(p.bathrooms ?? ""),
    parking:          String(p.parking ?? ""),
    photos:           (p.photos ?? []).join("\n"),
    is_featured:      p.is_featured ?? false,
    publish_portals:  p.publish_portals ?? true,
  };
}

export default function EditarPropiedadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [tab, setTab] = useState<"datos" | "descripcion" | "media" | "publicacion">("datos");
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then((r) => r.json())
      .then((body) => {
        if (body.property) {
          setForm(propertyToForm(body.property as Property));
        } else {
          setError("No se encontró la propiedad.");
        }
      })
      .catch(() => setError("Error al cargar la propiedad."))
      .finally(() => setLoading(false));
  }, [params.id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function generateDescription() {
    if (!form) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:       form.type,
          operation:  form.operation,
          city:       form.city,
          area_total: form.area_total,
          bedrooms:   form.bedrooms,
          photos:     form.photos,
        }),
      });
      const data = await res.json();
      if (data.title_es) update("title_es", data.title_es);
      if (data.desc_es)  update("desc_es", data.desc_es);
      setOk(data.source === "anthropic" ? "✦ Descripción generada con Claude." : "Descripción generada con fallback local.");
    } catch {
      setError("No se pudo generar la descripción.");
    } finally {
      setGenerating(false);
    }
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      const res = await fetch(`/api/properties/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photos: form.photos.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar.");
        return;
      }
      setOk("Cambios guardados correctamente.");
    } catch {
      setError("Error inesperado al guardar.");
    } finally {
      setSaving(false);
    }
  }

  const TABS = [
    { id: "datos",       label: "Datos"        },
    { id: "descripcion", label: "Descripción"  },
    { id: "media",       label: "Fotos"        },
    { id: "publicacion", label: "Publicación"  },
  ] as const;

  if (loading) {
    return (
      <PageWrapper title="Editar propiedad">
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }

  if (!form) {
    return (
      <PageWrapper title="Editar propiedad">
        <div className="rounded-[12px] border-[0.5px] border-error-border bg-error-light p-6 text-center text-[12px] text-error">
          {error || "Propiedad no encontrada."}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Editar propiedad"
      actions={
        <>
          <Button variant="ghost" onClick={() => router.push("/propiedades")}>Cancelar</Button>
          <Button variant="brand-soft" ai onClick={generateDescription} disabled={generating}>
            {generating ? "Generando..." : "✦ Regenerar descripción"}
          </Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </>
      }
    >
      {/* Feedback */}
      {error && (
        <div className="mb-3 rounded-[8px] border-[0.5px] border-error-border bg-error-light px-3 py-2 text-[11px] text-error">{error}</div>
      )}
      {ok && (
        <div className="mb-3 rounded-[8px] border-[0.5px] border-success-border bg-success-light px-3 py-2 text-[11px] text-success">{ok}</div>
      )}

      <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        {/* Tabs */}
        <div className="flex border-b-[0.5px] border-border-tertiary">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-[11px] font-medium transition-colors ${
                tab === t.id
                  ? "border-b-2 border-brand text-brand"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* TAB: DATOS */}
          {tab === "datos" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TIPO</label>
                <select className="input-base" value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="casa">Casa</option>
                  <option value="depto">Departamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="local">Local comercial</option>
                  <option value="oficina">Oficina</option>
                  <option value="bodega">Bodega</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">OPERACIÓN</label>
                <select className="input-base" value={form.operation} onChange={(e) => update("operation", e.target.value)}>
                  <option value="sale">Venta</option>
                  <option value="rent">Renta</option>
                  <option value="both">Venta y Renta</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">CIUDAD</label>
                <input className="input-base" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="CDMX, Huatulco..." />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">ESTADO</label>
                <input className="input-base" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="CDMX, Oaxaca..." />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">COLONIA / BARRIO</label>
                <input className="input-base" value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">DIRECCIÓN</label>
                <input className="input-base" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">PRECIO VENTA (MXN)</label>
                <input className="input-base" value={form.price_mxn} onChange={(e) => update("price_mxn", e.target.value.replace(/\D/g, ""))} placeholder="0" />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">PRECIO (USD)</label>
                <input className="input-base" value={form.price_usd} onChange={(e) => update("price_usd", e.target.value.replace(/\D/g, ""))} placeholder="0" />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SUPERFICIE TOTAL (m²)</label>
                <input className="input-base" value={form.area_total} onChange={(e) => update("area_total", e.target.value.replace(/\D/g, ""))} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SUPERFICIE CONSTRUIDA (m²)</label>
                <input className="input-base" value={form.area_built} onChange={(e) => update("area_built", e.target.value.replace(/\D/g, ""))} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">RECÁMARAS</label>
                <input className="input-base" type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">BAÑOS</label>
                <input className="input-base" type="number" min="0" step="0.5" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">ESTACIONAMIENTOS</label>
                <input className="input-base" type="number" min="0" value={form.parking} onChange={(e) => update("parking", e.target.value)} />
              </div>
            </div>
          )}

          {/* TAB: DESCRIPCIÓN */}
          {tab === "descripcion" && (
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TÍTULO (ES)</label>
                <input
                  className={`input-base ${form.title_es ? "ai-filled" : ""}`}
                  value={form.title_es}
                  onChange={(e) => update("title_es", e.target.value)}
                  placeholder="Ej: Casa residencial en Coyoacán"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TÍTULO (EN)</label>
                <input className="input-base" value={form.title_en} onChange={(e) => update("title_en", e.target.value)} placeholder="Residential house in Coyoacán" />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">DESCRIPCIÓN PORTAL (ES)</label>
                <textarea
                  className={`input-base min-h-[120px] ${form.desc_es ? "ai-filled" : ""}`}
                  value={form.desc_es}
                  onChange={(e) => update("desc_es", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">DESCRIPCIÓN PORTAL (EN)</label>
                <textarea className="input-base min-h-[100px]" value={form.desc_en} onChange={(e) => update("desc_en", e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">DESCRIPCIÓN WHATSAPP</label>
                <textarea
                  className={`input-base min-h-[80px] ${form.desc_whatsapp_es ? "ai-filled" : ""}`}
                  value={form.desc_whatsapp_es}
                  onChange={(e) => update("desc_whatsapp_es", e.target.value)}
                  placeholder="Versión corta para mandar por WA"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">DESCRIPCIÓN INSTAGRAM</label>
                <textarea
                  className={`input-base min-h-[80px] ${form.desc_instagram_es ? "ai-filled" : ""}`}
                  value={form.desc_instagram_es}
                  onChange={(e) => update("desc_instagram_es", e.target.value)}
                  placeholder="Caption con emojis para redes"
                />
              </div>

              <Button variant="brand-soft" ai onClick={generateDescription} disabled={generating}>
                {generating ? "Generando..." : "✦ Regenerar con Claude"}
              </Button>
            </div>
          )}

          {/* TAB: FOTOS */}
          {tab === "media" && (
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">URLs DE FOTOS (una por línea)</label>
                <textarea
                  className="input-base min-h-[180px]"
                  value={form.photos}
                  onChange={(e) => update("photos", e.target.value)}
                  placeholder={"https://storage.supabase.co/.../foto1.jpg\nhttps://..."}
                />
              </div>

              {/* Preview */}
              {form.photos.trim() && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {form.photos.split("\n").map((url) => url.trim()).filter(Boolean).slice(0, 8).map((url, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  ))}
                </div>
              )}

              <Button variant="brand-soft" ai onClick={generateDescription} disabled={generating}>
                {generating ? "Analizando..." : "✦ Analizar fotos con Claude Vision"}
              </Button>
            </div>
          )}

          {/* TAB: PUBLICACIÓN */}
          {tab === "publicacion" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">ESTATUS</label>
                <select className="input-base" value={form.status} onChange={(e) => update("status", e.target.value as PropertyStatus)}>
                  {PROPERTY_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-text-tertiary">Solo "Activa" aparece en el catálogo público y el bot la conoce.</p>
              </div>

              <div className="flex flex-col gap-3 rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                <label className="flex items-center gap-2 text-[11px] text-text-primary">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => update("is_featured", e.target.checked)}
                    className="h-3.5 w-3.5"
                  />
                  Propiedad destacada
                </label>
                <label className="flex items-center gap-2 text-[11px] text-text-primary">
                  <input
                    type="checkbox"
                    checked={form.publish_portals}
                    onChange={(e) => update("publish_portals", e.target.checked)}
                    className="h-3.5 w-3.5"
                  />
                  Publicar en portales externos
                </label>
              </div>

              <div className="md:col-span-2">
                <Button variant="primary" onClick={save} disabled={saving} className="w-full justify-center">
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
