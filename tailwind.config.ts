import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette lifted from the CMS detector component
        paper: "#222321", // page background (warm charcoal)
        panel: "#2a2b28", // slightly elevated surface
        ink: "#f2f2eb", // primary text (cream)
        muted: "#b8c3ac", // secondary text (sage)
        accent: "#e6f285", // lime highlight
        line: "rgba(255,255,255,0.14)", // hairline borders
        warn: "#ffd2a0", // warm alert
      },
      maxWidth: {
        prose: "40rem",
      },
      letterSpacing: {
        tightest: "-0.065em",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
