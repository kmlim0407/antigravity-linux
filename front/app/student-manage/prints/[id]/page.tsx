"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { findStudentById } from "@/lib/students";
import PdfSolveCanvas from "@/components/PdfSolveCanvas";
import { useRealtimeAssignment } from "@/hooks/useRealtimeAssignment";
import type { AnnotationData } from "@/lib/prints";

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

export default function PrintCorrectionPage({ params }: PageProps) {
  const { id: assignmentId } = use(params);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [annotation, setAnnotation] = useState<AnnotationData>({});
  const [correction, setCorrection] = useState<AnnotationData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAssignment = useCallback(async () => {
    try {
      const res = await fetch(`/api/prints/assignments/${assignmentId}`);
      if (!res.ok) {
        setLoadError("과제를 불러오지 못했습니다.");
        return;
      }
      const data = await res.json();
      setAssignment(data);
    } catch (err) {
      console.warn("loadAssignment failed:", err);
      setLoadError("과제를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  const loadAnnotation = useCallback(async () => {
    try {
      const res = await fetch(`/api/prints/assignments/${assignmentId}/annotation`);
      if (res.ok) {
        const data = await res.json();
        setAnnotation(data);
      }
    } catch (err) {
      console.warn("loadAnnotation failed:", err);
    }
  }, [assignmentId]);

  const loadCorrection = useCallback(async () => {
    try {
      const res = await fetch(`/api/prints/assignments/${assignmentId}/correction`);
      if (res.ok) {
        const data = await res.json();
        setCorrection(data);
      }
    } catch (err) {
      console.warn("loadCorrection failed:", err);
    }
  }, [assignmentId]);

  useEffect(() => {
    loadAssignment();
    loadAnnotation();
    loadCorrection();
  }, [loadAssignment, loadAnnotation, loadCorrection]);

  useRealtimeAssignment(
    assignmentId,
    (data) => {
      if (data && typeof data === "object") setAnnotation(data as AnnotationData);
    },
    (data) => {
      if (data && typeof data === "object") setCorrection(data as AnnotationData);
    }
  );

  const handleSaveCorrection = useCallback(
    async (data: AnnotationData) => {
      setSaving(true);
      try {
        await fetch(`/api/prints/assignments/${assignmentId}/correction`, {
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

  const student = assignment ? findStudentById(assignment.studentId) : null;

  if (loading && !assignment) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">불러오는 중…</p>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="mb-4 text-slate-500">{loadError ?? "과제를 찾을 수 없습니다."}</p>
        <Link href="/student-manage/prints/manage" className="text-blue-600 underline">
          목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{assignment.title}</h1>
            <p className="text-sm text-slate-500">{student?.name ?? assignment.studentId}</p>
          </div>
          <div className="flex items-center gap-3">
            {saving && <span className="text-xs text-slate-500">저장 중…</span>}
            <Link href="/student-manage/prints/manage" className="text-sm text-slate-600 underline">
              목록
            </Link>
          </div>
        </div>
        <p className="mb-2 text-xs text-slate-500">
          빨간색으로 첨삭해 주세요. 자동 저장됩니다.
        </p>
        <PdfSolveCanvas
          pdfUrl={assignment.pdfUrl}
          assignmentId={assignmentId}
          mode="correct"
          initialAnnotation={annotation}
          initialCorrection={correction}
          onSaveCorrection={handleSaveCorrection}
        />
      </div>
    </main>
  );
}
