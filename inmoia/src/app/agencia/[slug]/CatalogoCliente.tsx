"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Property = {
  id: string;
  slug: string;
  title_es: string | null;
  title_en: string | null;
  type: string | null;
  operation: string | null;
  price_mxn: number | null;
  price_usd: number | null;
  area_total: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  city: string | null;
  photos: string[] | null;
  amenities: string[] | null;
};

type Agency = {
  slug: string;
  name: string;
  brand_emoji: string | null;
  logo_url: string | null;
  whatsapp_number: string | null;
  bot_name: string | null;
};

const TYPE_OPTIONS = [
  { value: "all",     label: "Todos"    },
  { value: "casa",    label: "Casa"     },
  { value: "depto",   label: "Depto"    },
  { value: "terreno", label: "Terreno"  },
  { value: "local",   label: "Local"    },
  { value: "oficina", label: "Oficina"  },
];

const OP_OPTIONS = [
  { value: "all",   label: "Venta y renta" },
  { value: "venta", label: "Venta"         },
  { value: "renta", label: "Renta"         },
];

const TYPE_EMOJI: Record<string, string> = {
  casa: "🏡", depto: "🏢", terreno: "🌿",
  local: "🏬", oficina: "🏙️", bodega: "🏗️",
};

function fmxn(n: number) {
  return `$${n.toLocaleString("es-MX")} MXN`;
}

