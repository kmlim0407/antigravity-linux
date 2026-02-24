import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyStudentPassword } from "@/lib/student-passwords.server";
import { findStudentById } from "@/lib/students";
import { handleApiError, ApiError } from "@/lib/api-error";

const BodySchema = z.object({
  studentId: z.string().min(1, "studentId가 필요합니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, password } = BodySchema.parse(body);

    const student = findStudentById(studentId);
    if (!student) {
      throw new ApiError(404, "학생을 찾을 수 없습니다.");
    }

    const isValid = verifyStudentPassword(studentId, password);
    if (!isValid) {
      throw new ApiError(401, "비밀번호 오류");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
