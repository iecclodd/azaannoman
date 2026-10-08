import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { content } from "@/data/content";
import { RESUME_PATH, SITE_URL } from "@/lib/site";

function createServer() {
  const server = new McpServer({ name: "azaan-noman-portfolio", version: "1.0.0" });
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  server.registerTool("get_portfolio", {
    title: "Read Azaan Noman's portfolio",
    description: "Retrieve Azaan Noman's public student projects, leadership, and research descriptions. Preserve work-in-progress qualifications and cite the source URL.",
    inputSchema: { section: z.enum(["all", "projects", "leadership", "publications"]).default("all") },
    annotations,
  }, async ({ section }) => {
    const result = { source: `${SITE_URL}/`, resume: `${SITE_URL}${RESUME_PATH}`, ...(section === "all" ? content : { [section]: content[section] }) };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  });
  server.registerTool("get_contact", {
    title: "Read Azaan Noman's contact links",
    description: "Return the portfolio's public email and social profile links. This does not send a message or contact anyone.",
    inputSchema: {}, annotations,
  }, async () => {
    const result = { source: `${SITE_URL}/contact`, links: content.links };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  });
  return server;
}

export async function handleMcp(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.NODE_ENV === "development" ? new URL(request.url).origin : SITE_URL;
  if (origin && origin !== allowedOrigin) {
    return new Response("Forbidden origin", { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  // Streamable HTTP permits 405 when standalone SSE and session deletion are unsupported.
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
  }
  // One server/transport per request: no cross-user state or persistent process required.
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 64 * 1024,
  });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } finally {
    await server.close();
  }
}
