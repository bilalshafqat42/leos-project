import { NextResponse } from "next/server";

/*
 * Handles Contact form submissions from src/components/contact/Contact.js.
 *
 * Sends the enquiry by email via the Resend HTTP API (https://resend.com).
 * No SDK dependency is required, just a verified sending domain and API key.
 *
 * Required environment variables (see .env.example):
 *   RESEND_API_KEY   - secret API key from your Resend account
 *   CONTACT_TO_EMAIL - inbox that should receive enquiries
 *   CONTACT_FROM_EMAIL - a "from" address on a domain verified in Resend
 */

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

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error(
      "Contact form is not configured: missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.",
    );

    return NextResponse.json(
      {
        error:
          "The contact form isn't fully configured yet. Please call or email us directly for now.",
      },
      { status: 503 },
    );
  }

  const replyTo = EMAIL_PATTERN.test(contact) ? contact : undefined;

  const emailPayload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: replyTo,
    subject: `New site visit request: ${projectType} — ${name}`,
    text: [
      `Name: ${name}`,
      `Phone or email: ${contact}`,
      `Project type: ${projectType}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend API error:", response.status, errorBody);

      return NextResponse.json(
        { error: "We couldn't send your enquiry. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to reach Resend API:", error);

    return NextResponse.json(
      { error: "We couldn't send your enquiry. Please try again shortly." },
      { status: 502 },
    );
  }
}
