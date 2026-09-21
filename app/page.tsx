import { content, type LinkItem } from "@/data/content";
import Detector from "./Detector";

function isExternal(href?: string) {
  return !!href && href.startsWith("http");
}

function Item({ item }: { item: LinkItem }) {
  const titleEl = item.href ? (
    <a
      href={item.href}
      target={isExternal(item.href) ? "_blank" : undefined}
      rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-1 font-medium text-ink transition-colors hover:text-accent"
    >
      <span className="underline decoration-line decoration-1 underline-offset-[3px] group-hover:decoration-accent">
        {item.title}
      </span>
      {isExternal(item.href) && (
        <span
          aria-hidden
          className="translate-y-[0.5px] text-[0.7em] text-accent transition-transform group-hover:translate-x-[1px]"
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

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-[0.95rem] font-semibold tracking-tight text-ink">
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-[2px] bg-accent"
      />
      {children}
    </h2>
  );
}

function Section({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <section className="mt-14">
      <Heading>{title}</Heading>
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
    <main className="mx-auto min-h-screen max-w-prose px-6 py-20 sm:py-24">
      {/* Header */}
      <header>
        <h1 className="text-[clamp(2.1rem,7vw,3.4rem)] font-semibold leading-[0.95] tracking-tightest text-ink">
          {content.name}
        </h1>
        <p className="mt-2 text-[0.95rem] text-muted">
          {content.role}
        </p>
      </header>

      {/* 3D detector centerpiece */}
      <Detector />

      {/* Today */}
      <section className="mt-14">
        <Heading>Today</Heading>
        <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink/90">
          {content.today.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <Section title="Projects" items={content.projects} />
      <Section title="Building" items={content.building} />
      <Section title="More" items={content.links} />

      {/* Footer */}
      <footer className="mt-20 border-t border-line pt-6 text-[0.8rem] text-muted">
        <p>Built by Azaan Noman.</p>
      </footer>
    </main>
  );
}
