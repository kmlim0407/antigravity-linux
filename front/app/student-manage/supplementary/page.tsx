"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BOOKS, type BookKey, type SupType } from "@/lib/supplementary";

// ──────────────────────────────────────────
// 유틸
// ──────────────────────────────────────────

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ──────────────────────────────────────────
// 로딩 스피너
// ──────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex justify-center py-16">
      <span className="inline-flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-slate-300"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  );
}

// ──────────────────────────────────────────
// 손풀이 전체화면 오버레이
// ──────────────────────────────────────────

function HandwrittenOverlay({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[90vh] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="손풀이"
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-100"
            aria-label="닫기"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────
// 유형 상세 모달
// ──────────────────────────────────────────

function TypeDetailModal({
  type,
  bookMeta,
  onClose,
}: {
  type: SupType;
  bookMeta: (typeof BOOKS)[number];
  onClose: () => void;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [showHandwritten, setShowHandwritten] = useState(false);

  const videoId = extractYoutubeId(type.videoUrl ?? "");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {showHandwritten && type.handwrittenUrl && (
        <HandwrittenOverlay
          url={type.handwrittenUrl}
          onClose={() => setShowHandwritten(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className={`mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 ${bookMeta.bg}`}>
            <span className={`shrink-0 text-[12px] font-bold ${bookMeta.color}`}>
              {bookMeta.label}
            </span>
            <span className="flex-1 text-[15px] font-semibold text-slate-900">
              {type.name}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/70"
              aria-label="닫기"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 영상 섹션 */}
          <div className="mb-3">
            {videoId ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowVideo((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-red-500 shrink-0"
                    aria-hidden
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  {showVideo ? "영상 닫기" : "영상 보기"}
                </button>
                <AnimatePresence>
                  {showVideo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 overflow-hidden rounded-xl"
                    >
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full rounded-xl border-0"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <span className="text-[12px] text-slate-400">영상 없음</span>
            )}
          </div>

          {/* 손풀이 섹션 */}
          <div>
            {type.handwrittenUrl ? (
              <button
                type="button"
                onClick={() => setShowHandwritten(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                손풀이 보기
              </button>
            ) : (
              <span className="text-[12px] text-slate-400">손풀이 없음</span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ──────────────────────────────────────────
// 메인 페이지
// ──────────────────────────────────────────

export default function SupplementaryPage() {
  const [activeBook, setActiveBook] = useState<BookKey>("올고");
  const [typesByBook, setTypesByBook] = useState<Partial<Record<BookKey, SupType[]>>>({});
  const [loadingBook, setLoadingBook] = useState<BookKey | null>(null);
  const [selectedType, setSelectedType] = useState<SupType | null>(null);
  const loadedRef = useRef<Set<BookKey>>(new Set());

  const bookMeta = BOOKS.find((b) => b.key === activeBook)!;

  const loadTypes = useCallback(async (book: BookKey) => {
    setLoadingBook(book);
    try {
      const res = await fetch(`/api/supplementary?book=${encodeURIComponent(book)}`);
      const data = await res.json();
      setTypesByBook((prev) => ({ ...prev, [book]: Array.isArray(data) ? data : [] }));
      loadedRef.current.add(book);
    } catch {
      setTypesByBook((prev) => ({ ...prev, [book]: [] }));
    } finally {
      setLoadingBook(null);
    }
  }, []);

  useEffect(() => {
    if (!loadedRef.current.has(activeBook)) {
      loadTypes(activeBook);
    }
  }, [activeBook, loadTypes]);

  const currentTypes = typesByBook[activeBook] ?? [];
  const isLoading = loadingBook === activeBook;

  return (
    <main
      className="min-h-screen bg-white px-3 py-8 sm:px-4 sm:py-12"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* 헤더 */}
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            부교재
          </h1>
          <Link
            href="/student-manage/supplementary/manage"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="관리자 모드"
            aria-label="관리자 모드"
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

        {/* 탭 */}
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {BOOKS.map((book) => (
            <button
              key={book.key}
              type="button"
              onClick={() => setActiveBook(book.key)}
              className={`flex flex-1 items-center justify-center rounded-lg py-2.5 text-[13px] font-semibold transition sm:text-[14px] ${
                activeBook === book.key
                  ? `bg-white shadow-sm ${book.color}`
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {book.label}
            </button>
          ))}
        </div>

        {/* 유형 목록 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBook}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {isLoading ? (
              <LoadingDots />
            ) : currentTypes.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 py-14 text-center">
                <p className="text-[14px] text-slate-500">등록된 유형이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {currentTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedType(type)}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
                    >
                      <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold ${bookMeta.bg} ${bookMeta.color}`}>
                        {bookMeta.label}
                      </span>
                      <span className="flex-1 truncate text-[14px] font-medium text-slate-900">
                        {type.name}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 뒤로 가기 */}
        <Link
          href="/student-manage"
          className="inline-block text-sm text-slate-500 underline"
        >
          ← 학생관리
        </Link>
      </div>

      {/* 유형 상세 모달 */}
      <AnimatePresence>
        {selectedType && (
          <TypeDetailModal
            type={selectedType}
            bookMeta={BOOKS.find((b) => b.key === selectedType.book)!}
            onClose={() => setSelectedType(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
