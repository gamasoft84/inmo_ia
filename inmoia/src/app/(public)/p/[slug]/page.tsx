"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

type Row = Record<string, unknown>;

export default function PublicPropertyPage() {
  const supabase = createClient();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [lang, setLang] = useState<"es" | "en">("es");
  const [property, setProperty] = useState<Row | null>(null);
  const [similar, setSimilar] = useState<Row[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!slug) return;

      let propertyData: Row | null = null;

      const bySlug = await supabase.from("properties").select("*").eq("slug", slug).maybeSingle();
      if (!bySlug.error && bySlug.data) {
        propertyData = bySlug.data;
      } else {
        const byId = await supabase.from("properties").select("*").eq("id", slug).maybeSingle();
        if (!byId.error && byId.data) {
          propertyData = byId.data;
        }
      }

      if (!mounted) return;
      setProperty(propertyData);

      if (propertyData?.city) {
        const similarRes = await supabase
          .from("properties")
          .select("*")
          .eq("city", propertyData.city)
          .neq("id", propertyData.id)
          .limit(2);
        if (mounted) {
          setSimilar(similarRes.data ?? []);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [slug, supabase]);

  const titleRaw = lang === "en" ? property?.title_en ?? property?.title_es : property?.title_es ?? property?.title_en;
  const descriptionRaw = lang === "en" ? property?.desc_en ?? property?.desc_es : property?.desc_es ?? property?.desc_en;
  const title = typeof titleRaw === "string" ? titleRaw : "Propiedad";
  const description = typeof descriptionRaw === "string" ? descriptionRaw : "Descripcion no disponible.";
  const operationLabel = property?.operation === "rent" ? "EN RENTA" : "EN VENTA";
  const areaTotal = typeof property?.area_total === "number" ? property.area_total : "--";
  const bedrooms = typeof property?.bedrooms === "number" ? property.bedrooms : 0;
  const bathrooms = typeof property?.bathrooms === "number" ? property.bathrooms : 0;
  const parking = typeof property?.parking === "number" ? property.parking : 0;
  const city = typeof property?.city === "string" ? property.city : "Sin ciudad";

  return (
    <main className="min-h-screen bg-bg-secondary">
      <nav className="flex items-center justify-between border-b-[0.5px] border-border-tertiary bg-bg-primary px-4 py-2">
        <div className="text-[13px] font-medium text-text-primary">🌊 InmoIA</div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLang("es")}
            className="rounded-[6px] border-[0.5px] border-border-secondary bg-bg-secondary px-2 py-1 text-[10px]"
          >
            🇲🇽 ES
          </button>
          <button
            onClick={() => setLang("en")}
            className="rounded-[6px] border-[0.5px] border-border-secondary bg-bg-secondary px-2 py-1 text-[10px]"
          >
            🇺🇸 EN
          </button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <div className="flex h-[280px] items-center justify-center bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-[80px]">
            🏡
          </div>

          <div className="space-y-3 p-4">
            <p className="text-[10px] font-semibold tracking-[0.04em] text-brand">{operationLabel}</p>
            <h1 className="text-[20px] font-medium tracking-[-0.02em] text-text-primary">{title}</h1>
            <p className="text-[24px] font-medium text-brand-dark">
              {property?.price_mxn ? `$${Number(property.price_mxn).toLocaleString("es-MX")}` : "Precio por definir"}
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-text-secondary">
              <span>📐 {areaTotal}m²</span>
              <span>🛏 {bedrooms} rec</span>
              <span>🚿 {bathrooms} baños</span>
              <span>🚗 {parking} estacionamientos</span>
            </div>

            <p className="text-[12px] leading-relaxed text-text-secondary">
              {description}
            </p>

            <div className="rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
              <p className="text-[10px] text-text-tertiary">Ubicacion aproximada</p>
              <p className="mt-1 text-[12px] font-medium text-text-primary">{city}</p>
              <p className="mt-1 text-[10px] text-text-tertiary">Por privacidad, la direccion exacta se comparte al confirmar interes.</p>
            </div>
          </div>
        </article>

        <aside className="space-y-3">
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h2 className="text-[12px] font-medium">Agenda una visita</h2>
            <p className="mt-1 text-[11px] text-text-tertiary">Respuesta en minutos por WhatsApp.</p>
            <div className="mt-3 space-y-2">
              <Button variant="primary" full>
                📅 Agendar visita
              </Button>
              <Button variant="whatsapp" full>
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h3 className="text-[12px] font-medium">Propiedades similares</h3>
            <div className="mt-2 space-y-2">
              {similar.map((item) => (
                <Link key={String(item.id ?? "")} href={`/p/${String(item.slug ?? item.id ?? "")}`} className="block rounded-[8px] border-[0.5px] border-border-tertiary p-2">
                  <p className="text-[11px] font-medium text-text-primary">🏠 {typeof item.title_es === "string" ? item.title_es : "Propiedad"}</p>
                  <p className="text-[10px] text-brand-dark">
                    {item.price_mxn ? `$${Number(item.price_mxn).toLocaleString("es-MX")}` : "Precio por definir"}
                  </p>
                </Link>
              ))}
              {similar.length === 0 ? <p className="text-[10px] text-text-tertiary">Sin propiedades similares por ahora.</p> : null}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
