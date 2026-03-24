import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SA Policy Space — South African Reform Database";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* SA flag stripes */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "36px" }}>
          {["#007A4D", "#FFB612", "#DE3831", "#002395"].map((color) => (
            <div
              key={color}
              style={{
                width: "14px",
                height: "70px",
                background: color,
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          SA Policy Space
        </div>
        <div
          style={{
            fontSize: "30px",
            color: "#6B7280",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          South African Reform Database
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#9CA3AF",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.5,
          }}
        >
          49 policy reform ideas · implementation plans · international comparisons · economic impact analysis
        </div>
      </div>
    ),
    { ...size }
  );
}
