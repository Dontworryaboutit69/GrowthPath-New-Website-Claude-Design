"use client";

export default function Nav({ onCta }: { onCta: () => void }) {
  const openEbook = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("gp_ebook_dismissed");
    window.dispatchEvent(new CustomEvent("gp:open-ebook"));
  };

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#" className="nav-logo">
          <img
            src="/assets/growthpath-logo.png"
            alt="GrowthPath Advisory"
            style={{ height: 28, filter: "brightness(0) invert(1)" }}
          />
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#compare">Compare</a>
          <a href="#qualify">Qualify</a>
          <a href="#faq">FAQ</a>
          <button
            type="button"
            className="nav-link-btn"
            onClick={openEbook}
          >
            Free Ebook
          </button>
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="nav-ebook-mobile"
            onClick={openEbook}
            aria-label="Free Ebook"
          >
            Free Ebook
          </button>
          <button className="nav-cta" onClick={onCta}>
            <span className="nav-cta-full">See what you qualify for</span>
            <span className="nav-cta-short">Apply</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
