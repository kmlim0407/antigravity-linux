import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pageNumbersStr = formData.get("pageNumbers") as string | null;

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

    const pageNumbers: number[] = pageNumbersStr
      ? (JSON.parse(pageNumbersStr) as number[])
      : [];
    if (!Array.isArray(pageNumbers) || pageNumbers.length === 0) {
      return NextResponse.json(
        { error: "포함할 문항(페이지)을 하나 이상 선택해 주세요." },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const sourceDoc = await PDFDocument.load(bytes);
    const totalPages = sourceDoc.getPageCount();

    const indices = pageNumbers
      .map((p) => (typeof p === "number" ? p : parseInt(String(p), 10)))
      .filter((p) => Number.isInteger(p) && p >= 1 && p <= totalPages)
      .map((p) => p - 1); // 1-based → 0-based

    const uniqueIndices = [...new Set(indices)].sort((a, b) => a - b);
    if (uniqueIndices.length === 0) {
      return NextResponse.json(
        { error: "유효한 페이지 번호를 선택해 주세요." },
        { status: 400 }
      );
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(sourceDoc, uniqueIndices);
    for (const page of copiedPages) {
      newDoc.addPage(page);
    }

    const pdfBytes = await newDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="wrong-answer-print.pdf"',
      },
    });
  } catch (e) {
    console.error("wrong-answer-print error:", e);
    return NextResponse.json(
      { error: "오답 프린트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
