import { readFile, writeFile } from "node:fs/promises";

// Next 16.4 replaces proxy/config Vary headers when serving App Router HTML.
// Persist Accept in each prerendered page's response metadata so Next and
// Vercel append it after the framework's RSC headers. Keep Next pinned and
// verify this contract with the HTTP tests when upgrading the framework.
const pages = ["index", "about", "contact", "privacy", "docs", "_not-found"];
for (const page of pages) {
  const file = new URL(`../.next/server/app/${page}.meta`, import.meta.url);
  const metadata = JSON.parse(await readFile(file, "utf8"));
  metadata.headers ??= {};
  const varyKey = Object.keys(metadata.headers).find((key) => key.toLowerCase() === "vary");
  const vary = String(varyKey ? metadata.headers[varyKey] : "").split(",").map((v) => v.trim()).filter(Boolean);
  if (!vary.some((v) => v.toLowerCase() === "accept")) vary.push("Accept");
  metadata.headers[varyKey || "Vary"] = vary.join(", ");
  await writeFile(file, JSON.stringify(metadata, null, 2) + "\n");
  if (metadata.routeCache?.key) {
    const cacheFile = new URL(`../.next/server${metadata.routeCache.key}.meta`, import.meta.url);
    // A clean build has no runtime cache yet; Next seeds it from the page metadata.
    try {
      const cached = JSON.parse(await readFile(cacheFile, "utf8"));
      cached.headers = { ...cached.headers, Vary: metadata.headers[varyKey || "Vary"] };
      await writeFile(cacheFile, JSON.stringify(cached, null, 2) + "\n");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}
console.log(`Preserved Vary: Accept on ${pages.length} prerendered HTML responses.`);
