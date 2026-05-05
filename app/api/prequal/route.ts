import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type PrequalBody = {
  name?: string;
  email?: string;
  phone?: string;
  amount?: number;
  useCase?: string | null;
  ownsProperty?: string | null;
  equity?: string | null;
  credit?: string | null;
  state?: string;
};

const USE_CASE_LABELS: Record<string, string> = {
  working: "Working capital",
  consolidate: "Pay off MCA or cards",
  equipment: "Equipment or vehicles",
  growth: "Marketing & growth",
  realestate: "Real estate investment",
  other: "Something else",
};

const EQUITY_LABELS: Record<string, string> = {
  lt100: "Under $100K",
  "100_250": "$100K – $250K",
  "250_500": "$250K – $500K",
  gt500: "Over $500K",
  unsure: "Not sure",
};

const CREDIT_LABELS: Record<string, string> = {
  "600_649": "600 – 649",
  "650_699": "650 – 699",
  "700_749": "700 – 749",
  gt750: "750+",
  unsure: "Not sure",
};

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska",
  NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
  NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
  UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const UNSUPPORTED_STATES = new Set([
  "AZ","GA","HI","ID","MI","MN","NV","NJ","ND","OR","SD","UT","VT","VA","WV",
]);

function formatAmount(n?: number): string {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  if (n >= 1000) return "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "M";
  return "$" + n + "K";
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PrequalBody;

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.APPLY_EMAIL_FROM;
    const toRecipients = (process.env.PREQUAL_EMAIL_TO || process.env.APPLY_EMAIL_TO || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!apiKey || !fromAddress || toRecipients.length === 0) {
      console.warn(
        "[prequal] Missing RESEND_API_KEY / APPLY_EMAIL_FROM / PREQUAL_EMAIL_TO|APPLY_EMAIL_TO — skipping email send.",
      );
      return NextResponse.json({ ok: true, emailed: false });
    }

    const ownsNo = body.ownsProperty === "no";
    const stateUnsupported = !!body.state && UNSUPPORTED_STATES.has(body.state);
    const stateName = body.state ? STATE_NAMES[body.state] || body.state : "—";
    const useCaseLabel = body.useCase ? USE_CASE_LABELS[body.useCase] || body.useCase : "—";
    const equityLabel = body.equity ? EQUITY_LABELS[body.equity] || body.equity : "—";
    const creditLabel = body.credit ? CREDIT_LABELS[body.credit] || body.credit : "—";
    const ownsLabel =
      body.ownsProperty === "yes" ? "Yes"
      : body.ownsProperty === "no" ? "No"
      : "—";

    let routeNote = "Pre-qualified for HELOC";
    if (ownsNo) routeNote = "Does not own home — needs alternative funding";
    else if (stateUnsupported) routeNote = `State (${stateName}) not supported for HELOC — needs alternative funding`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0F172A; max-width: 580px;">
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #0F172A;">New GrowthPath lead — ${escapeHtml(body.name || "Unknown")}</h2>
        <p style="margin: 0 0 18px; color: #475569; font-size: 13.5px;">From the pre-qualification funnel · ${escapeHtml(routeNote)}</p>

        <h3 style="margin: 0 0 6px; font-size: 13px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.04em;">Contact</h3>
        <table style="border-collapse: collapse; font-size: 13px; color: #0F172A; margin-bottom: 18px;">
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Name</td><td>${escapeHtml(body.name || "—")}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Phone</td><td>${escapeHtml(body.phone || "—")}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Email</td><td>${escapeHtml(body.email || "—")}</td></tr>
        </table>

        <h3 style="margin: 0 0 6px; font-size: 13px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.04em;">Qualifier responses</h3>
        <table style="border-collapse: collapse; font-size: 13px; color: #0F172A;">
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Capital needed</td><td>${escapeHtml(formatAmount(body.amount))}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Use of funds</td><td>${escapeHtml(useCaseLabel)}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Owns home</td><td>${escapeHtml(ownsLabel)}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Home equity</td><td>${escapeHtml(ownsNo ? "—" : equityLabel)}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">Credit range</td><td>${escapeHtml(creditLabel)}</td></tr>
          <tr><td style="padding: 4px 14px 4px 0; color: #64748B;">State</td><td>${escapeHtml(stateName)}</td></tr>
        </table>

        <p style="margin: 22px 0 0; color: #475569; font-size: 12.5px;">
          This lead has not yet completed the full application. They saw their pre-qualification result on the next screen.
        </p>
      </div>
    `;

    const subjectAmount = formatAmount(body.amount);
    const subject = `New lead — ${body.name || "Unknown"} · ${subjectAmount} HELOC interest`;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toRecipients,
      replyTo: body.email || undefined,
      subject,
      html,
    });

    if (error) {
      console.error("[prequal] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Email failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, emailed: true });
  } catch (err) {
    console.error("[prequal] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
