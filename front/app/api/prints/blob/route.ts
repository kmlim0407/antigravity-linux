import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";

/**
 * Private Blob을 브라우저에서 불러올 수 있도록 프록시합니다.
 * pdfUrl이 private.blob.vercel-storage.com인 경우 이 API를 통해 스트리밍합니다.
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "url 쿼리가 필요합니다." }, { status: 400 });
    }

    // 보안: 우리 Blob 도메인만 허용
    if (
      !url.includes("blob.vercel-storage.com") ||
      !url.startsWith("https://")
    ) {
      return NextResponse.json({ error: "잘못된 URL입니다." }, { status: 400 });
    }

    // URL에서 pathname 추출: https://xxx.private.blob.vercel-storage.com/prints/... -> prints/...
    const match = url.match(/blob\.vercel-storage\.com\/(.+)$/);
    const pathname = match?.[1];
    if (!pathname) {
      return NextResponse.json({ error: "pathname을 추출할 수 없습니다." }, { status: 400 });
    }

    const result = await get(pathname, { access: "private" }) as
      | { stream?: ReadableStream; blob?: { contentType?: string }; statusCode?: number }
      | null;

    if (!result?.stream) {
      return new NextResponse("PDF를 찾을 수 없습니다.", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob?.contentType ?? "application/pdf",
      },
    });
  } catch (e) {
    console.error("prints/blob proxy error:", e);
    return NextResponse.json(
      { error: "PDF를 불러올 수 없습니다." },
      { status: 500 }
    );
  }
}
