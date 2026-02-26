"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Slot = {
  id: string;
  date: string;
  time: string;
  label?: string;
  available: boolean;
  bookedCount: number;
  maxBookings: number;
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, m! - 1, d!);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${m}월 ${d}일 (${days[date.getDay()]})`;
}

type Step = "select" | "form" | "done";

export default function MakeupPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/makeup/slots")
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (slot: Slot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep("form");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/makeup/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          studentName: name.trim(),
          reason: reason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "예약 실패. 다시 시도해주세요.");
        return;
      }
      setStep("done");
    } catch {
      setError("통신 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 날짜별 그룹핑
  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    (acc[slot.date] ??= []).push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <main
      className="min-h-screen bg-white px-3 py-8 sm:px-4 sm:py-12 lg:py-16 xl:py-20 dark:bg-slate-900"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        {/* 헤더 */}
        <header className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
              보강관리
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[14px]">
              원하는 날짜와 시간을 선택해 신청하면 선생님이 확인 후 안내드립니다.
            </p>
          </div>
          <Link
            href="/student-manage/makeup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title="관리자 설정"
            aria-label="관리자 설정"
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

        <AnimatePresence mode="wait">
          {/* STEP 1: 슬롯 선택 */}
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <span className="inline-flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              ) : sortedDates.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300">
                    현재 예약 가능한 시간이 없습니다
                  </p>
                  <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                    선생님께 보강 일정을 문의해 주세요
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 sm:text-xs">
                        {formatDate(date)}
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {grouped[date]!.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSelect(slot)}
                            disabled={!slot.available}
                            className={`group relative flex flex-col items-center justify-center rounded-xl border px-4 py-4 text-center transition sm:py-5 ${
                              slot.available
                                ? "cursor-pointer border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                                : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-800/50"
                            }`}
                          >
                            <span className="text-[18px] font-bold tabular-nums text-slate-900 dark:text-slate-100 sm:text-[20px]">
                              {slot.time}
                            </span>
                            {slot.label && (
                              <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                {slot.label}
                              </span>
                            )}
                            <span
                              className={`mt-1.5 text-[10px] font-medium sm:text-[11px] ${
                                slot.available
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {slot.available ? "예약 가능" : "마감"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: 이름 입력 */}
          {step === "form" && selectedSlot && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={() => { setStep("select"); setError(""); }}
                className="mb-6 flex items-center gap-1.5 text-[13px] text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                다른 시간 선택
              </button>

              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                  선택한 시간
                </p>
                <p className="mt-1 text-[17px] font-bold text-slate-900 dark:text-slate-100 sm:text-[18px]">
                  {formatDate(selectedSlot.date)} {selectedSlot.time}
                </p>
                {selectedSlot.label && (
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">{selectedSlot.label}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="본인 이름 입력"
                    maxLength={20}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                    보강 이유 <span className="text-slate-400 text-[12px]">(선택)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="예: 결석, 특정 단원 복습 등"
                    maxLength={200}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                  />
                </div>

                {error && (
                  <p className="text-[13px] text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="w-full rounded-xl bg-slate-900 py-3.5 text-[15px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  {submitting ? "예약 중…" : "예약 신청"}
                </button>

                <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                  신청 후 선생님 확정 시 개별 안내드립니다
                </p>
              </form>
            </motion.div>
          )}

          {/* STEP 3: 완료 */}
          {step === "done" && selectedSlot && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center py-16 text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[20px] font-bold text-slate-900 dark:text-slate-100 sm:text-[22px]">
                예약 신청 완료
              </h2>
              <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
                {formatDate(selectedSlot.date)} {selectedSlot.time}
              </p>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                선생님이 확인 후 확정 안내를 드립니다.
                <br />
                당일 취소는 자제해 주세요.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("select");
                  setSelectedSlot(null);
                  setName("");
                  setReason("");
                }}
                className="mt-8 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                처음으로
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
