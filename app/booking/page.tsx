"use client";

import "./booking.css";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gp_applicant_first_name");
      if (raw) setFirstName(raw);
    } catch {
      /* noop */
    }

    // Inject the GHL embed helper script once
    const existing = document.querySelector(
      'script[src="https://link.msgsndr.com/js/form_embed.js"]'
    );
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://link.msgsndr.com/js/form_embed.js";
      s.type = "text/javascript";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="booking-page">
      <header className="booking-nav">
        <a href="/" className="booking-logo">
          <img
            src="/assets/growthpath-logo.png"
            alt="GrowthPath Advisory"
            style={{ height: 28, filter: "brightness(0) invert(1)" }}
          />
        </a>
        <div className="booking-nav-meta">
          <span className="dot" />
          <span>Step 2 of 2 · Lock in your offer</span>
        </div>
      </header>

      <section className="booking-confirm">
        <div className="booking-confirm-inner">
          <div className="booking-check">✓</div>
          <span className="eyebrow">Application received</span>
          <h1>
            {firstName ? `${firstName}, you're` : "You're"} one short call away
            from <span className="ink-blue">funding.</span>
          </h1>
          <p className="booking-lede">
            Schedule a quick call with a GrowthPath lending specialist to review
            your application and collect the documentation needed before
            submission. This step gives you the best chance of approval and the
            best possible terms.
          </p>

          <div className="booking-reasons">
            <div className="booking-reason">
              <span className="booking-reason-num">01 — Review</span>
              <span className="booking-reason-h">Walk through your file</span>
              <span className="booking-reason-p">
                Confirm the information you submitted and answer any questions
                before underwriting sees it.
              </span>
            </div>
            <div className="booking-reason">
              <span className="booking-reason-num">02 — Documents</span>
              <span className="booking-reason-h">Collect what's needed</span>
              <span className="booking-reason-p">
                ID, proof of income, and bank statements — your specialist will
                tell you exactly what to upload.
              </span>
            </div>
            <div className="booking-reason">
              <span className="booking-reason-num">03 — Submit</span>
              <span className="booking-reason-h">Position for approval</span>
              <span className="booking-reason-p">
                We package your file the way underwriters want to see it. Most
                approvals come back within 48 hours.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-cal-section">
        <div className="booking-cal-shell">
          <div className="booking-cal-head">
            <div>
              <span className="eyebrow">Pick a time that works for you</span>
              <h2>Schedule your specialist call</h2>
            </div>
            <span className="booking-cal-meta">
              <span className="dot" />
              ~15 minutes · No prep required
            </span>
          </div>

          <div className="booking-iframe-wrap">
            <span className="booking-iframe-loading">Loading calendar…</span>
            <iframe
              src="https://api.leadconnectorhq.com/widget/booking/HhMHYgzz3lYfwHLuyO1a"
              style={{ width: "100%", border: "none", overflow: "hidden" }}
              scrolling="no"
              id="HhMHYgzz3lYfwHLuyO1a_1777687417400"
              title="Schedule your GrowthPath specialist call"
            />
          </div>

          <div className="booking-fineprint">
            <span className="booking-fineprint-icon">i</span>
            <div className="booking-fineprint-body">
              <h4>Can't book right now?</h4>
              <p>
                No problem — your application is saved. A GrowthPath advisor
                will reach out within one business day if you don't grab a slot
                here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
