import { content } from "@/data/content";
import { email, RESUME_PATH, SITE_URL } from "@/lib/site";

export interface InfoPage {
  title: string;
  description: string;
  sections: { heading: string; paragraphs: string[]; links?: { title: string; href: string }[] }[];
}

export const infoPages: Record<string, InfoPage> = {
  about: {
    title: "About Azaan Noman",
    description: "Meet Azaan Noman, a student builder and engineer working across AI, drone technology, and biomedical engineering.",
    sections: [
      { heading: "A student who builds", paragraphs: content.today },
      { heading: "Projects and research", paragraphs: [
        "This portfolio brings together my student projects, engineering experiments, research, and leadership roles. My work includes software for AI teams, autonomous drone systems, hands-on drone construction, and research into muscle signals and adaptable neural networks. The homepage describes each project and links to the public project site or repository when one is available.",
        "Some entries describe active research or work in progress. Their descriptions state the current scope; being listed here does not imply a finished product, a published result, or that every project has a public API. My resume provides another way to review my experience, and the contact page links to my public profiles.",
      ], links: [{ title: "Explore my projects", href: "/" }, { title: "Read my resume (PDF)", href: RESUME_PATH }] },
    ],
  },
  contact: {
    title: "Contact Azaan Noman",
    description: "Contact Azaan Noman about student projects, engineering collaborations, research, or corrections to this portfolio.",
    sections: [
      { heading: "Get in touch", paragraphs: [
        `You can reach me at ${email.description} about the projects, research, and organizations listed in this portfolio. A useful introduction includes your name, the project you are referring to, and what you would like to discuss. For a collaboration or research conversation, a short explanation of the goal and any relevant public links helps provide context.`,
        "The email link opens your own email application. This website does not submit a message or create a support ticket, and it does not promise a particular response time. Please avoid sending passwords, access tokens, or other sensitive information in an initial message.",
      ], links: [{ title: email.description, href: email.href! }] },
      { heading: "Public profiles and corrections", paragraphs: [
        "The profiles below are the same ones linked from my homepage. GitHub contains public code and project repositories; LinkedIn and Instagram provide other ways to identify my public profiles. If you notice an outdated description or broken link, email the page URL and the correction you suggest. Questions about a separate product or organization may be better directed to the contact information on that project's own website.",
      ], links: content.links.filter((link) => link.title !== "Email").map((link) => ({ title: link.title, href: link.href! })) },
    ],
  },
  privacy: {
    title: "Privacy — Azaan Noman",
    description: "How this personal portfolio handles page requests, email links, and links to other websites.",
    sections: [
      { heading: "Using this portfolio", paragraphs: [
        "This is a public personal portfolio. You can read its pages, download the resume, or use its public machine-readable content without creating an account. The site does not include a contact form, checkout, or a site-operated analytics script. Its read-only agent tools return the same public portfolio information and do not send emails, book appointments, or modify records.",
        "The site is hosted on Vercel. When you request a page or call an agent endpoint, the hosting infrastructure receives technical request information such as your IP address, requested URL, and browser or client headers. Vercel may process that information for delivering the site, security, and operational logging under its own policies. This page does not specify a retention period for the hosting provider.",
      ], links: [{ title: "Vercel privacy policy", href: "https://vercel.com/legal/privacy-policy" }] },
      { heading: "Email and external websites", paragraphs: [
        "Selecting an email link opens your chosen email application. Information you decide to send is handled through your email provider and the recipient's email service. Links to GitHub, social profiles, project sites, and organizations take you to other services, whose privacy practices apply when you visit them.",
        `For a question about this portfolio or information published here, contact ${email.description}. Please include the relevant page URL so the request can be understood. This notice describes the current site and should be reviewed if features such as forms, accounts, or analytics are added.`,
      ], links: [{ title: "Contact Azaan", href: "/contact" }] },
    ],
  },
  docs: {
    title: "Azaan Noman — Developer & Agent Resources",
    description: "Read Azaan Noman's portfolio as Markdown or through public read-only MCP tools, with sources and contact details.",
    sections: [
      { heading: "When to use this site", paragraphs: [
        "Use this site to answer questions about Azaan Noman's student projects, engineering interests, public research descriptions, leadership roles, resume, and contact links. The homepage is the primary source. Preserve qualifications such as work in progress and attribute claims to the portfolio. Follow each project's own website or repository for its technical documentation and current capabilities.",
        "This is Azaan Noman's personal portfolio, hosted on Vercel. It is not Vercel's developer portal, and it does not provide product administration, booking, or messaging APIs. No authentication or API key is needed to retrieve the public content here.",
      ], links: [{ title: "Agent guide (llms.txt)", href: "/llms.txt" }, { title: "Full portfolio in Markdown", href: "/index.md" }] },
      { heading: "HTTP and Markdown", paragraphs: [
        `Send GET ${SITE_URL}/ with Accept: text/markdown to receive Markdown from the homepage URL. Accept: text/html returns the normal page. Responses vary by Accept and honor quality values; a request that accepts neither supported representation receives HTTP 406. HEAD returns the same headers without a response body.`,
        "About, contact, privacy, and this documentation page also support Markdown negotiation. Explicit Markdown URLs are /index.md, /about.md, /contact.md, /privacy.md, and /docs.md. Missing pages return HTTP 404; clients accepting Markdown receive an explanation and recovery links. /llms-full.txt is another URL for the full homepage content. /sitemap.xml lists indexable pages and the resume.",
      ], links: [{ title: "Sitemap", href: "/sitemap.xml" }, { title: "Robots policy", href: "/robots.txt" }] },
      { heading: "Read-only MCP tools", paragraphs: [
        `Connect an MCP client using Streamable HTTP to ${SITE_URL}/mcp or ${SITE_URL}/.well-known/mcp. Both URLs are live protocol endpoints, not JSON manifests. The server uses the official MCP TypeScript SDK with stateless JSON responses. Clients initialize normally and send Accept: application/json, text/event-stream on POST requests. There is no standalone SSE stream or persistent session; GET and DELETE return HTTP 405.`,
        "The get_portfolio tool accepts section: all, projects, leadership, or publications (default: all) and returns public descriptions with source URLs. The get_contact tool returns the public email and profile links. These tools are read-only and cannot send messages or take actions on any linked service. Browser origins are restricted to this site's origin; non-browser clients may omit Origin. Use the MCP-Protocol-Version header negotiated during initialization on subsequent requests.",
      ] },
      { heading: "Source code", paragraphs: [
        "The public repository contains the Next.js application and its shared content data. HTML, Markdown, structured identity data, and MCP responses draw from that content so descriptions stay consistent. Public project links on the homepage lead to separate codebases and services maintained on their own schedules.",
      ], links: [{ title: "Portfolio repository", href: "https://github.com/iecclodd/azaannoman" }, { title: "Azaan Noman on GitHub", href: "https://github.com/iecclodd" }] },
    ],
  },
};
