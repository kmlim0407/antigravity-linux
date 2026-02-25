import { NextRequest, NextResponse } from "next/server";
import { getAssignment, getCorrection, setCorrection } from "@/lib/prints";
import type { CorrectionData } from "@/lib/prints";

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
    const correction = await getCorrection(id);
    return NextResponse.json(correction);
  } catch (e) {
    console.error("GET /api/prints/assignments/[id]/correction:", e);
    return NextResponse.json(
      { error: "첨삭을 불러올 수 없습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assignment = await getAssignment(id);
    if (!assignment) {
      return NextResponse.json({ error: "과제를 찾을 수 없습니다." }, { status: 404 });
    }
    const body = (await request.json()) as CorrectionData;
    await setCorrection(id, body);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT /api/prints/assignments/[id]/correction:", e);
    return NextResponse.json(
      { error: "첨삭 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
