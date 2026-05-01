"use client";

import { useState, useEffect, useRef } from "react";

export default function ExitIntentEbook() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const triggered = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("gp_ebook_dismissed")) triggered.current = true;

    const onMouseLeave = (e: MouseEvent) => {
      if (triggered.current) return;
      if (e.clientY <= 0 && e.relatedTarget === null) {
        triggered.current = true;
        setOpen(true);
      }
    };

    const fallbackTimer = setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true;
        setOpen(true);
      }
    }, 45000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("gp_ebook_dismissed", "1");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    // TODO: wire backend / CRM submission here.
    setSubmitted(true);
    sessionStorage.setItem("gp_ebook_dismissed", "1");
  };

  if (!open) return null;

  return (
    <div className="ebook-overlay" onClick={close}>
      <div
        className="ebook-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-title"
      >
        <button className="ebook-close" onClick={close} aria-label="Close">
          ×
        </button>

        {!submitted ? (
          <div className="ebook-grid">
            {/* LEFT — book visual */}
            <div className="ebook-visual">
              <div className="ebook-visual-tag">Free guide · 32 pages</div>
              <div className="ebook-book">
                <div className="ebook-book-spine" />
                <div className="ebook-book-cover">
                  <div className="ebook-book-mark">
                    <img
                      src="/assets/growthpath-logo.png"
                      alt=""
                      style={{ height: 18, filter: "brightness(0) invert(1)" }}
                    />
                  </div>
                  <div className="ebook-book-eyebrow">The Owner&apos;s Guide</div>
                  <div className="ebook-book-title">
                    Replace Expensive Capital with Your Home Equity
                  </div>
                  <div className="ebook-book-sub">
                    A practical breakdown of how a Business Purpose HELOC works,
                    what it costs, and when it&apos;s the right move.
                  </div>
                  <div className="ebook-book-edition">2026 Edition</div>
                </div>
                <div className="ebook-book-shadow" />
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="ebook-form-side">
              <span className="eyebrow">Wait — before you go</span>
              <h3 id="ebook-title">
                Get the playbook every owner reads before they apply.
              </h3>
              <p className="ebook-lede">
                A 32-page guide covering rate math, qualification rules, the
                full term sheet, and three real-world case studies. We&apos;ll
                send it to your inbox right now.
              </p>

              <ul className="ebook-bullets">
                <li>
                  <span className="bdot">✓</span> Side-by-side cost analysis vs.
                  MCA, cards, and SBA
                </li>
                <li>
                  <span className="bdot">✓</span> Walkthrough of the
                  qualification tiers
                </li>
                <li>
                  <span className="bdot">✓</span> Three case studies with full
                  numbers
                </li>
                <li>
                  <span className="bdot">✓</span> The full term sheet with every
                  fee disclosed
                </li>
              </ul>

              <form className="ebook-form" onSubmit={submit}>
                <div className="ebook-field">
                  <label htmlFor="eb-name">Full name</label>
                  <input
                    id="eb-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                </div>
                <div className="ebook-field">
                  <label htmlFor="eb-email">Email</label>
                  <input
                    id="eb-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="jane@yourcompany.com"
                    autoComplete="email"
                  />
                </div>
                <div className="ebook-field">
                  <label htmlFor="eb-phone">Phone</label>
                  <input
                    id="eb-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="(555) 555-5555"
                    autoComplete="tel"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary ebook-submit"
                >
                  Send me the guide <span className="btn-arrow">→</span>
                </button>
                <p className="ebook-fine">
                  By submitting, you agree to receive the guide and occasional
                  follow-ups from GrowthPath. No spam. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div className="ebook-success">
            <div className="ebook-success-check">✓</div>
            <h3>Check your inbox.</h3>
            <p>
              We&apos;ve sent <strong>The Owner&apos;s Guide</strong> to{" "}
              <strong>{form.email}</strong>. It usually lands within a minute.
              While you&apos;re here — want to see what you&apos;d qualify for?
            </p>
            <div className="ebook-success-actions">
              <a href="#hero" className="btn btn-primary" onClick={close}>
                Check your rate <span className="btn-arrow">→</span>
              </a>
              <button className="btn btn-ghost" onClick={close}>
                Keep browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
