/**
 * SITE CONTENT
 * ------------------------------------------------------------------
 * Single source of truth for the page. Edit the strings here — the
 * layout in app/page.tsx reads everything from this file, so nothing
 * in the JSX needs to change.
 *
 * Facts mirror the portfolio data layer (roles, metrics, projects).
 * Keep numbers accurate; never invent new ones.
 */

export interface LinkItem {
  title: string;
  description: string;
  href?: string;
}

export interface SiteContent {
  name: string;
  role: string;
  today: string[];
  projects: LinkItem[];
  building: LinkItem[];
  links: LinkItem[];
}

export const content: SiteContent = {
  name: "Azaan Noman",
  role: "Builder & Engineer",

  today: [
    "I'm a high-school builder and engineer from Richmond, TX. Right now I'm co-founding Polyshield, a safety layer that keeps AI agents from taking unsafe actions, and researching interpretable AI for prosthetic gesture recognition with a professor at the University of Miami.",
    "I'm drawn to systems — machines, organizations, businesses — and I ask the same questions about all of them: why does it work this way, what's inefficient, and how could it be rebuilt better? Alongside the building, I lead officer and director roles across seven organizations. I like to work at the intersection of AI, security, and engineering.",
  ],

  projects: [
    {
      title: "Polyshield",
      description:
        "A security platform that stops AI agents from taking unauthorized or unsafe actions — real-time guardrails and policy workflows for autonomous agents. Co-founder.",
      href: "https://polyshield.vercel.app",
    },
    {
      title: "Skyes Travel — AI Booking",
      description:
        "An AI booking engine for a travel company that automates the repetitive steps of the reservation workflow. AI automation intern.",
    },
    {
      title: "Autonomous Drone Navigation & Mapping",
      description:
        "AI-driven perception retrofitted onto existing drone platforms for self-navigation and mapping. Grew out of building three high-performance FPV drones from scratch.",
    },
    {
      title: "Mathlify STEM",
      description:
        "A pre-launch education platform building free, structured STEM learning for students.",
      href: "https://stem.mathlify.org",
    },
    {
      title: "Vibe Engineering Software",
      description:
        "Experimental tooling that turns a plain-language prompt into a complete, on-brand UI system — components, tokens, and layouts.",
    },
  ],

  building: [
    {
      title: "SLHS Student Council — Officer",
      description:
        "Lead officer behind a 600+ member organization, driving $100K+ in annual fundraising for donated meals and supplies to local shelters.",
      href: "https://linktr.ee/7lakesstuco",
    },
    {
      title: "Hearts for Elders — Secretary & Chapter Lead",
      description:
        "Helped scale a senior-care nonprofit into a global network with chapters across the U.S., Nigeria, and Kenya.",
      href: "https://www.hearts4elders.org",
    },
    {
      title: "Mecclabs — Mechanical Co-Director",
      description:
        "Architecting hands-on curriculum across five engineering disciplines; helped generate nearly $20K through education programs.",
      href: "https://www.mecclabs.com",
    },
    {
      title: "University of Miami — AI Research Collaborator",
      description:
        "Building the analysis model and co-authoring a research abstract on interpretable AI for prosthetics with a biomedical engineering professor.",
    },
    {
      title: "Technology Student Association — Officer",
      description:
        "Prepared 50+ competitors for regional, state, and national contests, carrying the chapter to the TSA National Conference.",
      href: "https://slhstsa.wixsite.com/home",
    },
  ],

  links: [
    {
      title: "Email",
      description: "azaannoman03@gmail.com",
      href: "mailto:azaannoman03@gmail.com",
    },
    {
      title: "GitHub",
      description: "github.com/iecclodd",
      href: "https://github.com/iecclodd",
    },
    {
      title: "LinkedIn",
      description: "Azaan Noman",
      href: "https://www.linkedin.com/in/azaan-noman-1841a741b/",
    },
    {
      title: "Instagram",
      description: "@iecclodd",
      href: "https://instagram.com/iecclodd",
    },
  ],
};
