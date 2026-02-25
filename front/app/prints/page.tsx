"use client";

import Link from "next/link";
import { students } from "@/lib/students";

export default function PrintsBrowsePage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden bg-white px-4 py-6 pb-[env(safe-area-inset-bottom)] dark:bg-slate-900 sm:py-8"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-md">
        {/* 헤더: 제목 + 관리 아이콘 */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            프린트 열람
          </h1>
          <Link
            href="/student-manage/prints/manage"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title="프린트 관리"
            aria-label="프린트 관리"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </Link>
        </header>

        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          이름을 누르고 비밀번호 입력 후 프린트를 풀 수 있습니다.
        </p>

        <div className="space-y-3 sm:space-y-4">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/student/${student.id}/solve`}
              className="block min-h-[52px] rounded-2xl bg-white px-5 py-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] dark:bg-slate-800 dark:shadow-slate-900/50 touch-manipulation"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                    {student.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 sm:mt-1">
                    프린트 풀이
                  </p>
                </div>
                <div className="flex h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  입장
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
