"use client";

import { useRef, useState, type CSSProperties } from "react";
import { fbqTrack } from "@/lib/fbpixel";

const fmtK = (n: number) => {
  if (n >= 1000)
    return "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "M";
  return "$" + n + "K";
};

type Answers = {
  amount: number;
  useCase: string | null;
  ownsProperty: string | null;
  equity: string | null;
  credit: string | null;
  state: string;
  name: string;
  email: string;
  phone: string;
};

const UNSUPPORTED_STATES = new Set([
  "AZ","GA","HI","ID","MI","MN","NV","NJ","ND","OR","SD","UT","VT","VA","WV",
]);

const ALL_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export default function QualifierFunnel() {
  const [step, setStep] = useState(0);
  const submittedPrequalRef = useRef(false);
  const [answers, setAnswers] = useState<Answers>({
    amount: 150,
    useCase: null,
    ownsProperty: null,
    equity: null,
    credit: null,
    state: "",
    name: "",
    email: "",
    phone: "",
  });

  const submitPrequalLead = (data: Answers) => {
    if (submittedPrequalRef.current) return;
    submittedPrequalRef.current = true;
    fbqTrack("Lead", {
      content_name: "HELOC pre-qualification",
      content_category: "funnel",
      value: data.amount,
      currency: "USD",
    });
    fetch("/api/prequal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch((err) => {
      console.error("[prequal] send failed:", err);
      submittedPrequalRef.current = false;
    });
  };

  const initiatedRef = useRef(false);
  const trackInitiate = () => {
    if (initiatedRef.current) return;
    initiatedRef.current = true;
    fbqTrack("InitiateCheckout", {
      content_name: "HELOC pre-qualification",
      content_category: "funnel",
      value: answers.amount,
      currency: "USD",
    });
  };

  const steps = [
    { id: "amount", label: "Capital needed" },
    { id: "useCase", label: "Use of funds" },
    { id: "ownsProperty", label: "Property ownership" },
    { id: "equity", label: "Home equity" },
    { id: "credit", label: "Credit range" },
    { id: "state", label: "Your state" },
    { id: "contact", label: "Your details" },
    { id: "result", label: "Pre-qualification" },
  ];
  const total = steps.length;
  const noProperty = answers.ownsProperty === "no";
  // Skip the equity step (index 3) when user doesn't own a home.
  const visibleTotal = noProperty ? total - 1 : total;
  const visibleStepNumber = noProperty && step > 3 ? step : step + 1;
  const pct = Math.round((visibleStepNumber / visibleTotal) * 100);

  const advance = (direction: 1 | -1) => {
    setStep((s) => {
      let target = s + direction;
      // Skip equity step (index 3) when user doesn't own property
      if (target === 3 && noProperty) target += direction;
      return Math.max(0, Math.min(target, total - 1));
    });
  };
  const next = () => advance(1);
  const prev = () => advance(-1);
  const reset = () => {
    setStep(0);
    submittedPrequalRef.current = false;
    setAnswers({
      amount: 150,
      useCase: null,
      ownsProperty: null,
      equity: null,
      credit: null,
      state: "",
      name: "",
      email: "",
      phone: "",
    });
  };

  const stateUnsupported =
    !!answers.state && UNSUPPORTED_STATES.has(answers.state);
  const stateName =
    ALL_STATES.find((s) => s.code === answers.state)?.name || answers.state;

  const contactValid =
    answers.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(answers.email) &&
    answers.phone.replace(/\D/g, "").length >= 10;

  const startApplication = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gp_prequal", JSON.stringify(answers));
    }
    window.location.href = "/apply";
  };

  const principal = answers.amount * 1000;
  const aprMCA = 0.8;
  const aprHELOC = 0.095;
  const monthsCompare = 24;
  const totalIfMCA = principal * (1 + (aprMCA / 12) * 6);
  const totalIfHELOC = principal * (1 + (aprHELOC / 12) * monthsCompare);
  const savings = Math.max(0, totalIfMCA - totalIfHELOC);
  const fmtSavings = "$" + Math.round(savings / 1000) + "K";

  const sliderPct = ((answers.amount - 25) / (750 - 25)) * 100;

  return (
    <div className="funnel-card">
      <div className="funnel-head">
        <div className="funnel-head-left">
          <span className="funnel-step">
            Step {Math.min(visibleStepNumber, visibleTotal)} of {visibleTotal}
          </span>
          <span className="funnel-title">{steps[step].label}</span>
        </div>
        <span className="funnel-tag">Soft check · No impact</span>
      </div>
      <div className="funnel-progress">
        <div className="funnel-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="funnel-body">
        {step === 0 && (
          <div className="fbody">
            <div className="fbody-q">
              How much <span className="it">capital</span> does your business
              need?
            </div>
            <div className="fbody-amount-display">
              <span className="amt-big">{fmtK(answers.amount)}</span>
              <span className="amt-range">$25K – $750K</span>
            </div>
            <div className="hero-card-slider">
              <input
                type="range"
                min={25}
                max={750}
                step={5}
                value={answers.amount}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    amount: parseInt(e.target.value),
                  })
                }
                style={{ ["--pct" as string]: `${sliderPct}%` } as CSSProperties}
              />
              <div className="hero-card-tick-row">
                <span>$25K</span>
                <span>$200K</span>
                <span>$400K</span>
                <span>$750K</span>
              </div>
            </div>
            <div className="fbody-presets">
              {[50, 100, 250, 500].map((v) => (
                <button
                  key={v}
                  className={
                    "preset" + (answers.amount === v ? " is-active" : "")
                  }
                  onClick={() => setAnswers({ ...answers, amount: v })}
                >
                  ${v}K
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fbody">
            <div className="fbody-q">What will you use the funds for?</div>
            <div className="fbody-options">
              {[
                {
                  id: "working",
                  label: "Working capital",
                  sub: "Payroll, inventory, seasonal gaps",
                },
                {
                  id: "consolidate",
                  label: "Pay off MCA or cards",
                  sub: "Replace expensive debt",
                },
                {
                  id: "equipment",
                  label: "Equipment or vehicles",
                  sub: "Operate or scale capacity",
                },
                {
                  id: "growth",
                  label: "Marketing & growth",
                  sub: "Hire, expand, run campaigns",
                },
                {
                  id: "realestate",
                  label: "Real estate investment",
                  sub: "Acquisitions, rehabs, holding costs",
                },
                {
                  id: "other",
                  label: "Something else",
                  sub: "Tell us in the application",
                },
              ].map((o) => (
                <button
                  key={o.id}
                  className={
                    "opt" + (answers.useCase === o.id ? " is-active" : "")
                  }
                  onClick={() => {
                    setAnswers({ ...answers, useCase: o.id });
                    setTimeout(next, 200);
                  }}
                >
                  <span className="opt-label">{o.label}</span>
                  <span className="opt-sub">{o.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fbody">
            <div className="fbody-q">
              Do you <span className="it">own a home</span> with equity?
            </div>
            <p className="fbody-contact-lede">
              This program is a HELOC against your home, so home ownership is
              required. If you don&apos;t own a home, we&apos;ll have an advisor
              reach out about other funding options.
            </p>
            <div className="fbody-options grid-2">
              {[
                { id: "yes", label: "Yes, I own a home" },
                { id: "no", label: "No, I don't" },
              ].map((o) => (
                <button
                  key={o.id}
                  className={
                    "opt opt-tight" +
                    (answers.ownsProperty === o.id ? " is-active" : "")
                  }
                  onClick={() => {
                    setAnswers({ ...answers, ownsProperty: o.id });
                    setTimeout(() => {
                      // If "no", skip equity (step 3) → jump straight to credit (step 4)
                      setStep(o.id === "no" ? 4 : 3);
                    }, 200);
                  }}
                >
                  <span className="opt-label">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fbody">
            <div className="fbody-q">
              How much <span className="it">equity</span> is in your home?
            </div>
            <div className="fbody-options grid-2">
              {[
                { id: "lt100", label: "Under $100K" },
                { id: "100_250", label: "$100K – $250K" },
                { id: "250_500", label: "$250K – $500K" },
                { id: "gt500", label: "Over $500K" },
                { id: "unsure", label: "Not sure" },
              ].map((o) => (
                <button
                  key={o.id}
                  className={
                    "opt opt-tight" +
                    (answers.equity === o.id ? " is-active" : "")
                  }
                  onClick={() => {
                    setAnswers({ ...answers, equity: o.id });
                    setTimeout(next, 200);
                  }}
                >
                  <span className="opt-label">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fbody">
            <div className="fbody-q">What&apos;s your approximate credit score?</div>
            <div className="fbody-options grid-2">
              {[
                { id: "600_649", label: "600 – 649", tier: "Expanded" },
                { id: "650_699", label: "650 – 699", tier: "Standard" },
                { id: "700_749", label: "700 – 749", tier: "Standard" },
                { id: "gt750", label: "750+", tier: "Best rates" },
                { id: "unsure", label: "Not sure", tier: null as string | null },
              ].map((o) => (
                <button
                  key={o.id}
                  className={
                    "opt opt-tight" +
                    (answers.credit === o.id ? " is-active" : "")
                  }
                  onClick={() => {
                    setAnswers({ ...answers, credit: o.id });
                    setTimeout(next, 200);
                  }}
                >
                  <span className="opt-label">{o.label}</span>
                  {o.tier && <span className="opt-tier">{o.tier}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="fbody">
            <div className="fbody-q">
              What <span className="it">state</span> is your home in?
            </div>
            <p className="fbody-contact-lede">
              The collateral property you&apos;d use for the HELOC.
            </p>
            <div className="fbody-field">
              <label htmlFor="qf-state">State</label>
              <select
                id="qf-state"
                className="fbody-select"
                value={answers.state}
                onChange={(e) =>
                  setAnswers({ ...answers, state: e.target.value })
                }
              >
                <option value="">Select your state…</option>
                {ALL_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="fbody">
            <div className="fbody-q">
              Where should we send your{" "}
              <span className="it">pre-qualification</span>?
            </div>
            <p className="fbody-contact-lede">
              Confirm your contact details and we&apos;ll show your offer on the
              next screen. No hard credit check.
            </p>
            <div className="fbody-contact">
              <div className="fbody-field">
                <label htmlFor="qf-name">Full name</label>
                <input
                  id="qf-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={answers.name}
                  onChange={(e) =>
                    setAnswers({ ...answers, name: e.target.value })
                  }
                />
              </div>
              <div className="fbody-field">
                <label htmlFor="qf-email">Email</label>
                <input
                  id="qf-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@yourcompany.com"
                  value={answers.email}
                  onChange={(e) =>
                    setAnswers({ ...answers, email: e.target.value })
                  }
                />
              </div>
              <div className="fbody-field">
                <label htmlFor="qf-phone">Mobile phone</label>
                <input
                  id="qf-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(555) 555-5555"
                  value={answers.phone}
                  onChange={(e) =>
                    setAnswers({ ...answers, phone: e.target.value })
                  }
                />
              </div>
              <p className="fbody-fine">
                We&apos;ll only use this to send your pre-qualification and
                follow up about your application. No spam, ever.
              </p>
            </div>
          </div>
        )}

        {step === 7 && noProperty && (
          <div className="fbody fbody-result">
            <div className="result-stamp result-stamp-warn">
              <span className="result-stamp-dot" />
              Different program needed
            </div>
            <div className="fbody-q result-q">
              {answers.name ? `${answers.name.split(" ")[0]}, ` : ""}
              this HELOC requires home ownership — but{" "}
              <span className="result-amt">we&apos;ve got options</span>.
            </div>
            <div className="result-subline">
              We have multiple funding programs — MCAs, term loans, equipment
              financing, lines of credit — that don&apos;t require real estate
              collateral. A GrowthPath advisor will reach out within 24 hours
              to walk you through what&apos;s available for your situation.
            </div>
            <button className="funnel-restart" onClick={reset}>
              Start over
            </button>
          </div>
        )}

        {step === 7 && !noProperty && !stateUnsupported && (
          <div className="fbody fbody-result">
            <div className="result-stamp">
              <span className="result-stamp-dot" />
              You pre-qualify
            </div>
            <div className="fbody-q result-q">
              {answers.name ? `${answers.name.split(" ")[0]}, you` : "You"} may
              qualify for up to{" "}
              <span className="result-amt">{fmtK(answers.amount)}</span>
            </div>
            <div className="result-subline">
              Based on your answers, you fit our{" "}
              {answers.credit === "600_649" ? "Expanded" : "Standard"} program.
              Complete the 5-minute application to lock in your rate.
            </div>
            <div className="result-grid">
              <div className="result-cell">
                <span className="rc-lbl">Estimated rate</span>
                <span className="rc-val rc-blue">8.9 – 11.4%</span>
              </div>
              <div className="result-cell">
                <span className="rc-lbl">Funding speed</span>
                <span className="rc-val">~5 days</span>
              </div>
              <div className="result-cell">
                <span className="rc-lbl">Out-of-pocket</span>
                <span className="rc-val rc-good">$0</span>
              </div>
              <div className="result-cell">
                <span className="rc-lbl">Savings vs. MCA</span>
                <span className="rc-val rc-good">~{fmtSavings}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary funnel-cta"
              onClick={startApplication}
            >
              Start your application · 5 min{" "}
              <span className="btn-arrow">→</span>
            </button>
            <button className="funnel-restart" onClick={reset}>
              Start over
            </button>
          </div>
        )}

        {step === 7 && !noProperty && stateUnsupported && (
          <div className="fbody fbody-result">
            <div className="result-stamp result-stamp-warn">
              <span className="result-stamp-dot" />
              Different program needed
            </div>
            <div className="fbody-q result-q">
              {answers.name ? `${answers.name.split(" ")[0]}, ` : ""}
              this specific HELOC isn&apos;t available in{" "}
              <span className="result-amt">{stateName}</span>
              {" "}— but don&apos;t worry.
            </div>
            <div className="result-subline">
              We have multiple funding options across MCAs, term loans, and
              other programs that can fit your needs. An advisor will reach out
              within one business day to walk through what&apos;s available for
              your situation.
            </div>
            <button className="funnel-restart" onClick={reset}>
              Start over
            </button>
          </div>
        )}
      </div>

      {step < total - 1 && (
        <div className="funnel-foot">
          <button
            className="funnel-back"
            onClick={prev}
            disabled={step === 0}
          >
            ← Back
          </button>
          {step === 0 ? (
            <button
              className="btn btn-primary funnel-next"
              onClick={() => {
                trackInitiate();
                next();
              }}
            >
              Continue <span className="btn-arrow">→</span>
            </button>
          ) : step === 5 ? (
            <button
              className="btn btn-primary funnel-next"
              onClick={next}
              disabled={!answers.state}
            >
              Continue <span className="btn-arrow">→</span>
            </button>
          ) : step === 6 ? (
            <button
              className="btn btn-primary funnel-next"
              onClick={() => {
                submitPrequalLead(answers);
                next();
              }}
              disabled={!contactValid}
            >
              See my pre-qualification <span className="btn-arrow">→</span>
            </button>
          ) : (
            <span className="funnel-hint">Tap an option to continue</span>
          )}
        </div>
      )}
    </div>
  );
}
