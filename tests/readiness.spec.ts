import { test, expect } from "@playwright/test";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { content } from "../data/content";
import { SITE_URL } from "../lib/site";

const pages = ["/", "/about", "/contact", "/privacy", "/docs"];
const markdownPath = (path: string) => path === "/" ? "/index.md" : `${path}.md`;

for (const path of pages) {
  test(`${path}: HTML and Markdown, explicit URL, headers and HEAD`, async ({ request }) => {
    const md = await request.get(path, { headers: { Accept: "text/markdown" } });
    expect(md.status()).toBe(200);
    expect(md.headers()["content-type"]).toContain("text/markdown");
    expect(md.headers().vary.toLowerCase().split(/,\s*/)).toContain("accept");
    const text = await md.text();
    expect(text).toMatch(/^# .*Azaan Noman/);
    expect(text.length).toBeGreaterThan(500);
    expect(text).not.toMatch(/<!DOCTYPE|<html|<script/);
    const explicit = await request.get(markdownPath(path));
    expect(explicit.status()).toBe(200);
    expect(await explicit.text()).toBe(text);
    const html = await request.get(path, { headers: { Accept: "text/html" } });
    expect(html.status()).toBe(200);
    expect(html.headers()["content-type"]).toContain("text/html");
    expect(html.headers().vary.toLowerCase().split(/,\s*/)).toContain("accept");
    expect(await html.text()).toMatch(/<!DOCTYPE html>/i);
    expect(html.headers().link).toContain(markdownPath(path));
    const head = await request.head(path, { headers: { Accept: "text/markdown" } });
    expect(head.status()).toBe(200);
    expect(head.headers()["content-type"]).toContain("text/markdown");
    expect(await head.body()).toHaveLength(0);
  });
}

test("HTTP preference, q=0, wildcard and unsupported types", async ({ request }) => {
  for (const [accept, status, type] of [
    ["text/markdown;q=0.2, text/html;q=1", 200, "text/html"],
    ["text/html;q=0.1, text/markdown;q=0.9", 200, "text/markdown"],
    ["text/markdown;q=0, */*", 200, "text/html"],
    ["text/html;q=0, */*", 200, "text/markdown"],
    ["*/*", 200, "text/html"],
    ["application/json", 406, "text/plain"],
    ["text/html;q=0, text/markdown;q=0, */*", 406, "text/plain"],
  ] as const) {
    const response = await request.get("/", { headers: { Accept: accept } });
    expect(response.status(), accept).toBe(status);
    expect(response.headers()["content-type"], accept).toContain(type);
    expect(response.headers().vary.toLowerCase()).toContain("accept");
  }
});

test("missing pages remain real 404s in both representations", async ({ request }) => {
  for (const path of ["/__agent-readiness-missing", "/missing/nested/page", "/unknown.md", "/constructor", "/toString"]) {
    for (const accept of ["text/markdown", "text/html"]) {
      const response = await request.get(path, { headers: { Accept: accept } });
      expect(response.status(), `${path} ${accept}`).toBe(404);
      if (accept === "text/markdown" || path.endsWith(".md")) {
        expect(response.headers()["content-type"]).toContain("text/markdown");
        expect(response.headers().vary.toLowerCase()).toContain("accept");
        expect(await response.text()).toContain(`${SITE_URL}/llms.txt`);
        expect((await response.text()).length).toBeGreaterThan(20);
      } else {
        expect(response.headers()["content-type"]).toContain("text/html");
      }
    }
  }
  const head = await request.head("/missing", { headers: { Accept: "text/markdown" } });
  expect(head.status()).toBe(404);
  expect(await head.body()).toHaveLength(0);
});

test("all homepage content is preserved in the Markdown representation", async ({ request }) => {
  const markdown = await (await request.get("/", { headers: { Accept: "text/markdown" } })).text();
  const plain = markdown.replace(/\\([\\`*_{}\[\]<>#])/g, "$1");
  for (const section of [content.projects, content.leadership, content.publications, content.links]) {
    for (const item of section) {
      expect(plain).toContain(item.title);
      expect(plain).toContain(item.description);
      if (item.href) expect(plain).toContain(item.href);
    }
  }
  expect(plain).toContain("/Azaan_Noman_Resume.pdf");
});

test("llms file follows the outline format and its internal links resolve", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/markdown");
  const text = await response.text();
  expect(text).toMatch(/^# Azaan Noman\n\n> /);
  expect(text).toContain("## When to use this site");
  expect(text).toContain("get_portfolio");
  for (const section of text.split(/^## /m).slice(1)) {
    const lines = section.split("\n").slice(1).filter(Boolean);
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) expect(line).toMatch(/^- \[.+\]\(https:\/\/.+\): /);
  }
  for (const match of text.matchAll(/\]\((https:\/\/azaannoman\.vercel\.app[^)]+)\)/g)) {
    const linked = await request.get(new URL(match[1]).pathname);
    expect(linked.status(), match[1]).toBe(200);
  }
  const full = await request.get("/llms-full.txt");
  expect(full.status()).toBe(200);
  expect(await full.text()).toBe(await (await request.get("/index.md")).text());
});

test("valid sitemap lists every indexable page and PDF with honest dates", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const xml = await response.text();
  expect(XMLValidator.validate(xml)).toBe(true);
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
  expect(parsed.urlset["@_xmlns"]).toBe("http://www.sitemaps.org/schemas/sitemap/0.9");
  const urls = parsed.urlset.url;
  expect(urls.map((url: { loc: string }) => new URL(url.loc).pathname).sort()).toEqual([...pages, "/Azaan_Noman_Resume.pdf"].sort());
  for (const entry of urls) {
    expect(entry.loc).toMatch(/^https:\/\/azaannoman\.vercel\.app\//);
    expect(entry.lastmod).toMatch(/^2026-10-0[47]$/);
    expect((await request.get(new URL(entry.loc).pathname)).status()).toBe(200);
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  expect(await robots.text()).toContain("Allow: /");
  const pdf = await request.get("/Azaan_Noman_Resume.pdf", { headers: { Accept: "application/pdf" } });
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("metadata, Person identity, social image, and accessible resource links", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Azaan Noman.*Student Projects/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('meta[name="is-agentic-site-type"]')).toHaveAttribute("content", "content");
  expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(`${SITE_URL}/`);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toBeTruthy();
  const image = await request.get(new URL(ogImage!).pathname);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const png = await image.body();
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema["@type"]).toBe("Person");
  expect(schema.name).toBe(content.name);
  expect(schema.sameAs).toContain("https://github.com/iecclodd");
  expect(schema.email).toBe("mailto:azaannoman03@gmail.com");
  expect(schema.address).toBeUndefined();
  for (const path of pages.slice(1)) {
    await expect(page.locator(`footer a[href="${path}"]`)).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "Link to resume (PDF, opens in a new tab)" })).toHaveAttribute("href", "/Azaan_Noman_Resume.pdf");
  for (const path of pages.slice(1)) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}${path}`);
    expect((await page.locator("main").innerText()).length).toBeGreaterThan(500);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

for (const path of ["/mcp", "/.well-known/mcp"]) {
  test(`${path}: real SDK handshake, tool discovery, and read-only calls`, async ({ baseURL, request }) => {
    const client = new Client({ name: "portfolio-verification", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(path, baseURL));
    try {
      await client.connect(transport);
      expect(client.getServerVersion()?.name).toBe("azaan-noman-portfolio");
      const tools = await client.listTools();
      expect(tools.tools.map((tool) => tool.name).sort()).toEqual(["get_contact", "get_portfolio"]);
      for (const tool of tools.tools) expect(tool.annotations?.readOnlyHint).toBe(true);
      const result = await client.callTool({ name: "get_portfolio", arguments: { section: "projects" } });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual({ source: `${SITE_URL}/`, resume: `${SITE_URL}/Azaan_Noman_Resume.pdf`, projects: content.projects });
      const all = await client.callTool({ name: "get_portfolio", arguments: {} });
      expect(all.structuredContent).toMatchObject({ name: content.name, publications: content.publications });
      const contact = await client.callTool({ name: "get_contact", arguments: {} });
      expect(contact.structuredContent).toEqual({ source: `${SITE_URL}/contact`, links: content.links });
      const invalid = await client.callTool({ name: "get_portfolio", arguments: { section: "private" } });
      expect(invalid.isError).toBe(true);
    } finally {
      await client.close();
    }
    for (const method of ["GET", "DELETE"]) {
      const response = await request.fetch(path, { method });
      expect(response.status()).toBe(405);
      expect(response.headers().allow).toBe("POST");
    }
    const blocked = await request.post(path, { headers: { Origin: "https://unrelated.example", Accept: "application/json, text/event-stream" }, data: {} });
    expect(blocked.status()).toBe(403);
    const malformed = await request.post(path, { headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" }, data: "{" });
    expect(malformed.status()).toBe(400);
    const wrongAccept = await request.post(path, { headers: { Accept: "text/html" }, data: {} });
    expect(wrongAccept.status()).toBe(406);
  });
}
