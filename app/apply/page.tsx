"use client";

import "./apply.css";
import { useEffect, useState, type CSSProperties } from "react";

type Prequal = {
  amount?: number;
  useCase?: string | null;
  equity?: string | null;
  credit?: string | null;
  state?: string;
  ownsProperty?: string | null;
  name?: string;
  email?: string;
  phone?: string;
};

const PREQUAL_CREDIT_TO_OPTION: Record<string, string> = {
  "600_649": "600 – 649",
  "650_699": "650 – 699",
  "700_749": "700 – 749",
  gt750: "750+",
  unsure: "Not sure",
};

type AppData = {
  // Owner 1 (the applicant)
  name: string;
  email: string;
  phone: string;
  dob: string;
  ssn: string;
  homeStreet: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  creditScore: string;
  ownsProperty: string; // "Yes" | "No"
  ownershipPct: string;

  // Owner 2 (only if ownership < 100%)
  hasCoOwner: boolean;
  co2Name: string;
  co2OwnershipPct: string;
  co2HomeStreet: string;
  co2HomeCity: string;
  co2HomeState: string;
  co2HomeZip: string;
  co2Dob: string;
  co2Ssn: string;
  co2Phone: string;
  co2Email: string;
  co2CreditScore: string;
  co2OwnsProperty: string;

  // Business
  businessLegalName: string;
  businessDba: string;
  entityType: string;
  businessStartDate: string;
  businessTaxId: string;
  incorporationState: string;
  businessPhone: string;
  industry: string;
  businessEmail: string;
  website: string;
  businessDescription: string;
  // Business location
  bizStreet: string;
  bizCity: string;
  bizState: string;
  bizZip: string;
  bizRentOwn: string; // "Rented" | "Owned"
  bizMonthlyPayment: string;
  bizLandlord: string;

  // Financials
  grossAnnualSales: string;
  averageBankBalance: string;
  ccProcessingVolume: string;
  monthlyDeposits: string;
  totalMonthlySales: string;
  hasOutstandingDebt: string; // "Yes" | "No"
  existingLender: string;
  existingBalance: string;

  // Signature
  signatureName: string;
  authorize: boolean;
};

const ENTITY_OPTIONS = [
  "Sole Proprietor",
  "LLC",
  "S-Corp",
  "C-Corp",
  "Partnership",
  "Other",
];

