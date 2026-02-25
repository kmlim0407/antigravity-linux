import { NextRequest, NextResponse } from "next/server";
import { getAssignment, getAnnotation, setAnnotation } from "@/lib/prints";
import type { AnnotationData } from "@/lib/prints";

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
    const annotation = await getAnnotation(id);
    return NextResponse.json(annotation);
  } catch (e) {
    console.error("GET /api/prints/assignments/[id]/annotation:", e);
    return NextResponse.json(
      { error: "풀이를 불러올 수 없습니다." },
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
    const body = (await request.json()) as AnnotationData;
    await setAnnotation(id, body);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT /api/prints/assignments/[id]/annotation:", e);
    return NextResponse.json(
      { error: "풀이 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
