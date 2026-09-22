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
    "I build what I want to see. Most of what I make starts as something I wished existed, so I make it myself.",
    "The problems worth solving usually sit in the overlap between fields — drone technology, machine learning, neuroscience, biomedical engineering — where no single discipline has the whole answer. That gap is the most interesting place to build.",
  ],

  projects: [
    {
      title: "Worktree",
      description:
        "A desktop workspace for AI software teams — connect your computers as nodes, run agents on any of them, and follow the work from any device. Local or synced, with your own provider keys. Co-founder.",
      href: "https://tryworktree.com",
    },
    {
      title: "Morro",
      description:
        "Personal software that shapes itself around how you actually work. It connects the apps you already use, maps the work into your own objects — leads, follow-ups, decisions — and generates an interface around them. In private beta. Co-founder.",
      href: "https://morroapp.vercel.app",
    },
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
