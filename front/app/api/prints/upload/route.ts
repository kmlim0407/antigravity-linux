import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const studentId = formData.get("studentId") as string | null;
    const title = (formData.get("title") as string | null) || "과제";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "PDF 파일을 업로드해 주세요." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기는 50MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    if (!studentId || !studentId.trim()) {
      return NextResponse.json(
        { error: "학생을 선택해 주세요." },
        { status: 400 }
      );
    }

    const safeTitle = title.trim().slice(0, 100) || "과제";
    const timestamp = Date.now();
    const filename = `prints/${studentId}/${timestamp}-${safeTitle.replace(/[^a-zA-Z0-9가-힣_-]/g, "_")}.pdf`;

    const blob = await put(filename, file, {
      access: "private",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
    });
  } catch (e) {
    console.error("prints/upload error:", e);
    return NextResponse.json(
      { error: "업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
