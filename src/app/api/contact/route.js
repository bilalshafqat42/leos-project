import { NextResponse } from "next/server";

import { deliverToChannels } from "@/lib/leadDelivery";
import { isLeadApiConfigured, sendLead } from "@/lib/leadApi";
import { isMailConfigured, sendMail } from "@/lib/mailer";

/*
 * Handles Contact form submissions from src/components/contact/Contact.js.
 *
 * Delivers the enquiry two ways, attempted concurrently (see
 * src/lib/leadDelivery.js):
 *   - Email via Titan Email SMTP (see src/lib/mailer.js).
 *   - A JSON POST to Performo (see src/lib/leadApi.js).
 * Either channel can be configured independently; the request only fails
 * if every configured channel fails.
 *
 * Required environment variables (see .env.example):
 *   SMTP_USER        - the Titan mailbox enquiries are sent from
 *   SMTP_PASSWORD    - that mailbox's password
 *   CONTACT_TO_EMAIL - inbox that should receive enquiries
 *   LEAD_API_URL     - Performo endpoint to receive the lead as JSON
 *   LEAD_API_KEY     - Performo API key, sent as the x-api-key header
 */

const DEFAULT_TO_EMAIL = "info@leosproject.ae";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const contact = String(body?.contact ?? "").trim();
  const projectType = String(body?.projectType ?? "").trim();
  const message = String(body?.message ?? "").trim();
  const pageUrl = String(body?.pageUrl ?? "").trim() || undefined;
  const conversationId = String(body?.conversationId ?? "").trim() || undefined;

  if (!name || !contact || !projectType || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const replyTo = EMAIL_PATTERN.test(contact) ? contact : undefined;

  const channels = [
    {
      name: "email",
      configured: isMailConfigured(),
      send: () =>
        sendMail({
          to: toEmail,
          replyTo,
          subject: `New site visit request: ${projectType} — ${name}`,
          text: [
            `Name: ${name}`,
            `Phone or email: ${contact}`,
            `Project type: ${projectType}`,
            "",
            "Message:",
            message,
          ].join("\n"),
        }),
    },
    {
      name: "lead API",
      configured: isLeadApiConfigured(),
      send: () =>
        sendLead({
          type: "contact",
          message: `New site visit request from ${name} (${contact}) — ${projectType}.\n\n${message}`,
          pageUrl,
          conversationId,
        }),
    },
  ];

  const { attempted, anySucceeded } = await deliverToChannels(
    channels,
    "contact form enquiry",
  );

  if (!attempted) {
    console.error(
      "Contact form is not configured: missing SMTP_PASSWORD and LEAD_API_URL.",
    );

    return NextResponse.json(
      {
        error:
          "The contact form isn't fully configured yet. Please call or email us directly for now.",
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