export function CatalogoCliente({ agency, properties }: { agency: Agency; properties: Property[] }) {
  const [query,     setQuery]    = useState("");
  const [typeF,     setTypeF]    = useState("all");
  const [opF,       setOpF]      = useState("all");
  const [cityF,     setCityF]    = useState("all");
  const [maxPrice,  setMaxPrice] = useState("");
  const [lang,      setLang]     = useState<"es" | "en">("es");

  const cities = useMemo(() => {
    const set = new Set(properties.map(p => p.city ?? "").filter(Boolean));
    return Array.from(set).sort();
  }, [properties]);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      const q = query.toLowerCase();
      const title = (lang === "en" ? p.title_en : p.title_es) ?? p.title_es ?? "";
      if (q && !title.toLowerCase().includes(q) && !(p.city ?? "").toLowerCase().includes(q)) return false;
      if (typeF !== "all" && p.type !== typeF) return false;
      if (opF  !== "all" && p.operation !== opF) return false;
      if (cityF !== "all" && p.city !== cityF) return false;
      if (maxPrice && p.price_mxn && p.price_mxn > Number(maxPrice)) return false;
      return true;
    });
  }, [properties, query, typeF, opF, cityF, maxPrice, lang]);

  const waBase = agency.whatsapp_number
    ? `https://wa.me/${agency.whatsapp_number.replace(/\D/g, "")}`
    : null;

  return (
    <div className="min-h-screen" style={{ background: "#F8F7F4", fontFamily: "system-ui, sans-serif" }}>

      {/* ── HEADER ─────────────────────────────────── */}
      <header style={{ background: "#0F0F1A" }} className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {agency.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={agency.logo_url} alt={agency.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="text-[22px]">{agency.brand_emoji ?? "🏡"}</span>
            )}
            <span className="text-[15px] font-semibold text-white">{agency.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <button
              type="button"
              onClick={() => setLang(l => l === "es" ? "en" : "es")}
              className="rounded-full border border-white/20 px-3 py-1 text-[10px] text-white/70 hover:bg-white/10"
            >
              {lang === "es" ? "🇲🇽 ES" : "🇺🇸 EN"}
            </button>
            {waBase && (
              <a
                href={`${waBase}?text=${encodeURIComponent(lang === "es" ? "Hola, me interesa conocer sus propiedades" : "Hello, I'm interested in your properties")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-3 py-1.5 text-[11px] font-medium text-white"
                style={{ background: "#25D366" }}
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #1A1430 100%)" }} className="py-12 text-center">
        <p className="text-[40px]">{agency.brand_emoji ?? "🏡"}</p>
        <h1 className="mt-2 text-[24px] font-bold text-white">{agency.name}</h1>
        <p className="mt-1 text-[13px] text-white/60">
          {lang === "es"
            ? `${filtered.length} propiedades disponibles`
            : `${filtered.length} properties available`}
        </p>
        {waBase && (
          <a
            href={`${waBase}?text=${encodeURIComponent(lang === "es" ? `Hola ${agency.bot_name ?? ""}! Me interesa una propiedad de ${agency.name}` : `Hello! I'm interested in a property from ${agency.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg transition hover:opacity-90"
            style={{ background: "#25D366" }}
          >
            💬 {lang === "es" ? `Hablar con ${agency.bot_name ?? "Sofía"}` : `Chat with ${agency.bot_name ?? "Sofia"}`}
          </a>
        )}
      </div>

      {/* ── FILTERS ────────────────────────────────── */}
      <div className="sticky top-[52px] z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
          {/* Search */}
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === "es" ? "🔍 Buscar por nombre o ciudad..." : "🔍 Search by name or city..."}
            className="mb-3 w-full rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          {/* Filter chips row */}
          <div className="flex flex-wrap gap-2">
            {/* Tipo */}
            {TYPE_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setTypeF(o.value)}
                className="rounded-full px-3 py-1 text-[11px] font-medium transition"
                style={{
                  background: typeF === o.value ? "#C8830A" : "#F3F4F6",
                  color:      typeF === o.value ? "#fff"     : "#374151",
                }}
              >
                {o.label}
              </button>
            ))}
            <div className="mx-1 w-px bg-gray-200" />
            {/* Operación */}
            {OP_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setOpF(o.value)}
                className="rounded-full px-3 py-1 text-[11px] font-medium transition"
                style={{
                  background: opF === o.value ? "#0F0F1A" : "#F3F4F6",
                  color:      opF === o.value ? "#fff"    : "#374151",
                }}
              >
                {o.label}
              </button>
            ))}
            {/* Ciudad */}
            {cities.length > 1 && (
              <select
                value={cityF}
                onChange={e => setCityF(e.target.value)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] text-gray-700 outline-none"
              >
                <option value="all">{lang === "es" ? "Todas las ciudades" : "All cities"}</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {/* Precio máx */}
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder={lang === "es" ? "Precio máx MXN" : "Max price MXN"}
              className="w-40 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] text-gray-700 outline-none"
            />
            {(query || typeF !== "all" || opF !== "all" || cityF !== "all" || maxPrice) && (
              <button
                type="button"
                onClick={() => { setQuery(""); setTypeF("all"); setOpF("all"); setCityF("all"); setMaxPrice(""); }}
                className="rounded-full bg-red-50 px-3 py-1 text-[11px] text-red-600 hover:bg-red-100"
              >
                ✕ {lang === "es" ? "Limpiar" : "Clear"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID ───────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[40px]">🏠</p>
            <p className="mt-2 text-[15px] font-medium text-gray-600">
              {lang === "es" ? "Sin propiedades para este filtro" : "No properties match this filter"}
            </p>
            <button
              type="button"
              onClick={() => { setQuery(""); setTypeF("all"); setOpF("all"); setCityF("all"); setMaxPrice(""); }}
              className="mt-3 text-[13px] text-amber-600 underline"
            >
              {lang === "es" ? "Ver todas" : "See all"}
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => {
              const title = (lang === "en" ? p.title_en : p.title_es) ?? p.title_es ?? "Propiedad";
              const photo = p.photos?.[0] ?? null;
              const waMsg = lang === "es"
                ? `Hola! Me interesa la propiedad: ${title} (${p.city ?? ""})`
                : `Hello! I'm interested in: ${title} (${p.city ?? ""})`;

              return (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-[14px] bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Photo */}
                  <Link href={`/p/${p.slug}?back=${encodeURIComponent(`/agencia/${agency.slug}`)}`} className="block">
                    {photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={photo}
                        alt={title}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-[48px]"
                           style={{ background: "linear-gradient(135deg, #C8830A22, #0F0F1A11)" }}>
                        {TYPE_EMOJI[p.type ?? ""] ?? "🏠"}
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    {/* Tags */}
                    <div className="mb-2 flex flex-wrap gap-1">
                      {p.type && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-amber-700">
                          {p.type}
                        </span>
                      )}
                      {p.operation && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold uppercase text-gray-500">
                          {p.operation}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={`/p/${p.slug}?back=${encodeURIComponent(`/agencia/${agency.slug}`)}`}>
                      <h2 className="text-[14px] font-semibold leading-snug text-gray-800 hover:text-amber-700">
                        {title}
                      </h2>
                    </Link>

                    {/* City */}
                    <p className="mt-0.5 text-[11px] text-gray-500">📍 {p.city ?? "—"}</p>

                    {/* Price */}
                    <p className="mt-2 text-[18px] font-bold" style={{ color: "#C8830A" }}>
                      {p.price_mxn ? fmxn(p.price_mxn) : (lang === "es" ? "Precio a convenir" : "Price on request")}
                    </p>

                    {/* Specs */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.bedrooms ? (
                        <span className="text-[11px] text-gray-500">🛏 {p.bedrooms}</span>
                      ) : null}
                      {p.bathrooms ? (
                        <span className="text-[11px] text-gray-500">🚿 {p.bathrooms}</span>
                      ) : null}
                      {p.area_total ? (
                        <span className="text-[11px] text-gray-500">📐 {p.area_total} m²</span>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/p/${p.slug}?back=${encodeURIComponent(`/agencia/${agency.slug}`)}`}
                        className="flex-1 rounded-[8px] py-2 text-center text-[12px] font-medium transition hover:opacity-80"
                        style={{ background: "#0F0F1A", color: "#fff" }}
                      >
                        {lang === "es" ? "Ver detalles" : "View details"}
                      </Link>
                      {waBase && (
                        <a
                          href={`${waBase}?text=${encodeURIComponent(waMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-[8px] px-3 py-2 text-[18px] transition hover:opacity-80"
                          style={{ background: "#25D366" }}
                          title="WhatsApp"
                        >
                          💬
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-6 text-center">
        <p className="text-[11px] text-gray-400">
          {agency.name} · Powered by{" "}
          <span className="font-semibold text-amber-600">✦ InmoIA</span>
        </p>
      </footer>
    </div>
  );
}
