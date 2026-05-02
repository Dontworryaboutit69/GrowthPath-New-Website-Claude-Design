import type { Metadata } from "next";
import "./globals.css";
import "./design.css";
import "./funnel.css";
import "./ebook.css";

const SITE_URL = "https://heloc.growthpathadvisory.com";
const TITLE = "Replace expensive capital with your home equity — GrowthPath Advisory";
const DESCRIPTION =
  "Access $25K to $750K against your home equity at a fraction of what MCAs, credit cards, and traditional lenders charge. No refinance. Your mortgage rate stays locked. Funded in ~5 days.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "GrowthPath Advisory",
  authors: [{ name: "GrowthPath Advisory" }],
  keywords: [
    "Business Purpose HELOC",
    "Home Equity Line of Credit",
    "Business Funding",
    "MCA Replacement",
    "Working Capital",
    "GrowthPath Advisory",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "GrowthPath Advisory",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    // Next.js auto-detects app/opengraph-image.png — but set explicitly to be safe
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "GrowthPath Advisory — Replace expensive capital with your home equity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
