import Negotiator from "negotiator";
import { content } from "@/data/content";
import { RESUME_PATH, SITE_URL } from "@/lib/site";

export const apiIndex = {
  name: "Azaan Noman Student Projects API",
  version: "1.0.0",
  description: "Read-only access to the public portfolio. No account or API key required.",
  documentation: `${SITE_URL}/docs`,
  openapi: `${SITE_URL}/openapi.json`,
  endpoints: ["/api/v1/portfolio", "/api/v1/projects", "/api/v1/contact"].map(path => SITE_URL + path),
};
export const portfolioData = () => ({ source: `${SITE_URL}/`, resume: `${SITE_URL}${RESUME_PATH}`, ...content });
export const contactData = () => ({ source: `${SITE_URL}/contact`, links: content.links });

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  Vary: "Accept",
  Link: '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json;version=3.1.1", </docs>; rel="service-doc"',
};

export function jsonResponse(request: Request, data: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(request.method === "HEAD" ? null : JSON.stringify(data), { status, headers: { ...headers, ...extra } });
}

export function problem(request: Request, status: number, code: string, title: string, detail: string, resolution: string, extra: Record<string, string> = {}) {
  return jsonResponse(request, {
    type: "about:blank", title, status, detail,
    instance: new URL(request.url).pathname, code, resolution,
  }, status, { ...extra, "Content-Type": "application/problem+json; charset=utf-8" });
}

export function checkJsonRequest(request: Request) {
  if (!["GET", "HEAD"].includes(request.method)) {
    return problem(request, 405, "METHOD_NOT_ALLOWED", "Method Not Allowed", "This resource is read-only.", "Use GET to read it or HEAD to inspect its headers.", { Allow: "GET, HEAD" });
  }
  if (!new Negotiator({ headers: { accept: request.headers.get("accept") ?? "*/*" } }).mediaType(["application/json"])) {
    return problem(request, 406, "NOT_ACCEPTABLE", "Not Acceptable", "This resource is available as application/json.", "Send Accept: application/json or */*.");
  }
}

export async function handleApi(request: Request) {
  const url = new URL(request.url);
  const known = ["/api", "/api/v1/portfolio", "/api/v1/projects", "/api/v1/contact"].includes(url.pathname);
  if (!known) return problem(request, 404, "NOT_FOUND", "Not Found", "No API operation exists at this path.", "Read /openapi.json or GET /api for available endpoints.");
  const invalid = checkJsonRequest(request);
  if (invalid) return invalid;

  const allowed = url.pathname === "/api/v1/projects" ? ["limit", "offset"] : [];
  for (const name of url.searchParams.keys()) {
    if (!allowed.includes(name) || url.searchParams.getAll(name).length !== 1) {
      return problem(request, 400, "INVALID_QUERY", "Bad Request", "The query contains an unknown or repeated parameter.", "Use each documented query parameter at most once; see /openapi.json.");
    }
  }
  if (url.pathname === "/api") return jsonResponse(request, apiIndex);
  if (url.pathname === "/api/v1/portfolio") return jsonResponse(request, portfolioData());
  if (url.pathname === "/api/v1/contact") return jsonResponse(request, contactData());

  const limitText = url.searchParams.get("limit") ?? "20";
  const offsetText = url.searchParams.get("offset") ?? "0";
  const limit = Number(limitText);
  const offset = Number(offsetText);
  if (!/^\d+$/.test(limitText) || !/^\d+$/.test(offsetText) || !Number.isSafeInteger(limit) || !Number.isSafeInteger(offset) || limit < 1 || limit > 100 || offset > 2147483647) {
    return problem(request, 400, "INVALID_QUERY", "Bad Request", "Pagination parameters are outside their supported integer ranges.", "Use limit from 1 to 100 (default 20) and offset from 0 to 2147483647 (default 0).");
  }
  return jsonResponse(request, { source: `${SITE_URL}/`, projects: content.projects.slice(offset, offset + limit), total: content.projects.length, limit, offset });
}
