"use client";

import QualifierFunnel from "@/components/QualifierFunnel";
import "./qualify.css";

export default function QualifyPage() {
  return (
    <div className="qualify-page">
      <header className="qualify-nav">
        <a href="/" className="qualify-logo">
          <img
            src="/assets/growthpath-logo.png"
            alt="GrowthPath Advisory"
            style={{ height: 28, filter: "brightness(0) invert(1)" }}
          />
        </a>
        <div className="qualify-nav-meta">
          <span className="dot" />
          <span>Soft check &middot; No impact to your credit</span>
        </div>
      </header>

      <main className="qualify-main">
        <div className="qualify-shell">
          <div className="qualify-intro">
            <h1>See what you qualify for.</h1>
            <p>
              Answer a few quick questions and we&apos;ll show your
              pre-qualified amount. Takes about 2 minutes. No hard credit
              pull.
            </p>
          </div>
          <QualifierFunnel />
        </div>
      </main>
    </div>
  );
}
