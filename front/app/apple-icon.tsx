import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#ffffff",
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1,
            marginBottom: -4,
            fontFamily: "serif",
          }}
        >
          ∩
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: 4,
            fontFamily: "sans-serif",
          }}
        >
          SMOOKTH
        </div>
      </div>
    ),
    { ...size }
  );
}
