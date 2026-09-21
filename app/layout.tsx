import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#222321",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Azaan Noman",
  description:
    "Builder & engineer. Co-founding Polyshield, researching interpretable AI for prosthetics, and leading across seven organizations.",
  metadataBase: new URL("https://azaannoman.vercel.app"),
  openGraph: {
    title: "Azaan Noman",
    description:
      "Builder & engineer. Co-founding Polyshield, researching interpretable AI for prosthetics, and leading across seven organizations.",
    url: "https://azaannoman.vercel.app",
    siteName: "Azaan Noman",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Azaan Noman",
    description:
      "Builder & engineer at the intersection of AI, security, and engineering.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
