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
  leadership: LinkItem[];
  publications: LinkItem[];
  links: LinkItem[];
}

export const content: SiteContent = {
  name: "Azaan Noman",
  role: "Builder & Engineer",

  today: [
    "I'm a high schooler at Seven Lakes High School. When I'm not in class, I'm usually building something.",
    "My interests sit at the intersection of drone technology, machine learning, neuroscience, and biomedical engineering. I'm drawn to autonomous systems, AI, and the engineering that ties them together.",
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
        "Personal software that shapes itself around how you actually work. It connects the apps you already use, maps the work into your own objects — leads, follow-ups, decisions — and generates an interface around them. Co-founder.",
      href: "https://morroapp.vercel.app",
    },
    {
      title: "Skyes Travel — AI Booking System",
      description:
        "An AI-powered booking system I built for a family travel business approaching $200K in revenue. It runs the whole reservation workflow, turning a manual process into a fast, near hands-free pipeline from first inquiry to confirmed booking.",
    },
    {
      title: "Connectome-Driven Drone Autonomy",
      description:
        "The fruit fly is the most complex animal to have its entire brain digitally mapped, neuron by neuron. I'm using that connectome as a blueprint for an autonomous drone system, translating how a biological brain senses and steers into onboard navigation and control.",
    },
    {
      title: "FPV & Racing Drones",
      description:
        "Self-taught FPV drone builder. I've built three high-performance racing drones from scratch, from component selection and soldering to assembly, advanced tuning, and flight testing.",
    },
    {
      title: "RECOIL-1: A Bioinspired Elastic-Recovery Water Pump",
      description:
        "A low-pressure water pump with a replaceable, leaf-shaped silicone membrane. The AutoCAD design uses a cam-driven mechanism to compress the membrane while elastic recovery helps refill the chamber. A branching, leaf-vein-inspired reinforcement pattern is compared against a plain membrane to test whether controlled stiffness improves refilling, recovery timing, and consistency of water delivery.",
    },
    {
      title: "Polyshield",
      description:
        "A security platform that stops AI agents from taking unauthorized or unsafe actions — real-time guardrails and policy workflows for autonomous agents. Co-founder.",
      href: "https://polyshield.vercel.app",
    },
    {
      title: "CalcQuest",
      description:
        "A game that makes practicing AP Calculus AB/BC feel like leveling up instead of grinding problem sets. I'm a junior developer on the team, driving the design and visuals, with more of the build on the way.",
    },
  ],

  leadership: [
    {
      title: "Hearts for Elders — Head of Chapter Management",
      description:
        "I lead chapter management for a senior-care nonprofit with chapters across 6 continents, coordinating the volunteers and local teams that keep them running. The organization has reached 1,150+ elders with 200+ volunteers and over $10,000 raised to bring dignity, companionship, and compassion to elderly communities.",
      href: "https://www.hearts4elders.org",
    },
    {
      title: "Mecclabs — Mechanical Co-Director",
      description:
        "Co-director for a 501(c)(3) that teaches core engineering through hands-on, project-based camps, spanning mechanical, electrical, biomedical, and chemical disciplines. I design curriculum and have helped generate nearly $20K through the programs.",
      href: "https://www.mecclabs.com",
    },
    {
      title: "Technology Student Association — Officer",
      description:
        "Officer in one of the largest and most-awarded TSA chapters in Texas. I help prepare 50+ competitors for regional, state, and national contests. This season the chapter took 2nd for the State School Award out of 125 schools and produced 14 national qualifiers.",
      href: "https://www.slhstsa.org",
    },
    {
      title: "Mathlify STEM",
      description:
        "A student-led nonprofit making hands-on STEM affordable for under-resourced schools. It ships beginner electronics kits with breadboards, LEDs, resistors, and printed activity guides, built on the belief that hands-on STEM access shouldn't depend on budget.",
      href: "https://stem.mathlify.org",
    },
    {
      title: "SLHS Student Council — Officer",
      description:
        "Lead officer behind a 600+ member organization, driving $100K+ in annual fundraising for donated meals and supplies to local shelters.",
      href: "https://linktr.ee/7lakesstuco",
    },
  ],

  publications: [
    {
      title:
        "Identifying Important and Transferable sEMG Features for Cross-User Hand Gesture Classification",
      description:
        "This study evaluates 21 surface electromyography (sEMG) features across 18 participants to investigate which muscle-signal characteristics support accurate hand-gesture recognition and generalize to unseen users. By comparing personalized and cross-user machine-learning performance, it examines a key barrier to developing adaptable prosthetic control systems that require less individual calibration. To be presented at BMES 2026.",
    },
    {
      title:
        "CALIBER: A Context-Aware Calibration Layer for Neural Network Adaptation",
      description:
        "CALIBER investigates whether a lightweight add-on can help trained neural networks adapt to new users or changing conditions using only a small amount of contextual data. Inspired by hypernetworks, the proposed system would generate targeted adjustments rather than extensively retraining the original model. The research will test whether this approach improves prediction accuracy while reducing calibration-data requirements and adaptation time. Currently in the works.",
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
