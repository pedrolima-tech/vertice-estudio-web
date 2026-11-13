import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const dynamic = "force-static";
export const alt = `${site.name}: sites, landing pages e soluções tecnológicas sob medida`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(60% 70% at 78% 40%, rgba(124,92,255,0.45), transparent 70%), radial-gradient(40% 50% at 85% 60%, rgba(77,232,255,0.35), transparent 70%)",
          backgroundColor: "#05060a",
          color: "#edeff5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#8a90a2" }}>{`${site.name} · ${site.tagline}`}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>
          <span>Sites que só</span>
          <span>poderiam ser seus.</span>
        </div>
        <div style={{ fontSize: 30, color: "#8a90a2" }}>Sites personalizados · Landing pages · Soluções tecnológicas</div>
      </div>
    ),
    size,
  );
}
