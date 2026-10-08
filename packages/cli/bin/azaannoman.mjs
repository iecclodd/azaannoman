#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { realpathSync } from "node:fs";

export const help = `Azaan Noman portfolio CLI 1.0.0 (Node.js 20+)

Usage: azaannoman <command> [options]

Commands:
  portfolio                 Read the complete public portfolio
  projects                  List student projects
  contact                   Read public email and profile links
  openapi                   Read the OpenAPI 3.1 specification

Options:
  --limit <1-100>            Projects per page (projects only, default 20)
  --offset <0-2147483647>    Projects to skip (projects only, default 0)
  --base-url <http(s) URL>   API origin (default https://azaannoman.vercel.app)
  --help                    Print help
  --version                 Print version

Successful commands print JSON to stdout. Errors print JSON to stderr and exit 1.
No authentication, writes, or message sending. Requests time out after 15 seconds.
`;

export async function run(args, { stdout = text => { process.stdout.write(text); }, stderr = text => { process.stderr.write(text); }, fetchImpl = fetch } = {}) {
  try {
    if (args.length === 0 || (args.length === 1 && ["--help", "-h"].includes(args[0]))) { stdout(help); return 0; }
    if (args.length === 1 && args[0] === "--version") { stdout("1.0.0\n"); return 0; }
    const paths = { portfolio: "/api/v1/portfolio", projects: "/api/v1/projects", contact: "/api/v1/contact", openapi: "/openapi.json" };
    const [command, ...flags] = args;
    if (!Object.hasOwn(paths, command)) throw new Error("Unknown command. Run azaannoman --help.");
    let baseUrl = "https://azaannoman.vercel.app";
    const query = new URLSearchParams();
    const seen = new Set();
    for (let i = 0; i < flags.length; i += 2) {
      const flag = flags[i];
      const value = flags[i + 1];
      if (!["--limit", "--offset", "--base-url"].includes(flag) || !value || value.startsWith("--") || seen.has(flag)) throw new Error("Unknown, repeated, or incomplete option. Run azaannoman --help.");
      seen.add(flag);
      if (flag === "--base-url") { baseUrl = value; continue; }
      const n = Number(value);
      const valid = /^\d+$/.test(value) && Number.isSafeInteger(n) && (flag === "--limit" ? n >= 1 && n <= 100 : n >= 0 && n <= 2147483647);
      if (command !== "projects" || !valid) throw new Error("Use --limit (1-100) and --offset (0-2147483647) only with projects.");
      query.set(flag.slice(2), value);
    }
    const base = new URL(baseUrl);
    if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.pathname !== "/" || base.search || base.hash) throw new Error("--base-url must be an HTTP(S) origin without credentials, a path, query, or fragment.");
    const url = new URL(paths[command], base);
    url.search = query.toString();
    const response = await fetchImpl(url, { headers: { Accept: "application/json", "User-Agent": "azaannoman-cli/1.0.0" }, signal: AbortSignal.timeout(15000), redirect: "error" });
    const isJson = /^application\/(?:[\w.+-]+\+)?json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "");
    if (!isJson) throw new Error(`HTTP ${response.status}: expected a JSON response. Check --base-url or try again later.`);
    const body = await response.json();
    if (!response.ok) {
      stderr(JSON.stringify({ error: { code: body.code ?? "HTTP_ERROR", message: body.detail ?? body.title ?? `HTTP ${response.status}`, resolution: body.resolution ?? "Check the API documentation and retry.", status: response.status } }) + "\n");
      return 1;
    }
    stdout(JSON.stringify(body, null, 2) + "\n");
    return 0;
  } catch (error) {
    stderr(JSON.stringify({ error: { code: "CLI_ERROR", message: error instanceof Error ? error.message : "Request failed.", resolution: "Run azaannoman --help; check the options and network connection." } }) + "\n");
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  run(process.argv.slice(2)).then(code => { process.exitCode = code; });
}
