import { NextRequest, NextResponse } from "next/server";
import { infoPages } from "@/data/pages";
import { notFoundMarkdown, pageMarkdown } from "@/lib/markdown";
import { preferredRepresentation } from "@/lib/negotiation";
import { RESUME_PATH } from "@/lib/site";

// These resources have their own content types and must bypass page negotiation.
const resources = new Set([
  RESUME_PATH, "/sitemap.xml", "/robots.txt", "/llms.txt", "/llms-full.txt",
  "/mcp", "/.well-known/mcp", "/opengraph-image", "/favicon.ico",
]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (resources.has(path) || path.startsWith("/opengraph-image/") ||
      !["GET", "HEAD"].includes(request.method) || request.headers.get("rsc") === "1") {
    return NextResponse.next();
  }

  const explicitMarkdown = path.endsWith(".md");
  const pagePath = path === "/index.md" ? "/" : explicitMarkdown ? path.slice(0, -3) : path;
  const knownPage = pagePath === "/" || Object.hasOwn(infoPages, pagePath.slice(1));
  const alternate = pagePath === "/" ? "/index.md" : `${pagePath}.md`;
  const headers = new Headers({
    Vary: "Accept",
    Link: `${knownPage ? `<${alternate}>; rel="alternate"; type="text/markdown", ` : ""}</llms.txt>; rel="describedby"`,
  });
  const representation = explicitMarkdown ? "text/markdown" : preferredRepresentation(request.headers.get("accept"));

  if (representation === "text/markdown") {
    headers.set("Content-Type", "text/markdown; charset=utf-8");
    // Avoid sharing a negotiated response across clients on CDNs with fixed cache keys.
    headers.set("Cache-Control", "no-store");
    if (explicitMarkdown) headers.set("X-Robots-Tag", "noindex");
    const body = knownPage ? pageMarkdown(pagePath)! : notFoundMarkdown;
    return new NextResponse(request.method === "HEAD" ? null : body, { status: knownPage ? 200 : 404, headers });
  }
  if (!representation) {
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.set("Cache-Control", "no-store");
    return new NextResponse(request.method === "HEAD" ? null : "Not Acceptable. Available representations: text/html, text/markdown.\n", { status: 406, headers });
  }
  return NextResponse.next({ headers });
}

export const config = { matcher: ["/((?!_next/|_vercel/).*)"] };
