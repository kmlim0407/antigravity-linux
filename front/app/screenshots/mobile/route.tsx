import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 540,
          height: 960,
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
            padding: "16px 24px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.15em" }}>MENU</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.05em" }}>
            SMOOKTH
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>∩</span>
        </div>

        {/* Hero */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: "40px 32px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#94a3b8", textTransform: "uppercase" }}>
            MATH STUDIO
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textAlign: "center",
            }}
          >
            SMOOKTH
          </div>
          <div style={{ fontSize: 16, color: "#475569", fontWeight: 500, textAlign: "center", letterSpacing: "0.02em" }}>
            BE LOGICAL ∩ BE TACTICAL
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "14px 32px",
              background: "#0f172a",
              color: "#ffffff",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            상담 문의
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "0 24px 48px",
          }}
        >
          {[
            { title: "성취도 체크", desc: "내 학습 현황 한눈에" },
            { title: "오답 기록", desc: "틀린 문제 다시 정복" },
            { title: "보강 신청", desc: "빠진 수업 쉽게 신청" },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{ fontSize: 18, color: "#cbd5e1" }}>→</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 540, height: 960 }
  );
}
