import React from "react";

type EmbedSearchParams = {
  url?: string;
};

type EmbedPageProps = {
  // Next.js 15+ 에서 searchParams 가 Promise 로 들어옴
  searchParams: Promise<EmbedSearchParams>;
};

// 유튜브 일반 링크 → 임베드 링크로 변환
function toEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);

    // 이미 embed 링크인 경우
    if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
      return rawUrl;
    }

    // youtu.be/VIDEO_ID 형식
    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.replace("/", "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // youtube.com/watch?v=VIDEO_ID 형식
    if (url.hostname.includes("youtube.com") && url.pathname === "/watch") {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // youtube.com/shorts/VIDEO_ID 형식
    if (
      url.hostname.includes("youtube.com") &&
      url.pathname.startsWith("/shorts/")
    ) {
      const videoId = url.pathname.replace("/shorts/", "").split("/")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // 그 외에는 일단 원본 그대로
    return rawUrl;
  } catch {
    // URL 파싱 실패 시 원본 사용
    return rawUrl;
  }
}

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  // ✅ Promise 로 들어오는 searchParams 를 await 해서 푼다
  const params = await searchParams;
  const rawUrl = params?.url ?? "";
  const embedUrl = toEmbedUrl(rawUrl);

  if (!rawUrl) {
    return (
      <div
        style={{
          padding: 24,
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <p>영상 URL이 전달되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 960,
          aspectRatio: "16 / 9",
        }}
      >
        <iframe
          src={embedUrl}
          title="QnA Video"
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
    </div>
  );
}
