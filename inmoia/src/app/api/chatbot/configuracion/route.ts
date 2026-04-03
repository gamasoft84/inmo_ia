import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type EscalationAction = "notificar" | "notificar-y-agendar" | "tomar-control";

type BotContextConfig = {
  tone: string;
  promptBase: string;
  scheduleStart: string;
  scheduleEnd: string;
  autoScore: boolean;
  hotLeadThreshold: number;
  escalationAction: EscalationAction;
  takeoverAlert: boolean;
  alertEmail: string;
  dailySummary: boolean;
};

type BotConfigResponse = {
  botName: string;
  tone: string;
  promptBase: string;
  bot24h: boolean;
  scheduleStart: string;
  scheduleEnd: string;
  greetingEs: string;
  greetingEn: string;
  autoScore: boolean;
  hotLeadThreshold: number;
  escalationAction: EscalationAction;
  takeoverAlert: boolean;
  alertEmail: string;
  dailySummary: boolean;
};

type TableConfigRow = {
  agency_id: string;
  config: BotConfigResponse;
  updated_at: string;
};

const DEFAULT_CONFIG: BotConfigResponse = {
  botName: "Sofia",
  tone: "Profesional, calido, con emojis moderados",
  promptBase:
    "Eres Sofia, asistente inmobiliaria. Tu objetivo es calificar leads y agendar visitas con respuestas claras, empaticas y breves.",
  bot24h: true,
  scheduleStart: "08:00",
  scheduleEnd: "21:00",
  greetingEs:
    "¡Hola! Soy Sofia 🏡 de InmoIA. Te ayudo con propiedades, precios y visitas. ¿Que tipo de inmueble buscas?",
  greetingEn:
    "Hi! I am Sofia 🏡 from InmoIA. I can help with listings, pricing and visit scheduling. What are you looking for?",
  autoScore: true,
  hotLeadThreshold: 75,
  escalationAction: "notificar-y-agendar",
  takeoverAlert: true,
  alertEmail: "admin@agencia.com",
  dailySummary: true,
};

function parseBotContext(value: string | null): Partial<BotContextConfig> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as Partial<BotContextConfig>;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // Older records may store plain prompt text in this field.
    return { promptBase: value };
  }

  return {};
}

function buildConfigFromAgency(agency: Record<string, unknown>): BotConfigResponse {
  const context = parseBotContext(typeof agency.bot_context === "string" ? agency.bot_context : null);

  return {
    botName: typeof agency.bot_name === "string" ? agency.bot_name.trim() || DEFAULT_CONFIG.botName : DEFAULT_CONFIG.botName,
    tone: context.tone || DEFAULT_CONFIG.tone,
    promptBase: context.promptBase || DEFAULT_CONFIG.promptBase,
    bot24h: typeof agency.bot_active_24h === "boolean" ? agency.bot_active_24h : DEFAULT_CONFIG.bot24h,
    scheduleStart: context.scheduleStart || DEFAULT_CONFIG.scheduleStart,
    scheduleEnd: context.scheduleEnd || DEFAULT_CONFIG.scheduleEnd,
    greetingEs: typeof agency.bot_greeting_es === "string" ? agency.bot_greeting_es.trim() || DEFAULT_CONFIG.greetingEs : DEFAULT_CONFIG.greetingEs,
    greetingEn: typeof agency.bot_greeting_en === "string" ? agency.bot_greeting_en.trim() || DEFAULT_CONFIG.greetingEn : DEFAULT_CONFIG.greetingEn,
    autoScore: context.autoScore ?? DEFAULT_CONFIG.autoScore,
    hotLeadThreshold: context.hotLeadThreshold ?? DEFAULT_CONFIG.hotLeadThreshold,
    escalationAction: context.escalationAction || DEFAULT_CONFIG.escalationAction,
    takeoverAlert: context.takeoverAlert ?? DEFAULT_CONFIG.takeoverAlert,
    alertEmail: context.alertEmail || DEFAULT_CONFIG.alertEmail,
    dailySummary: context.dailySummary ?? DEFAULT_CONFIG.dailySummary,
  };
}

