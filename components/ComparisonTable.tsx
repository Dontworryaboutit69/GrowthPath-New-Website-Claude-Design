const otherProducts = [
  {
    name: "Merchant Cash Advance",
    sub: "Daily ACH debits",
    cost: "$40,000",
    costNote: "Total fees on $100K (6-month payback at 1.4 factor)",
    rate: "~80%",
    rateLbl: "APR equivalent",
    speed: "1–3 days",
    catchHead: "Annualized, that's an 80% APR",
    catch:
      "And they take it all back in six months through daily ACH debits. Owners who stack MCAs pay this every cycle.",
  },
  {
    name: "Business Credit Cards",
    sub: "Revolving balances",
    cost: "$24,000",
    costNote: "Year 1 interest on $100K at 24% APR",
    rate: "22–29%",
    rateLbl: "APR",
    speed: "Instant",
    catchHead: "Pure interest — principal still owed",
    catch:
      "Minimum payments barely touch the principal. At $100K carrying 24%, you stay in debt for decades.",
  },
  {
    name: "SBA Loan",
    sub: "Government-backed term loan",
    cost: "$10,500",
    costNote: "Year 1 interest on $100K at 11% APR (10-yr term)",
    rate: "10–13%",
    rateLbl: "APR",
    speed: "60–90 days",
    catchHead: "Cheaper rate — but slow and selective",
    catch:
      "Personal guarantees, extensive documentation, 60–90 day review. Most small businesses don't qualify or can't wait.",
  },
];

export default function ComparisonTable() {
  return (
    <div className="compare-wrap">
      <div className="compare-spotlight">
        <div>
          <span className="winner-tag">
            <span className="star">★</span> Best option · Backed by your home
            equity
          </span>
          <h3>GrowthPath Business HELOC</h3>
          <p className="desc">
            On the same $100K, you&apos;d pay roughly{" "}
            <strong style={{ color: "white" }}>
              $9,500 in year 1 interest
            </strong>
            . Compare that to <strong style={{ color: "white" }}>$40,000</strong>{" "}
            on an MCA or{" "}
            <strong style={{ color: "white" }}>$24,000</strong> on credit cards
            — at a 9.5% APR, it&apos;s the cheapest capital your business has
            access to.
          </p>
        </div>
        <div className="compare-spotlight-stats">
          <div className="css-stat">
            <div className="v blue">$9,500</div>
            <div className="l">Year 1 cost on $100K</div>
          </div>
          <div className="css-stat">
            <div className="v">8–12%</div>
            <div className="l">APR</div>
          </div>
          <div className="css-stat">
            <div className="v">~5 days</div>
            <div className="l">Funding speed</div>
          </div>
        </div>
      </div>

      <div className="compare-vs-label">
        <span className="vs-strong">vs.</span> what you&apos;re probably using
        now
      </div>

      <div className="compare-others">
        {otherProducts.map((p) => (
          <div key={p.name} className="co-card">
            <div className="co-name">{p.name}</div>
            <div className="co-sub">{p.sub}</div>

            <div className="co-cost">
              <div className="co-cost-lbl">{p.costNote}</div>
              <div className="co-cost-val">{p.cost}</div>
            </div>

            <div className="co-stats">
              <div className="co-stat">
                <div className="l">{p.rateLbl}</div>
                <div className="v">{p.rate}</div>
              </div>
              <div className="co-stat">
                <div className="l">Funding speed</div>
                <div className="v muted">{p.speed}</div>
              </div>
            </div>

            <div className="co-catch">
              <span className="h">The catch</span>
              <strong
                style={{
                  color: "var(--gp-graphite)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {p.catchHead}.
              </strong>
              {p.catch}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
