import { contactFormSchema } from "@/features/contact/contact-schema";
import {
  dataResponse,
  errorResponse,
  parseJson,
  rateLimitRequest,
  routeError,
} from "@/features/cms/server/api-helpers";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getContactConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return null;
  }

  return { apiKey, from, to };
}

export async function POST(request: Request) {
  const limited = rateLimitRequest(request, { limit: 4, windowMs: 15 * 60_000 });

  if (limited) {
    return limited;
  }

  try {
    const payload = contactFormSchema.parse(await parseJson(request));

    if (payload.website) {
      return dataResponse({ ok: true });
    }

    const config = getContactConfig();

    if (!config) {
      return errorResponse("Contact form is not configured yet.", 503);
    }

    const plainText = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      "",
      payload.message,
    ].join("\n");

    const html = `
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #111; line-height: 1.6;">
        <p><strong>New portfolio contact message</strong></p>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <pre style="white-space: pre-wrap; border: 1px solid #ddd; padding: 16px;">${escapeHtml(payload.message)}</pre>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify({
        from: config.from,
        html,
        reply_to: payload.email,
        subject: `Portfolio contact from ${payload.name}`,
        text: plainText,
        to: [config.to],
      }),
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Failed to send contact email:", details);
      return errorResponse("Message could not be sent right now.", 502);
    }

    return dataResponse({ ok: true });
  } catch (error) {
    return routeError(error);
  }
}
