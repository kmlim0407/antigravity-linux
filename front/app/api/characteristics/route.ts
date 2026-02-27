import { NextRequest, NextResponse } from "next/server";
import {
  getCharacteristics,
  setCharacteristics,
  getAllCharacteristics,
} from "@/lib/characteristics";
import { students } from "@/lib/students";

/** GET ?studentId=xxx  — 한 학생 or 전체 */
export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId");
  try {
    if (studentId) {
      const data = await getCharacteristics(studentId);
      return NextResponse.json(data ?? { studentId, tags: [], memo: "", updatedAt: "" });
    }
    // 전체
    const ids = students.map((s) => s.id);
    const all = await getAllCharacteristics(ids);
    return NextResponse.json(all);
  } catch (e) {
    console.error("GET /api/characteristics error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** PUT { studentId, tags[], memo } */
export async function PUT(req: NextRequest) {
  try {
    const { studentId, tags, memo } = await req.json();
    if (!studentId || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "studentId, tags[] required" },
        { status: 400 }
      );
    }
    const result = await setCharacteristics(studentId, tags, memo ?? "");
    return NextResponse.json(result);
  } catch (e) {
    console.error("PUT /api/characteristics error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
