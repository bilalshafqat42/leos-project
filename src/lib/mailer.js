import nodemailer from "nodemailer";

/*
 * Shared Gmail SMTP sender for src/app/api/contact/route.js and
 * src/app/api/chatbot/route.js.
 *
 * Required environment variables (see .env.example):
 *   GMAIL_USER         - the Gmail address enquiries are sent from
 *   GMAIL_APP_PASSWORD - a Google "App Password" for that account
 *                        (myaccount.google.com/security -> App Passwords,
 *                        requires 2-Step Verification to be enabled)
 */

const DEFAULT_GMAIL_USER = "leos.project.uae@gmail.com";

let cachedTransporter = null;

function getMailConfig() {
  return {
    user: process.env.GMAIL_USER || DEFAULT_GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  };
}

export function isMailConfigured() {
  return Boolean(getMailConfig().pass);
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { user, pass } = getMailConfig();

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return cachedTransporter;
}

export async function sendMail({ to, replyTo, subject, text }) {
  const { user } = getMailConfig();
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"LEOS Project Management" <${user}>`,
    to,
    replyTo,
    subject,
    text,
  });
}
