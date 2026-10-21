import { ImageResponse } from "next/og";
import { colors } from "@/styles/tokens";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Generated Open Graph / Twitter card image: neutral wordmark, page title, subtitle and the retailer disclosure. */
export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${colors.night.hex} 0%, ${colors.brandStrong.hex} 100%)`,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: colors.brand.hex, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>A</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Authorized Internet Retailer</div>
            <div style={{ fontSize: 20, color: colors.border.hex }}>Independent retailer of AT&amp;T services</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", width: 72, height: 6, borderRadius: 3, background: colors.brand.hex }} />
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontSize: 30, color: colors.tint2.hex, lineHeight: 1.3 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 20, color: colors.border.hex }}>Not AT&amp;T&apos;s official website. AT&amp;T is a trademark of AT&amp;T Intellectual Property.</div>
      </div>
    ),
    { ...ogSize },
  );
}