function hasAgencyBotColumns(agency: Record<string, unknown>) {
  return ["bot_name", "bot_greeting_es", "bot_greeting_en", "bot_active_24h", "bot_context"].some(
    (key) => key in agency,
  );
}

function isMissingRelationError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("does not exist")
    || lower.includes("relation")
    || lower.includes("42p01")
    || lower.includes("could not find the table")
  );
}

async function getDedicatedTableConfig(agencyId: string) {
  const supabase = createAdminClient();
  if (!supabase) return { data: null, missingTable: false };

  const query = await supabase
    .from("chatbot_configs")
    .select("agency_id, config, updated_at")
    .eq("agency_id", agencyId)
    .maybeSingle();

  if (query.error) {
    return {
      data: null,
      missingTable: isMissingRelationError(query.error.message),
      error: query.error.message,
    };
  }

  return {
    data: (query.data as TableConfigRow | null) ?? null,
    missingTable: false,
  };
}

async function upsertDedicatedTableConfig(agencyId: string, config: BotConfigResponse) {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const upsert = await supabase.from("chatbot_configs").upsert(
    {
      agency_id: agencyId,
      config,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "agency_id" },
  );

  if (upsert.error) {
    return {
      ok: false,
      missingTable: isMissingRelationError(upsert.error.message),
      error: upsert.error.message,
    };
  }

  return { ok: true };
}

function extractAgencyId(req: NextRequest) {
  const byQuery = req.nextUrl.searchParams.get("agencyId")?.trim();
  const byHeader = req.headers.get("x-agency-id")?.trim();
  return byQuery || byHeader || null;
}

async function resolveAgency(agencyId: string) {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const agency = await supabase
    .from("agencies")
    .select("*")
    .eq("id", agencyId)
    .maybeSingle();

  if (agency.error || !agency.data?.id) return null;
  return agency.data;
}

export async function GET(req: NextRequest) {
  const agencyId = extractAgencyId(req);
  if (!agencyId) {
    return NextResponse.json(
      { ok: false, error: "agencyId is required (query param agencyId or header x-agency-id)" },
      { status: 400 },
    );
  }

  const agency = await resolveAgency(agencyId);

  if (!agency) {
    return NextResponse.json({ ok: false, error: "Agency not found", agencyId }, { status: 404 });
  }

  const dedicated = await getDedicatedTableConfig(agency.id);
  const hasAgencyColumns = hasAgencyBotColumns(agency as Record<string, unknown>);
  const agencyConfig = hasAgencyColumns ? buildConfigFromAgency(agency as Record<string, unknown>) : null;
  if (agencyConfig) {
    return NextResponse.json({
      ok: true,
      data: agencyConfig,
      persisted: true,
      storage: "agencies",
      agencyId: agency.id,
    });
  }

  if (dedicated.data?.config) {
    return NextResponse.json({
      ok: true,
      data: { ...DEFAULT_CONFIG, ...dedicated.data.config },
      persisted: true,
      storage: "chatbot_configs",
      agencyId: agency.id,
    });
  }

  return NextResponse.json({
    ok: true,
    data: DEFAULT_CONFIG,
    persisted: false,
    storage: "default",
    agencyId: agency.id,
    warning: dedicated.missingTable ? "Create chatbot_configs table to persist bot configuration" : undefined,
  });
}

