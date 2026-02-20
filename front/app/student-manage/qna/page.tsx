"use client";

import React, { useState } from "react";
import Link from "next/link";

type VideoEntry = { id: string; book: string; number: string; title: string; url: string };

export default function QnaPage() {
  const [studentName, setStudentName] = useState("");
  const [book, setBook] = useState("");
  const [number, setNumber] = useState("");
  const [results, setResults] = useState<VideoEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResults([]);
    setSearched(false);
    setErrorMsg("");
    if (!book.trim() || !number.trim()) {
      setErrorMsg("교재와 문제 번호를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/qna/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, number }),
      });
      const data = await res.json();
      if (!res.ok) setErrorMsg(data.error ?? "영상 조회 중 오류");
      else {
        setResults(data.videos ?? []);
        setSearched(true);
      }
    } catch {
      setErrorMsg("서버 통신 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-10 sm:py-12" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/student-manage"
          className="mb-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 sm:text-[14px]"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로가기
        </Link>
        <header>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">질문 / Q&A</h1>
          <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">노션 DB 연동 영상 검색</p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="min-w-0 flex-1 sm:min-w-[180px] space-y-1">
              <label className="block text-[12px] font-semibold text-slate-700">학생 이름 (선택)</label>
              <input placeholder="예) 김지호" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px]" />
            </div>
            <div className="min-w-0 flex-1 sm:min-w-[180px] space-y-1">
              <label className="block text-[12px] font-semibold text-slate-700">교재 / 키워드 <span className="text-red-500">*</span></label>
              <input placeholder="예) 고쟁이, 쎈" value={book} onChange={(e) => setBook(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px]" />
            </div>
            <div className="min-w-0 flex-1 sm:min-w-[180px] space-y-1">
              <label className="block text-[12px] font-semibold text-slate-700">문제 번호 <span className="text-red-500">*</span></label>
              <input placeholder="예) 120" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px]" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="mt-4 rounded-full border border-slate-300 bg-white px-5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
            {loading ? "찾는 중..." : "영상 찾기"}
          </button>
        </form>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{errorMsg}</div>
        )}

        <section>
          <h2 className="mb-3 text-base font-semibold text-slate-800">결과</h2>
          {!searched && !loading && !errorMsg && (
            <p className="text-[12px] text-slate-600">예) 고쟁이 / 120 입력 시 노션 DB에서 해당 교재·번호 영상 검색</p>
          )}
          {searched && !loading && results.length === 0 && !errorMsg && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-600">해당 교재·번호로 등록된 영상 없음. 노션 DB 확인 필요.</div>
          )}
          {results.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((v) => (
                <article key={v.id} className="rounded-xl border border-slate-200 bg-white p-3">
                  <h3 className="mb-2 text-[13px] font-semibold text-slate-900">{v.title}</h3>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <iframe src={`/embed?url=${encodeURIComponent(v.url)}`} title={v.title} className="absolute inset-0 h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  {studentName.trim() && <p className="mt-2 text-[11px] text-slate-600">학생: {studentName}</p>}
                  <p className="text-[11px] text-slate-600">교재: {v.book || book} / 번호: {v.number || number}</p>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[11px] font-medium text-slate-700 hover:underline">새 창에서 열기</a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
