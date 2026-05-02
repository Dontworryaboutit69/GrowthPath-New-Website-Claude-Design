import { NextResponse } from "next/server";
import { buildApplicationPdf, type ApplicationData } from "@/lib/applicationPdf";

export const runtime = "nodejs";

// DEV ONLY — generates a sample PDF in the browser for visual review.
// Disabled in production.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not available" }, { status: 404 });
  }

  const sample: ApplicationData = {
    name: "Jane Smith", email: "jane@acme.com", phone: "(555) 555-1234",
    dob: "1985-06-15", ssn: "123-45-6789",
    homeStreet: "123 Main Street", homeCity: "Miami", homeState: "FL", homeZip: "33101",
    creditScore: "700 – 749", ownsProperty: "Yes", ownershipPct: "100",
    hasCoOwner: false,
    co2Name: "", co2OwnershipPct: "",
    co2HomeStreet: "", co2HomeCity: "", co2HomeState: "", co2HomeZip: "",
    co2Dob: "", co2Ssn: "", co2Phone: "", co2Email: "",
    co2CreditScore: "", co2OwnsProperty: "",
    businessLegalName: "Acme Industries LLC", businessDba: "Acme Renovations",
    entityType: "LLC",
    businessStartDate: "2018-01-15", businessTaxId: "12-3456789",
    incorporationState: "FL", businessPhone: "(555) 555-9876",
    industry: "General contracting & commercial renovations",
    businessEmail: "ops@acme.com", website: "https://acme.com",
    businessDescription:
      "Commercial general contractor specializing in tenant improvements, " +
      "renovations, and ground-up builds across South Florida.",
    bizStreet: "500 Biz Avenue, Suite 210", bizCity: "Miami",
    bizState: "FL", bizZip: "33101",
    bizRentOwn: "Rented", bizMonthlyPayment: "$3,500",
    bizLandlord: "Property Holdings LLC · (555) 100-2002",
    grossAnnualSales: "$1,200,000", averageBankBalance: "$45,000",
    ccProcessingVolume: "$25,000 / month", monthlyDeposits: "35",
    totalMonthlySales: "$100,000",
    hasOutstandingDebt: "Yes", existingLender: "FastCap Funding",
    existingBalance: "$28,500",
    signatureName: "Jane Smith", authorize: true,
  };

  const bytes = await buildApplicationPdf(sample, {
    signedAt: new Date(),
    referenceId: "GP-PREVIEW-SAMPLE",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0 (Preview)",
  });

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="growthpath-application-preview.pdf"',
    },
  });
}
