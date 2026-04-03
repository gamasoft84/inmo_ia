import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type SummaryItem = {
  leadId: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
};

const MOCK_SUMMARIES: SummaryItem[] = [
  {
    leadId: "mock-carlos",
    name: "Carlos Mendoza",
    avatar: "C",
    preview: "¿Cuando puedo ver la casa?",
    time: "5 min",
    unread: true,
  },
];

const MOCK_THREAD = [
  { id: "m1", role: "bot", content: "¡Hola! Soy Sofia 🏡 ¿En que puedo ayudarte?", created_at: new Date().toISOString(), is_read: true },
  { id: "m2", role: "client", content: "Me interesa la Casa Coyoacan", created_at: new Date().toISOString(), is_read: false },
];

function initialsFromName(name: string) {
  const clean = name.trim();
  if (!clean) return "?";
  const parts = clean.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function relativeTime(dateIso: string) {
  const date = new Date(dateIso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return "ayer";
}

function extractAgencyId(req: NextRequest) {
  const byQuery = req.nextUrl.searchParams.get("agencyId")?.trim();
  const byHeader = req.headers.get("x-agency-id")?.trim();
  return byQuery || byHeader || null;
}

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("leadId");
  const agencyId = extractAgencyId(req);
  if (!agencyId) {
    return NextResponse.json(
      { ok: false, error: "agencyId is required (query param agencyId or header x-agency-id)" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  if (!supabase) {
    if (leadId) {
      return NextResponse.json({ ok: true, mode: "thread", data: MOCK_THREAD, mock: true });
    }
    return NextResponse.json({ ok: true, mode: "summary", data: MOCK_SUMMARIES, mock: true });
  }

  if (leadId) {
    const thread = await supabase
      .from("conversations")
      .select("id, role, content, created_at, is_read")
      .eq("agency_id", agencyId)
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true })
      .limit(300);

    if (thread.error) {
      return NextResponse.json({ ok: false, error: thread.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, mode: "thread", data: thread.data ?? [] });
  }

  const recent = await supabase
    .from("conversations")
    .select("lead_id, content, created_at, is_read")
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: false })
    .limit(400);

  if (recent.error) {
    return NextResponse.json({ ok: false, error: recent.error.message }, { status: 500 });
  }

  const latestByLead = new Map<string, { content: string; created_at: string; is_read: boolean }>();
  for (const row of recent.data ?? []) {
    if (!row.lead_id) continue;
    if (!latestByLead.has(row.lead_id)) {
      latestByLead.set(row.lead_id, {
        content: row.content ?? "",
        created_at: row.created_at ?? new Date().toISOString(),
        is_read: row.is_read ?? false,
      });
    }
  }

  const leadIds = Array.from(latestByLead.keys());
  if (leadIds.length === 0) {
    return NextResponse.json({ ok: true, mode: "summary", data: [] });
  }

  const leads = await supabase
    .from("leads")
    .select("id, name, phone")
    .in("id", leadIds);

  if (leads.error) {
    return NextResponse.json({ ok: false, error: leads.error.message }, { status: 500 });
  }

  const leadMap = new Map((leads.data ?? []).map((lead) => [lead.id, lead]));

  const summaries: SummaryItem[] = leadIds
    .map((id) => {
      const latest = latestByLead.get(id);
      const lead = leadMap.get(id);
      const name = lead?.name?.trim() || lead?.phone || "Lead sin nombre";

      return {
        leadId: id,
        name,
        avatar: initialsFromName(name),
        preview: latest?.content ?? "Sin mensajes",
        time: relativeTime(latest?.created_at ?? new Date().toISOString()),
        unread: !(latest?.is_read ?? true),
      };
    })
    .sort((a, b) => (a.time === "ahora" ? -1 : 1) - (b.time === "ahora" ? -1 : 1));

  return NextResponse.json({ ok: true, mode: "summary", data: summaries });
}

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const leadId = String(payload?.leadId ?? "").trim();
  const content = String(payload?.content ?? "").trim();
  const agencyId = (
    req.nextUrl.searchParams.get("agencyId")
    || req.headers.get("x-agency-id")
    || payload?.agencyId
  )?.toString().trim();

  if (!agencyId || !leadId || !content) {
    return NextResponse.json(
      { ok: false, error: "agencyId, leadId and content are required" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  const lead = await supabase
    .from("leads")
    .select("id, agency_id")
    .eq("id", leadId)
    .eq("agency_id", agencyId)
    .maybeSingle();

  if (lead.error || !lead.data?.agency_id) {
    return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  }

  const inserted = await supabase.from("conversations").insert({
    lead_id: leadId,
    agency_id: agencyId,
    role: "agent",
    content,
    is_read: true,
  });

  if (inserted.error) {
    return NextResponse.json({ ok: false, error: inserted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
