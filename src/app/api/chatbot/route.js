import { NextResponse } from "next/server";

/*
 * Handles submissions from the floating chat widget
 * (src/components/floating-actions/FloatingActions.js).
 *
 * Sends the enquiry by email via the Resend HTTP API (https://resend.com),
 * the same service used by src/app/api/contact/route.js. Enquiries go to
 * both the main business inbox and the chat-specific inbox.
 *
 * Required environment variables (see .env.example):
 *   RESEND_API_KEY     - secret API key from your Resend account
 *   CONTACT_TO_EMAIL   - main business inbox (shared with the Contact form)
 *   CHATBOT_TO_EMAIL   - inbox that should receive chat widget enquiries
 *   CONTACT_FROM_EMAIL - a "from" address on a domain verified in Resend
 */

const DEFAULT_CONTACT_EMAIL = "info@leosproject.ae";
const DEFAULT_CHATBOT_EMAIL = "leos.project.uae@gmail.com";

// Same validation the client applies — kept here too since the client-side
// check can always be bypassed by calling this endpoint directly.
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

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.error(
      "Chat widget is not configured: missing RESEND_API_KEY or CONTACT_FROM_EMAIL.",
    );

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

  const emailPayload = {
    from: fromEmail,
    to: toEmails,
    subject: `New chat enquiry: ${service} — ${name}`,
    text: [
      `Name: ${name}`,
      `Phone number: ${phone}`,
      `Service: ${service}`,
      "",
      "Submitted via the website chat widget.",
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
