import assert from "node:assert/strict";
import test from "node:test";
import { preferredRepresentation } from "../lib/negotiation";
import { serializeJsonLd } from "../lib/site";

for (const [accept, expected] of [
  [null, "text/html"], ["*/*", "text/html"], ["text/*", "text/html"],
  ["text/html", "text/html"], ["text/markdown", "text/markdown"],
  ["TEXT/MARKDOWN", "text/markdown"],
  ["text/markdown, text/html", "text/markdown"],
  ["text/html, text/markdown", "text/html"],
  ["text/markdown;q=0.2, text/html;q=0.9", "text/html"],
  ["text/html;q=0.1, text/markdown;q=0.9", "text/markdown"],
  ["text/markdown;q=0, */*;q=1", "text/html"],
  ["text/html;q=0, */*;q=1", "text/markdown"],
  ["text/html;q=0, text/markdown;q=0, */*;q=1", undefined],
  ["application/json", undefined], ["*/*;q=0", undefined],
] as const) {
  test(`Accept ${accept ?? "(absent)"} selects ${expected ?? "406"}`, () => {
    assert.equal(preferredRepresentation(accept), expected);
  });
}

test("JSON-LD safely embeds text that could otherwise close a script", () => {
  const value = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(value);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});
