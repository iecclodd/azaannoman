import { test, expect } from "@playwright/test";
import SwaggerParser from "@apidevtools/swagger-parser";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { content } from "../data/content";
import { SITE_URL } from "../lib/site";
import { openapi } from "../lib/openapi";
const exec = promisify(execFile);
const cliEnv = { ...process.env };
delete cliEnv.FORCE_COLOR;
delete cliEnv.NO_COLOR;

test("published OpenAPI validates and every documented operation matches its schema", async ({ request }) => {
  const response = await request.get("/openapi.json", { headers: { Accept: "application/json" } });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  const raw = await response.json();
  expect(raw).toEqual(openapi);
  const document = await SwaggerParser.validate(raw) as unknown as typeof openapi;
  const ajv = new Ajv2020({ strict: false }); addFormats(ajv);
  for (const [path, operations] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      const result = await request.fetch(path, { method: method.toUpperCase(), headers: { Accept: "application/json" } });
      expect(result.status(), `${method} ${path}`).toBe(200);
      expect(result.headers()["content-type"]).toContain("application/json");
      expect(result.headers().link).toContain("/openapi.json");
      expect(result.headers().vary.toLowerCase()).toContain("accept");
      if (method === "head") expect(await result.body()).toHaveLength(0);
      else {
        const response = operation.responses["200"] as { content: { "application/json": { schema: object } } };
        const validate = ajv.compile(response.content["application/json"].schema);
        expect(validate(await result.json()), JSON.stringify(validate.errors)).toBe(true);
      }
    }
  }
  const head = await request.head("/openapi.json");
  expect(head.status()).toBe(200); expect(await head.body()).toHaveLength(0);
});

test("API data, pagination, and all error cases work through deployed routing", async ({ request }) => {
  const portfolio = await (await request.get("/api/v1/portfolio")).json();
  expect(portfolio).toEqual({ source: `${SITE_URL}/`, resume: `${SITE_URL}/Azaan_Noman_Resume.pdf`, ...content });
  const page = await (await request.get("/api/v1/projects?limit=2&offset=2")).json();
  expect(page.projects).toEqual(content.projects.slice(2, 4));
  expect(page.total).toBe(content.projects.length);
  expect((await (await request.get("/api/v1/projects?offset=100")).json()).projects).toEqual([]);
  const ajv = new Ajv2020({ strict: false }); addFormats(ajv);
  const validateProblem = ajv.compile(openapi.components.schemas.Problem);
  for (const [path, method, accept, status, code] of [
    ["/api/v1/projects?limit=0", "GET", "application/json", 400, "INVALID_QUERY"],
    ["/api/v1/projects?limit=1&limit=2", "GET", "application/json", 400, "INVALID_QUERY"],
    ["/api/v1/contact?unknown=secret", "GET", "application/json", 400, "INVALID_QUERY"],
    ["/api/not-a-real-endpoint", "GET", "application/json", 404, "NOT_FOUND"],
    ["/api/v1/missing/nested", "GET", "text/html", 404, "NOT_FOUND"],
    ["/api/v1/portfolio", "GET", "application/json;q=0, */*", 406, "NOT_ACCEPTABLE"],
    ["/api/v1/projects", "GET", "text/html", 406, "NOT_ACCEPTABLE"],
    ["/openapi.json", "GET", "text/html", 406, "NOT_ACCEPTABLE"],
    ...["/api", "/api/v1/portfolio", "/api/v1/projects", "/api/v1/contact", "/openapi.json"].flatMap(path => ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"].map(method => [path, method, "application/json", 405, "METHOD_NOT_ALLOWED"])),
  ] as [string, string, string, number, string][]) {
    const response = await request.fetch(path, { method, headers: { Accept: accept } });
    expect(response.status(), `${method} ${path}`).toBe(status);
    expect(response.headers()["content-type"]).toContain("application/problem+json");
    const problem = await response.json();
    expect(validateProblem(problem), JSON.stringify(validateProblem.errors)).toBe(true);
    expect(problem).toMatchObject({ type: "about:blank", status, code });
    expect(problem.detail).toBeTruthy(); expect(problem.resolution).toBeTruthy();
    expect(problem.instance).toBe(path.split("?")[0]);
    if (status === 405) expect(response.headers().allow).toBe("GET, HEAD");
  }
  for (const [path, status] of [["/api/missing", 404], ["/api/v1/projects?limit=0", 400]] as const) {
    const head = await request.head(path); expect(head.status()).toBe(status); expect(await head.body()).toHaveLength(0);
  }
});

test("CLI release is complete, executable, and reads the public API", async ({ request, baseURL }) => {
  const path = "/cli/azaannoman-cli-1.0.0.tgz";
  const tarball = await request.get(path);
  expect(tarball.status()).toBe(200);
  expect(await tarball.body()).toEqual(await readFile(resolve("public" + path)));
  const packed = JSON.parse((await exec("npm", ["pack", "./packages/cli", "--dry-run", "--json"])).stdout)[0];
  expect(packed.files.map((file: { path: string }) => file.path).sort()).toEqual(["LICENSE", "README.md", "bin/azaannoman.mjs", "package.json"]);
  const installed = await exec("npm", ["exec", "--yes", `--package=${resolve("public" + path)}`, "--", "azaannoman", "projects", "--limit", "2", "--base-url", baseURL!]);
  expect(JSON.parse(installed.stdout).projects).toEqual(content.projects.slice(0, 2));
  const cli = resolve("packages/cli/bin/azaannoman.mjs");
  for (const command of ["portfolio", "projects", "contact", "openapi"]) {
    const { stdout, stderr } = await exec(process.execPath, [cli, command, "--base-url", baseURL!], { env: cliEnv });
    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toBeTruthy();
  }
  const result = await exec(process.execPath, [cli, "projects", "--limit", "2", "--offset", "2", "--base-url", baseURL!]);
  expect(JSON.parse(result.stdout).projects).toEqual(content.projects.slice(2, 4));
});

test("brand identity, student-project heading, and API/CLI discovery are visible", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Azaan Noman.*Student Projects/);
  await expect(page.getByRole("heading", { name: "Student Projects", exact: true })).toBeVisible();
  await expect(page.locator('link[rel="service-desc"]')).toHaveAttribute("href", "/openapi.json");
  const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').nth(1).innerText())["@graph"];
  expect(graph[0]).toMatchObject({ "@type": "WebSite", name: "Azaan Noman", alternateName: "Azaan Noman Student Projects", url: `${SITE_URL}/` });
  expect(graph[1].mainEntity["@id"]).toBe(`${SITE_URL}/#person`);
  await page.goto("/docs");
  for (const path of ["/openapi.json", "/api", "/api/v1/portfolio", "/api/v1/projects", "/api/v1/contact", "/cli/azaannoman-cli-1.0.0.tgz"]) await expect(page.locator(`main a[href="${path}"]`)).toBeVisible();
  const llms = await (await request.get("/llms.txt")).text();
  expect(llms).toContain("/openapi.json"); expect(llms).toContain("/cli/azaannoman-cli-1.0.0.tgz");
});
