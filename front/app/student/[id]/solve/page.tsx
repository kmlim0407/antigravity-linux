"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findStudentById, type Student } from "@/lib/students";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Assignment = {
  id: string;
  studentId: string;
  pdfUrl: string;
  title: string;
  pageCount?: number;
  createdAt: string;
};

export default function StudentSolveListPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const student = findStudentById(id);
  const [step, setStep] = useState<"password" | "list">("password");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prints/assignments?studentId=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (step === "list") loadAssignments();
  }, [step, loadAssignments]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id, password: inputPassword }),
      });
      if (res.ok) {
        setStep("list");
      } else {
        const data = await res.json();
        setError(data.error ?? "비밀번호 오류");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-[env(safe-area-inset-bottom)]">
        <p className="mb-4 text-center text-sm sm:text-base">학생을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/student")}
          className="min-h-[44px] rounded-lg border bg-white px-4 py-3 text-sm shadow-sm touch-manipulation"
        >
          목록으로
        </button>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className="flex min-h-screen flex-col items-center px-4 py-6 pb-[env(safe-area-inset-bottom)] sm:py-8">
        <h1 className="mb-4 text-xl font-bold sm:text-2xl">{student.name}</h1>
        <p className="mb-2 text-sm text-gray-600">프린트 풀이</p>
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm rounded-2xl border bg-white px-4 py-6 shadow-sm"
        >
          <p className="mb-4 text-sm text-gray-700">개인 비밀번호를 입력하세요.</p>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="mb-3 w-full rounded-lg border px-4 py-3 text-base min-h-[44px] touch-manipulation"
            placeholder="비밀번호"
            autoComplete="current-password"
          />
          {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full rounded-lg border bg-blue-50 py-3 min-h-[44px] text-base font-semibold shadow-sm hover:bg-blue-100 active:bg-blue-200 touch-manipulation disabled:opacity-60"
          >
            {isVerifying ? "확인 중..." : "입장하기"}
          </button>
        </form>
        <Link
          href={`/student/${id}`}
          className="mt-4 py-3 px-4 text-sm text-gray-500 underline touch-manipulation min-h-[44px]"
        >
          ← 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-6 pb-[env(safe-area-inset-bottom)] sm:py-8">
      <h1 className="mb-1 text-xl font-bold sm:text-2xl">{student.name}</h1>
      <p className="mb-4 text-sm text-gray-600">프린트 풀이</p>

      {loading ? (
        <p className="py-8 text-slate-500">불러오는 중…</p>
      ) : assignments.length === 0 ? (
        <p className="py-8 text-slate-500">아직 배정된 과제가 없습니다.</p>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {assignments.map((a) => (
            <Link
              key={a.id}
              href={`/student/${id}/solve/${a.id}`}
              className="block rounded-2xl border bg-white px-5 py-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {a.pageCount ? `${a.pageCount}페이지` : ""}
                    {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <span className="text-blue-600 text-sm font-medium">풀기 →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href={`/student/${id}`}
        className="mt-6 py-3 px-4 text-sm text-gray-500 underline touch-manipulation"
      >
        ← 돌아가기
      </Link>
    </div>
  );
}
