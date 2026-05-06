import type { Metadata } from "next";
import Script from "next/script";
import { FB_PIXEL_ID } from "@/lib/fbpixel";
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
      <body>
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