export async function PUT(req: NextRequest) {
  const payload = (await req.json().catch(() => null)) as Partial<BotConfigResponse> | null;

  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const agencyId = extractAgencyId(req);
  if (!agencyId) {
    return NextResponse.json(
      { ok: false, error: "agencyId is required (query param agencyId or header x-agency-id)" },
      { status: 400 },
    );
  }

  const agency = await resolveAgency(agencyId);
  if (!agency) {
    return NextResponse.json({ ok: false, error: "Agency not found", agencyId }, { status: 404 });
  }

  const normalized: BotConfigResponse = {
    botName: String(payload.botName ?? DEFAULT_CONFIG.botName).trim() || DEFAULT_CONFIG.botName,
    tone: String(payload.tone ?? DEFAULT_CONFIG.tone).trim() || DEFAULT_CONFIG.tone,
    promptBase: String(payload.promptBase ?? DEFAULT_CONFIG.promptBase).trim() || DEFAULT_CONFIG.promptBase,
    bot24h: Boolean(payload.bot24h ?? DEFAULT_CONFIG.bot24h),
    scheduleStart: String(payload.scheduleStart ?? DEFAULT_CONFIG.scheduleStart).trim() || DEFAULT_CONFIG.scheduleStart,
    scheduleEnd: String(payload.scheduleEnd ?? DEFAULT_CONFIG.scheduleEnd).trim() || DEFAULT_CONFIG.scheduleEnd,
    greetingEs: String(payload.greetingEs ?? DEFAULT_CONFIG.greetingEs).trim() || DEFAULT_CONFIG.greetingEs,
    greetingEn: String(payload.greetingEn ?? DEFAULT_CONFIG.greetingEn).trim() || DEFAULT_CONFIG.greetingEn,
    autoScore: Boolean(payload.autoScore ?? DEFAULT_CONFIG.autoScore),
    hotLeadThreshold: Math.max(0, Math.min(100, Number(payload.hotLeadThreshold ?? DEFAULT_CONFIG.hotLeadThreshold) || DEFAULT_CONFIG.hotLeadThreshold)),
    escalationAction: (payload.escalationAction ?? DEFAULT_CONFIG.escalationAction) as EscalationAction,
    takeoverAlert: Boolean(payload.takeoverAlert ?? DEFAULT_CONFIG.takeoverAlert),
    alertEmail: String(payload.alertEmail ?? DEFAULT_CONFIG.alertEmail).trim() || DEFAULT_CONFIG.alertEmail,
    dailySummary: Boolean(payload.dailySummary ?? DEFAULT_CONFIG.dailySummary),
  };

  const context: BotContextConfig = {
    tone: normalized.tone,
    promptBase: normalized.promptBase,
    scheduleStart: normalized.scheduleStart,
    scheduleEnd: normalized.scheduleEnd,
    autoScore: normalized.autoScore,
    hotLeadThreshold: normalized.hotLeadThreshold,
    escalationAction: normalized.escalationAction,
    takeoverAlert: normalized.takeoverAlert,
    alertEmail: normalized.alertEmail,
    dailySummary: normalized.dailySummary,
  };

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (hasAgencyBotColumns(agency as Record<string, unknown>)) {
    if ("bot_name" in agency) updatePayload.bot_name = normalized.botName;
    if ("bot_greeting_es" in agency) updatePayload.bot_greeting_es = normalized.greetingEs;
    if ("bot_greeting_en" in agency) updatePayload.bot_greeting_en = normalized.greetingEn;
    if ("bot_active_24h" in agency) updatePayload.bot_active_24h = normalized.bot24h;
    if ("bot_context" in agency) updatePayload.bot_context = JSON.stringify(context);

    const updated = await supabase
      .from("agencies")
      .update(updatePayload)
      .eq("id", agency.id);

    if (updated.error) {
      return NextResponse.json({ ok: false, error: updated.error.message }, { status: 500 });
    }

    // Keep dedicated table in sync when available for backward compatibility.
    const mirror = await upsertDedicatedTableConfig(agency.id, normalized);
    if (!mirror.ok && !mirror.missingTable) {
      console.warn("[chatbot-config] could not mirror config into chatbot_configs", mirror.error);
    }

    return NextResponse.json({ ok: true, data: normalized, storage: "agencies", agencyId: agency.id });
  }

  const fallback = await upsertDedicatedTableConfig(agency.id, normalized);
  if (!fallback.ok) {
    if (fallback.missingTable) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing table chatbot_configs",
          sql: "create table if not exists chatbot_configs (agency_id uuid primary key references agencies(id) on delete cascade, config jsonb not null, updated_at timestamptz default now());",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: fallback.error ?? "Could not persist config",
        sql: fallback.missingTable
          ? "create table if not exists chatbot_configs (agency_id uuid primary key references agencies(id) on delete cascade, config jsonb not null, updated_at timestamptz default now());"
          : undefined,
      },
      { status: fallback.missingTable ? 409 : 500 },
    );
  }

  return NextResponse.json({ ok: true, data: normalized, storage: "chatbot_configs", agencyId: agency.id });
}
