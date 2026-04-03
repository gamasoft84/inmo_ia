import { NextRequest, NextResponse } from "next/server";
import { handleIncomingWhatsAppMessage } from "@/lib/whatsapp/bot-handler";

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const message = String(payload?.message ?? "").trim();

  if (!message) {
    return NextResponse.json(
      { ok: false, error: "message is required" },
      { status: 400 },
    );
  }

  const result = await handleIncomingWhatsAppMessage({
    from: "api-test",
    body: message,
  });

  return NextResponse.json({
    ok: true,
    score: result.leadScore,
    temperature: result.leadTemp,
    language: result.language,
    suggestedProperties: result.matches,
    suggestedReply: result.reply,
  });
}
