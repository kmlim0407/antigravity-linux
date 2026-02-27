import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const typeId = formData.get("typeId") as string | null;
    if (!file || !typeId)
      return NextResponse.json(
        { error: "file, typeId required" },
        { status: 400 }
      );
    if (!file.type.startsWith("image/"))
      return NextResponse.json(
        { error: "이미지 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    const ext = file.name.split(".").pop() || "jpg";
    const blob = await put(
      `supplementary/${typeId}/handwritten.${ext}`,
      file,
      { access: "public", addRandomSuffix: false }
    );
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("POST /api/supplementary/upload error:", e);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
