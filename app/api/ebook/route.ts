import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const SITE_URL = "https://heloc.growthpathadvisory.com";
const EBOOK_PATH = "/GrowthPath-Owners-Guide.pdf";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

function makeRefId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EB-${ts}-${rnd}`;
}

// ============================================================
// USER EMAIL — beautifully branded ebook delivery
// ============================================================
function userEmailHtml(name: string, downloadUrl: string): string {
  const firstName = name.trim().split(" ")[0] || "there";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Your GrowthPath Owner's Guide</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">

    <!-- Navy header -->
    <div style="background:#0A1628;padding:32px 36px 28px;border-top:4px solid #1E5BCC;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <img src="${SITE_URL}/assets/growthpath-logo.png" alt="GrowthPath Advisory"
              height="32" style="height:32px;display:block;filter:brightness(0) invert(1);" />
          </td>
          <td align="right" style="font-size:11px;color:#B8CDF0;letter-spacing:.14em;text-transform:uppercase;font-weight:700;">
            Owner's Guide
          </td>
        </tr>
      </table>
    </div>

    <!-- Hero -->
    <div style="padding:44px 36px 8px;background:#ffffff;">
      <div style="font-size:11px;color:#1E5BCC;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:14px;">
        It's here, ${escapeHtml(firstName)}.
      </div>
      <h1 style="margin:0 0 16px;font-size:30px;line-height:1.15;font-weight:700;color:#0F172A;letter-spacing:-.02em;">
        Replace expensive capital with your home equity.
      </h1>
      <p style="margin:0 0 22px;font-size:15.5px;line-height:1.65;color:#475569;">
        Your copy of <strong style="color:#0F172A;">The Owner's Guide</strong> is attached to this email and ready to read. Inside: how a Business Purpose HELOC actually works, what it costs, and three real owner stories with the numbers.
      </p>
    </div>

    <!-- Download button -->
    <div style="padding:0 36px 8px;text-align:center;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
        <tr>
          <td align="center" bgcolor="#1E5BCC" style="border-radius:6px;">
            <a href="${downloadUrl}"
               style="display:inline-block;padding:16px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:.02em;border-radius:6px;">
              Download the PDF →
            </a>
          </td>
        </tr>
      </table>
      <div style="margin-top:10px;font-size:11px;color:#94A3B8;letter-spacing:.12em;text-transform:uppercase;font-weight:600;">
        32 pages · attached to this email
      </div>
    </div>

    <!-- Divider -->
    <div style="padding:32px 36px 0;">
      <div style="border-top:1px solid #E5E7EB;"></div>
    </div>

    <!-- What's inside -->
    <div style="padding:24px 36px 8px;">
      <div style="font-size:11px;color:#1E5BCC;letter-spacing:.14em;text-transform:uppercase;font-weight:700;margin-bottom:10px;">
        What's inside
      </div>
      <ul style="list-style:none;padding:0;margin:0;">
        ${[
          "The dollar gap between expensive debt and your home equity",
          "Three real owners — Sarah, Javier, Anya — with full numbers",
          "How a Business Purpose HELOC works in plain English",
          "Two automatic underwriting tiers and what each requires",
          "From application to funded in five business days",
          "The full term sheet and FAQ",
        ].map((item) => `
          <li style="padding:8px 0 8px 22px;position:relative;font-size:14px;line-height:1.5;color:#1F2937;">
            <span style="position:absolute;left:0;top:13px;width:7px;height:7px;background:#1E5BCC;border-radius:50%;display:inline-block;"></span>
            ${escapeHtml(item)}
          </li>`).join("")}
      </ul>
    </div>

    <!-- Soft CTA card -->
    <div style="padding:24px 36px 8px;">
      <div style="background:#F4F7FD;border-left:4px solid #1E5BCC;padding:20px 24px;">
        <div style="font-size:11px;color:#0E2F6B;letter-spacing:.14em;text-transform:uppercase;font-weight:700;margin-bottom:6px;">
          When you're ready
        </div>
        <div style="font-size:16px;color:#0F172A;line-height:1.45;font-weight:600;letter-spacing:-.012em;margin-bottom:10px;">
          See what your equity actually qualifies for.
        </div>
        <div style="font-size:13.5px;color:#475569;line-height:1.55;margin-bottom:12px;">
          Five-minute prequalification, soft credit pull, no hard pull until you accept an offer.
        </div>
        <a href="${SITE_URL}/apply" style="display:inline-block;color:#1E5BCC;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:.01em;">
          Check your number →
        </a>
      </div>
    </div>

    <!-- Navy footer -->
    <div style="background:#0A1628;padding:32px 36px;margin-top:32px;border-bottom:4px solid #1E5BCC;">
      <img src="${SITE_URL}/assets/growthpath-logo.png" alt="GrowthPath Advisory"
        height="22" style="height:22px;display:block;filter:brightness(0) invert(1);margin-bottom:12px;" />
      <div style="font-size:12px;color:#B8CDF0;letter-spacing:.12em;text-transform:uppercase;font-weight:600;margin-bottom:14px;">
        growthpathadvisory.com
      </div>
      <div style="font-size:11px;color:rgba(184,205,240,0.55);line-height:1.6;">
        © 2026 GrowthPath Advisory. GrowthPath Advisory facilitates business-purpose loans secured by residential real estate. Loan terms, rates, and availability subject to underwriting and state regulations. This guide is informational only and is not a commitment to lend. You're receiving this email because you requested The Owner's Guide.
      </div>
    </div>

  </div>
</body></html>`;
}

