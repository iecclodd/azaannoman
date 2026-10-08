import assert from "node:assert/strict";
import { test } from "node:test";
import SwaggerParser from "@apidevtools/swagger-parser";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { handleApi } from "../lib/api";
import { openapi } from "../lib/openapi";
import { content } from "../data/content";
import { SITE_URL } from "../lib/site";

const request = (path: string, method = "GET", accept = "application/json") => new Request(SITE_URL + path, { method, headers: { Accept: accept } });

test("OpenAPI validates and describes every REST operation and response", async () => {
  const document = await SwaggerParser.validate(JSON.parse(JSON.stringify(openapi))) as unknown as typeof openapi;
  const ajv = new Ajv2020({ strict: false });
  addFormats(ajv);
  const ids = new Set();
  for (const [path, item] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(item)) {
      assert.ok(operation.description);
      assert.ok(operation.operationId);
      assert.ok(!ids.has(operation.operationId));
      ids.add(operation.operationId);
      const response = await handleApi(request(path, method.toUpperCase()));
      assert.equal(response.status, 200);
      if (method === "get") {
        const schema = operation.responses["200"] as { content: { "application/json": { schema: object } } };
        const validate = ajv.compile(schema.content["application/json"].schema);
        assert.ok(validate(await response.json()), JSON.stringify(validate.errors));
      } else assert.equal(await response.text(), "");
    }
  }
  assert.equal(ids.size, 8);
});

test("portfolio and contact return all original data and source URLs", async () => {
  const portfolio = await (await handleApi(request("/api/v1/portfolio"))).json();
  assert.deepEqual(portfolio, { source: `${SITE_URL}/`, resume: `${SITE_URL}/Azaan_Noman_Resume.pdf`, ...content });
  const contact = await (await handleApi(request("/api/v1/contact"))).json();
  assert.deepEqual(contact.links, content.links);
});

test("pagination returns contiguous pages and handles empty pages", async () => {
  const first = await (await handleApi(request("/api/v1/projects?limit=2"))).json();
  const second = await (await handleApi(request("/api/v1/projects?limit=2&offset=2"))).json();
  assert.deepEqual([...first.projects, ...second.projects], content.projects.slice(0, 4));
  assert.equal(first.total, content.projects.length);
  assert.equal(first.limit, 2);
  assert.equal(second.offset, 2);
  const empty = await (await handleApi(request("/api/v1/projects?offset=2147483647"))).json();
  assert.deepEqual(empty.projects, []);
});

test("unknown, repeated, malformed, and unbounded queries are JSON problems", async () => {
  for (const path of ["/api?x=1", "/api/v1/portfolio?section=private", "/api/v1/contact?x=secret", ...["limit=0", "limit=101", "limit=-1", "limit=1.5", "limit=1e1", "limit=abc", "limit=", "limit=2&limit=3", "offset=-1", "offset=2147483648", "offset=Infinity", "offset=1&offset=2", "offset=1.2", "other=secret"].map(q => `/api/v1/projects?${q}`)]) {
    const response = await handleApi(request(path));
    assert.equal(response.status, 400, path);
    assert.match(response.headers.get("content-type")!, /^application\/problem\+json/);
    const body = await response.json();
    assert.equal(body.status, 400);
    assert.equal(body.code, "INVALID_QUERY");
    assert.ok(body.resolution);
    assert.ok(!JSON.stringify(body).includes("secret"));
  }
});

test("unknown nested API routes and rejected methods never return HTML", async () => {
  for (const path of ["/api/missing", "/api/v1/missing/nested", "/api/constructor"]) {
    const response = await handleApi(request(path));
    assert.equal(response.status, 404);
    assert.equal((await response.json()).code, "NOT_FOUND");
  }
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const response = await handleApi(request("/api/v1/projects", method));
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, HEAD");
    assert.equal((await response.json()).code, "METHOD_NOT_ALLOWED");
  }
});

test("JSON negotiation honors q=0, and HEAD errors have no body", async () => {
  for (const [accept, status] of [["*/*", 200], ["application/*", 200], ["application/json;q=0, */*", 406], ["text/html", 406], ["application/json;q=.2,text/html;q=1", 200]] as const) {
    const response = await handleApi(request("/api/v1/projects", "GET", accept));
    assert.equal(response.status, status);
    assert.match(response.headers.get("vary")!, /Accept/i);
    const head = await handleApi(request("/api/v1/projects", "HEAD", accept));
    assert.equal(head.status, status);
    assert.equal(await head.text(), "");
  }
});
