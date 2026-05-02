"use client";

import Nav from "@/components/Nav";
import QualifierFunnel from "@/components/QualifierFunnel";
import ComparisonTable from "@/components/ComparisonTable";
import FAQ from "@/components/FAQ";
import ExitIntentEbook from "@/components/ExitIntentEbook";
import { Fragment } from "react";

export default function Home() {
  const scrollToHero = () => {
    const isMobile =
      typeof window !== "undefined" && window.innerWidth <= 1080;
    if (isMobile) {
      document
        .getElementById("qualifier")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document
        .getElementById("hero")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div data-screen-label="Landing Page">
      <Nav onCta={scrollToHero} />

      {/* HERO */}
      <section id="hero" className="hero" data-screen-label="Hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <div className="hero-meta">
              <span className="dot" />
              <span>
                Business Purpose HELOC · $25K – $750K
                <span className="hide-mobile"> · Funded ~5 days</span>
              </span>
            </div>
            <h1>
              Your home equity can replace every{" "}
              <span className="strike">expensive dollar</span> your business is
              borrowing.
            </h1>
            <p className="hero-sub">
              Access $25K to $750K at a fraction of what MCAs, credit cards, and
              traditional lenders charge. No refinance. Your mortgage rate stays
              locked.
            </p>
          </div>

          <div className="hero-buttons">
            <div className="hero-cta-row">
              <button className="btn btn-primary" onClick={scrollToHero}>
                See what you qualify for{" "}
                <span className="btn-arrow">→</span>
              </button>
              <a href="#compare" className="btn btn-ghost-light">
                Compare your current funding
              </a>
            </div>
            <p className="hero-micro">
              <span className="check">✓</span>
              Soft credit check &nbsp;·&nbsp; No impact to score &nbsp;·&nbsp; ~5
              minutes
            </p>
          </div>

          <div className="marquee hero-marquee-mobile">
            <div className="marquee-track">
              {Array.from({ length: 2 }).map((_, k) => (
                <Fragment key={k}>
                  <span>No refinance required</span>
                  <span className="star">✦</span>
                  <span>Mortgage rate stays locked</span>
                  <span className="star">✦</span>
                  <span>$0 out-of-pocket</span>
                  <span className="star">✦</span>
                  <span>Soft pull to prequalify</span>
                  <span className="star">✦</span>
                  <span>10–30 year terms</span>
                  <span className="star">✦</span>
                  <span>No prepayment penalties</span>
                  <span className="star">✦</span>
                  <span>eNotary closing 7 days a week</span>
                  <span className="star">✦</span>
                </Fragment>
              ))}
            </div>
          </div>

          <div id="qualifier" className="hero-funnel-wrap">
            <QualifierFunnel />
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <div className="num">
                $750<span className="small">K</span>
              </div>
              <div className="lbl">
                Maximum loan
                <br />
                10–30 year terms
              </div>
            </div>
            <div className="trust-item">
              <div className="num">
                5<span className="small"> days</span>
              </div>
              <div className="lbl">
                Application
                <br />
                to funded
              </div>
            </div>
            <div className="trust-item">
              <div className="num">$0</div>
              <div className="lbl">
                Out-of-pocket
                <br />
                cost to close
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE — DESKTOP (between hero and problem) */}
      <div className="marquee marquee-desktop">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <Fragment key={k}>
              <span>No refinance required</span>
              <span className="star">✦</span>
              <span>Mortgage rate stays locked</span>
              <span className="star">✦</span>
              <span>$0 out-of-pocket</span>
              <span className="star">✦</span>
              <span>Soft pull to prequalify</span>
              <span className="star">✦</span>
              <span>10–30 year terms</span>
              <span className="star">✦</span>
              <span>No prepayment penalties</span>
              <span className="star">✦</span>
              <span>eNotary closing 7 days a week</span>
              <span className="star">✦</span>
            </Fragment>
          ))}
        </div>
      </div>

      {/* COMPARISON — now section 01 */}
      <section
        id="compare"
        className="compare section"
        data-screen-label="Comparison"
      >
        <div className="container">
          <div className="shead">
            <div>
              <span className="eyebrow">01 — The real cost of your current capital</span>
              <h2>
                The same $100K,
                <br />
                four very different costs.
              </h2>
            </div>
            <div className="shead-aside">
              Here&apos;s what $100K actually costs you depending on where you
              borrow it. The numbers tell the story.
            </div>
          </div>
          <ComparisonTable />

          <div className="section-cta">
            <p>
              The math is the math. See what your equity actually qualifies
              for.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={scrollToHero}
            >
              See what you qualify for <span className="btn-arrow">→</span>
            </button>
            <span className="section-cta-fine">
              Soft credit check · No impact to your score · ~5 minutes
            </span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how section" data-screen-label="How it works">
        <div className="container">
          <div className="shead">
            <div>
              <span className="eyebrow">02 — Process</span>
              <h2>
                From application
                <br />
                to funded in four steps.
              </h2>
            </div>
            <div className="shead-aside">
              No title office trips. No paper packets. eNotary closing seven
              days a week. Most loans fund within 5 business days.
            </div>
          </div>
          <div className="how-track">
            {[
              {
                n: "01",
                t: "Check what you qualify for",
                time: "~5 min",
                d: "Quick online application takes about 5 minutes. Soft credit inquiry — no impact to your score. See your prequalified amount in seconds.",
              },
              {
                n: "02",
                t: "Verify your information",
                time: "~24 hrs",
                d: "Upload ID and connect your financial accounts to verify income. Bank, payroll, asset, or tax-return verification — handled automatically.",
              },
              {
                n: "03",
                t: "Complete your closing",
                time: "~30 min",
                d: "Sign your documents through our eNotary platform from your computer or phone. No trips to a title office. Available seven days a week.",
              },
              {
                n: "04",
                t: "Get your funds",
                time: "~5 days",
                d: "Funds deposited directly to your bank account via ACH. Most primary residence loans fund within 5 business days. No out-of-pocket costs.",
              },
            ].map((s) => (
              <div key={s.n} className="how-step">
                <div className="step-tag">
                  <span className="num">{s.n}</span>
                  Step {s.n}
                </div>
                <div className="step-time">{s.time}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>

          <div className="section-cta">
            <p>From application to funded in 5 days. Start yours now.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={scrollToHero}
            >
              Start my application <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="uses section" data-screen-label="Use cases">
        <div className="container">
          <div className="shead">
            <div>
              <span className="eyebrow">03 — Use of funds</span>
              <h2>
                Put your equity
                <br />
                to work however you need.
              </h2>
            </div>
            <div className="shead-aside">
              This is a business purpose loan. Use the funds for anything that
              grows, sustains, or improves your business.
            </div>
          </div>
          <div className="uses-grid">
            {[
              {
                n: "01",
                t: "Working capital",
                d: "Cover payroll, inventory, or seasonal gaps without draining your operating account.",
              },
              {
                n: "02",
                t: "Debt consolidation",
                d: "Eliminate MCA payments, credit card balances, and high-interest loans in one move.",
              },
              {
                n: "03",
                t: "Equipment & vehicles",
                d: "Fund what your business needs to operate, expand capacity, or scale into a new market.",
              },
              {
                n: "04",
                t: "Marketing & growth",
                d: "Run campaigns, hire staff, or open new locations without giving up cash flow.",
              },
              {
                n: "05",
                t: "Real estate investment",
                d: "Acquisitions, rehabs, and holding costs — keep your investment runway funded.",
              },
              {
                n: "06",
                t: "Renovations & upgrades",
                d: "Upgrade your commercial or investment properties to drive higher returns.",
              },
            ].map((u) => (
              <div key={u.n} className="use-card">
                <span className="num">{u.n}</span>
                <h3>{u.t}</h3>
                <p>{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUALIFY */}
      <section id="qualify" className="qualify section" data-screen-label="Qualify">
        <div className="container qualify-grid">
          <div>
            <span className="eyebrow eyebrow-light">04 — Qualification</span>
            <h2 style={{ marginTop: 16 }}>What you need to qualify.</h2>
            <p className="lead">
              Two automated underwriting tiers. Even if you don&apos;t fit the
              standard guidelines, you may still receive an offer through the
              expanded program. The platform places you in the best program you
              qualify for.
            </p>
            <div className="qualify-tier">
              <span className="pip">Two tiers</span>
              <span>
                <strong style={{ color: "white" }}>Standard</strong> for prime
                borrowers,{" "}
                <strong style={{ color: "white" }}>Expanded</strong> for
                borrowers in the 600–649 range. The system runs both
                automatically.
              </span>
            </div>
          </div>
          <div className="qualify-list">
            {[
              {
                lbl: "You own a home with equity",
                sub: "Single family, townhome, condo, duplex, or multi-unit up to 4 units",
                val: "Property",
              },
              {
                lbl: "Owned for at least 90 days",
                sub: "Recent purchases need to season briefly",
                val: "90 days",
              },
              {
                lbl: "Credit score of 600 or higher",
                sub: "Primary applicant · Experian FICO 9",
                val: "600+",
              },
              {
                lbl: "Debt-to-income ratio under 50%",
                sub: "Calculated automatically from your verifications",
                val: "DTI <50%",
              },
              {
                lbl: "Valid US-issued ID",
                sub: "Driver’s license, state ID, passport, or permanent resident card",
                val: "ID",
              },
            ].map((q, i) => (
              <div key={i} className="qualify-item">
                <span className="check">✓</span>
                <span className="lbl">
                  {q.lbl}
                  <span className="s">{q.sub}</span>
                </span>
                <span className="val">{q.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-cta section-cta-onblue">
          <p>If that&apos;s you, the rest takes 5 minutes.</p>
          <button
            type="button"
            className="btn btn-ghost-light"
            onClick={scrollToHero}
          >
            Check my eligibility <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      {/* FINE PRINT */}
      <section className="fine section" data-screen-label="Fine print">
        <div className="container">
          <div className="shead">
            <div>
              <span className="eyebrow">05 — Loan details</span>
              <h2>
                The fine print,
                <br />
                without the fine print.
              </h2>
            </div>
            <div className="shead-aside">
              Everything you&apos;d hunt for in a term sheet, called out
              plainly. No gotchas, no asterisks hidden in footnotes.
            </div>
          </div>
          <div className="fine-grid">
            {[
              {
                l: "Loan amounts",
                v: "$25K",
                u: "– $750K",
                n: "Single line of credit, multiple draws over the draw period.",
              },
              {
                l: "Terms",
                v: "10 / 15 / 20 / 30",
                u: "years",
                n: "Fixed or variable. Variable rates are 25 bps lower.",
              },
              {
                l: "Lien position",
                v: "Up to 3rd",
                u: "lien",
                n: "Sits behind your existing mortgage on primary residences.",
              },
              {
                l: "Rate floor",
                v: "4.5%",
                u: "minimum",
                n: "Final rate depends on tier, lien position, and term length.",
              },
              {
                l: "Origination fee",
                v: "1.99 – 4.99%",
                u: "",
                n: "Rolled into the loan. No out-of-pocket cost.",
              },
              {
                l: "Prepayment penalty",
                v: "None",
                u: "",
                n: "Pay off any time. (See FAQ for the 16-week clawback exception.)",
              },
              {
                l: "Credit check",
                v: "Soft",
                u: "to prequalify",
                n: "Hard pull only when you decide to move forward.",
              },
              {
                l: "Valuation",
                v: "AVM",
                u: "most loans",
                n: "Full appraisal only required if loan exceeds $400K.",
              },
              {
                l: "Redraw",
                v: "$500",
                u: "minimum",
                n: "3–5 year draw period. Redraw up to 100% of original limit.",
              },
            ].map((c, i) => (
              <div key={i} className="fine-cell">
                <div className="lbl">{c.l}</div>
                <div className="val">
                  {c.v}
                  {c.u && <span className="unit">{c.u}</span>}
                </div>
                <div className="note">{c.n}</div>
              </div>
            ))}
          </div>
          <div className="fine-states">
            <div>
              <div className="h">State availability</div>
              <div className="t">
                Available in most US states. This program is not currently
                offered in:
              </div>
            </div>
            <div className="pills">
              {[
                "AZ",
                "GA",
                "HI",
                "ID",
                "MI",
                "MN",
                "NV",
                "NJ",
                "ND",
                "OR",
                "SD",
                "UT",
                "VT",
                "VA",
                "WV",
              ].map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq section" data-screen-label="FAQ">
        <div className="container-tight">
          <div className="shead">
            <div>
              <span className="eyebrow">06 — FAQ</span>
              <h2>
                Questions you
                <br />
                probably have.
              </h2>
            </div>
            <div className="shead-aside">
              The questions every business owner asks before they apply.
            </div>
          </div>
          <FAQ />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final" data-screen-label="Final CTA">
        <div className="container final-inner">
          <span className="eyebrow eyebrow-light final-eyebrow">
            Ready when you are
          </span>
          <h2 style={{ color: "white" }}>
            Stop overpaying for capital
            <br />
            you could access for less.
          </h2>
          <p className="lead">
            Every month you stay in an MCA or carry high-interest credit card
            debt is a month you&apos;re paying more than you need to. If you own
            a home with equity, you already have access to cheaper capital — you
            just haven&apos;t unlocked it yet.
          </p>
          <div className="final-cta-row">
            <button className="btn btn-primary" onClick={scrollToHero}>
              Check your rate now <span className="btn-arrow">→</span>
            </button>
            <a href="#compare" className="btn btn-ghost-light">
              Compare to your current funding
            </a>
          </div>
          <p className="final-micro">
            5-minute application · Soft credit pull · No obligation
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" style={{ display: "inline-block" }}>
                <img
                  src="/assets/growthpath-logo.png"
                  alt="GrowthPath Advisory"
                  style={{
                    height: 32,
                    filter: "brightness(0) invert(1)",
                    opacity: 0.95,
                  }}
                />
              </a>
              <p>
                Business purpose HELOCs for owners who&apos;d rather borrow
                against equity than cash flow.
              </p>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Product</div>
              <a href="#how">How it works</a>
              <a href="#compare">Compare</a>
              <a href="#qualify">Qualify</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Company</div>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Legal</div>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Licensing</a>
              <a href="#">Disclosures</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 GrowthPath Advisory · All rights reserved</div>
            <div className="legal">
              GrowthPath Advisory facilitates business purpose loans secured by
              residential real estate. Loan terms, rates, and availability
              subject to underwriting and state regulations. This is not a
              commitment to lend.
            </div>
          </div>
        </div>
      </footer>

      {/* Exit-intent ebook popup */}
      <ExitIntentEbook />
    </div>
  );
}
