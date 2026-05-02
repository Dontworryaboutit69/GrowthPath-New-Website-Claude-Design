import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildApplicationPdf, type ApplicationData, type PdfMeta } from "@/lib/applicationPdf";

export const runtime = "nodejs";

function makeReferenceId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GP-${ts}-${rnd}`;
}

function clientIpFrom(req: Request): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return undefined;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApplicationData & {
      prequal?: Record<string, unknown>;
    };

    const referenceId = makeReferenceId();
    const meta: PdfMeta = {
      prequal: body.prequal,
      signedAt: new Date(),
      referenceId,
      ipAddress: clientIpFrom(req),
      userAgent: req.headers.get("user-agent") ?? undefined,
    };

    const pdfBytes = await buildApplicationPdf(body, meta);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    const filename =
      `growthpath-application-${(body.businessLegalName || body.name || "applicant")
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase()
        .slice(0, 40)}-${referenceId}.pdf`;

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.APPLY_EMAIL_FROM;
    const toRecipients = (process.env.APPLY_EMAIL_TO || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    if (!apiKey || !fromAddress || toRecipients.length === 0) {
      console.warn(
        "[apply] Missing RESEND_API_KEY / APPLY_EMAIL_FROM / APPLY_EMAIL_TO — skipping email send. PDF generated only.",
      );
      // Still return success so the user gets to the booking page.
      return NextResponse.json({ ok: true, referenceId, emailed: false });
    }

    const resend = new Resend(apiKey);

    const summaryHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0F172A; max-width: 580px;">
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #0F172A;">New GrowthPath application — ${escapeHtml(body.name || "")}</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 13.5px;">Reference: <strong>${escapeHtml(referenceId)}</strong></p>
        <table style="border-collapse: collapse; font-size: 13px; color: #0F172A;">
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Business</td><td>${escapeHtml(body.businessLegalName || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Owner</td><td>${escapeHtml(body.name || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Email</td><td>${escapeHtml(body.email || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Phone</td><td>${escapeHtml(body.phone || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Home state</td><td>${escapeHtml(body.homeState || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Credit</td><td>${escapeHtml(body.creditScore || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Annual sales</td><td>${escapeHtml(body.grossAnnualSales || "—")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #64748B;">Signed</td><td>${meta.signedAt.toLocaleString("en-US", { timeZoneName: "short" })}</td></tr>
        </table>
        <p style="margin: 18px 0 0; color: #475569; font-size: 13px;">
          Full signed application is attached as a PDF.
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toRecipients,
      replyTo: body.email || undefined,
      subject: `New application — ${body.name || "Applicant"} (${body.businessLegalName || "Business"})`,
      html: summaryHtml,
      attachments: [
        {
          filename,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error("[apply] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Email failed", referenceId },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, referenceId, emailed: true });
  } catch (err) {
    console.error("[apply] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
