import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SMOOKTH — BE LOGICAL ∩ BE TACTICAL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 그리드 패턴 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.4,
          }}
        />

        {/* 우상단 장식 원 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
            opacity: 0.5,
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* 교집합 로고 */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1,
              fontFamily: "serif",
            }}
          >
            ∩
          </div>

          {/* 브랜드명 */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            SMOOKTH
          </div>

          {/* 슬로건 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 4,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#475569",
                letterSpacing: "0.12em",
              }}
            >
              BE LOGICAL
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "#94a3b8",
              }}
            >
              ∩
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#475569",
                letterSpacing: "0.12em",
              }}
            >
              BE TACTICAL
            </div>
          </div>

          {/* 설명 */}
          <div
            style={{
              marginTop: 8,
              padding: "12px 32px",
              background: "#0f172a",
              borderRadius: 100,
              fontSize: 16,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "0.08em",
            }}
          >
            논리적인 이해 × 전략적인 훈련
          </div>
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 40,
            fontSize: 14,
            color: "#94a3b8",
            letterSpacing: "0.05em",
          }}
        >
          smookth.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
