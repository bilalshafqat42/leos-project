import nodemailer from "nodemailer";

/*
 * Shared Titan Email (smtp.titan.email) sender for
 * src/app/api/contact/route.js and src/app/api/chatbot/route.js.
 *
 * Required environment variables (see .env.example):
 *   SMTP_USER     - the Titan mailbox enquiries are sent from,
 *                   e.g. info@leosproject.ae
 *   SMTP_PASSWORD - that mailbox's password
 */

const DEFAULT_SMTP_USER = "info@leosproject.ae";
const TITAN_SMTP_HOST = "smtp.titan.email";
const TITAN_SMTP_PORT = 465;

let cachedTransporter = null;

function getMailConfig() {
  return {
    user: process.env.SMTP_USER || DEFAULT_SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  };
}

export function isMailConfigured() {
  return Boolean(getMailConfig().pass);
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { user, pass } = getMailConfig();

  cachedTransporter = nodemailer.createTransport({
    host: TITAN_SMTP_HOST,
    port: TITAN_SMTP_PORT,
    secure: true,
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
