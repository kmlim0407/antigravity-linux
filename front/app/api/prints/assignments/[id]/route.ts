import { NextRequest, NextResponse } from "next/server";
import { getAssignment, deleteAssignment } from "@/lib/prints";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assignment = await getAssignment(id);
    if (!assignment) {
      return NextResponse.json({ error: "과제를 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(assignment);
  } catch (e) {
    console.error("GET /api/prints/assignments/[id]:", e);
    return NextResponse.json(
      { error: "과제를 불러올 수 없습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = await deleteAssignment(id);
    if (!ok) {
      return NextResponse.json({ error: "과제를 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/prints/assignments/[id]:", e);
    return NextResponse.json(
      { error: "과제 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
