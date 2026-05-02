import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";

export type ApplicationData = {
  name: string; email: string; phone: string; dob: string; ssn: string;
  homeStreet: string; homeCity: string; homeState: string; homeZip: string;
  creditScore: string; ownsProperty: string; ownershipPct: string;
  hasCoOwner: boolean;
  co2Name: string; co2OwnershipPct: string;
  co2HomeStreet: string; co2HomeCity: string; co2HomeState: string; co2HomeZip: string;
  co2Dob: string; co2Ssn: string; co2Phone: string; co2Email: string;
  co2CreditScore: string; co2OwnsProperty: string;
  businessLegalName: string; businessDba: string; entityType: string;
  businessStartDate: string; businessTaxId: string; incorporationState: string;
  businessPhone: string; industry: string; businessEmail: string; website: string;
  businessDescription: string;
  bizStreet: string; bizCity: string; bizState: string; bizZip: string;
  bizRentOwn: string; bizMonthlyPayment: string; bizLandlord: string;
  grossAnnualSales: string; averageBankBalance: string; ccProcessingVolume: string;
  monthlyDeposits: string; totalMonthlySales: string;
  hasOutstandingDebt: string; existingLender: string; existingBalance: string;
  signatureName: string; authorize: boolean;
};

export type PdfMeta = {
  prequal?: Record<string, unknown>;
  signedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  referenceId: string;
};

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 50;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

const INK = rgb(0.058, 0.090, 0.165);
const SLATE = rgb(0.278, 0.337, 0.412);
const MUTE = rgb(0.580, 0.639, 0.722);
const BLUE = rgb(0.118, 0.357, 0.800);
const LINE = rgb(0.898, 0.906, 0.922);
const PAPER = rgb(0.980, 0.980, 0.976);
const WHITE = rgb(1, 1, 1);

type Cursor = { page: PDFPage; y: number; pageNum: number };
type Fonts = {
  helv: PDFFont; helvBold: PDFFont; helvOblique: PDFFont;
  courier: PDFFont; courierBold: PDFFont; sigItalic: PDFFont;
};

const fmtSsnMasked = (v: string) => {
  const digits = (v || "").replace(/\D/g, "");
  if (digits.length !== 9) return v || "—";
  return `XXX-XX-${digits.slice(-4)}`;
};
const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};
const dash = (v: string | undefined | null) => (v && v.trim() ? v : "—");

