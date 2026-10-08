import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { infoPages } from "@/data/pages";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(infoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = Object.hasOwn(infoPages, slug) ? infoPages[slug] : undefined;
  if (!page) notFound();
  return {
    title: { absolute: page.title }, description: page.description,
    alternates: { canonical: `/${slug}`, types: { "text/markdown": `/${slug}.md` } },
    openGraph: { title: page.title, description: page.description, url: `/${slug}`, type: "website" },
  };
}

export default async function InformationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = Object.hasOwn(infoPages, slug) ? infoPages[slug] : undefined;
  if (!page) notFound();
  return (
    <main className="mx-auto min-h-screen max-w-prose px-6 py-24 sm:py-28">
      <header>
        <a href="/" className="text-[0.8rem] text-muted hover:text-ink">← Azaan Noman</a>
        <h1 className="mt-5 text-[0.95rem] font-semibold tracking-tight text-ink">{page.title}</h1>
      </header>
      {page.sections.map((section) => (
        <section key={section.heading} className="mt-14">
          <h2 className="mb-5 text-[0.95rem] font-semibold tracking-tight text-ink">{section.heading}</h2>
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink/90">
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.links && <ul className="space-y-2">{section.links.map((link) => (
              <li key={link.href}><a className="group font-medium text-ink" href={link.href}><span className="u-anim">{link.title}</span></a></li>
            ))}</ul>}
          </div>
        </section>
      ))}
    </main>
  );
}
