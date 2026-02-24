import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1280,
          height: 800,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* NavBar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 48px",
            borderBottom: "1px solid #e2e8f0",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.05em" }}>
            SMOOKTH
          </span>
          <div style={{ display: "flex", gap: 32, fontSize: 14, color: "#64748b", fontWeight: 600 }}>
            <span>홈</span>
            <span>수업영상</span>
            <span>학생관리</span>
            <span>보강관리</span>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "48px",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", color: "#94a3b8", textTransform: "uppercase" }}>
            MATH STUDIO
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            SMOOKTH
          </div>
          <div style={{ fontSize: 22, color: "#475569", fontWeight: 500, letterSpacing: "0.02em" }}>
            BE LOGICAL ∩ BE TACTICAL
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "14px 36px",
              background: "#0f172a",
              color: "#ffffff",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            상담 문의
          </div>
        </div>

        {/* Bottom cards */}
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "0 48px 40px",
            justifyContent: "center",
          }}
        >
          {["성취도 체크", "오답 기록", "보강 신청"].map((label) => (
            <div
              key={label}
              style={{
                padding: "14px 28px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1280, height: 800 }
  );
}
