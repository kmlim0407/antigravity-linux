"use client";

import Link from "next/link";
import { students, type Student } from "@/lib/students";

export default function StudentListPage() {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col items-center px-4 py-6 pb-[env(safe-area-inset-bottom)] sm:py-8">
      <h1 className="text-xl font-bold mb-2 sm:text-2xl">성취도</h1>
      <p className="mb-4 text-gray-600 text-sm text-center sm:mb-6">
        이름을 누르고 비밀번호 입력 후 체크하세요.
      </p>

      <div className="w-full max-w-md space-y-3 sm:space-y-4">
        {students.map((student: Student) => (
          <Link
            key={student.id}
            href={`/student/${student.id}`}
            className="
              block rounded-2xl bg-white px-5 py-4 shadow-md
              min-h-[52px] active:scale-[0.98]
              hover:shadow-lg hover:-translate-y-0.5
              transition-transform touch-manipulation
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold sm:text-base">{student.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">성취도 체크</p>
              </div>
              <div
                className="
                  flex h-10 w-10 min-w-[40px] min-h-[40px] items-center justify-center rounded-full
                  bg-blue-50 text-xs font-semibold text-blue-600
                "
              >
                입장
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