const CREDIT_OPTIONS = [
  "Below 600",
  "600 – 649",
  "650 – 699",
  "700 – 749",
  "750+",
  "Not sure",
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

const INITIAL: AppData = {
  name: "", email: "", phone: "", dob: "", ssn: "",
  homeStreet: "", homeCity: "", homeState: "", homeZip: "",
  creditScore: "", ownsProperty: "", ownershipPct: "100",
  hasCoOwner: false,
  co2Name: "", co2OwnershipPct: "",
  co2HomeStreet: "", co2HomeCity: "", co2HomeState: "", co2HomeZip: "",
  co2Dob: "", co2Ssn: "", co2Phone: "", co2Email: "",
  co2CreditScore: "", co2OwnsProperty: "",
  businessLegalName: "", businessDba: "", entityType: "",
  businessStartDate: "", businessTaxId: "", incorporationState: "",
  businessPhone: "", industry: "", businessEmail: "", website: "",
  businessDescription: "",
  bizStreet: "", bizCity: "", bizState: "", bizZip: "",
  bizRentOwn: "", bizMonthlyPayment: "", bizLandlord: "",
  grossAnnualSales: "", averageBankBalance: "", ccProcessingVolume: "",
  monthlyDeposits: "", totalMonthlySales: "",
  hasOutstandingDebt: "", existingLender: "", existingBalance: "",
  signatureName: "", authorize: false,
};

const TOTAL_STEPS = 4;

export default function ApplyPage() {
  const [step, setStep] = useState<number | "done">(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prequal, setPrequal] = useState<Prequal>({});
  const [data, setData] = useState<AppData>(INITIAL);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gp_prequal");
      if (!raw) return;
      const pq = JSON.parse(raw) as Prequal;
      setPrequal(pq);
      setData((d) => ({
        ...d,
        name: pq.name || d.name,
        email: pq.email || d.email,
        phone: pq.phone || d.phone,
        homeState: pq.state || d.homeState,
        creditScore: (pq.credit && PREQUAL_CREDIT_TO_OPTION[pq.credit]) || d.creditScore,
        ownsProperty:
          pq.ownsProperty === "yes"
            ? "Yes"
            : pq.ownsProperty === "no"
            ? "No"
            : d.ownsProperty,
      }));
    } catch {
      /* noop */
    }
  }, []);

  // When ownership pct changes, sync hasCoOwner
  const setOwnership = (val: string) => {
    const pct = parseInt(val) || 0;
    setData((d) => ({
      ...d,
      ownershipPct: val,
      hasCoOwner: pct > 0 && pct < 100,
    }));
  };

  const update = <K extends keyof AppData>(key: K, value: AppData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  // Per-step validation
  const valid1 =
    data.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(data.email) &&
    data.phone.replace(/\D/g, "").length >= 10 &&
    !!data.dob &&
    data.ssn.replace(/\D/g, "").length === 9 &&
    data.homeStreet.trim().length > 3 &&
    data.homeCity.trim().length > 1 &&
    !!data.homeState &&
    data.homeZip.replace(/\D/g, "").length >= 5 &&
    !!data.creditScore &&
    !!data.ownsProperty &&
    !!data.ownershipPct &&
    (!data.hasCoOwner ||
      (data.co2Name.trim().length > 1 &&
        !!data.co2OwnershipPct &&
        data.co2HomeStreet.trim().length > 3 &&
        data.co2HomeCity.trim().length > 1 &&
        !!data.co2HomeState &&
        data.co2HomeZip.replace(/\D/g, "").length >= 5 &&
        !!data.co2Dob &&
        data.co2Ssn.replace(/\D/g, "").length === 9 &&
        data.co2Phone.replace(/\D/g, "").length >= 10 &&
        /\S+@\S+\.\S+/.test(data.co2Email) &&
        !!data.co2CreditScore &&
        !!data.co2OwnsProperty));

  const valid2 =
    data.businessLegalName.trim().length > 1 &&
    !!data.entityType &&
    !!data.businessStartDate &&
    data.businessTaxId.replace(/\D/g, "").length === 9 &&
    !!data.incorporationState &&
    data.businessPhone.replace(/\D/g, "").length >= 10 &&
    data.industry.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(data.businessEmail) &&
    data.businessDescription.trim().length > 4 &&
    data.bizStreet.trim().length > 3 &&
    data.bizCity.trim().length > 1 &&
    !!data.bizState &&
    data.bizZip.replace(/\D/g, "").length >= 5 &&
    !!data.bizRentOwn;

  const valid3 =
    !!data.grossAnnualSales &&
    !!data.averageBankBalance &&
    !!data.monthlyDeposits &&
    !!data.totalMonthlySales &&
    !!data.hasOutstandingDebt &&
    (data.hasOutstandingDebt === "No" ||
      (!!data.existingLender && !!data.existingBalance));

  const valid4 =
    data.authorize &&
    data.signatureName.trim().toLowerCase() === data.name.trim().toLowerCase() &&
    data.signatureName.trim().length > 1;

  const missingFor = (s: number): string[] => {
    const m: string[] = [];
    if (s === 1) {
      if (data.name.trim().length <= 1) m.push("Full legal name");
      if (!/\S+@\S+\.\S+/.test(data.email)) m.push("Email");
      if (data.phone.replace(/\D/g, "").length < 10) m.push("Cell phone");
      if (!data.dob) m.push("Date of birth");
      if (data.ssn.replace(/\D/g, "").length !== 9) m.push("Social Security #");
      if (data.homeStreet.trim().length <= 3) m.push("Street address");
      if (data.homeCity.trim().length <= 1) m.push("City");
      if (!data.homeState) m.push("State");
      if (data.homeZip.replace(/\D/g, "").length < 5) m.push("ZIP");
      if (!data.creditScore) m.push("Credit score");
      if (!data.ownsProperty) m.push("Property ownership");
      if (!data.ownershipPct) m.push("Ownership %");
      if (data.hasCoOwner) {
        if (data.co2Name.trim().length <= 1) m.push("Co-owner name");
        if (!data.co2OwnershipPct) m.push("Co-owner ownership %");
        if (data.co2HomeStreet.trim().length <= 3) m.push("Co-owner street");
        if (data.co2HomeCity.trim().length <= 1) m.push("Co-owner city");
        if (!data.co2HomeState) m.push("Co-owner state");
        if (data.co2HomeZip.replace(/\D/g, "").length < 5) m.push("Co-owner ZIP");
        if (!data.co2Dob) m.push("Co-owner date of birth");
        if (data.co2Ssn.replace(/\D/g, "").length !== 9) m.push("Co-owner SSN");
        if (data.co2Phone.replace(/\D/g, "").length < 10) m.push("Co-owner phone");
        if (!/\S+@\S+\.\S+/.test(data.co2Email)) m.push("Co-owner email");
        if (!data.co2CreditScore) m.push("Co-owner credit");
        if (!data.co2OwnsProperty) m.push("Co-owner property");
      }
    } else if (s === 2) {
      if (data.businessLegalName.trim().length <= 1) m.push("Business legal name");
      if (!data.entityType) m.push("Entity type");
      if (!data.businessStartDate) m.push("Business start date");
      if (data.businessTaxId.replace(/\D/g, "").length !== 9) m.push("EIN");
      if (!data.incorporationState) m.push("State of incorporation");
      if (data.businessPhone.replace(/\D/g, "").length < 10) m.push("Business phone");
      if (data.industry.trim().length <= 1) m.push("Industry");
      if (!/\S+@\S+\.\S+/.test(data.businessEmail)) m.push("Business email");
      if (data.businessDescription.trim().length <= 4) m.push("Business description");
      if (data.bizStreet.trim().length <= 3) m.push("Business street");
      if (data.bizCity.trim().length <= 1) m.push("Business city");
      if (!data.bizState) m.push("Business state");
      if (data.bizZip.replace(/\D/g, "").length < 5) m.push("Business ZIP");
      if (!data.bizRentOwn) m.push("Rented or owned");
    } else if (s === 3) {
      if (!data.grossAnnualSales) m.push("Gross annual sales");
      if (!data.averageBankBalance) m.push("Average bank balance");
      if (!data.monthlyDeposits) m.push("Monthly deposits");
      if (!data.totalMonthlySales) m.push("Total monthly sales");
      if (!data.hasOutstandingDebt) m.push("Outstanding debt question");
      if (
        data.hasOutstandingDebt === "Yes" &&
        (!data.existingLender || !data.existingBalance)
      )
        m.push("Existing lender details");
    }
    return m;
  };
  const missing = step !== "done" ? missingFor(step as number) : [];

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, prequal }),
      });
      if (!res.ok) throw new Error("Submission failed");
      sessionStorage.removeItem("gp_prequal");
      try {
        const first = (data.name || "").trim().split(/\s+/)[0] || "";
        if (first) sessionStorage.setItem("gp_applicant_first_name", first);
      } catch {
        /* noop */
      }
      window.location.href = "/booking";
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles: Record<number, { eyebrow: string; title: string; lede: string }> = {
    1: {
      eyebrow: "About you",
      title: "Tell us about yourself.",
      lede: "Most of this is already filled in. We just need a few more details about you and your home.",
    },
    2: {
      eyebrow: "Your business",
      title: "Tell us about your business.",
      lede: "Basic legal information and where the business operates.",
    },
    3: {
      eyebrow: "Financials",
      title: "Your business financials.",
      lede: "Used to determine your final offer. Your information is encrypted in transit and never sold or shared with third parties.",
    },
    4: {
      eyebrow: "Authorization",
      title: "Review and sign.",
      lede: "One final authorization and you're done. A GrowthPath advisor will reach out within one business day.",
    },
  };

  const head = step !== "done" ? stepTitles[step as number] : null;
  const progressPct = step === "done" ? 100 : (((step as number) / TOTAL_STEPS) * 100);

  return (
    <div className="apply-page">
      <header className="apply-nav">
        <a href="/" className="apply-logo">
          <img
            src="/assets/growthpath-logo.png"
            alt="GrowthPath Advisory"
            style={{ height: 28, filter: "brightness(0) invert(1)" }}
          />
        </a>
        <div className="apply-nav-meta">
          <span className="dot" />
          <span>Soft check · No impact to your credit</span>
        </div>
      </header>

      <main className="apply-main">
        <div className="apply-shell">
          {step !== "done" && head && (
            <>
              <div className="apply-head">
                <span className="eyebrow">
                  Step {step} of {TOTAL_STEPS} · {head.eyebrow}
                </span>
                <h1>{head.title}</h1>
                <p className="apply-lede">{head.lede}</p>
              </div>

              <div className="apply-progress">
                <div
                  className="apply-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {prequal.amount && (
                <div className="apply-summary">
                  <div className="apply-summary-row">
                    <span className="l">Capital requested</span>
                    <span className="v">${prequal.amount}K</span>
                  </div>
                  {prequal.useCase && (
                    <div className="apply-summary-row">
                      <span className="l">Use of funds</span>
                      <span className="v">
                        {USE_LABELS[prequal.useCase] ?? prequal.useCase}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <Step1
                  data={data}
                  update={update}
                  setOwnership={setOwnership}
                />
              )}
              {step === 2 && <Step2 data={data} update={update} />}
              {step === 3 && <Step3 data={data} update={update} />}
              {step === 4 && <Step4 data={data} update={update} />}

              {error && <p className="apply-error">{error}</p>}

              {missing.length > 0 && (step as number) < TOTAL_STEPS && (
                <div className="apply-missing">
                  <span className="apply-missing-h">Still need:</span>
                  <span className="apply-missing-list">
                    {missing.slice(0, 6).join(" · ")}
                    {missing.length > 6 ? ` · +${missing.length - 6} more` : ""}
                  </span>
                </div>
              )}

              <div className="apply-actions">
                {(step as number) > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep((step as number) - 1)}
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                )}
                {(step as number) < TOTAL_STEPS && (
                  <button
                    type="button"
                    className="btn btn-primary apply-cta"
                    onClick={() => setStep((step as number) + 1)}
                    disabled={
                      (step === 1 && !valid1) ||
                      (step === 2 && !valid2) ||
                      (step === 3 && !valid3)
                    }
                  >
                    Continue <span className="btn-arrow">→</span>
                  </button>
                )}
                {step === TOTAL_STEPS && (
                  <button
                    type="button"
                    className="btn btn-primary apply-cta"
                    onClick={submit}
                    disabled={!valid4 || submitting}
                  >
                    {submitting ? "Submitting…" : "Submit application"}{" "}
                    <span className="btn-arrow">→</span>
                  </button>
                )}
              </div>

              <p className="apply-fine">
                Submitting this form is a soft inquiry only. A hard credit pull
                only happens after you accept a final offer.
              </p>
            </>
          )}

          {step === "done" && (
            <div className="apply-done">
              <div className="apply-done-check">✓</div>
              <h1>Application received.</h1>
              <p>
                Thanks{data.name ? `, ${data.name.split(" ")[0]}` : ""}. A
                GrowthPath advisor will reach out within one business day to
                confirm your offer and next steps.
              </p>
              <a href="/" className="btn btn-ghost">
                Back to home
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================
   STEPS
   ============================================ */

function Step1({
  data,
  update,
  setOwnership,
}: {
  data: AppData;
  update: <K extends keyof AppData>(k: K, v: AppData[K]) => void;
  setOwnership: (v: string) => void;
}) {
  return (
    <div className="apply-form">
      <Field id="name" label="Full legal name" value={data.name}
        onChange={(v) => update("name", v)} placeholder="Jane Doe"
        autoComplete="name" />
      <Row>
        <Field id="email" label="Email" type="email" value={data.email}
          onChange={(v) => update("email", v)}
          placeholder="jane@yourcompany.com" autoComplete="email" />
        <Field id="phone" label="Cell phone" type="tel" value={data.phone}
          onChange={(v) => update("phone", v)}
          placeholder="(555) 555-5555" autoComplete="tel" />
      </Row>
      <DateField id="dob" label="Date of birth" value={data.dob}
        onChange={(v) => update("dob", v)}
        yearMin={new Date().getFullYear() - 95}
        yearMax={new Date().getFullYear() - 18} />
      <SecureField id="ssn" label="Social Security #" value={data.ssn}
        onChange={(v) => update("ssn", formatSsn(v))}
        placeholder="•••-••-••••" maxLength={11} />

      <h4 className="apply-subhead">Home address (collateral property)</h4>
      <Field id="homeStreet" label="Street address" value={data.homeStreet}
        onChange={(v) => update("homeStreet", v)}
        placeholder="123 Main St" autoComplete="street-address" />
      <Row3>
        <Field id="homeCity" label="City" value={data.homeCity}
          onChange={(v) => update("homeCity", v)}
          placeholder="City" autoComplete="address-level2" />
        <SelectFieldSmall id="homeState" label="State" value={data.homeState}
          onChange={(v) => update("homeState", v)} options={STATES} />
        <Field id="homeZip" label="ZIP" value={data.homeZip}
          onChange={(v) => update("homeZip", v.replace(/\D/g, "").slice(0, 5))}
          placeholder="12345" inputMode="numeric"
          autoComplete="postal-code" />
      </Row3>

      <SelectField id="creditScore" label="Estimated credit score"
        value={data.creditScore}
        onChange={(v) => update("creditScore", v)} options={CREDIT_OPTIONS} />
      <YesNoField id="ownsProperty"
        label="Do you own any property?"
        value={data.ownsProperty}
        onChange={(v) => update("ownsProperty", v)} />

      <Field id="ownershipPct" label="Your ownership % of the business"
        value={data.ownershipPct}
        onChange={(v) => setOwnership(v.replace(/\D/g, "").slice(0, 3))}
        placeholder="100" inputMode="numeric"
        hint="If under 100%, we'll collect details on your co-owner below." />

      {data.hasCoOwner && (
        <div className="apply-subform">
          <h4 className="apply-subhead">Co-Owner / Guarantor 2</h4>
          <Row>
            <Field id="co2Name" label="Full legal name"
              value={data.co2Name}
              onChange={(v) => update("co2Name", v)}
              placeholder="John Doe" />
            <Field id="co2OwnershipPct" label="Ownership %"
              value={data.co2OwnershipPct}
              onChange={(v) => update("co2OwnershipPct",
                v.replace(/\D/g, "").slice(0, 3))}
              placeholder="50" inputMode="numeric" />
          </Row>
          <Field id="co2HomeStreet" label="Home street address"
            value={data.co2HomeStreet}
            onChange={(v) => update("co2HomeStreet", v)} />
          <Row3>
            <Field id="co2HomeCity" label="City" value={data.co2HomeCity}
              onChange={(v) => update("co2HomeCity", v)} />
            <SelectFieldSmall id="co2HomeState" label="State"
              value={data.co2HomeState}
              onChange={(v) => update("co2HomeState", v)} options={STATES} />
            <Field id="co2HomeZip" label="ZIP" value={data.co2HomeZip}
              onChange={(v) => update("co2HomeZip",
                v.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric" />
          </Row3>
          <DateField id="co2Dob" label="Date of birth"
            value={data.co2Dob}
            onChange={(v) => update("co2Dob", v)}
            yearMin={new Date().getFullYear() - 95}
            yearMax={new Date().getFullYear() - 18} />
          <SecureField id="co2Ssn" label="Social Security #"
            value={data.co2Ssn}
            onChange={(v) => update("co2Ssn", formatSsn(v))}
            placeholder="•••-••-••••" maxLength={11} />
          <Row>
            <Field id="co2Phone" label="Cell phone" type="tel"
              value={data.co2Phone}
              onChange={(v) => update("co2Phone", v)} />
            <Field id="co2Email" label="Email" type="email"
              value={data.co2Email}
              onChange={(v) => update("co2Email", v)} />
          </Row>
          <SelectField id="co2CreditScore" label="Estimated credit score"
            value={data.co2CreditScore}
            onChange={(v) => update("co2CreditScore", v)}
            options={CREDIT_OPTIONS} />
          <YesNoField id="co2OwnsProperty"
            label="Does this co-owner own any property?"
            value={data.co2OwnsProperty}
            onChange={(v) => update("co2OwnsProperty", v)} />
        </div>
      )}
    </div>
  );
}

function Step2({
  data,
  update,
}: {
  data: AppData;
  update: <K extends keyof AppData>(k: K, v: AppData[K]) => void;
}) {
  return (
    <div className="apply-form">
      <Row>
        <Field id="businessLegalName" label="Business legal name"
          value={data.businessLegalName}
          onChange={(v) => update("businessLegalName", v)}
          placeholder="Acme Industries LLC" />
        <Field id="businessDba" label="DBA (optional)"
          value={data.businessDba}
          onChange={(v) => update("businessDba", v)}
          placeholder="If different" />
      </Row>
      <SelectField id="entityType" label="Legal entity type"
        value={data.entityType}
        onChange={(v) => update("entityType", v)} options={ENTITY_OPTIONS} />
      <DateField id="businessStartDate" label="Business start date"
        value={data.businessStartDate}
        onChange={(v) => update("businessStartDate", v)}
        yearMin={new Date().getFullYear() - 80}
        yearMax={new Date().getFullYear()} />
      <SecureField id="businessTaxId" label="Business Tax ID (EIN)"
        value={data.businessTaxId}
        onChange={(v) => update("businessTaxId", formatEin(v))}
        placeholder="••-•••••••" maxLength={10} />
      <Row>
        <SelectFieldSmall id="incorporationState"
          label="State of incorporation"
          value={data.incorporationState}
          onChange={(v) => update("incorporationState", v)}
          options={STATES} />
        <Field id="businessPhone" label="Business phone" type="tel"
          value={data.businessPhone}
          onChange={(v) => update("businessPhone", v)}
          placeholder="(555) 555-5555" />
      </Row>
      <Row>
        <Field id="industry" label="Industry / NAICS"
          value={data.industry}
          onChange={(v) => update("industry", v)}
          placeholder="e.g. General contracting" />
        <Field id="businessEmail" label="Business email" type="email"
          value={data.businessEmail}
          onChange={(v) => update("businessEmail", v)}
          placeholder="contact@acme.com" />
      </Row>
      <Field id="website" label="Website (optional)"
        value={data.website}
        onChange={(v) => update("website", v)}
        placeholder="https://acme.com" />
      <TextareaField id="businessDescription"
        label="Business description"
        value={data.businessDescription}
        onChange={(v) => update("businessDescription", v)}
        placeholder="What does the business do?" rows={3} />

      <h4 className="apply-subhead">Business location</h4>
      <Field id="bizStreet" label="Street address"
        value={data.bizStreet}
        onChange={(v) => update("bizStreet", v)} />
      <Row3>
        <Field id="bizCity" label="City" value={data.bizCity}
          onChange={(v) => update("bizCity", v)} />
        <SelectFieldSmall id="bizState" label="State"
          value={data.bizState}
          onChange={(v) => update("bizState", v)} options={STATES} />
        <Field id="bizZip" label="ZIP" value={data.bizZip}
          onChange={(v) => update("bizZip",
            v.replace(/\D/g, "").slice(0, 5))}
          inputMode="numeric" />
      </Row3>
      <SelectField id="bizRentOwn" label="Is the location rented or owned?"
        value={data.bizRentOwn}
        onChange={(v) => update("bizRentOwn", v)}
        options={["Rented", "Owned", "N/A"]} />
      {data.bizRentOwn !== "N/A" && data.bizRentOwn !== "" && (
        <Row>
          <Field id="bizMonthlyPayment" label="Monthly payment"
            value={data.bizMonthlyPayment}
            onChange={(v) => update("bizMonthlyPayment", v)}
            placeholder="$3,500" inputMode="numeric" />
          <Field id="bizLandlord"
            label={data.bizRentOwn === "Owned" ? "Mortgage holder" : "Landlord contact"}
            value={data.bizLandlord}
            onChange={(v) => update("bizLandlord", v)}
            placeholder="Name & phone" />
        </Row>
      )}
    </div>
  );
}

function Step3({
  data,
  update,
}: {
  data: AppData;
  update: <K extends keyof AppData>(k: K, v: AppData[K]) => void;
}) {
  return (
    <div className="apply-form">
      <TrustBadges />

      <Row>
        <Field id="grossAnnualSales" label="Gross annual sales"
          value={data.grossAnnualSales}
          onChange={(v) => update("grossAnnualSales", v)}
          placeholder="$1,200,000" inputMode="numeric" />
        <Field id="totalMonthlySales" label="Total monthly sales"
          value={data.totalMonthlySales}
          onChange={(v) => update("totalMonthlySales", v)}
          placeholder="$100,000" inputMode="numeric" />
      </Row>
      <Row>
        <Field id="averageBankBalance" label="Average bank balance"
          value={data.averageBankBalance}
          onChange={(v) => update("averageBankBalance", v)}
          placeholder="$45,000" inputMode="numeric" />
        <Field id="monthlyDeposits" label="Avg # deposits per month"
          value={data.monthlyDeposits}
          onChange={(v) => update("monthlyDeposits",
            v.replace(/\D/g, "").slice(0, 4))}
          placeholder="35" inputMode="numeric" />
      </Row>
      <Field id="ccProcessingVolume"
        label="Average credit-card processing volume (optional)"
        value={data.ccProcessingVolume}
        onChange={(v) => update("ccProcessingVolume", v)}
        placeholder="$25,000 / month" inputMode="numeric" />

      <YesNoField id="hasOutstandingDebt"
        label="Do you have an outstanding cash advance or business loan?"
        value={data.hasOutstandingDebt}
        onChange={(v) => update("hasOutstandingDebt", v)} />

      {data.hasOutstandingDebt === "Yes" && (
        <Row>
          <Field id="existingLender" label="Lender / funder name"
            value={data.existingLender}
            onChange={(v) => update("existingLender", v)} />
          <Field id="existingBalance" label="Open balance"
            value={data.existingBalance}
            onChange={(v) => update("existingBalance", v)}
            placeholder="$25,000" inputMode="numeric" />
        </Row>
      )}
    </div>
  );
}

function Step4({
  data,
  update,
}: {
  data: AppData;
  update: <K extends keyof AppData>(k: K, v: AppData[K]) => void;
}) {
  return (
    <div className="apply-form">
      <div className="apply-auth-block">
        <h4 className="apply-subhead">Authorization</h4>
        <p className="apply-auth-text">
          By signing below, you (the business and business owner, individually
          and collectively) authorize GrowthPath Advisory and its marketplace
          participants and their respective representatives, successors,
          assigns and designees to obtain consumer, business, and investigative
          reports about you — including credit-card processor and bank
          statements — from one or more consumer reporting agencies (such as
          TransUnion, Experian, and Equifax) and from other credit bureaus,
          banks, creditors, and third parties. You also authorize GrowthPath
          Advisory to transmit this application form and any related
          information obtained in connection with this application to any of
          the recipients for the purposes described above. You also consent to
          the release, by any creditor or financial institution, of any
          information relating to you, on its own behalf.
        </p>

        <label className="apply-checkbox">
          <input
            type="checkbox"
            checked={data.authorize}
            onChange={(e) => update("authorize", e.target.checked)}
          />
          <span>
            I have read, understood, and agree to the authorization above. I
            understand the initial inquiry is a soft pull with no impact to my
            credit score.
          </span>
        </label>
      </div>

      <div className="apply-sign-block">
        <h4 className="apply-subhead">E-signature</h4>
        <p className="apply-sign-help">
          Type your full legal name <strong>exactly as you entered it above</strong> ({data.name || "—"}) to sign.
        </p>
        <input
          type="text"
          className="apply-sign-input"
          value={data.signatureName}
          onChange={(e) => update("signatureName", e.target.value)}
          placeholder="Your full name"
          autoComplete="off"
          style={{ ["--ink" as string]: "var(--gp-ink)" } as CSSProperties}
        />
        <p className="apply-sign-meta">
          Signed on{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

/* ============================================
   FIELD HELPERS
   ============================================ */

function Field({
  id, label, value, onChange, placeholder, type = "text",
  autoComplete, inputMode, hint,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "email" | "tel";
  hint?: string;
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={autoComplete}
        inputMode={inputMode} />
      {hint && <p className="apply-hint">{hint}</p>}
    </div>
  );
}

function SecureField({
  id, label, value, onChange, placeholder, maxLength,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; maxLength?: number;
}) {
  const [reveal, setReveal] = useState(false);
  return (
    <div className="apply-field">
      <label htmlFor={id}>
        {label}{" "}
        <span className="apply-secure-tag">
          <span className="lock">🔒</span> encrypted
        </span>
      </label>
      <div className="apply-secure-wrap">
        <input id={id} type={reveal ? "text" : "password"} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} maxLength={maxLength}
          inputMode="numeric" autoComplete="off" />
        <button type="button" className="apply-reveal"
          onClick={() => setReveal((r) => !r)}>
          {reveal ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function TextareaField({
  id, label, value, onChange, placeholder, rows = 3,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} value={value} rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} />
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
  yearMin,
  yearMax,
}: {
  id: string;
  label: string;
  value: string; // ISO yyyy-mm-dd
  onChange: (v: string) => void;
  yearMin: number;
  yearMax: number;
}) {
  // Keep partial selections locally; emit ISO date only when all three are set.
  const initial = (() => {
    const [yy, mm, dd] = (value || "").split("-");
    return { y: yy || "", m: mm || "", d: dd || "" };
  })();
  const [parts, setParts] = useState(initial);

  // If parent resets value to "" (e.g. after submit), clear local state.
  useEffect(() => {
    if (!value) return;
    const [yy, mm, dd] = value.split("-");
    if (yy && mm && dd && (yy !== parts.y || mm !== parts.m || dd !== parts.d)) {
      setParts({ y: yy, m: mm, d: dd });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const setPart = (which: "y" | "m" | "d", v: string) => {
    const next = { ...parts, [which]: v };
    setParts(next);
    if (next.y && next.m && next.d) {
      onChange(`${next.y}-${next.m.padStart(2, "0")}-${next.d.padStart(2, "0")}`);
    } else {
      onChange("");
    }
  };

  const months = [
    ["01", "Jan"], ["02", "Feb"], ["03", "Mar"], ["04", "Apr"],
    ["05", "May"], ["06", "Jun"], ["07", "Jul"], ["08", "Aug"],
    ["09", "Sep"], ["10", "Oct"], ["11", "Nov"], ["12", "Dec"],
  ] as const;
  const monthNum = parseInt(parts.m || "0");
  const yearNum = parseInt(parts.y || "0");
  const daysInMonth = monthNum && yearNum
    ? new Date(yearNum, monthNum, 0).getDate()
    : 31;
  const years: number[] = [];
  for (let yr = yearMax; yr >= yearMin; yr--) years.push(yr);

  return (
    <div className="apply-field">
      <label htmlFor={`${id}-month`}>{label}</label>
      <div className="apply-date-grid">
        <select
          id={`${id}-month`}
          className="apply-native-select"
          value={parts.m}
          onChange={(e) => setPart("m", e.target.value)}
          aria-label={`${label} — month`}
        >
          <option value="">Month</option>
          {months.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          id={`${id}-day`}
          className="apply-native-select"
          value={parts.d}
          onChange={(e) => setPart("d", e.target.value)}
          aria-label={`${label} — day`}
        >
          <option value="">Day</option>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((n) => (
            <option key={n} value={String(n).padStart(2, "0")}>{n}</option>
          ))}
        </select>
        <select
          id={`${id}-year`}
          className="apply-native-select"
          value={parts.y}
          onChange={(e) => setPart("y", e.target.value)}
          aria-label={`${label} — year`}
        >
          <option value="">Year</option>
          {years.map((yr) => (
            <option key={yr} value={String(yr)}>{yr}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SelectField({
  id, label, value, onChange, options,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <div className="apply-select-grid">
        {options.map((opt) => (
          <button key={opt} type="button"
            className={"apply-select-opt" + (value === opt ? " is-active" : "")}
            onClick={() => onChange(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectFieldSmall({
  id, label, value, onChange, options,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} className="apply-native-select"
        onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  );
}

function YesNoField({
  id, label, value, onChange,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <div className="apply-yn">
        {["Yes", "No"].map((opt) => (
          <button key={opt} type="button"
            className={"apply-yn-opt" + (value === opt ? " is-active" : "")}
            onClick={() => onChange(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="apply-row">{children}</div>;
}

function Row3({ children }: { children: React.ReactNode }) {
  return <div className="apply-row apply-row-3">{children}</div>;
}

function TrustBadges() {
  return (
    <div className="apply-trust">
      <div className="apply-trust-item">
        <span className="apply-trust-icon">🔒</span>
        <span>256-bit SSL encryption</span>
      </div>
      <div className="apply-trust-item">
        <span className="apply-trust-icon">🛡️</span>
        <span>Soft inquiry — no credit impact</span>
      </div>
      <div className="apply-trust-item">
        <span className="apply-trust-icon">🚫</span>
        <span>Never sold to third parties</span>
      </div>
      <div className="apply-trust-item">
        <span className="apply-trust-icon">✓</span>
        <span>No commitment to lend</span>
      </div>
    </div>
  );
}

/* ============================================
   FORMATTERS
   ============================================ */

function formatSsn(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

function formatEin(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

const USE_LABELS: Record<string, string> = {
  working: "Working capital",
  consolidate: "Pay off MCA or cards",
  equipment: "Equipment or vehicles",
  growth: "Marketing & growth",
  realestate: "Real estate investment",
  other: "Something else",
};
