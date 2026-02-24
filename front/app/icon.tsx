import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#ffffff",
          borderRadius: 112,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            fontSize: 280,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1,
            marginBottom: -10,
            fontFamily: "serif",
          }}
        >
          ∩
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: 10,
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
