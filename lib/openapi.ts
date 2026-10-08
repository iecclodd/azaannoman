import { SITE_URL } from "@/lib/site";

const string = (description: string, extra = {}) => ({ type: "string", description, ...extra });
const uri = (description: string) => string(description, { format: "uri" });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const array = (description: string, items: object) => ({ type: "array", description, items });
const object = (description: string, properties: Record<string, object>, required = Object.keys(properties)) => ({ type: "object", description, properties, required, additionalProperties: false });
const integer = (description: string, minimum: number, maximum?: number) => ({ type: "integer", description, minimum, ...(maximum === undefined ? {} : { maximum }) });
const problemResponse = { description: "RFC 9457 problem details with a stable code and a resolution hint. Match on code rather than human-readable text.", content: { "application/problem+json": { schema: ref("Problem") } } };
const errorResponses = { "400": problemResponse, "404": problemResponse, "405": { ...problemResponse, headers: { Allow: { description: "Allowed HTTP methods.", schema: { type: "string", const: "GET, HEAD" } } } }, "406": problemResponse };
const response = (name: string) => ({ description: "The requested public data. No authentication is needed.", content: { "application/json": { schema: ref(name) } } });
const pagination = [
  { name: "limit", in: "query", required: false, description: "Maximum number of projects to return. Each parameter may appear only once.", schema: { ...integer("Page size.", 1, 100), default: 20 } },
  { name: "offset", in: "query", required: false, description: "Number of projects to skip in portfolio order. Beyond the total returns an empty list.", schema: { ...integer("Starting position.", 0, 2147483647), default: 0 } },
];
function operation(operationId: string, summary: string, description: string, schema: string, parameters: object[] = []) {
  return {
    get: { operationId, summary, description, tags: ["Public portfolio"], parameters, responses: { "200": response(schema), ...errorResponses } },
    head: { operationId: `${operationId}Headers`, summary: `${summary} headers`, description: `Validate the same request as GET without a response body. ${description}`, tags: ["Public portfolio"], parameters, responses: Object.fromEntries(Object.entries({ "200": response(schema), ...errorResponses }).map(([status, value]) => [status, { description: value.description, ...(status === "405" ? { headers: errorResponses["405"].headers } : {}) }])) },
  };
}

export const openapi = {
  openapi: "3.1.1",
  jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
  info: {
    title: "Azaan Noman Student Projects API", version: "1.0.0",
    description: "Read Azaan Noman's public student projects, research descriptions, leadership, resume, and contact links. All operations are read-only and require no credentials. Preserve work-in-progress qualifications and cite source URLs. JSON is served for GET; HEAD has no body. Unknown or repeated query parameters return 400. Errors use RFC 9457 application/problem+json. No application-level rate limit is enforced; hosting protections may apply. Reuse responses and avoid unnecessary polling. MCP is a separate JSON-RPC protocol documented at /docs.",
    contact: { name: "Azaan Noman", url: `${SITE_URL}/contact` },
  },
  servers: [{ url: SITE_URL, description: "Official public portfolio" }],
  security: [],
  tags: [{ name: "Public portfolio", description: "Public information from the same content used by the website." }],
  externalDocs: { description: "HTTP, Markdown, MCP, and CLI documentation", url: `${SITE_URL}/docs` },
  paths: {
    "/api": operation("getApiIndex", "Discover the API", "Return the API version, OpenAPI URL, documentation, and available public endpoints.", "ApiIndex"),
    "/api/v1/portfolio": operation("getPortfolio", "Read the complete portfolio", "Return all published biography, project, leadership, research, and contact data with canonical source and resume URLs.", "Portfolio"),
    "/api/v1/projects": operation("listProjects", "List student projects", "Read projects in the same order as the homepage, with bounded offset pagination. Project descriptions may describe work in progress. No search or writes are supported.", "ProjectPage", pagination),
    "/api/v1/contact": operation("getContact", "Read public contact links", "Return the public email and profile links. This operation does not send a message or contact anyone.", "Contact"),
  },
  components: { schemas: {
    LinkItem: object("A published project, research entry, leadership role, or contact link.", { title: string("Published title."), description: string("Original description; preserve qualifications such as work in progress."), href: uri("Optional public link, including mailto links for email.") }, ["title", "description"]),
    ApiIndex: object("API discovery information.", { name: string("API name."), version: string("Public API version."), description: string("API purpose."), documentation: uri("Human and agent documentation."), openapi: uri("OpenAPI specification."), endpoints: array("Public data endpoint URLs.", uri("Endpoint URL.")) }),
    Portfolio: object("Complete public portfolio.", { source: uri("Canonical source to cite."), resume: uri("Public resume PDF."), name: string("Portfolio owner's name."), role: string("Public role."), today: array("Biography paragraphs.", string("Published biography paragraph.")), projects: array("Student projects.", ref("LinkItem")), leadership: array("Leadership and organizations.", ref("LinkItem")), publications: array("Research descriptions, including work in progress.", ref("LinkItem")), links: array("Contact and social links.", ref("LinkItem")) }),
    ProjectPage: object("A page of student projects.", { source: uri("Canonical source to cite."), projects: array("Projects in portfolio order.", ref("LinkItem")), total: integer("Total number of projects before pagination.", 0), limit: integer("Requested page size.", 1, 100), offset: integer("Requested starting position.", 0, 2147483647) }),
    Contact: object("Published contact links.", { source: uri("Canonical contact page."), links: array("Public email and profiles. Reading does not contact anyone.", ref("LinkItem")) }),
    Problem: object("RFC 9457 problem details. The response status matches status; extensions provide a stable error code and recovery guidance.", { type: uri("Problem type URI; about:blank uses the HTTP status meaning."), title: string("HTTP status phrase."), status: integer("HTTP error status.", 400, 599), detail: string("Human-readable explanation of this occurrence."), instance: string("Request path without query values.", { format: "uri-reference" }), code: string("Stable error code.", { enum: ["INVALID_QUERY", "NOT_FOUND", "METHOD_NOT_ALLOWED", "NOT_ACCEPTABLE"] }), resolution: string("Action the client can take to resolve the problem.") }),
  } },
};
