"use client";

import "./apply.css";
import { useEffect, useState } from "react";

type Prequal = {
  amount?: number;
  useCase?: string | null;
  equity?: string | null;
  credit?: string | null;
  name?: string;
  email?: string;
  phone?: string;
};

type AppData = {
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  personalIncome: string;
  businessRevenue: string;
  ownershipPct: string;
  entityStructure: string;
};

const ENTITY_OPTIONS = [
  "Sole Proprietor",
  "LLC",
  "S-Corp",
  "C-Corp",
  "Partnership",
  "Other",
];

export default function ApplyPage() {
  const [step, setStep] = useState<1 | 2 | "done">(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prequal, setPrequal] = useState<Prequal>({});
  const [data, setData] = useState<AppData>({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    personalIncome: "",
    businessRevenue: "",
    ownershipPct: "",
    entityStructure: "",
  });

  // Pull pre-qualification answers + contact from funnel sessionStorage
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
      }));
    } catch {
      /* noop */
    }
  }, []);

  const step1Valid =
    data.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(data.email) &&
    data.phone.replace(/\D/g, "").length >= 10 &&
    data.propertyAddress.trim().length > 5;

  const step2Valid =
    data.personalIncome.trim().length > 0 &&
    data.businessRevenue.trim().length > 0 &&
    data.ownershipPct.trim().length > 0 &&
    data.entityStructure.trim().length > 0;

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
      setStep("done");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          Soft check · No impact to your credit
        </div>
      </header>

      <main className="apply-main">
        <div className="apply-shell">
          {step !== "done" && (
            <>
              <div className="apply-head">
                <span className="eyebrow">
                  Step {step} of 2 ·{" "}
                  {step === 1 ? "About you" : "About your business"}
                </span>
                <h1>
                  {step === 1
                    ? "Confirm your details."
                    : "Tell us about your business."}
                </h1>
                <p className="apply-lede">
                  {step === 1
                    ? "Most of this is already filled in from your pre-qualification. Just confirm and add your property address."
                    : "Four quick numbers about your income, revenue, and entity. Takes 60 seconds."}
                </p>
              </div>

              <div className="apply-progress">
                <div
                  className="apply-progress-fill"
                  style={{ width: step === 1 ? "50%" : "100%" }}
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
                        {labelFor(prequal.useCase, USE_LABELS)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="apply-form">
                  <Field
                    id="name"
                    label="Full name"
                    value={data.name}
                    onChange={(v) => setData({ ...data, name: v })}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(v) => setData({ ...data, email: v })}
                    placeholder="jane@yourcompany.com"
                    autoComplete="email"
                  />
                  <Field
                    id="phone"
                    label="Cell phone"
                    type="tel"
                    value={data.phone}
                    onChange={(v) => setData({ ...data, phone: v })}
                    placeholder="(555) 555-5555"
                    autoComplete="tel"
                  />
                  <Field
                    id="propertyAddress"
                    label="Property address"
                    value={data.propertyAddress}
                    onChange={(v) =>
                      setData({ ...data, propertyAddress: v })
                    }
                    placeholder="123 Main St, City, ST 12345"
                    autoComplete="street-address"
                    hint="The home you're using as collateral."
                  />
                </div>
              )}

              {step === 2 && (
                <div className="apply-form">
                  <Field
                    id="personalIncome"
                    label="Estimated annual personal income"
                    value={data.personalIncome}
                    onChange={(v) =>
                      setData({ ...data, personalIncome: v })
                    }
                    placeholder="$150,000"
                    inputMode="numeric"
                    hint="Pre-tax. We'll verify with documentation later."
                  />
                  <Field
                    id="businessRevenue"
                    label="Average monthly business revenue"
                    value={data.businessRevenue}
                    onChange={(v) =>
                      setData({ ...data, businessRevenue: v })
                    }
                    placeholder="$50,000"
                    inputMode="numeric"
                  />
                  <Field
                    id="ownershipPct"
                    label="Your ownership %"
                    value={data.ownershipPct}
                    onChange={(v) => setData({ ...data, ownershipPct: v })}
                    placeholder="100"
                    inputMode="numeric"
                  />
                  <SelectField
                    id="entityStructure"
                    label="Entity structure"
                    value={data.entityStructure}
                    onChange={(v) =>
                      setData({ ...data, entityStructure: v })
                    }
                    options={ENTITY_OPTIONS}
                  />
                </div>
              )}

              {error && <p className="apply-error">{error}</p>}

              <div className="apply-actions">
                {step === 2 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep(1)}
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                )}
                {step === 1 && (
                  <button
                    type="button"
                    className="btn btn-primary apply-cta"
                    onClick={() => setStep(2)}
                    disabled={!step1Valid}
                  >
                    Continue <span className="btn-arrow">→</span>
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="button"
                    className="btn btn-primary apply-cta"
                    onClick={submit}
                    disabled={!step2Valid || submitting}
                  >
                    {submitting
                      ? "Submitting…"
                      : "Submit my application"}{" "}
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

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "email" | "tel";
  hint?: string;
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
      {hint && <p className="apply-hint">{hint}</p>}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="apply-field">
      <label htmlFor={id}>{label}</label>
      <div className="apply-select-grid">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={
              "apply-select-opt" + (value === opt ? " is-active" : "")
            }
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

const USE_LABELS: Record<string, string> = {
  working: "Working capital",
  consolidate: "Pay off MCA or cards",
  equipment: "Equipment or vehicles",
  growth: "Marketing & growth",
  realestate: "Real estate investment",
  other: "Something else",
};

function labelFor(id: string | null | undefined, map: Record<string, string>) {
  if (!id) return "—";
  return map[id] ?? id;
}
