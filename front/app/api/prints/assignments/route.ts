import { NextRequest, NextResponse } from "next/server";
import {
  listAssignments,
  listAssignmentsByStudent,
  createAssignment,
  type Assignment,
} from "@/lib/prints";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (studentId) {
      const assignments = await listAssignmentsByStudent(studentId);
      return NextResponse.json(assignments);
    }

    const assignments = await listAssignments();
    return NextResponse.json(assignments);
  } catch (e) {
    console.error("GET /api/prints/assignments:", e);
    return NextResponse.json(
      { error: "과제 목록을 불러올 수 없습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, pdfUrl, title, pageCount } = body as {
      studentId?: string;
      pdfUrl?: string;
      title?: string;
      pageCount?: number;
    };

    if (!studentId || !pdfUrl) {
      return NextResponse.json(
        { error: "studentId와 pdfUrl은 필수입니다." },
        { status: 400 }
      );
    }

    const assignment = await createAssignment({
      studentId,
      pdfUrl,
      title: title ?? "과제",
      pageCount,
    });

    return NextResponse.json(assignment);
  } catch (e) {
    console.error("POST /api/prints/assignments:", e);
    return NextResponse.json(
      { error: "과제 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
