import { NextRequest, NextResponse } from "next/server";
import { handleIncomingWhatsAppMessage } from "@/lib/whatsapp/bot-handler";
import { validateTwilioWebhookSignature } from "@/lib/whatsapp/twilio";
import { persistWhatsAppConversation } from "@/lib/whatsapp/persistence";

function getPublicWebhookUrl(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  return `${protocol}://${host}/api/webhook/twilio`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function twimlMessage(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
}

export async function POST(req: NextRequest) {
  try {
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

    const persisted = await persistWhatsAppConversation({
      from,
      to,
      incomingMessage: text,
      botReply: result.reply,
      leadScore: result.leadScore,
      leadTemp: result.leadTemp,
      language: result.language,
    });

    if (!persisted.ok) {
      console.warn("[twilio-webhook] persistence skipped", persisted.reason);
    }

    return new NextResponse(twimlMessage(result.reply), {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("[twilio-webhook] unhandled error", error);

    // Return fallback TwiML so the WhatsApp user still receives a response.
    return new NextResponse(
      twimlMessage("Gracias por tu mensaje. En este momento estoy validando tu solicitud. ¿Te puedo responder en unos minutos?"),
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      },
    );
  }
}