export async function buildApplicationPdf(
  data: ApplicationData,
  meta: PdfMeta,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`GrowthPath Application — ${data.businessLegalName || data.name}`);
  pdf.setAuthor("GrowthPath Advisory");
  pdf.setSubject("Business Purpose HELOC — Loan Application");
  pdf.setProducer("GrowthPath Advisory");
  pdf.setCreator("GrowthPath Advisory");
  pdf.setCreationDate(meta.signedAt);

  const fonts: Fonts = {
    helv: await pdf.embedFont(StandardFonts.Helvetica),
    helvBold: await pdf.embedFont(StandardFonts.HelveticaBold),
    helvOblique: await pdf.embedFont(StandardFonts.HelveticaOblique),
    courier: await pdf.embedFont(StandardFonts.Courier),
    courierBold: await pdf.embedFont(StandardFonts.CourierBold),
    sigItalic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
  };

  const cur: Cursor = {
    page: pdf.addPage([PAGE_W, PAGE_H]),
    y: PAGE_H - MARGIN_TOP - 70,
    pageNum: 1,
  };
  drawHeader(cur.page, fonts, meta);
  drawFooter(cur.page, fonts);

  const startNewPage = () => {
    cur.page = pdf.addPage([PAGE_W, PAGE_H]);
    cur.y = PAGE_H - MARGIN_TOP - 30;
    cur.pageNum += 1;
    drawHeader(cur.page, fonts, meta);
    drawFooter(cur.page, fonts);
  };

  const ensureRoom = (needed: number) => {
    if (cur.y - needed < MARGIN_BOTTOM + 30) startNewPage();
  };

  // --- Title block on page 1 ---
  cur.page.drawText("BUSINESS PURPOSE HELOC", {
    x: MARGIN_X, y: cur.y + 50, size: 8, font: fonts.courierBold, color: BLUE,
  });
  cur.page.drawText("Loan application", {
    x: MARGIN_X, y: cur.y + 30, size: 22, font: fonts.helvBold, color: INK,
  });
  cur.page.drawText(
    `Submitted ${meta.signedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${meta.signedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
    { x: MARGIN_X, y: cur.y + 12, size: 9, font: fonts.helv, color: SLATE },
  );
  cur.y -= 8;

  // --- Section: Applicant ---
  drawSectionHeader(cur, ensureRoom, "01 — Applicant", "Primary borrower & guarantor", fonts);
  drawKV(cur, ensureRoom, fonts, [
    ["Full legal name", dash(data.name)],
    ["Email", dash(data.email)],
    ["Cell phone", dash(data.phone)],
    ["Date of birth", fmtDate(data.dob)],
    ["Social Security #", fmtSsnMasked(data.ssn)],
    [
      "Home address (collateral)",
      [data.homeStreet, [data.homeCity, data.homeState, data.homeZip].filter(Boolean).join(", ")]
        .filter(Boolean).join("\n") || "—",
    ],
    ["Estimated credit score", dash(data.creditScore)],
    ["Owns additional property", dash(data.ownsProperty)],
    ["Ownership % of business", data.ownershipPct ? `${data.ownershipPct}%` : "—"],
  ]);

  // --- Section: Co-Owner ---
  if (data.hasCoOwner) {
    drawSectionHeader(cur, ensureRoom, "02 — Co-Owner / Guarantor", "Additional guarantor", fonts);
    drawKV(cur, ensureRoom, fonts, [
      ["Full legal name", dash(data.co2Name)],
      ["Ownership %", data.co2OwnershipPct ? `${data.co2OwnershipPct}%` : "—"],
      [
        "Home address",
        [data.co2HomeStreet, [data.co2HomeCity, data.co2HomeState, data.co2HomeZip].filter(Boolean).join(", ")]
          .filter(Boolean).join("\n") || "—",
      ],
      ["Date of birth", fmtDate(data.co2Dob)],
      ["Social Security #", fmtSsnMasked(data.co2Ssn)],
      ["Cell phone", dash(data.co2Phone)],
      ["Email", dash(data.co2Email)],
      ["Estimated credit score", dash(data.co2CreditScore)],
      ["Owns additional property", dash(data.co2OwnsProperty)],
    ]);
  }

  // --- Section: Business ---
  drawSectionHeader(
    cur, ensureRoom,
    data.hasCoOwner ? "03 — Business" : "02 — Business",
    "Legal entity & operations",
    fonts,
  );
  drawKV(cur, ensureRoom, fonts, [
    ["Legal name", dash(data.businessLegalName)],
    ["DBA", dash(data.businessDba)],
    ["Entity type", dash(data.entityType)],
    ["Business start date", fmtDate(data.businessStartDate)],
    ["EIN / Tax ID", data.businessTaxId || "—"],
    ["State of incorporation", dash(data.incorporationState)],
    ["Business phone", dash(data.businessPhone)],
    ["Industry / NAICS", dash(data.industry)],
    ["Business email", dash(data.businessEmail)],
    ["Website", dash(data.website)],
    ["Description", dash(data.businessDescription)],
    [
      "Business address",
      [data.bizStreet, [data.bizCity, data.bizState, data.bizZip].filter(Boolean).join(", ")]
        .filter(Boolean).join("\n") || "—",
    ],
    ["Rented or owned", dash(data.bizRentOwn)],
    ...(data.bizRentOwn && data.bizRentOwn !== "N/A"
      ? ([
          ["Monthly payment", dash(data.bizMonthlyPayment)],
          [data.bizRentOwn === "Owned" ? "Mortgage holder" : "Landlord", dash(data.bizLandlord)],
        ] as [string, string][])
      : []),
  ]);

  // --- Section: Financials ---
  drawSectionHeader(
    cur, ensureRoom,
    data.hasCoOwner ? "04 — Financials" : "03 — Financials",
    "Sales, deposits, and existing obligations",
    fonts,
  );
  drawKV(cur, ensureRoom, fonts, [
    ["Gross annual sales", dash(data.grossAnnualSales)],
    ["Total monthly sales", dash(data.totalMonthlySales)],
    ["Average bank balance", dash(data.averageBankBalance)],
    ["Avg deposits / month", dash(data.monthlyDeposits)],
    ["Credit-card processing volume", dash(data.ccProcessingVolume)],
    ["Outstanding cash advance / loan", dash(data.hasOutstandingDebt)],
    ...(data.hasOutstandingDebt === "Yes"
      ? ([
          ["Existing lender", dash(data.existingLender)],
          ["Open balance", dash(data.existingBalance)],
        ] as [string, string][])
      : []),
  ]);

  // --- Section: Authorization & Signature ---
  drawSectionHeader(
    cur, ensureRoom,
    data.hasCoOwner ? "05 — Authorization & Signature" : "04 — Authorization & Signature",
    "Borrower consent",
    fonts,
  );

  const authText =
    "By signing below, you (the business and business owner, individually and collectively) authorize " +
    "GrowthPath Advisory and its marketplace participants and their respective representatives, " +
    "successors, assigns and designees to obtain consumer, business, and investigative reports about " +
    "you — including credit-card processor and bank statements — from one or more consumer reporting " +
    "agencies (such as TransUnion, Experian, and Equifax) and from other credit bureaus, banks, " +
    "creditors, and third parties. You also authorize GrowthPath Advisory to transmit this application " +
    "form and any related information obtained in connection with this application to any of the " +
    "recipients for the purposes described above. You also consent to the release, by any creditor or " +
    "financial institution, of any information relating to you, on its own behalf.";

  drawWrappedText(cur, ensureRoom, fonts.helv, authText, 8.5, SLATE, 1.4);
  cur.y -= 6;

  ensureRoom(22);
  drawCheckbox(cur.page, MARGIN_X, cur.y - 10, data.authorize);
  cur.page.drawText(
    "Applicant has read, understood, and agreed to the authorization above.",
    { x: MARGIN_X + 18, y: cur.y - 8, size: 9, font: fonts.helv, color: INK },
  );
  cur.y -= 20;

  ensureRoom(22);
  drawCheckbox(cur.page, MARGIN_X, cur.y - 10, true);
  cur.page.drawText(
    "Initial inquiry is a soft credit pull with no impact to credit score.",
    { x: MARGIN_X + 18, y: cur.y - 8, size: 9, font: fonts.helv, color: INK },
  );
  cur.y -= 22;

  // Compact two-column signature block (~76pt tall) — fits at bottom of page.
  const SIG_BOX_H = 76;
  if (cur.y - SIG_BOX_H < MARGIN_BOTTOM + 4) startNewPage();
  const sigBoxTop = cur.y;
  cur.page.drawRectangle({
    x: MARGIN_X, y: sigBoxTop - SIG_BOX_H,
    width: CONTENT_W, height: SIG_BOX_H,
    borderColor: LINE, borderWidth: 1, color: PAPER,
  });
  cur.page.drawText("E-SIGNATURE", {
    x: MARGIN_X + 14, y: sigBoxTop - 14, size: 7, font: fonts.courierBold, color: BLUE,
  });
  const sig = data.signatureName || data.name || "—";
  cur.page.drawText(sig, {
    x: MARGIN_X + 14, y: sigBoxTop - 42, size: 20, font: fonts.sigItalic, color: INK,
  });
  const sigW = fonts.sigItalic.widthOfTextAtSize(sig, 20);
  cur.page.drawLine({
    start: { x: MARGIN_X + 14, y: sigBoxTop - 46 },
    end: { x: MARGIN_X + 14 + Math.min(sigW + 8, 230), y: sigBoxTop - 46 },
    thickness: 0.6, color: SLATE,
  });
  cur.page.drawText("Applicant signature", {
    x: MARGIN_X + 14, y: sigBoxTop - 62, size: 7, font: fonts.courier, color: MUTE,
  });

  const metaX = MARGIN_X + CONTENT_W / 2 + 10;
  const signedDate = meta.signedAt.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const signedTime = meta.signedAt.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", timeZoneName: "short",
  });
  cur.page.drawText("SIGNED", {
    x: metaX, y: sigBoxTop - 14, size: 7, font: fonts.courierBold, color: BLUE,
  });
  cur.page.drawText(signedDate, {
    x: metaX, y: sigBoxTop - 28, size: 9.5, font: fonts.helvBold, color: INK,
  });
  cur.page.drawText(signedTime, {
    x: metaX, y: sigBoxTop - 40, size: 8.5, font: fonts.helv, color: SLATE,
  });
  cur.page.drawText(`Reference: ${meta.referenceId}`, {
    x: metaX, y: sigBoxTop - 54, size: 7.5, font: fonts.courier, color: SLATE,
  });
  if (meta.ipAddress) {
    cur.page.drawText(`Audit: IP ${meta.ipAddress}`, {
      x: metaX, y: sigBoxTop - 65, size: 6.5, font: fonts.courier, color: MUTE,
    });
  }
  cur.y = sigBoxTop - SIG_BOX_H - 8;

  // Add page numbers across the final page count
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Page ${i + 1} of ${pages.length}`, {
      x: PAGE_W - MARGIN_X - 60, y: 32, size: 8, font: fonts.courier, color: MUTE,
    });
  });

  return await pdf.save();
}

