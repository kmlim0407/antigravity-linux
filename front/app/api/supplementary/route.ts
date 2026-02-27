import { NextRequest, NextResponse } from "next/server";
import {
  getTypesByBook,
  createSupType,
  type BookKey,
} from "@/lib/supplementary";

export async function GET(req: NextRequest) {
  const book = req.nextUrl.searchParams.get("book") as BookKey | null;
  if (!book)
    return NextResponse.json({ error: "book required" }, { status: 400 });
  try {
    const types = await getTypesByBook(book);
    return NextResponse.json(types);
  } catch (e) {
    console.error("GET /api/supplementary error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { book, name, videoUrl = "", handwrittenUrl = "" } = await req.json();
    if (!book || !name?.trim())
      return NextResponse.json(
        { error: "book, name required" },
        { status: 400 }
      );
    const type = await createSupType({
      book,
      name: name.trim(),
      videoUrl,
      handwrittenUrl,
    });
    return NextResponse.json(type);
  } catch (e) {
    console.error("POST /api/supplementary error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
