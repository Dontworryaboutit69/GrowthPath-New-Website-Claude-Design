import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: wire to email (Resend) or CRM (GHL/HubSpot/etc.)
    // For now, log so we can see submissions in the dev server output.
    console.log("[apply] new application:", JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[apply] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