// ---------- helpers (mutate `cur` directly) ----------

function drawHeader(page: PDFPage, fonts: Fonts, meta: PdfMeta) {
  page.drawText("GrowthPath Advisory", {
    x: MARGIN_X, y: PAGE_H - 38, size: 11, font: fonts.helvBold, color: INK,
  });
  page.drawText("BUSINESS HELOC · LOAN APPLICATION", {
    x: MARGIN_X, y: PAGE_H - 50, size: 7, font: fonts.courier, color: MUTE,
  });
  const ref = `REF ${meta.referenceId}`;
  const refW = fonts.courierBold.widthOfTextAtSize(ref, 7.5);
  page.drawText(ref, {
    x: PAGE_W - MARGIN_X - refW, y: PAGE_H - 38, size: 7.5, font: fonts.courierBold, color: BLUE,
  });
  page.drawLine({
    start: { x: MARGIN_X, y: PAGE_H - 60 },
    end: { x: PAGE_W - MARGIN_X, y: PAGE_H - 60 },
    thickness: 0.5, color: LINE,
  });
}

function drawFooter(page: PDFPage, fonts: Fonts) {
  page.drawLine({
    start: { x: MARGIN_X, y: 48 },
    end: { x: PAGE_W - MARGIN_X, y: 48 },
    thickness: 0.5, color: LINE,
  });
  page.drawText("CONFIDENTIAL — Loan application data. For underwriting use only.", {
    x: MARGIN_X, y: 32, size: 7.5, font: fonts.courier, color: MUTE,
  });
}

