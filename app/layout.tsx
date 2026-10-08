import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: "%s | Azaan Noman" },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  other: { "is-agentic-site-type": "content" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Azaan Noman",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head><link rel="describedby" href="/llms.txt" /><link rel="service-desc" type="application/vnd.oai.openapi+json;version=3.1.1" href="/openapi.json" /><link rel="service-doc" href="/docs" /></head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
