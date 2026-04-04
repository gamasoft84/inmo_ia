"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { SkeletonBlock, SkeletonLine } from "@/components/ui/Skeleton";

type Row = Record<string, unknown>;

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isMissingSlugColumn(message?: string | null) {
  const n = (message ?? "").toLowerCase();
  return n.includes("column") && n.includes("slug") && n.includes("does not exist");
}

const TYPE_EMOJI: Record<string, string> = {
  casa: "🏡", depto: "🏢", terreno: "🌿",
  local: "🏬", oficina: "🏙️", bodega: "🏗️",
};

export default function PublicPropertyPage() {
  const supabase = createClient();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const backUrl = searchParams.get("back");
  const slug = params?.slug ?? "";

  const [lang, setLang] = useState<"es" | "en">("es");
  const [property, setProperty] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [similar, setSimilar] = useState<Row[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!slug) return;

      let data: Row | null = null;

      // 1. Por UUID
      if (isUuid(slug)) {
        const res = await supabase.from("properties").select("*").eq("id", slug).maybeSingle();
        if (!res.error && res.data) data = res.data;
      }

      // 2. Por columna slug (exacto) — prioridad sobre city-lookup
      if (!data) {
        const res = await supabase.from("properties").select("*").eq("slug", slug).maybeSingle();
        if (!res.error && res.data) {
          data = res.data;
        } else if (isMissingSlugColumn(res.error?.message)) {
          // Schema sin columna slug: fallback por ciudad extraída del slug
          const parts = slug.split("-");
          const city = parts.slice(1, -1).join(" "); // quita tipo y timestamp
          if (city) {
            const legacy = await supabase
              .from("properties")
              .select("*")
              .ilike("city", city)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            if (!legacy.error && legacy.data) data = legacy.data;
          }
        }
      }

      if (!mounted) return;
      setProperty(data);
      setLoading(false);

      if (data?.city) {
        const sim = await supabase
          .from("properties")
          .select("id, slug, title_es, price_mxn, type")
          .eq("city", data.city as string)
          .neq("id", data.id as string)
          .eq("status", "active")
          .limit(3);
        if (mounted) setSimilar(sim.data ?? []);
      }
    }

    void load();
    return () => { mounted = false; };
  }, [slug, supabase]);

  // Campos
  const photos = Array.isArray(property?.photos) ? (property.photos as string[]).filter(Boolean) : [];
  const type = typeof property?.type === "string" ? property.type : "casa";
  const emoji = TYPE_EMOJI[type] ?? "🏠";
  const titleRaw = lang === "en" ? (property?.title_en ?? property?.title_es) : (property?.title_es ?? property?.title_en);
  const descRaw = lang === "en" ? (property?.desc_en ?? property?.desc_es) : (property?.desc_es ?? property?.desc_en);
  const title = typeof titleRaw === "string" ? titleRaw : "Propiedad";
  const description = typeof descRaw === "string" ? descRaw : "";
  const operationLabel = property?.operation === "rent" ? "EN RENTA" : "EN VENTA";
  const price = typeof property?.price_mxn === "number" && property.price_mxn > 0
    ? `$${property.price_mxn.toLocaleString("es-MX")}`
    : typeof property?.price_usd === "number" && property.price_usd > 0
    ? `USD $${property.price_usd.toLocaleString("en-US")}`
    : null;
  const areaTotal = typeof property?.area_total === "number" && property.area_total > 0 ? property.area_total : null;
  const areaBuilt = typeof property?.area_built === "number" && property.area_built > 0 ? property.area_built : null;
  const bedrooms = typeof property?.bedrooms === "number" ? property.bedrooms : 0;
  const bathrooms = typeof property?.bathrooms === "number" ? property.bathrooms : 0;
  const parking = typeof property?.parking === "number" ? property.parking : 0;
  const city = typeof property?.city === "string" ? property.city : "";
  const neighborhood = typeof property?.neighborhood === "string" ? property.neighborhood : "";
  const amenities = Array.isArray(property?.amenities) ? (property.amenities as string[]).filter(Boolean) : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-secondary">
        <Nav lang={lang} onLang={setLang} backUrl={backUrl} />
        <div className="mx-auto max-w-6xl p-4">
          <SkeletonBlock className="mb-3 h-[300px] w-full" />
          <SkeletonLine className="mb-2 w-3/4" />
          <SkeletonLine className="w-1/2" />
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-bg-secondary">
        <Nav lang={lang} onLang={setLang} backUrl={backUrl} />
        <div className="mx-auto max-w-6xl p-8 text-center">
          <p className="text-[36px]">🏚</p>
          <h1 className="mt-2 text-[18px] font-medium text-text-primary">Propiedad no encontrada</h1>
          <p className="mt-1 text-[12px] text-text-tertiary">Es posible que haya sido eliminada o el enlace sea incorrecto.</p>
          <Link href="/" className="btn btn-brand mt-4 inline-flex">Ver catálogo</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-secondary">
      <Nav lang={lang} onLang={setLang} backUrl={backUrl} />

      <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">

          {/* Galería */}
          {photos.length > 0 ? (
            <div>
              <div className="relative h-[300px] w-full overflow-hidden bg-bg-tertiary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[activePhoto]}
                  alt={title}
                  className="h-full w-full object-cover"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhoto((p) => (p - 1 + photos.length) % photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-white hover:bg-black/60"
                    >‹</button>
                    <button
                      onClick={() => setActivePhoto((p) => (p + 1) % photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-white hover:bg-black/60"
                    >›</button>
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                      {activePhoto + 1}/{photos.length}
                    </span>
                  </>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto p-2">
                  {photos.map((url, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)} className={`shrink-0`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className={`h-14 w-20 rounded-[6px] object-cover transition ${
                          i === activePhoto ? "ring-2 ring-brand" : "opacity-60 hover:opacity-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-[80px]">
              {emoji}
            </div>
          )}

          <div className="space-y-4 p-4">
            <div>
              <p className="mb-1 text-[10px] font-semibold tracking-[0.04em] text-brand">{operationLabel}</p>
              <h1 className="text-[20px] font-medium leading-tight tracking-[-0.02em] text-text-primary">{title}</h1>
            </div>

            {price ? (
              <p className="text-[26px] font-medium tracking-[-0.02em] text-brand-dark">{price}</p>
            ) : (
              <p className="text-[14px] text-text-tertiary">Precio a convenir — solicita información</p>
            )}

            {/* Características */}
            <div className="flex flex-wrap gap-3 text-[12px] text-text-secondary">
              {areaTotal && <span className="flex items-center gap-1"><span>📐</span>{areaTotal}m² total</span>}
              {areaBuilt && <span className="flex items-center gap-1"><span>🏗</span>{areaBuilt}m² construidos</span>}
              {bedrooms > 0 && <span className="flex items-center gap-1"><span>🛏</span>{bedrooms} rec.</span>}
              {bathrooms > 0 && <span className="flex items-center gap-1"><span>🚿</span>{bathrooms} baños</span>}
              {parking > 0 && <span className="flex items-center gap-1"><span>🚗</span>{parking} cajones</span>}
            </div>

            {/* Amenidades */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((a) => (
                  <span key={a} className="rounded-full border-[0.5px] border-brand-border bg-brand-light px-2.5 py-[3px] text-[10px] font-medium text-brand-text">
                    {a}
                  </span>
                ))}
              </div>
            )}

            {/* Descripción */}
            {description && (
              <p className="text-[12px] leading-relaxed text-text-secondary">{description}</p>
            )}

            {/* Ubicación */}
            {(city || neighborhood) && (
              <div className="rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                <p className="text-[10px] text-text-tertiary">Ubicación aproximada</p>
                <p className="mt-0.5 text-[12px] font-medium text-text-primary">
                  {[neighborhood, city].filter(Boolean).join(", ")}
                </p>
                <p className="mt-1 text-[10px] text-text-tertiary">
                  La dirección exacta se comparte al confirmar interés.
                </p>
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-3">
          {/* CTA */}
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
            <h2 className="text-[13px] font-medium text-text-primary">¿Te interesa esta propiedad?</h2>
            <p className="mt-1 text-[11px] text-text-tertiary">Sofía te responde en minutos por WhatsApp.</p>
            <div className="mt-3 space-y-2">
              <Button variant="primary" full>📅 Agendar visita</Button>
              <Button variant="whatsapp" full>💬 WhatsApp</Button>
            </div>
          </div>

          {/* Resumen */}
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">Ficha técnica</h3>
            <div className="space-y-2 text-[11px]">
              <SummaryRow label="Tipo" value={type.charAt(0).toUpperCase() + type.slice(1)} />
              <SummaryRow label="Operación" value={operationLabel} />
              {areaTotal && <SummaryRow label="Superficie total" value={`${areaTotal} m²`} />}
              {areaBuilt && <SummaryRow label="Sup. construida" value={`${areaBuilt} m²`} />}
              {bedrooms > 0 && <SummaryRow label="Recámaras" value={String(bedrooms)} />}
              {bathrooms > 0 && <SummaryRow label="Baños" value={String(bathrooms)} />}
              {parking > 0 && <SummaryRow label="Estacionamiento" value={String(parking)} />}
              {city && <SummaryRow label="Ciudad" value={city} />}
            </div>
          </div>

          {/* Similares */}
          {similar.length > 0 && (
            <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
              <h3 className="mb-2 text-[12px] font-medium text-text-primary">Propiedades similares</h3>
              <div className="space-y-2">
                {similar.map((item) => (
                  <Link
                    key={String(item.id ?? "")}
                    href={`/p/${String(item.slug ?? item.id ?? "")}`}
                    className="block rounded-[8px] border-[0.5px] border-border-tertiary p-2 hover:bg-bg-secondary"
                  >
                    <p className="text-[11px] font-medium text-text-primary">
                      {TYPE_EMOJI[String(item.type ?? "")] ?? "🏠"} {typeof item.title_es === "string" ? item.title_es : "Propiedad"}
                    </p>
                    <p className="text-[10px] text-brand-dark">
                      {item.price_mxn ? `$${Number(item.price_mxn).toLocaleString("es-MX")}` : "Precio por definir"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function Nav({ lang, onLang, backUrl }: { lang: "es" | "en"; onLang: (l: "es" | "en") => void; backUrl?: string | null }) {
  return (
    <nav className="flex items-center justify-between border-b-[0.5px] border-border-tertiary bg-bg-primary px-4 py-2">
      {backUrl ? (
        <Link href={backUrl} className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-primary">
          ← {lang === "en" ? "Back" : "Regresar"}
        </Link>
      ) : (
        <Link href="/" className="text-[13px] font-medium text-text-primary">🌊 InmoIA</Link>
      )}
      <div className="flex items-center gap-1">
        {(["es", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => onLang(l)}
            className={`rounded-[6px] border-[0.5px] px-2 py-1 text-[10px] transition ${
              lang === l
                ? "border-brand bg-brand-light font-medium text-brand-dark"
                : "border-border-secondary bg-bg-secondary text-text-tertiary"
            }`}
          >
            {l === "es" ? "🇲🇽 ES" : "🇺🇸 EN"}
          </button>
        ))}
      </div>
    </nav>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-1.5 last:border-0 last:pb-0">
      <span className="text-text-tertiary">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}
