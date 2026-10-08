import { ImageResponse } from "next/og";
import { content } from "@/data/content";

export const alt = "Azaan Noman — Student projects, AI & engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 96, background: "#fdfdfc", color: "#111110", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 72, fontWeight: 600 }}>{content.name}</div>
      <div style={{ marginTop: 28, fontSize: 36, color: "#6b6b65" }}>Student projects, AI & engineering</div>
      <div style={{ marginTop: 72, fontSize: 24, color: "#6b6b65" }}>azaannoman.vercel.app</div>
    </div>,
    size,
  );
}
