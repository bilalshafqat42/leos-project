import { NextResponse } from "next/server";

import { isMailConfigured, sendMail } from "@/lib/mailer";

/*
 * Handles submissions from the floating chat widget
 * (src/components/floating-actions/FloatingActions.js).
 *
 * Sends the enquiry by email via Titan Email SMTP (see src/lib/mailer.js).
 * Enquiries go to both the main business inbox and the chat-specific inbox.
 *
 * Required environment variables (see .env.example):
 *   SMTP_USER        - the Titan mailbox enquiries are sent from
 *   SMTP_PASSWORD    - that mailbox's password
 *   CONTACT_TO_EMAIL - main business inbox (shared with the Contact form)
 *   CHATBOT_TO_EMAIL - inbox that should receive chat widget enquiries
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
  const service = String(body?.service ?? "").trim();

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

  if (!isMailConfigured()) {
    console.error("Chat widget is not configured: missing SMTP_PASSWORD.");

    return NextResponse.json(
      {
        error:
          "The chat isn't fully configured yet. Please call or email us directly for now.",
      },
      { status: 503 },
    );
  }

  const toEmails = [
    ...new Set([
      process.env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_EMAIL,
      process.env.CHATBOT_TO_EMAIL || DEFAULT_CHATBOT_EMAIL,
    ]),
  ];

  try {
    await sendMail({
      to: toEmails,
      subject: `New chat enquiry: ${service} — ${name}`,
      text: [
        `Name: ${name}`,
        `Phone number: ${phone}`,
        `Service: ${service}`,
        "",
        "Submitted via the website chat widget.",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send chat widget email:", error);

    return NextResponse.json(
      { error: "We couldn't send your enquiry. Please try again shortly." },
      { status: 502 },
    );
  }
}
