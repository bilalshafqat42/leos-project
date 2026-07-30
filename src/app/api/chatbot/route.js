import { NextResponse } from "next/server";

import { deliverToChannels } from "@/lib/leadDelivery";
import { isLeadApiConfigured, sendLead } from "@/lib/leadApi";
import { isMailConfigured, sendMail } from "@/lib/mailer";

/*
 * Handles submissions from the floating chat widget
 * (src/components/floating-actions/FloatingActions.js).
 *
 * Delivers the enquiry two ways, attempted concurrently (see
 * src/lib/leadDelivery.js):
 *   - Email via Titan Email SMTP (see src/lib/mailer.js), to both the main
 *     business inbox and the chat-specific inbox.
 *   - A JSON POST to Performo (see src/lib/leadApi.js).
 * Either channel can be configured independently; the request only fails
 * if every configured channel fails.
 *
 * Required environment variables (see .env.example):
 *   SMTP_USER        - the Titan mailbox enquiries are sent from
 *   SMTP_PASSWORD    - that mailbox's password
 *   CONTACT_TO_EMAIL - main business inbox (shared with the Contact form)
 *   CHATBOT_TO_EMAIL - inbox that should receive chat widget enquiries
 *   LEAD_API_URL     - Performo endpoint to receive the lead as JSON
 *   LEAD_API_KEY     - Performo API key, sent as the x-api-key header
 *
 * Performo's /api/public/submissions accepts:
 *   { type, name, phone, email, service, message, pageUrl, conversationId,
 *     campaign }
 * type: "chat" only requires message; everything else is optional there.
 */

const DEFAULT_CONTACT_EMAIL = "info@leosproject.ae";
const DEFAULT_CHATBOT_EMAIL = "info@leosproject.ae";

// UAE mobile (5XXXXXXXX) or landline (2/3/4/6/7/9 + 7 digits), with or
// without a +971/971/0 prefix — same validation the client applies, kept
// here too since the client-side check can always be bypassed by calling
// this endpoint directly.
const UAE_PHONE_PATTERN = /^(?:\+?971|0)?(?:5\d{8}|[234679]\d{7})$/;
const INTERNATIONAL_PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

function isValidPhoneNumber(value) {
  const digits = value.replace(/[\s\-()]/g, "");
  return (
    UAE_PHONE_PATTERN.test(digits) || INTERNATIONAL_PHONE_PATTERN.test(digits)
  );
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const service = String(body?.service ?? "").trim();
  const pageUrl = String(body?.pageUrl ?? "").trim() || undefined;
  const conversationId = String(body?.conversationId ?? "").trim() || undefined;

  if (!name || !phone || !service) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!isValidPhoneNumber(phone)) {
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 400 },
    );
  }

  const toEmails = [
    ...new Set([
      process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_EMAIL,
      process.env.CHATBOT_TO_EMAIL || DEFAULT_CHATBOT_EMAIL,
    ]),
  ];

  const channels = [
    {
      name: "email",
      configured: isMailConfigured(),
      send: () =>
        sendMail({
          to: toEmails,
          subject: `New chat enquiry: ${service} — ${name}`,
          text: [
            `Name: ${name}`,
            `Phone number: ${phone}`,
            `Email: ${email || "Not provided"}`,
            `Service: ${service}`,
            "",
            "Submitted via the website chat widget.",
          ].join("\n"),
        }),
    },
    {
      name: "lead API",
      configured: isLeadApiConfigured(),
      send: () =>
        sendLead({
          type: "chat",
          message: `New chat enquiry from ${name} (${phone}) — interested in ${service}.`,
          pageUrl,
          conversationId,
          name,
          phone,
          email: email || undefined,
          service,
        }),
    },
  ];

  const { attempted, anySucceeded } = await deliverToChannels(
    channels,
    "chat widget enquiry",
  );

  if (!attempted) {
    console.error(
      "Chat widget is not configured: missing SMTP_PASSWORD and LEAD_API_URL.",
    );

    return NextResponse.json(
      {
        error:
          "The chat isn't fully configured yet. Please call or email us directly for now.",
      },
      { status: 503 },
    );
  }

  if (!anySucceeded) {
    return NextResponse.json(
      { error: "We couldn't send your enquiry. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
