import { NextResponse } from "next/server";

import { isMailConfigured, sendMail } from "@/lib/mailer";

/*
 * Handles Contact form submissions from src/components/contact/Contact.js.
 *
 * Sends the enquiry by email via Titan Email SMTP (see src/lib/mailer.js).
 *
 * Required environment variables (see .env.example):
 *   SMTP_USER        - the Titan mailbox enquiries are sent from
 *   SMTP_PASSWORD    - that mailbox's password
 *   CONTACT_TO_EMAIL - inbox that should receive enquiries
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

  if (!name || !contact || !projectType || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!isMailConfigured()) {
    console.error(
      "Contact form is not configured: missing SMTP_PASSWORD.",
    );

    return NextResponse.json(
      {
        error:
          "The contact form isn't fully configured yet. Please call or email us directly for now.",
      },
      { status: 503 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const replyTo = EMAIL_PATTERN.test(contact) ? contact : undefined;

  try {
    await sendMail({
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
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact form email:", error);

    return NextResponse.json(
      { error: "We couldn't send your enquiry. Please try again shortly." },
      { status: 502 },
    );
  }
}
