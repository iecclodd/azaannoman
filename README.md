# azaannoman-portfolio

Personal site for Azaan Noman — [azaannoman.vercel.app](https://azaannoman.vercel.app).

A minimal, typography-first single page in the spirit of [emilkowal.ski](https://emilkowal.ski): one narrow column, no chrome, content over decoration. Built with Next.js (App Router) + Tailwind, deployed on Vercel.

## Editing content

Everything on the page reads from a single file — [`data/content.ts`](data/content.ts). Edit the strings there; the layout in [`app/page.tsx`](app/page.tsx) needs no changes.

Sections:

- **Today** — short intro, what I'm working on now.
- **Projects** — things I've built or am building.
- **Building** — organizations and roles.
- **More** — contact and social links.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Agent-readable content

The homepage and `/about`, `/contact`, `/privacy`, and `/docs` serve Markdown
when requested with `Accept: text/markdown`. Normal browser requests keep the
existing HTML layout. Negotiation honors quality values and explicit rejection;
unsupported page media types return 406. Missing pages return real 404s, with
Markdown recovery links for Markdown clients. Explicit `.md` URLs are also
available (`/index.md` for the homepage).

- `/llms.txt`: agent use cases and links, in the llms.txt outline format.
- `/llms-full.txt`: the full portfolio in Markdown.
- `/sitemap.xml` and `/robots.txt`: crawl discovery, including the public resume.
- `/mcp` and `/.well-known/mcp`: equivalent, live Streamable HTTP MCP endpoints.
  Use a standard MCP client to initialize, then call `get_portfolio` or
  `get_contact`. No credentials are required; both tools only read published data.
  Stateless JSON mode has no persistent session or standalone SSE stream, so
  GET and DELETE return 405. Cross-origin browser requests return 403.
- Homepage Person JSON-LD, canonical URLs, and `/opengraph-image`: identity and
  attribution metadata. This is a personal portfolio, not a business, so no
  Organization or private postal-address claims are made.

`data/content.ts` remains the source for portfolio facts across HTML, Markdown,
and MCP. Supporting pages live in `data/pages.ts`. Update `CONTENT_UPDATED` in
`lib/site.ts` when page content changes; update the resume's sitemap date when
replacing the PDF. Dates reflect content updates rather than request time.

Next 16.4 overwrites custom Vary headers when serving App Router HTML. On Vercel,
`vercel.json` runs `next build` and appends `Accept` through a platform response
header transform, preserving Next's RSC Vary values. For local/self-hosted builds,
`npm run build` also runs `scripts/finalize-static-headers.mjs` to put the same
header into prerendered HTML metadata and any existing route-cache copy.
This keeps pages static and avoids fetching the site from itself. Keep Next
pinned and rerun HTTP tests when upgrading; the local script fails on missing
expected page metadata. Development HTML headers are managed by Next. Negotiated
Markdown responses are explicitly not cached.

## Verification

```bash
npm ci
npx playwright install chromium
npm test                 # Accept parsing and safe JSON-LD serialization
npm run build            # Production build, type checking, response metadata
npm run test:e2e         # Starts next start; HTTP, browser, sitemap, MCP checks
# Run the same tests against a deployed site:
BASE_URL=https://azaannoman.vercel.app npm run test:e2e
```

Tests check response bodies and status codes, both Accept variants, HEAD, q=0,
406, nested 404s, explicit Markdown links, llms.txt format, XML sitemap contents,
metadata, social image dimensions, mobile overflow, resume preservation, and real
SDK MCP initialization/tool calls on both endpoints.

Search ranking and indexing need time and independent search-engine verification.
Submitting the sitemap in Google Search Console requires the owner's verified
property. Hosting on vercel.app does not make this Vercel's developer portal.

## Deploy

Push to GitHub and connect the repo to the `azaannoman` project on Vercel (or import it fresh). Every push to `main` deploys automatically.

## REST API, OpenAPI, and CLI

`/openapi.json` publishes an OpenAPI 3.1.1 document with typed parameters, response
schemas, unique operation IDs, and descriptions for every REST GET and HEAD
operation. `/api` provides JSON discovery. Public data endpoints are:

- `/api/v1/portfolio`: complete portfolio, source URL, and resume URL.
- `/api/v1/projects?limit=20&offset=0`: projects in homepage order; limit 1–100,
  offset 0–2147483647. An offset past the end returns an empty list.
- `/api/v1/contact`: the public email and social links.

No credentials or writes. Unsupported methods return 405 with `Allow: GET, HEAD`.
Invalid/unknown/repeated parameters return 400, unknown API paths return 404,
and rejected JSON media types return 406. Errors use RFC 9457
`application/problem+json`, including stable `code` and `resolution` extensions.
Query values are not reflected in error messages. HEAD preserves status/headers
without a response body. No application-level rate limit is enforced; platform
protections may still apply. Clients should reuse data and avoid needless polling.

The dependency-free Node.js 20+ CLI lives in `packages/cli`. Its versioned npm
package is available directly from the official domain:

```sh
npx --yes --package=https://azaannoman.vercel.app/cli/azaannoman-cli-1.0.0.tgz azaannoman projects --limit 3
```

It supports `portfolio`, `projects`, `contact`, `openapi`, `--help`, and `--version`.
Data goes to stdout as JSON; errors go to stderr as JSON with exit code 1.
Registry publication requires the owner's npm login and is not yet complete.
See `packages/cli/README.md` for publishing steps. Regenerate the hosted archive
after editing the package using:

```sh
npm pack ./packages/cli --pack-destination ./public/cli
```

Do not replace an already published version; bump its version and update links.
The MIT license in `packages/cli/LICENSE` applies only to the CLI package.

Tests also validate the published OpenAPI document, validate response bodies
against its schemas, cover API errors and pagination, test CLI success/failure
streams and argument validation, and install/run the real packaged executable.
The homepage's WebSite/ProfilePage metadata ties its brand to the existing Person
identity. Its visible Student Projects heading retains the existing typography.
Search ranking still requires indexing and genuine links from relevant profiles
or publications; metadata cannot guarantee a top-ten ranking.
