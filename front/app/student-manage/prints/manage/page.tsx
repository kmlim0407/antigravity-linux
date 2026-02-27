"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { students } from "@/lib/students";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "smookth";

type Assignment = {
  id: string;
  studentId: string;
  pdfUrl: string;
  title: string;
  pageCount?: number;
  createdAt: string;
};

export default function PrintsManagePage() {
  const [authed, setAuthed] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const handleAuth = () => {
    if (pinInput === ADMIN_KEY) {
      setAuthed(true);
    } else {
      setPinError("비밀번호가 틀렸습니다");
      setPinInput("");
    }
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-slate-900">
        <div className="w-full max-w-xs text-center" style={{ fontFamily: "var(--font-outfit)" }}>
          <h1 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">관리자 모드</h1>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); setPinError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="관리자 비밀번호"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-[15px] outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {pinError && <p className="mt-2 text-[13px] text-red-500">{pinError}</p>}
          <button
            type="button"
            onClick={handleAuth}
            className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-[14px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            입장
          </button>
          <Link href="/student-manage/prints" className="mt-4 inline-block text-sm text-slate-500 underline">
            ← 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return <PrintsDashboard />;
}

function PrintsDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "upload">("list");

  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prints/assignments");
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !studentId.trim()) {
      setUploadError("PDF 파일과 학생을 선택해 주세요.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentId", studentId);
      formData.append("title", title.trim() || "과제");

      const uploadRes = await fetch("/api/prints/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const d = await uploadRes.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? "업로드 실패");
      }
      const { url } = await uploadRes.json();

      const pageCountFd = new FormData();
      pageCountFd.append("file", file);
      const pageCountRes = await fetch("/api/wrong-answer-print/page-count", {
        method: "POST",
        body: pageCountFd,
      });
      let pageCount: number | undefined;
      if (pageCountRes.ok) {
        const pc = await pageCountRes.json();
        pageCount = pc.pageCount;
      }

      const assignRes = await fetch("/api/prints/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, pdfUrl: url, title: title.trim() || "과제", pageCount }),
      });
      if (!assignRes.ok) {
        const d = await assignRes.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? "과제 생성 실패");
      }

      setFile(null);
      setTitle("");
      setTab("list");
      await fetchAssignments();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const byStudent = assignments.reduce<Record<string, Assignment[]>>((acc, a) => {
    if (!acc[a.studentId]) acc[a.studentId] = [];
    acc[a.studentId]!.push(a);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-white px-3 py-8 dark:bg-slate-900" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">프린트 관리</h1>
        </header>

        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700">
          {(["list", "upload"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg py-2 text-[14px] font-medium ${
                tab === key ? "bg-white shadow-sm dark:bg-slate-700" : "text-slate-500"
              }`}
            >
              {key === "list" ? "과제 목록" : "PDF 업로드"}
            </button>
          ))}
        </div>

        {tab === "list" && (
          <div className="space-y-6">
            {loading ? (
              <p className="text-slate-500">불러오는 중…</p>
            ) : assignments.length === 0 ? (
              <p className="text-slate-500">과제가 없습니다. PDF를 업로드해 주세요.</p>
            ) : (
              Object.entries(byStudent).map(([sid, list]) => {
                const student = students.find((s) => s.id === sid);
                return (
                  <div key={sid} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                      {student?.name ?? sid}
                    </h2>
                    <div className="space-y-2">
                      {list.map((a) => (
                        <Link
                          key={a.id}
                          href={`/student-manage/prints/${a.id}`}
                          className="block rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
                        >
                          <div className="flex items-center justify-between">
                            <span>{a.title}</span>
                            <span className="text-slate-500 text-xs">
                              {new Date(a.createdAt).toLocaleDateString("ko-KR")} · 첨삭 →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "upload" && (
          <form onSubmit={handleUpload} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">PDF 파일</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">학생</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                >
                  <option value="">선택</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 3월 1주 과제"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
                />
              </div>
              {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
              >
                {uploading ? "업로드 중…" : "업로드 & 배정"}
              </button>
            </div>
          </form>
        )}

        <Link
          href="/student-manage/prints"
          className="mt-8 inline-block text-sm text-slate-500 underline"
        >
          ← 개별 프린트
        </Link>
      </div>
    </main>
  );
}
