import { createAdminClient } from "@/lib/supabase/admin";

type PersistInput = {
  from: string;
  to?: string;
  incomingMessage: string;
  botReply: string;
  leadScore: number;
  leadTemp: "hot" | "warm" | "cold";
  language: "es" | "en";
};

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/^whatsapp:/i, "").trim();
}

export async function persistWhatsAppConversation(input: PersistInput) {
  const supabase = createAdminClient();
  if (!supabase) {
    return {
      ok: false as const,
      skipped: true as const,
      reason: "Supabase admin client not configured",
    };
  }

  const phone = normalizeWhatsAppNumber(input.from);
  const toPhone = input.to ? normalizeWhatsAppNumber(input.to) : null;

  try {
    let agencyId: string | null = null;

    if (toPhone) {
      const agencyByNumber = await supabase
        .from("agencies")
        .select("id")
        .eq("whatsapp_number", toPhone)
        .maybeSingle();

      if (!agencyByNumber.error && agencyByNumber.data?.id) {
        agencyId = agencyByNumber.data.id;
      }
    }

    if (!agencyId) {
      const fallbackAgency = await supabase
        .from("agencies")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (!fallbackAgency.error && fallbackAgency.data?.id) {
        agencyId = fallbackAgency.data.id;
      }
    }

    if (!agencyId) {
      return {
        ok: false as const,
        skipped: true as const,
        reason: "No agency found to attach conversation",
      };
    }

    const existingLead = await supabase
      .from("leads")
      .select("id")
      .eq("agency_id", agencyId)
      .eq("phone", phone)
      .maybeSingle();

    let leadId: string;

    if (existingLead.error) {
      throw existingLead.error;
    }

    if (existingLead.data?.id) {
      leadId = existingLead.data.id;

      const updateLead = await supabase
        .from("leads")
        .update({
          ai_score: input.leadScore,
          temperature: input.leadTemp,
          language: input.language,
          source: "whatsapp",
          last_contact_at: new Date().toISOString(),
        })
        .eq("id", leadId);

      if (updateLead.error) {
        throw updateLead.error;
      }
    } else {
      const createLead = await supabase
        .from("leads")
        .insert({
          agency_id: agencyId,
          phone,
          source: "whatsapp",
          language: input.language,
          ai_score: input.leadScore,
          temperature: input.leadTemp,
          status: "new",
          last_contact_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createLead.error || !createLead.data?.id) {
        throw createLead.error ?? new Error("Lead insert returned no id");
      }

      leadId = createLead.data.id;
    }

    const insertClientMessage = await supabase.from("conversations").insert({
      agency_id: agencyId,
      lead_id: leadId,
      role: "client",
      content: input.incomingMessage,
      language: input.language,
      is_read: false,
    });

    if (insertClientMessage.error) {
      throw insertClientMessage.error;
    }

    const insertBotMessage = await supabase.from("conversations").insert({
      agency_id: agencyId,
      lead_id: leadId,
      role: "bot",
      content: input.botReply,
      language: input.language,
      is_read: false,
    });

    if (insertBotMessage.error) {
      throw insertBotMessage.error;
    }

    return {
      ok: true as const,
      skipped: false as const,
      agencyId,
      leadId,
    };
  } catch (error) {
    return {
      ok: false as const,
      skipped: true as const,
      reason: error instanceof Error ? error.message : "Unknown persistence error",
    };
  }
}
