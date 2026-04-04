export type LeadStatus =
  | "new"
  | "contacted"
  | "visit_scheduled"
  | "visit_done"
  | "negotiation"
  | "closed"
  | "lost";

export type LeadTemperature = "hot" | "warm" | "cold";

export type LeadSource = "whatsapp" | "portal" | "referral" | "direct";

export type UrgencyLevel = "this_month" | "3_months" | "no_rush";

export interface Lead {
  id: string;
  agency_id: string;
  agent_id: string | null;
  name: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  status: LeadStatus;
  temperature: LeadTemperature;
  ai_score: number;
  source: LeadSource;
  language: "es" | "en";
  budget_max: number | null;
  preferred_type: string | null;
  preferred_zones: string[];
  min_bedrooms: number | null;
  credit_type: string | null;
  urgency: UrgencyLevel | null;
  property_id: string | null;
  notes: string | null;
  ai_summary: string | null;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
}

export const LEAD_TEMP_META: Record<
  LeadTemperature,
  { emoji: string; bg: string; color: string; border: string; label: string; minScore: number; action: string }
> = {
  hot:  { emoji: "🔥", bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1", label: "Caliente", minScore: 75, action: "Llamar ahora"     },
  warm: { emoji: "🟡", bg: "#FAEEDA", color: "#854F0B", border: "#FAC775", label: "Tibio",    minScore: 40, action: "Agendar hoy"      },
  cold: { emoji: "🧊", bg: "#f0f0f0", color: "#9090a8", border: "#ddd",    label: "Frío",     minScore: 0,  action: "Reactivar por WA" },
};

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new:             "Nuevo",
  contacted:       "Contactado",
  visit_scheduled: "Visita agendada",
  visit_done:      "Visita realizada",
  negotiation:     "Negociación",
  closed:          "Cerrado",
  lost:            "Perdido",
};

/** Calcula temperatura a partir del score (0-100) */
export function scoreToTemperature(score: number): LeadTemperature {
  if (score >= 75) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}
