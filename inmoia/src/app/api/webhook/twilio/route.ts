import { NextRequest, NextResponse } from "next/server";
import { handleIncomingWhatsAppMessage } from "@/lib/whatsapp/bot-handler";
import { validateTwilioWebhookSignature } from "@/lib/whatsapp/twilio";
import { persistWhatsAppConversation } from "@/lib/whatsapp/persistence";

function getPublicWebhookUrl(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  return `${protocol}://${host}/api/webhook/twilio`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const body = Object.fromEntries(
    Array.from(form.entries()).map(([k, v]) => [k, String(v)]),
  );

  const from = body.From ?? "";
  const text = body.Body ?? "";
  const to = body.To ?? "";

  if (!from || !text) {
    return NextResponse.json(
      { ok: false, error: "Missing From/Body payload" },
      { status: 400 },
    );
  }

  const signature = req.headers.get("x-twilio-signature");
  const shouldValidate = process.env.NODE_ENV === "production";
  if (shouldValidate) {
    const valid = validateTwilioWebhookSignature({
      signature,
      url: getPublicWebhookUrl(req),
      body,
    });

    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid Twilio signature" }, { status: 401 });
    }
  }

  const result = await handleIncomingWhatsAppMessage({
    from,
    body: text,
  });

  await persistWhatsAppConversation({
    from,
    to,
    incomingMessage: text,
    botReply: result.reply,
    leadScore: result.leadScore,
    leadTemp: result.leadTemp,
    language: result.language,
  });

  // Twilio can consume TwiML directly from webhook response.
  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${result.reply}</Message></Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
