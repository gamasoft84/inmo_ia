export type AgencyStatus = "trial" | "active" | "past_due" | "suspended" | "cancelled" | "archived";

export type AgencyPlan = "solo" | "agency" | "pro" | "enterprise";

export type ColorTheme = "amber" | "green" | "blue" | "coral" | "purple";

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  brand_emoji: string;
  brand_color: ColorTheme;
  dark_mode: boolean;
  plan: AgencyPlan;
  status: AgencyStatus;
  trial_ends_at: string | null;
  whatsapp_number: string | null;
  bot_name: string;
  bot_greeting_es: string | null;
  bot_greeting_en: string | null;
  bot_active_24h: boolean;
  bot_context: string | null;
  languages: string[];
  timezone: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export const AGENCY_STATUS_META: Record<
  AgencyStatus,
  { color: string; bg: string; label: string; botActive: boolean; graceDays: number }
> = {
  trial:     { color: "#185FA5", bg: "#E6F1FB", label: "Trial",      botActive: true,  graceDays: 14 },
  active:    { color: "#3B6D11", bg: "#EAF3DE", label: "Activa",     botActive: true,  graceDays: 0  },
  past_due:  { color: "#854F0B", bg: "#FAEEDA", label: "Pago pend.", botActive: true,  graceDays: 3  },
  suspended: { color: "#A32D2D", bg: "#FCEBEB", label: "Suspendida", botActive: false, graceDays: 0  },
  cancelled: { color: "#9090a8", bg: "#f0f0f0", label: "Cancelada",  botActive: false, graceDays: 0  },
  archived:  { color: "#9090a8", bg: "#f0f0f0", label: "Archivada",  botActive: false, graceDays: 0  },
};

export const PLAN_LIMITS: Record<AgencyPlan, { price_usd: number | null; agents: number; properties: number; messages: number }> = {
  solo:       { price_usd: 49,  agents: 1,        properties: 20,       messages: 500  },
  agency:     { price_usd: 149, agents: 5,        properties: 50,       messages: 1000 },
  pro:        { price_usd: 299, agents: 15,       properties: 150,      messages: 5000 },
  enterprise: { price_usd: null, agents: Infinity, properties: Infinity, messages: Infinity },
};
