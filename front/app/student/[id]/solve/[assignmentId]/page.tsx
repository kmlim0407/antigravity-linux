"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findStudentById } from "@/lib/students";
import PdfSolveCanvas from "@/components/PdfSolveCanvas";
import { useRealtimeAssignment } from "@/hooks/useRealtimeAssignment";
import type { AnnotationData } from "@/lib/prints";

type PageProps = {
  params: Promise<{ id: string; assignmentId: string }>;
};

type Assignment = {
  id: string;
  studentId: string;
  pdfUrl: string;
  title: string;
  pageCount?: number;
  createdAt: string;
};

export default function StudentSolvePage({ params }: PageProps) {
  const router = useRouter();
  const { id, assignmentId } = use(params);
  const student = findStudentById(id);
  const [step, setStep] = useState<"password" | "solve">("password");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [annotation, setAnnotation] = useState<AnnotationData>({});
  const [correction, setCorrection] = useState<AnnotationData>({});
  const [saving, setSaving] = useState(false);

  const loadAssignment = useCallback(async () => {
    try {
      const res = await fetch(`/api/prints/assignments/${assignmentId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.studentId !== id) return;
      setAssignment(data);
    } catch {}
  }, [assignmentId, id]);

  const loadAnnotation = useCallback(async () => {
    try {
      const res = await fetch(`/api/prints/assignments/${assignmentId}/annotation`);
      if (res.ok) {
        const data = await res.json();
        setAnnotation(data);
      }
    } catch {}
  }, [assignmentId]);

  const loadCorrection = useCallback(async () => {
    try {
      const res = await fetch(`/api/prints/assignments/${assignmentId}/correction`);
      if (res.ok) {
        const data = await res.json();
        setCorrection(data);
      }
    } catch {}
  }, [assignmentId]);

  useEffect(() => {
    if (step === "solve") {
      loadAssignment();
      loadAnnotation();
      loadCorrection();
    }
  }, [step, loadAssignment, loadAnnotation, loadCorrection]);

  useRealtimeAssignment(
    step === "solve" ? assignmentId : null,
    undefined,
    (data) => {
      if (data && typeof data === "object") setCorrection(data as AnnotationData);
    }
  );

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
        setStep("solve");
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

  const handleSaveAnnotation = useCallback(
    async (data: AnnotationData) => {
      setSaving(true);
      try {
        await fetch(`/api/prints/assignments/${assignmentId}/annotation`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } finally {
        setSaving(false);
      }
    },
    [assignmentId]
  );

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="mb-4 text-center text-sm">학생을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/student")}
          className="min-h-[44px] rounded-lg border bg-white px-4 py-3 text-sm"
        >
          목록으로
        </button>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className="flex min-h-screen flex-col items-center px-4 py-6">
        <h1 className="mb-4 text-xl font-bold">{student.name}</h1>
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm rounded-2xl border bg-white px-4 py-6 shadow-sm"
        >
          <p className="mb-4 text-sm text-gray-700">개인 비밀번호를 입력하세요.</p>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="mb-3 w-full rounded-lg border px-4 py-3 text-base min-h-[44px]"
            placeholder="비밀번호"
          />
          {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full rounded-lg border bg-blue-50 py-3 min-h-[44px] text-base font-semibold disabled:opacity-60"
          >
            {isVerifying ? "확인 중..." : "입장하기"}
          </button>
        </form>
        <Link href={`/student/${id}/solve`} className="mt-4 text-sm text-gray-500 underline">
          ← 돌아가기
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="mb-4 text-center text-sm">과제를 찾을 수 없습니다.</p>
        <Link href={`/student/${id}/solve`} className="text-sm text-blue-600 underline">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{assignment.title}</h1>
          <div className="flex items-center gap-3">
            {saving && <span className="text-xs text-slate-500">저장 중…</span>}
            <Link
              href={`/student/${id}/solve`}
              className="text-sm text-slate-600 underline"
            >
              목록
            </Link>
          </div>
        </div>
        <PdfSolveCanvas
          pdfUrl={assignment.pdfUrl}
          assignmentId={assignmentId}
          mode="solve"
          initialAnnotation={annotation}
          initialCorrection={correction}
          onSaveAnnotation={handleSaveAnnotation}
        />
      </div>
    </div>
  );
}
