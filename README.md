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

## Deploy

Push to GitHub and connect the repo to the `azaannoman` project on Vercel (or import it fresh). Every push to `main` deploys automatically.
