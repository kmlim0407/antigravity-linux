"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BookingStatus = "pending" | "confirmed" | "cancelled";

type Slot = {
  id: string;
  date: string;
  time: string;
  label?: string;
  maxBookings: number;
};

type Booking = {
  id: string;
  slotId: string;
  studentName: string;
  reason?: string;
  status: BookingStatus;
  createdAt: string;
  slot: Slot | null;
};

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "smookth";

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, m! - 1, d!);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${m}월 ${d}일 (${days[date.getDay()]})`;
}

const statusLabel: Record<BookingStatus, string> = {
  pending: "대기",
  confirmed: "확정",
  cancelled: "취소",
};

const statusStyle: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

// ──────────────────────────────────────────
// Main
// ──────────────────────────────────────────

export default function MakeupManagePage() {
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
          <h1 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">보강 관리</h1>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); setPinError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="관리자 비밀번호"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-[15px] outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
          />
          {pinError && <p className="mt-2 text-[13px] text-red-500">{pinError}</p>}
          <button
            type="button"
            onClick={handleAuth}
            className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-[14px] font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            입장
          </button>
        </div>
      </main>
    );
  }

  return <ManageDashboard />;
}

// ──────────────────────────────────────────
// Dashboard (인증 후)
// ──────────────────────────────────────────

function ManageDashboard() {
  const [tab, setTab] = useState<"bookings" | "slots">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/makeup/bookings?adminKey=${ADMIN_KEY}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    await fetch("/api/makeup/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status, adminKey: ADMIN_KEY }),
    });
    await fetchBookings();
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <main
      className="min-h-screen bg-white px-3 py-8 sm:px-4 sm:py-12 dark:bg-slate-900"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
            보강 관리
          </h1>
        </header>

        {/* 탭 */}
        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          {([["bookings", "예약 목록"], ["slots", "슬롯 추가"]] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition sm:text-[14px] ${
                tab === key
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              {label}
              {key === "bookings" && counts.pending > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {counts.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "bookings" ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* 필터 */}
              <div className="mb-4 flex flex-wrap gap-2">
                {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition sm:text-[13px] ${
                      filter === f
                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
                    }`}
                  >
                    {f === "all" ? "전체" : statusLabel[f]}
                    <span className="ml-1 text-[11px] opacity-70">({counts[f]})</span>
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <span className="inline-flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-[14px] text-slate-500 dark:text-slate-400">예약이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onUpdateStatus={updateStatus}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <AddSlotForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ──────────────────────────────────────────
// 구글 캘린더 링크 생성
// ──────────────────────────────────────────

function makeGCalLink(booking: Booking): string {
  if (!booking.slot) return "#";
  const [y, mo, d] = booking.slot.date.split("-");
  const [hh, mm] = booking.slot.time.split(":");
  const pad = (s: string) => s.padStart(2, "0");
  const start = `${y}${pad(mo!)}${pad(d!)}T${pad(hh!)}${pad(mm!)}00`;
  const startDate = new Date(Number(y), Number(mo) - 1, Number(d), Number(hh), Number(mm));
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  const end = `${endDate.getFullYear()}${pad(String(endDate.getMonth() + 1))}${pad(String(endDate.getDate()))}T${pad(String(endDate.getHours()))}${pad(String(endDate.getMinutes()))}00`;
  const details = booking.reason
    ? `학생: ${booking.studentName}\n이유: ${booking.reason}`
    : `학생: ${booking.studentName}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `보강: ${booking.studentName}`,
    dates: `${start}/${end}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ──────────────────────────────────────────
// 예약 카드
// ──────────────────────────────────────────

function BookingCard({
  booking,
  onUpdateStatus,
}: {
  booking: Booking;
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  const handle = async (status: BookingStatus) => {
    setUpdating(true);
    await onUpdateStatus(booking.id, status);
    setUpdating(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100 sm:text-[16px]">
              {booking.studentName}
            </span>
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${statusStyle[booking.status]}`}>
              {statusLabel[booking.status]}
            </span>
          </div>
          {booking.slot ? (
            <p className="mt-0.5 text-[13px] text-slate-600 dark:text-slate-400">
              {formatDate(booking.slot.date)} {booking.slot.time}
              {booking.slot.label && ` · ${booking.slot.label}`}
            </p>
          ) : (
            <p className="mt-0.5 text-[13px] text-slate-400">슬롯 정보 없음</p>
          )}
          {booking.reason && (
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              이유: {booking.reason}
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            신청 {new Date(booking.createdAt).toLocaleDateString("ko-KR")}
          </p>
          {booking.status === "confirmed" && booking.slot && (
            <a
              href={makeGCalLink(booking)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z"/>
              </svg>
              구글 캘린더에 추가
            </a>
          )}
        </div>

        {/* 액션 버튼 */}
        {booking.status !== "cancelled" && (
          <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
            {booking.status === "pending" && (
              <button
                type="button"
                onClick={() => handle("confirmed")}
                disabled={updating}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:text-[13px]"
              >
                확정
              </button>
            )}
            <button
              type="button"
              onClick={() => handle("cancelled")}
              disabled={updating}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 sm:text-[13px]"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 슬롯 추가 폼
// ──────────────────────────────────────────

function AddSlotForm() {
  const today = new Date().toISOString().split("T")[0]!;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [maxBookings, setMaxBookings] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/makeup/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey: ADMIN_KEY,
          date,
          time,
          label: label || undefined,
          maxBookings,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: "슬롯이 추가되었습니다" });
        setDate("");
        setTime("");
        setLabel("");
        setMaxBookings(1);
      } else {
        setResult({ ok: false, message: data.error ?? "추가 실패" });
      }
    } catch {
      setResult({ ok: false, message: "통신 오류" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-6 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
      <h2 className="mb-5 text-[15px] font-bold text-slate-900 dark:text-slate-100 sm:text-[16px]">
        보강 슬롯 추가
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-slate-700 dark:text-slate-300">
              날짜 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-slate-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-slate-700 dark:text-slate-300">
              시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-slate-700 dark:text-slate-300">
            설명 <span className="text-slate-400">(선택)</span>
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="예: 오후 보강, 시험대비 특강"
            maxLength={50}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-slate-700 dark:text-slate-300">
            최대 인원
          </label>
          <select
            value={maxBookings}
            onChange={(e) => setMaxBookings(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-slate-500"
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}명</option>
            ))}
          </select>
        </div>

        {result && (
          <p className={`text-[13px] ${result.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {result.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !date || !time}
          className="w-full rounded-xl bg-slate-900 py-3 text-[14px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {submitting ? "추가 중…" : "슬롯 추가"}
        </button>
      </form>
    </div>
  );
}
