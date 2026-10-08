import assert from "node:assert/strict";
import { test } from "node:test";
import { run } from "../packages/cli/bin/azaannoman.mjs";

async function cli(args: string[], fetchImpl: typeof fetch = async () => Response.json({ ok: true })) {
  let stdout = ""; let stderr = "";
  const code = await run(args, { stdout: text => { stdout += text; }, stderr: text => { stderr += text; }, fetchImpl });
  return { code, stdout, stderr };
}

test("CLI sends correct GET routes, pagination, and JSON headers", async () => {
  for (const [args, path] of [
    [["portfolio"], "/api/v1/portfolio"], [["contact"], "/api/v1/contact"], [["openapi"], "/openapi.json"],
    [["projects", "--limit", "3", "--offset", "2"], "/api/v1/projects?limit=3&offset=2"],
  ] as const) {
    const result = await cli([...args, "--base-url", "http://localhost:3100"], async (input, init) => {
      assert.equal(String(input), `http://localhost:3100${path}`);
      assert.equal(new Headers(init?.headers).get("accept"), "application/json");
      assert.equal(init?.redirect, "error");
      assert.ok(init?.signal);
      return Response.json({ projects: [{ title: "Public work" }] });
    });
    assert.equal(result.code, 0);
    assert.deepEqual(JSON.parse(result.stdout), { projects: [{ title: "Public work" }] });
    assert.equal(result.stderr, "");
  }
});

test("CLI rejects invalid commands/options before making requests", async () => {
  for (const args of [["constructor"], ["unknown"], ["portfolio", "--limit", "2"], ["projects", "--limit"], ["projects", "--limit", "101"], ["projects", "--offset", "-1"], ["projects", "--limit", "2", "--limit", "3"], ["projects", "--offset", "1.5"], ["contact", "--base-url", "file:///etc/passwd"], ["contact", "--base-url", "https://user:secret@example.com"], ["contact", "--base-url", "https://example.com/path"]]) {
    const result = await cli(args, async () => { assert.fail("Invalid arguments must not fetch"); });
    assert.equal(result.code, 1);
    assert.equal(result.stdout, "");
    assert.equal(JSON.parse(result.stderr).error.code, "CLI_ERROR");
    assert.ok(!result.stderr.includes("secret"));
  }
});

test("CLI provides help/version without network activity", async () => {
  for (const args of [[], ["--help"], ["-h"], ["--version"]]) {
    const result = await cli(args, async () => { assert.fail("No request expected"); });
    assert.equal(result.code, 0);
    assert.ok(result.stdout.length);
    assert.equal(result.stderr, "");
  }
});

test("CLI reports API problems to stderr with a nonzero exit", async () => {
  const result = await cli(["projects"], async () => Response.json({ code: "INVALID_QUERY", detail: "Invalid limit.", resolution: "Use 1 to 100." }, { status: 400, headers: { "Content-Type": "application/problem+json" } }));
  assert.equal(result.code, 1);
  assert.equal(result.stdout, "");
  assert.deepEqual(JSON.parse(result.stderr), { error: { code: "INVALID_QUERY", message: "Invalid limit.", resolution: "Use 1 to 100.", status: 400 } });
});

test("CLI handles HTML, malformed JSON, and network failures as JSON errors", async () => {
  for (const fetchImpl of [async () => new Response("<h1>Unavailable</h1>", { status: 503 }), async () => new Response("{", { headers: { "Content-Type": "application/json" } }), async () => { throw new Error("Network unavailable"); }]) {
    const result = await cli(["portfolio"], fetchImpl);
    assert.equal(result.code, 1);
    assert.equal(result.stdout, "");
    assert.equal(JSON.parse(result.stderr).error.code, "CLI_ERROR");
  }
});
