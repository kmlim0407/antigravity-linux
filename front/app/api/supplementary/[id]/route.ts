import { NextRequest, NextResponse } from "next/server";
import { updateSupType, deleteSupType, type BookKey } from "@/lib/supplementary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    await updateSupType(id, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/supplementary/[id] error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = req.nextUrl.searchParams.get("book") as BookKey;
    if (!book)
      return NextResponse.json({ error: "book required" }, { status: 400 });
    await deleteSupType(id, book);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/supplementary/[id] error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
