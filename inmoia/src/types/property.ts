export type PropertyStatus = "draft" | "active" | "paused" | "sold" | "rented" | "archived";

export type PropertyType = "casa" | "depto" | "terreno" | "local" | "oficina" | "bodega";

export type OperationType = "sale" | "rent" | "both";

export type PrivacyLevel = "exact" | "approximate" | "neighborhood";

export interface Property {
  id: string;
  agency_id: string;
  agent_id: string | null;
  slug: string;
  type: PropertyType;
  operation: OperationType;
  status: PropertyStatus;
  title_es: string;
  title_en: string | null;
  desc_es: string | null;
  desc_en: string | null;
  desc_whatsapp_es: string | null;
  desc_whatsapp_en: string | null;
  desc_instagram_es: string | null;
  price_mxn: number | null;
  price_usd: number | null;
  area_total: number | null;
  area_built: number | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  floors: number;
  age_years: number;
  amenities: string[];
  credits: string[];
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  lat: number | null;
  lng: number | null;
  privacy_level: PrivacyLevel;
  photos: string[];
  ai_score: number;
  ai_analysis: Record<string, unknown> | null;
  is_featured: boolean;
  publish_portals: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export const PROPERTY_TYPE_EMOJI: Record<PropertyType, string> = {
  casa:    "🏡",
  depto:   "🏢",
  terreno: "🌿",
  local:   "🏬",
  oficina: "🏙️",
  bodega:  "🏗️",
};

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  casa:    "Casa",
  depto:   "Departamento",
  terreno: "Terreno",
  local:   "Local comercial",
  oficina: "Oficina",
  bodega:  "Bodega",
};

export const PROPERTY_STATUS_META: Record<
  PropertyStatus,
  { bg: string; color: string; border: string; label: string; emoji: string; visible: boolean }
> = {
  draft:    { bg: "#f0f0f0", color: "#555",    border: "#ddd",    label: "Borrador",  emoji: "📝", visible: false },
  active:   { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97", label: "Activa",    emoji: "✅", visible: true  },
  paused:   { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775", label: "Pausada",   emoji: "⏸", visible: false },
  sold:     { bg: "#E6F1FB", color: "#185FA5", border: "#B5D4F4", label: "Vendida",   emoji: "🏆", visible: false },
  rented:   { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97", label: "Rentada",   emoji: "🔑", visible: false },
  archived: { bg: "#f0f0f0", color: "#9090a8", border: "#e0e0e0", label: "Archivada", emoji: "🗃", visible: false },
};

/** Solo status "active" aparece en catálogo público y el bot la conoce */
export function isPropertyPublic(status: PropertyStatus): boolean {
  return status === "active";
}

/** Genera slug desde datos de la propiedad */
export function generatePropertySlug(type: string, city: string, area: number, id: string): string {
  const normalize = (s: string) =>
    s.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e")
      .replace(/[íìï]/g, "i").replace(/[óòö]/g, "o")
      .replace(/[úùü]/g, "u").replace(/ñ/g, "n")
      .replace(/[^a-z0-9-]/g, "");
  return `${normalize(type)}-${normalize(city)}-${area}m2-${id.slice(0, 4)}`;
}
