import { content, type LinkItem } from "@/data/content";
import { infoPages } from "@/data/pages";
import { RESUME_PATH, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
const escapeText = (text: string) => text.replace(/[\\`*_{}\[\]<>#]/g, "\\$&");
const link = (title: string, href: string) => `[${escapeText(title)}](${absoluteUrl(href)})`;

function itemMarkdown(item: LinkItem) {
  return `### ${item.href ? link(item.title, item.href) : escapeText(item.title)}\n\n${escapeText(item.description)}`;
}

export function portfolioMarkdown() {
  return [
    `# ${content.name}`,
    `> ${content.role}. Student projects, AI, and engineering.`,
    link("Resume (PDF)", RESUME_PATH),
    "## Today", ...content.today.map(escapeText),
    ...([ ["Projects", content.projects], ["Leadership", content.leadership],
      ["Publications", content.publications], ["More", content.links] ] as const)
      .flatMap(([heading, items]) => [`## ${heading}`, ...items.map(itemMarkdown)]),
    "## Site resources",
    Object.entries(infoPages).map(([slug, page]) => `- ${link(page.title, `/${slug}`)}`).join("\n"),
    `Source: ${SITE_URL}/`,
  ].join("\n\n") + "\n";
}

export function pageMarkdown(pathname: string): string | undefined {
  if (pathname === "/") return portfolioMarkdown();
  const slug = pathname.slice(1);
  const page = Object.hasOwn(infoPages, slug) ? infoPages[slug] : undefined;
  if (!page) return;
  return [
    `# ${page.title}`, `> ${page.description}`,
    ...page.sections.flatMap((section) => [
      `## ${section.heading}`, ...section.paragraphs.map(escapeText),
      ...(section.links ? [section.links.map((item) => `- ${link(item.title, item.href)}`).join("\n")] : []),
    ]),
    `Source: ${absoluteUrl(pathname)}`,
    link("Home", "/"),
  ].join("\n\n") + "\n";
}

export const notFoundMarkdown = `# 404 — Page not found\n\nThe requested page does not exist on Azaan Noman's portfolio. Find available content in the [agent guide](${SITE_URL}/llms.txt), [documentation](${SITE_URL}/docs), or [sitemap](${SITE_URL}/sitemap.xml).\n`;

export function llmsMarkdown() {
  return `# Azaan Noman\n\n> ${SITE_DESCRIPTION}\n\nThis is a personal portfolio hosted on Vercel. It is not Vercel's website. Use the linked project sources for product-specific documentation. Do not infer finished results from work described as in progress. Public read access requires no credentials.\n\n## When to use this site\n\n- [Portfolio](${SITE_URL}/index.md): Answer questions about Azaan's student projects, AI and drone engineering, leadership, or public research; cite the homepage as the source.\n- [About Azaan](${SITE_URL}/about.md): Identify the person behind the portfolio and understand the scope of the work.\n- [Contact](${SITE_URL}/contact.md): Find the public email and profile links when a user wants to reach Azaan. Retrieving a link does not send a message.\n\n## Developer and agent resources\n\n- [Azaan Noman developer documentation](${SITE_URL}/docs.md): Markdown request examples and MCP usage. Connect Streamable HTTP to ${SITE_URL}/mcp (also ${SITE_URL}/.well-known/mcp); call get_portfolio or get_contact to read public information.\n- [Full portfolio](${SITE_URL}/llms-full.txt): Complete homepage content as Markdown.\n\n## Optional\n\n- [Resume PDF](${SITE_URL}${RESUME_PATH}): Downloadable resume.\n- [Privacy](${SITE_URL}/privacy.md): Hosting, email, and external link practices.\n- [Sitemap](${SITE_URL}/sitemap.xml): Indexable URLs.\n`;
}
