import twilio from "twilio";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) return null;
  return twilio(sid, token);
}

export async function sendWhatsAppMessage(to: string, body: string) {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const client = getTwilioClient();

  if (!client || !from) {
    return { ok: false as const, skipped: true as const, reason: "Twilio env vars missing" };
  }

  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  const response = await client.messages.create({
    from,
    to: normalizedTo,
    body,
  });

  return {
    ok: true as const,
    skipped: false as const,
    sid: response.sid,
  };
}

export function validateTwilioWebhookSignature({
  signature,
  url,
  body,
}: {
  signature: string | null;
  url: string;
  body: Record<string, string>;
}) {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || !signature) return false;

  return twilio.validateRequest(token, signature, url, body);
}
