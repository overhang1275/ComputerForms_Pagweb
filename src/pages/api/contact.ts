import type { APIRoute } from "astro";
import dns from "node:dns";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const RECIPIENT = "hola@computerforms.com.mx";
dns.setDefaultResultOrder("ipv4first");

const clean = (value: FormDataEntryValue | null, max = 500) =>
  String(value ?? "").trim().slice(0, max);

const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const htmlEscape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);

const redirect = (origin: string, status: string) =>
  Response.redirect(`${origin}/?contact=${status}#contacto`, 303);

export const POST: APIRoute = async ({ request, url }) => {
  const form = await request.formData();

  if (clean(form.get("website"))) {
    return redirect(url.origin, "sent");
  }

  const name = clean(form.get("name"), 120);
  const company = clean(form.get("company"), 160);
  const email = clean(form.get("email"), 180);
  const phone = clean(form.get("phone"), 80);
  const message = clean(form.get("message"), 2000);

  if (!name || !isEmail(email) || !message) {
    return redirect(url.origin, "error");
  }

  const env = import.meta.env;
  const host = env.SMTP_HOST || process.env.SMTP_HOST;
  const port = Number(env.SMTP_PORT || process.env.SMTP_PORT || 587);
  const user = env.SMTP_USER || process.env.SMTP_USER;
  const pass = env.SMTP_PASS || process.env.SMTP_PASS;
  const from = env.SMTP_FROM || process.env.SMTP_FROM || user;

  if (!host || !user || !pass || !from) {
    console.error("Missing SMTP configuration");
    return redirect(url.origin, "error");
  }

  const transportOptions: SMTPTransport.Options = {
    host,
    port,
    secure: (env.SMTP_SECURE || process.env.SMTP_SECURE) === "true",
    requireTLS: port === 587,
    auth: { user, pass },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  const rows = [
    ["Nombre", name],
    ["Empresa", company || "No indicada"],
    ["Correo", email],
    ["Telefono", phone || "No indicado"],
    ["Mensaje", message],
  ];

  try {
    await transporter.sendMail({
      from,
      to: RECIPIENT,
      cc: email,
      replyTo: email,
      subject: `Nuevo contacto desde computerforms.com.mx - ${name}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
      html: `<h2>Nuevo contacto desde computerforms.com.mx</h2>${rows
        .map(([label, value]) => `<p><strong>${htmlEscape(label)}:</strong><br>${htmlEscape(value).replace(/\n/g, "<br>")}</p>`)
        .join("")}`,
    });

    return redirect(url.origin, "sent");
  } catch (error) {
    console.error("Contact email failed", error);
    return redirect(url.origin, "error");
  }
};

export const GET: APIRoute = () =>
  new Response("Method not allowed", { status: 405 });
