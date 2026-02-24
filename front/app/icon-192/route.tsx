import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#ffffff",
          borderRadius: 42,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 105,
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
            letterSpacing: 3,
            fontFamily: "sans-serif",
          }}
        >
          SMOOKTH
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
