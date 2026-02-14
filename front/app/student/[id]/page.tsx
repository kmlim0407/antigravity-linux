"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { findStudentById, type Student } from "@/lib/students";

type PageProps = {
  params: Promise<{ id: string }>;
};

const MON_ITEMS = ["과제", "교재 오답프린트", "과제오답"] as const;
const FRI_ITEMS = [
  "과제",
  "모의고사 오답프린트",
  "교재 오답프린트",
  "과제오답",
] as const;

type MonChecklist = Record<(typeof MON_ITEMS)[number], boolean>;
type FriChecklist = Record<(typeof FRI_ITEMS)[number], boolean>;

const initialMon: MonChecklist = {
  과제: false,
  "교재 오답프린트": false,
  과제오답: false,
};

const initialFri: FriChecklist = {
  과제: false,
  "모의고사 오답프린트": false,
  "교재 오답프린트": false,
  과제오답: false,
};

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function dateToKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 짧은 라벨 (캘린더 셀용)
const MON_SHORT = ["과제", "교재오답", "과제오답"] as const;
const FRI_SHORT = ["과제", "모의오답", "교재오답", "과제오답"] as const;

function DateCell({
  dateKey,
  studentId,
  isToday,
  dayOfWeek,
}: {
  dateKey: string;
  studentId: string;
  isToday: boolean;
  dayOfWeek: number;
}) {
  const storageKey = `achievement_${studentId}_${dateKey}`;

  const [monCheck, setMonCheck] = useState<Record<string, boolean>>({
    과제: false,
    교재오답: false,
    과제오답: false,
  });
  const [friCheck, setFriCheck] = useState<Record<string, boolean>>({
    과제: false,
    모의오답: false,
    교재오답: false,
    과제오답: false,
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/achievement?studentId=${encodeURIComponent(studentId)}&dateKey=${encodeURIComponent(dateKey)}`
      );
      const data = await res.json();
      if (res.ok && data) {
        if (data.mon) {
          setMonCheck({
            과제: data.mon.과제 ?? false,
            교재오답: data.mon["교재 오답프린트"] ?? false,
            과제오답: data.mon.과제오답 ?? false,
          });
        }
        if (data.fri) {
          setFriCheck({
            과제: data.fri.과제 ?? false,
            모의오답: data.fri["모의고사 오답프린트"] ?? false,
            교재오답: data.fri["교재 오답프린트"] ?? false,
            과제오답: data.fri.과제오답 ?? false,
          });
        }
      }
    } catch {
      // API 실패 시 localStorage 폴백
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { mon?: MonChecklist; fri?: FriChecklist };
          if (parsed.mon) {
            setMonCheck({
              과제: parsed.mon.과제 ?? false,
              교재오답: parsed.mon["교재 오답프린트"] ?? false,
              과제오답: parsed.mon.과제오답 ?? false,
            });
          }
          if (parsed.fri) {
            setFriCheck({
              과제: parsed.fri.과제 ?? false,
              모의오답: parsed.fri["모의고사 오답프린트"] ?? false,
              교재오답: parsed.fri["교재 오답프린트"] ?? false,
              과제오답: parsed.fri.과제오답 ?? false,
            });
          }
        } catch {}
      }
    }
  }, [studentId, dateKey, storageKey]);

  useEffect(() => {
    load();
  }, [load]);

  const saveToServer = async (mon: typeof monCheck, fri: typeof friCheck) => {
    const payload = {
      mon: { 과제: mon.과제, "교재 오답프린트": mon.교재오답, 과제오답: mon.과제오답 },
      fri: { 과제: fri.과제, "모의고사 오답프린트": fri.모의오답, "교재 오답프린트": fri.교재오답, 과제오답: fri.과제오답 },
    };
    try {
      const res = await fetch("/api/achievement", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, dateKey, ...payload }),
      });
      if (!res.ok) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, JSON.stringify(payload));
        }
      }
    } catch {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
      }
    }
  };

  const toggleMon = (k: string) => {
    setMonCheck((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      saveToServer(next, friCheck);
      return next;
    });
  };

  const toggleFri = (k: string) => {
    setFriCheck((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      saveToServer(monCheck, next);
      return next;
    });
  };

  const isMon = dayOfWeek === 1;
  const isFri = dayOfWeek === 5;
  const dayNum = parseInt(dateKey.split("-")[2] ?? "1", 10);

  return (
    <div
      className={`flex min-h-[100px] flex-col rounded-lg border p-1.5 sm:min-h-[160px] sm:rounded-xl sm:p-2.5 ${
        isToday ? "border-blue-400 bg-blue-50/50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-1 text-center sm:mb-1.5">
        <span className={`text-xs font-semibold sm:text-sm ${isToday ? "text-blue-600" : "text-slate-700"}`}>
          {dayNum}
        </span>
        <span className="ml-0.5 text-[9px] text-slate-400 sm:ml-1 sm:text-[10px]">
          {WEEKDAYS[dayOfWeek]}
        </span>
      </div>

      <div className="flex-1 space-y-0.5 overflow-auto sm:space-y-1">
        {isMon && (
          <div className="space-y-0.5">
            {MON_SHORT.map((label) => (
              <label
                key={label}
                className="flex min-h-[28px] cursor-pointer items-center gap-1.5 py-0.5 text-[10px] touch-manipulation sm:min-h-[24px] sm:text-[11px]"
              >
                <input
                  type="checkbox"
                  checked={monCheck[label] ?? false}
                  onChange={() => toggleMon(label)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 min-h-[20px] min-w-[20px] shrink-0 rounded border-slate-300 text-blue-600 touch-manipulation sm:h-3 sm:w-3 sm:min-h-[12px] sm:min-w-[12px]"
                />
                <span className="truncate">{label}</span>
              </label>
            ))}
          </div>
        )}
        {isFri && (
          <div className="space-y-0.5">
            {FRI_SHORT.map((label) => (
              <label
                key={label}
                className="flex min-h-[28px] cursor-pointer items-center gap-1.5 py-0.5 text-[10px] touch-manipulation sm:min-h-[24px] sm:text-[11px]"
              >
                <input
                  type="checkbox"
                  checked={friCheck[label] ?? false}
                  onChange={() => toggleFri(label)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 min-h-[20px] min-w-[20px] shrink-0 rounded border-slate-300 text-blue-600 touch-manipulation sm:h-3 sm:w-3 sm:min-h-[12px] sm:min-w-[12px]"
                />
                <span className="truncate">{label}</span>
              </label>
            ))}
          </div>
        )}
        {!isMon && !isFri && (
          <p className="py-1 text-[9px] text-slate-400 sm:text-[10px]">수업 없음</p>
        )}
      </div>
    </div>
  );
}

export default function StudentDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const student: Student | undefined = findStudentById(id);

  const [step, setStep] = useState<"password" | "form">("password");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  useEffect(() => {
    setCalendarMonth(new Date());
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === student?.password) {
      setStep("form");
      setError("");
    } else {
      setError("비밀번호 오류");
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

  const prevMonth = () => {
    setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  };

  const nextMonth = () => {
    setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1));
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const days: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(dateToKey(new Date(year, month, d)));
    }
    return days;
  };

  if (step === "password") {
    return (
      <div className="flex min-h-screen flex-col items-center px-4 py-6 pb-[env(safe-area-inset-bottom)] sm:py-8">
        <h1 className="mb-4 text-xl font-bold sm:text-2xl">{student.name}</h1>
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm rounded-2xl border bg-white px-4 py-6 shadow-sm"
        >
          <p className="mb-4 text-sm text-gray-700">
            개인 비밀번호를 입력하세요.
          </p>
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
            className="w-full rounded-lg border bg-blue-50 py-3 min-h-[44px] text-base font-semibold shadow-sm hover:bg-blue-100 active:bg-blue-200 touch-manipulation"
          >
            입장하기
          </button>
        </form>
        <button
          onClick={() => router.push("/student")}
          className="mt-4 py-3 px-4 text-sm text-gray-500 underline touch-manipulation min-h-[44px]"
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  const days = getCalendarDays();
  return (
      <div className="flex min-h-screen flex-col items-center px-2 py-4 pb-[env(safe-area-inset-bottom)] sm:px-4 sm:py-6">
        <h1 className="mb-1 text-xl font-bold sm:text-2xl">{student.name}</h1>
        <p className="mb-3 text-xs text-gray-500 text-center sm:mb-4 sm:text-sm">
          날짜 안에서 바로 체크하세요. 월·금만 수업 항목 표시됩니다.
        </p>

        <div className="w-full max-w-5xl overflow-x-auto rounded-2xl border bg-white px-3 py-4 shadow-sm sm:px-5 sm:py-5">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg px-3 py-2.5 min-h-[44px] min-w-[44px] text-sm hover:bg-slate-100 active:bg-slate-200 touch-manipulation"
            >
              ← 이전
            </button>
            <span className="text-base font-semibold sm:text-lg">
              {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg px-3 py-2.5 min-h-[44px] min-w-[44px] text-sm hover:bg-slate-100 active:bg-slate-200 touch-manipulation"
            >
              다음 →
            </button>
          </div>

          <div className="grid min-w-[280px] grid-cols-7 gap-1 sm:gap-2">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="py-1 text-center text-[10px] font-medium text-slate-500 sm:py-2 sm:text-sm"
              >
                {w}
              </div>
            ))}
            {days.map((key, i) => (
              <div key={i} className="min-w-0">
                {key ? (
                  <DateCell
                    dateKey={key}
                    studentId={id}
                    isToday={key === getTodayKey()}
                    dayOfWeek={(() => {
                      const [y, m, d] = key.split("-").map(Number);
                      return new Date(y, (m ?? 1) - 1, d ?? 1).getDay();
                    })()}
                  />
                ) : (
                  <div className="min-h-[100px] sm:min-h-[160px] rounded-lg sm:rounded-xl border border-slate-100 bg-slate-50/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/student")}
          className="mt-4 py-3 px-4 text-sm text-gray-500 underline touch-manipulation min-h-[44px] sm:mt-6"
        >
          ← 목록으로
        </button>
      </div>
    );
}
