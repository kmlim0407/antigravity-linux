"use client";

import React, { useState } from "react";

type VideoEntry = {
  id: string;
  book: string;
  number: string;
  title: string;
  url: string;
};

export default function QnaPage() {
  const [studentName, setStudentName] = useState("");
  const [book, setBook] = useState("");
  const [number, setNumber] = useState("");
  const [results, setResults] = useState<VideoEntry[]>([]);
  const [selected, setSelected] = useState<VideoEntry | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setResults([]);
    setSelected(null);
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

      if (!res.ok) {
        setErrorMsg(data.error ?? "영상 조회 중 오류가 발생했습니다.");
      } else {
        const vids: VideoEntry[] = data.videos ?? [];
        setResults(vids);
        setSelected(vids[0] ?? null); // 첫 영상 자동 선택
        setSearched(true);
      }
    } catch {
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      {/* ===== 전체 배경에 은은한 무늬/그라데이션 ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* 아주 연한 원형 그라데이션들 */}
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-sky-100 via-indigo-50 to-white blur-3xl" />
        <div className="absolute top-40 -right-16 h-80 w-80 rounded-full bg-gradient-to-tl from-violet-100 via-slate-50 to-white blur-3xl" />
        <div className="absolute bottom-[-80px] left-10 h-72 w-72 rounded-full bg-gradient-to-tr from-slate-100 via-blue-50 to-white blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-8">
        {/* ===== 상단 Hero + 검색 폼 ===== */}
        <section className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:items-stretch">
          {/* 왼쪽: 화이트톤 + 패턴 + 텍스트 */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm sm:p-8">
            {/* 카드 안 배경 패턴 (연한 줄무늬 느낌) */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),transparent_55%),linear-gradient(to_bottom,_rgba(148,163,184,0.06),transparent)]" />

            <div className="relative z-10">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium tracking-[0.25em] text-slate-500">
                QUESTION · VIDEO ARCHIVE
              </p>

              <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[26px]">
                질문이 남는 순간,
                <br />
                <span className="text-slate-600">
                  같은 설명을 다시 볼 수 있게
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                수업 중 자주 나오는 질문들을{" "}
                <span className="font-medium text-slate-900">영상</span>으로
                정리해 둔 페이지입니다.
                <br />
                교재와 번호만 입력하면, 그때 들었던 설명을 한 번 더
                <span className="font-medium text-slate-900"> 그대로</span>{" "}
                확인할 수 있습니다.
              </p>

              <div className="mt-6 grid gap-3 text-[12px] text-slate-700 sm:grid-cols-3">
                <InfoChip
                  title="누적 질문 영상"
                  desc="자주 틀리는 문제를 중심으로 계속 추가"
                />
                <InfoChip
                  title="정렬 기준"
                  desc="교재 · 문제 번호 기준으로 연결"
                />
                <InfoChip
                  title="활용 타이밍"
                  desc="틀린 직후, 시험 전 정리용 복습"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 검색 폼 카드 */}
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
          >
            {/* 카드 안 배경에 아주 연한 그라데이션 */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-sky-50/40" />

            <div className="relative z-10">
              <h2 className="text-[16px] font-semibold sm:text-[17px]">
                질문 영상 검색
              </h2>
              <p className="mt-1 text-[12px] text-slate-500">
                교재와 문제 번호를 입력하면, 연결된 질문 영상을 찾습니다.
              </p>

              <div className="mt-5 space-y-3">
                <InputBlock
                  label="학생 이름"
                  hint="선택 입력"
                  required={false}
                >
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-400/60"
                    placeholder="예) 김지호"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </InputBlock>

                <InputBlock label="교재" required>
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-400/60"
                    placeholder="예) 고쟁이, 쎈, 자이스토리"
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                  />
                </InputBlock>

                <InputBlock label="문제 번호" required>
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-400/60"
                    placeholder="예) 120"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </InputBlock>
              </div>
            </div>

            <div className="relative z-10 mt-5 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "영상 찾는 중..." : "영상 찾기"}
              </button>
              <p className="text-[11px] text-slate-500">
                예) 교재: <span className="font-medium">고쟁이</span> / 번호:{" "}
                <span className="font-medium">120</span>
              </p>
            </div>
          </form>
        </section>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {errorMsg}
          </div>
        )}

        {/* 처음 안내 */}
        {!searched && !loading && !errorMsg && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-4 text-[13px] text-slate-600">
            교재와 번호를 입력하면, 아래에{" "}
            <span className="font-medium text-slate-900">
              큰 화면으로 해설 영상
            </span>
            이 재생됩니다.
            <br />
            번호가 맞는지, 노션 DB의 교재/번호와 일치하는지 먼저 확인해 주세요.
          </div>
        )}

        {/* ===== 메인 영상 섹션 ===== */}
        {selected && (
          <section className="mt-10">
            {/* 그라데이션 보더 + 화이트 카드 */}
            <div className="rounded-[26px] bg-gradient-to-r from-slate-100 via-sky-100/60 to-indigo-100/70 p-[1px] shadow-md">
              <div className="rounded-[24px] border border-slate-200 bg-white px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
                      선택된 질문 영상
                    </p>
                    <h2 className="text-[16px] font-semibold sm:text-[18px]">
                      {selected.title}
                    </h2>
                    <p className="mt-1 text-[12px] text-slate-500">
                      교재{" "}
                      <span className="font-medium text-slate-900">
                        {selected.book}
                      </span>{" "}
                      · 번호{" "}
                      <span className="font-medium text-slate-900">
                        {selected.number}
                      </span>
                      {studentName && (
                        <>
                          {" "}
                          · 조회 학생{" "}
                          <span className="font-medium text-slate-900">
                            {studentName}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      수업 복습
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      시험 전 정리
                    </span>
                  </div>
                </div>

                {/* 큰 영상 플레이어 */}
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  <div className="relative w-full pb-[56.25%]">
                    <iframe
                      src={`/embed?url=${encodeURIComponent(selected.url)}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* 하단 설명 3칸 */}
                <div className="mt-4 grid gap-3 text-[12px] text-slate-700 sm:grid-cols-3">
                  <MiniInfoCard
                    title="언제 보면 좋은가?"
                    body="틀린 직후, 그리고 시험 1~2일 전에 한 번 더 보는 것이 가장 효율적입니다."
                  />
                  <MiniInfoCard
                    title="집중 포인트"
                    body="풀이 과정 전체보다, 첫 판단과 선택이 어디서 갈렸는지에 집중해서 보세요."
                  />
                  <MiniInfoCard
                    title="원본 링크"
                    body={
                      <a
                        href={selected.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 underline underline-offset-2"
                      >
                        새 창에서 영상 열기
                      </a>
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== 관련 영상 리스트 ===== */}
        {searched && results.length > 1 && (
          <section className="mt-10">
            <h3 className="mb-3 text-[13px] font-semibold text-slate-700">
              같은 조건으로 등록된 다른 영상
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {results.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected(v)}
                  className={`group rounded-2xl border px-4 py-3 text-left text-[13px] transition ${
                    selected?.id === v.id
                      ? "border-slate-900 bg-slate-900/5"
                      : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <p className="line-clamp-2 font-medium text-slate-900">
                    {v.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {v.book} · {v.number}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 opacity-0 group-hover:opacity-100">
                    이 영상 보기 →
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 결과 없음 */}
        {searched && results.length === 0 && !loading && !errorMsg && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-[13px] text-slate-600">
            해당 교재 / 번호로 등록된 영상이 없습니다.
            <br />
            번호를 다시 확인하거나, 임경묵T에게 영상 등록을 요청해주세요.
          </div>
        )}
      </div>
    </main>
  );
}

/* ===== 작은 컴포넌트들 ===== */

function InfoChip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4">
      <p className="text-[11px] text-slate-500">{title}</p>
      <p className="mt-1 font-medium text-slate-800">{desc}</p>
    </div>
  );
}

function InputBlock({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 text-[12px]">
      <label className="flex items-center gap-1 text-slate-700">
        <span>{label}</span>
        {required && <span className="text-xs text-slate-500">*</span>}
        {hint && <span className="text-[11px] text-slate-400">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function MiniInfoCard({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-[11px] text-slate-500">{title}</p>
      <div className="mt-1 text-[12px] text-slate-700">{body}</div>
    </div>
  );
}
