import { content } from "@/data/content";

export const SITE_URL = "https://azaannoman.vercel.app";
export const SITE_TITLE = "Azaan Noman — Student Projects, AI & Engineering";
export const SITE_DESCRIPTION =
  "Azaan Noman is a student builder and engineer at Seven Lakes High School. Explore projects in AI, drone autonomy, neuroscience, and biomedical engineering.";
// Change this when the published page content changes, not on every request.
export const CONTENT_UPDATED = "2026-10-07";
export const RESUME_PATH = "/Azaan_Noman_Resume.pdf";
export const email = content.links.find((link) => link.title === "Email")!;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: content.name,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: email.href,
  sameAs: content.links.flatMap((link) =>
    link.href?.startsWith("https://") ? [link.href] : [],
  ),
  knowsAbout: ["Drone technology", "Machine learning", "Neuroscience", "Biomedical engineering"],
};

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