// ============================================================
// INTERNAL NOTIFICATION — leaner format for Sonia
// ============================================================
function notifyEmailHtml(name: string, email: string, phone: string, refId: string): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F172A;max-width:560px;">
    <h2 style="margin:0 0 8px;font-size:17px;color:#0F172A;">New ebook download — ${escapeHtml(name)}</h2>
    <p style="margin:0 0 16px;color:#475569;font-size:13px;">Reference: <strong>${escapeHtml(refId)}</strong></p>
    <table style="border-collapse:collapse;font-size:13px;">
      <tr><td style="padding:4px 14px 4px 0;color:#64748B;">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding:4px 14px 4px 0;color:#64748B;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#1E5BCC;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:4px 14px 4px 0;color:#64748B;">Phone</td><td>${escapeHtml(phone)}</td></tr>
      <tr><td style="padding:4px 14px 4px 0;color:#64748B;">Source</td><td>Exit-intent ebook popup</td></tr>
    </table>
    <p style="margin:18px 0 0;color:#475569;font-size:13px;">
      They've already received the ebook with a CTA back to <a href="${SITE_URL}/apply" style="color:#1E5BCC;">${SITE_URL}/apply</a>.
    </p>
  </div>`;
}

// ============================================================
// POST handler
// ============================================================
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string; phone?: string };
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();

    if (!name || !/\S+@\S+\.\S+/.test(email) || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const refId = makeRefId();
    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.APPLY_EMAIL_FROM;
    const notifyRecipients = (process.env.APPLY_EMAIL_TO || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    if (!apiKey || !fromAddress) {
      console.warn("[ebook] Missing RESEND_API_KEY / APPLY_EMAIL_FROM — skipping email send.");
      return NextResponse.json({ ok: true, refId, emailed: false });
    }

    const resend = new Resend(apiKey);

    // Fetch the ebook PDF from /public to attach
    const pdfRes = await fetch(`${SITE_URL}${EBOOK_PATH}`);
    if (!pdfRes.ok) throw new Error(`Failed to load ebook PDF: ${pdfRes.status}`);
    const pdfBytes = Buffer.from(await pdfRes.arrayBuffer());
    const pdfBase64 = pdfBytes.toString("base64");

    // 1. Send the user the ebook
    const downloadUrl = `${SITE_URL}${EBOOK_PATH}`;
    const userResult = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: "Your GrowthPath Owner's Guide",
      html: userEmailHtml(name, downloadUrl),
      attachments: [
        { filename: "GrowthPath-Owners-Guide.pdf", content: pdfBase64 },
      ],
    });

    if (userResult.error) {
      console.error("[ebook] User email failed:", userResult.error);
      return NextResponse.json(
        { ok: false, error: "Email failed", refId },
        { status: 502 },
      );
    }

    // 2. Notify the team — best effort, don't block on failure
    if (notifyRecipients.length > 0) {
      try {
        await resend.emails.send({
          from: fromAddress,
          to: notifyRecipients,
          replyTo: email,
          subject: `New ebook download — ${name}`,
          html: notifyEmailHtml(name, email, phone, refId),
        });
      } catch (err) {
        console.error("[ebook] Notification email failed:", err);
      }
    }

    return NextResponse.json({ ok: true, refId, emailed: true });
  } catch (err) {
    console.error("[ebook] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
