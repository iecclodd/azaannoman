import { portfolioMarkdown } from "@/lib/markdown";
export const dynamic = "force-static";
export function GET() {
  return new Response(portfolioMarkdown(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
