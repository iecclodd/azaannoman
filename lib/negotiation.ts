import Negotiator from "negotiator";

export function preferredRepresentation(accept: string | null) {
  return new Negotiator({ headers: { accept: accept || "*/*" } })
    .mediaType(["text/html", "text/markdown"]);
}