function drawSectionHeader(
  cur: Cursor,
  ensureRoom: (n: number) => void,
  title: string,
  subtitle: string,
  fonts: Fonts,
) {
  ensureRoom(50);
  cur.page.drawLine({
    start: { x: MARGIN_X, y: cur.y + 6 },
    end: { x: MARGIN_X + 32, y: cur.y + 6 },
    thickness: 1.6, color: BLUE,
  });
  cur.page.drawText(title.toUpperCase(), {
    x: MARGIN_X, y: cur.y - 10, size: 9, font: fonts.courierBold, color: BLUE,
  });
  cur.page.drawText(subtitle, {
    x: MARGIN_X, y: cur.y - 24, size: 12, font: fonts.helvBold, color: INK,
  });
  cur.y -= 38;
}

function drawKV(
  cur: Cursor,
  ensureRoom: (n: number) => void,
  fonts: Fonts,
  rows: [string, string][],
) {
  const labelX = MARGIN_X;
  const valueX = MARGIN_X + 200;
  const valueW = CONTENT_W - 200;
  const lineH = 14;

  for (const [label, raw] of rows) {
    const value = raw == null ? "—" : String(raw);
    const lines = wrapText(value, fonts.helv, 10, valueW);
    const blockH = Math.max(lineH, lines.length * lineH) + 4;
    ensureRoom(blockH + 6);

    cur.page.drawText(label.toUpperCase(), {
      x: labelX, y: cur.y - 9, size: 7.5, font: fonts.courier, color: MUTE,
    });
    let lineY = cur.y - 9;
    for (const ln of lines) {
      cur.page.drawText(ln, {
        x: valueX, y: lineY, size: 10, font: fonts.helv, color: INK,
      });
      lineY -= lineH;
    }
    cur.y -= blockH;
    cur.page.drawLine({
      start: { x: labelX, y: cur.y - 2 },
      end: { x: PAGE_W - MARGIN_X, y: cur.y - 2 },
      thickness: 0.3, color: LINE,
    });
    cur.y -= 6;
  }
  cur.y -= 6;
}

function drawWrappedText(
  cur: Cursor,
  ensureRoom: (n: number) => void,
  font: PDFFont,
  text: string,
  size: number,
  color: ReturnType<typeof rgb>,
  lineHeightFactor: number,
) {
  const lines = wrapText(text, font, size, CONTENT_W);
  const lh = size * lineHeightFactor;
  for (const ln of lines) {
    ensureRoom(lh + 4);
    cur.page.drawText(ln, { x: MARGIN_X, y: cur.y - size, size, font, color });
    cur.y -= lh;
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of (text || "").split("\n")) {
    if (!para) { out.push(""); continue; }
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxW && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function drawCheckbox(page: PDFPage, x: number, y: number, checked: boolean) {
  const size = 12;
  page.drawRectangle({
    x, y: y - 1, width: size, height: size,
    borderColor: INK, borderWidth: 0.8,
    color: checked ? BLUE : WHITE,
  });
  if (checked) {
    page.drawLine({
      start: { x: x + 2.5, y: y + 5 },
      end: { x: x + 5, y: y + 2 },
      thickness: 1.6, color: WHITE,
    });
    page.drawLine({
      start: { x: x + 5, y: y + 2 },
      end: { x: x + 9.5, y: y + 8 },
      thickness: 1.6, color: WHITE,
    });
  }
}
