import { content, type LinkItem } from "@/data/content";
import type { Metadata } from "next";
import { personSchema, serializeJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
};

function isExternal(href?: string) {
  return !!href && href.startsWith("http");
}

function Item({ item }: { item: LinkItem }) {
  const titleEl = item.href ? (
    <a
      href={item.href}
      target={isExternal(item.href) ? "_blank" : undefined}
      rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-1 font-medium text-ink"
    >
      <span className="u-anim">{item.title}</span>
      {isExternal(item.href) && (
        <span
          aria-hidden
          className="translate-y-[0.5px] text-[0.7em] text-muted transition-transform group-hover:translate-x-[1px]"
        >
          ↗
        </span>
      )}
    </a>
  ) : (
    <span className="font-medium text-ink">{item.title}</span>
  );

  return (
    <li className="leading-relaxed">
      <div>{titleEl}</div>
      <div className="text-muted">{item.description}</div>
    </li>
  );
}

function Section({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-[0.95rem] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <ul className="space-y-5 text-[0.95rem]">
        {items.map((item) => (
          <Item key={item.title} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(personSchema) }} />
    <main className="mx-auto min-h-screen max-w-prose px-6 py-24 sm:py-28">
      {/* Header */}
      <header>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-[0.95rem] font-semibold tracking-tight text-ink">
            {content.name}
          </h1>
          <a
            href="/Azaan_Noman_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Link to resume (PDF, opens in a new tab)"
            className="group inline-flex items-center gap-1 text-[0.8rem] text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <span className="u-anim">Link to resume</span>
            <span
              aria-hidden
              className="translate-y-[0.5px] text-[0.7em] transition-transform group-hover:translate-x-[1px]"
            >
              ↗
            </span>
          </a>
        </div>
        <p className="text-[0.95rem] text-muted">{content.role}</p>
      </header>

      {/* Today */}
      <section className="mt-14">
        <h2 className="mb-5 text-[0.95rem] font-semibold tracking-tight text-ink">
          Today
        </h2>
        <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink/90">
          {content.today.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <Section title="Projects" items={content.projects} />
      <Section title="Leadership" items={content.leadership} />
      <Section title="Publications" items={content.publications} />
      <Section title="More" items={content.links} />

      {/* Footer */}
      <footer className="mt-20 border-t border-line pt-6 text-[0.8rem] text-muted">
        <p>Built by Azaan Noman.</p>
        <nav aria-label="Site information" className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <a className="hover:text-ink" href="/about">About</a>
          <a className="hover:text-ink" href="/contact">Contact</a>
          <a className="hover:text-ink" href="/privacy">Privacy</a>
          <a className="hover:text-ink" href="/docs">Developer & agent resources</a>
        </nav>
      </footer>
    </main>
    </>
  );
}
