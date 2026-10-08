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

Next 16.4 overwrites custom Vary headers when serving App Router HTML. The build
script `scripts/finalize-static-headers.mjs` adds `Accept` to the prerendered HTML
response metadata and its route-cache copy, preserving Next's RSC Vary values.
This keeps pages static and avoids fetching the site from itself. Keep Next
pinned and rerun HTTP tests when upgrading; the script fails on missing expected
metadata. The workaround applies to production builds; development HTML headers
are managed by Next. Negotiated Markdown responses are explicitly not cached.

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
