import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

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

    const bytes = new Uint8Array(await file.arrayBuffer());
    const doc = await PDFDocument.load(bytes);
    const pageCount = doc.getPageCount();

    return NextResponse.json({ pageCount });
  } catch (e) {
    console.error("page-count error:", e);
    return NextResponse.json(
      { error: "PDF를 읽을 수 없습니다." },
      { status: 500 }
    );
  }
}
