"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function EmbedPage() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return (
      <div
        style={{
          maxWidth: 800,
          margin: "40px auto",
          padding: 16,
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          잘못된 접근입니다.
        </h1>
        <p style={{ fontSize: 14, color: "#4b5563" }}>
          쿼리 파라미터 <code>url</code> 이 필요합니다.
          <br />
          예) <code>/embed?url=https%3A%2F%2Fexample.com</code>
        </p>
      </div>
    );
  }

  const decodedUrl = decodeURIComponent(rawUrl);

  const handleOpenNewTab = () => {
    window.open(decodedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "24px auto 40px",
        padding: "0 16px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        해설 영상 보기
      </h1>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        아래 박스에서 영상이 보이지 않으면{" "}
        <button
          type="button"
          onClick={handleOpenNewTab}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            margin: 0,
            color: "#2563eb",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 13,
          }}
        >
          새 창으로 열기
        </button>
        를 눌러주세요.
      </p>

      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9
          backgroundColor: "#000",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <iframe
          src={decodedUrl}
          title="해설 영상"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={handleOpenNewTab}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid #d1d5db",
            fontSize: 13,
            cursor: "pointer",
            backgroundColor: "white",
          }}
        >
          영상 새 창으로 열기
        </button>
      </div>

      <p
        style={{
          marginTop: 8,
          fontSize: 11,
          color: "#9ca3af",
          wordBreak: "break-all",
        }}
      >
        원본 링크: {decodedUrl}
      </p>
    </div>
  );
}
