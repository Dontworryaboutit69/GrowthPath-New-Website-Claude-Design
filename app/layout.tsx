import type { Metadata } from "next";
import "./globals.css";
import "./design.css";
import "./funnel.css";
import "./ebook.css";

export const metadata: Metadata = {
  title: "GrowthPath Advisory — Business HELOC for Owners Who Are Done Overpaying",
  description:
    "Access $25K to $750K against your home equity at a fraction of what MCAs, credit cards, and traditional lenders charge. No refinance. Your mortgage rate stays locked. Funded in ~5 days.",
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
