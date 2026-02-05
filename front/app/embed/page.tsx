// app/embed/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EmbedInner() {
  const searchParams = useSearchParams();

  // /embed?url=... 로 들어온 값
  const rawUrl = searchParams.get("url") || "";
  const decodedUrl = rawUrl ? decodeURIComponent(rawUrl) : "";

  if (!decodedUrl) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        <p>임베드할 URL이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="w-full h-full max-w-[1200px] max-h-[700px]">
        <iframe
          src={decodedUrl}
          title="임베드 영상"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <p>로딩 중...</p>
        </div>
      }
    >
      <EmbedInner />
    </Suspense>
  );
}
