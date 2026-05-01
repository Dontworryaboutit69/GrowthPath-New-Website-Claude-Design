"use client";

import { useState } from "react";

const faqData = [
  {
    q: "Will this affect my mortgage?",
    a: "No. A business purpose HELOC sits behind your existing mortgage as a second or third lien. Your current rate, payment, and terms stay exactly the same.",
  },
  {
    q: "Will this show up on my credit report?",
    a: "The initial check is a soft pull with no impact to your score. If you move forward, a hard pull occurs. The HELOC reports as a revolving tradeline on your personal credit. It does not report to business credit.",
  },
  {
    q: "What if my credit isn’t perfect?",
    a: "The platform approves borrowers with scores as low as 600. There are two underwriting tiers, and the system automatically places you in the best program you qualify for. You don’t need to select anything.",
  },
  {
    q: "How fast can I actually get funded?",
    a: "Most primary residence loans fund within 5 business days. That includes a 3-day rescission period required by law. Secondary properties have no rescission period and can fund even faster.",
  },
  {
    q: "Can I pay it off early?",
    a: "Yes. No prepayment penalties. The only exception: if you pay back 90% or more within the first 16 weeks, there may be a compensation clawback.",
  },
  {
    q: "What if I just refinanced?",
    a: "We recommend waiting 45 days after your refinance has been recorded with your county before applying. This ensures liens are accurately reflected in the system.",
  },
  {
    q: "Can I borrow again after I pay it down?",
    a: "Yes. As you pay down your balance, you can redraw up to 100% of your original credit limit during your draw period. No new hard credit pull required. Minimum redraw is $500.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="faq-list">
      {faqData.map((item, i) => (
        <div key={i} className={"faq-item" + (open === i ? " open" : "")}>
          <button
            className="faq-q"
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <span className="faq-q-num">
              {String(i + 1).padStart(2, "0")} /{" "}
              {String(faqData.length).padStart(2, "0")}
            </span>
            <span className="faq-q-text">{item.q}</span>
            <span className="faq-q-icon">+</span>
          </button>
          <div className="faq-a">
            <div className="faq-a-inner">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
