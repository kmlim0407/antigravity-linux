"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BOOKS, type BookKey, type SupType } from "@/lib/supplementary";

// ──────────────────────────────────────────
// 상수
// ──────────────────────────────────────────

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "smookth";

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
// 유형 카드
// ──────────────────────────────────────────

function TypeCard({
  type,
  bookMeta,
  onUpdated,
  onDeleted,
}: {
  type: SupType;
  bookMeta: (typeof BOOKS)[number];
  onUpdated: (updated: SupType) => void;
  onDeleted: (id: string) => void;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [showHandwritten, setShowHandwritten] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [editName, setEditName] = useState(type.name);
  const [editVideoUrl, setEditVideoUrl] = useState(type.videoUrl ?? "");
  const [editHandwrittenUrl, setEditHandwrittenUrl] = useState(
    type.handwrittenUrl ?? ""
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoId = extractYoutubeId(type.videoUrl ?? "");
  const editVideoId = extractYoutubeId(editVideoUrl);

  const handleSave = async () => {
    if (!editName.trim()) {
      setEditError("유형명을 입력해주세요.");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/supplementary/${type.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          videoUrl: editVideoUrl.trim(),
          handwrittenUrl: editHandwrittenUrl.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error ?? "수정 실패");
        return;
      }
      onUpdated({
        ...type,
        name: editName.trim(),
        videoUrl: editVideoUrl.trim(),
        handwrittenUrl: editHandwrittenUrl.trim(),
      });
      setEditing(false);
    } catch {
      setEditError("통신 오류");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setEditError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("typeId", type.id);
      const res = await fetch("/api/supplementary/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error ?? "업로드 실패");
        return;
      }
      setEditHandwrittenUrl(data.url);
    } catch {
      setEditError("업로드 통신 오류");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/supplementary/${type.id}?book=${encodeURIComponent(type.book)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onDeleted(type.id);
      }
    } catch {
      // 삭제 실패 시 상태 복원
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditName(type.name);
    setEditVideoUrl(type.videoUrl ?? "");
    setEditHandwrittenUrl(type.handwrittenUrl ?? "");
    setEditError("");
  };

  return (
    <>
      {showHandwritten && (type.handwrittenUrl || editHandwrittenUrl) && (
        <HandwrittenOverlay
          url={type.handwrittenUrl || editHandwrittenUrl}
          onClose={() => setShowHandwritten(false)}
        />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
        {/* 카드 헤더 */}
        <div className={`flex items-center gap-3 rounded-t-2xl px-4 py-3 ${bookMeta.bg}`}>
          <span className={`text-[13px] font-bold ${bookMeta.color}`}>
            {bookMeta.label}
          </span>
          <span className="flex-1 truncate text-[14px] font-semibold text-slate-900">
            {type.name}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setEditing((v) => !v);
                setConfirmDelete(false);
              }}
              className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-white/60"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition hover:bg-white/60 disabled:opacity-50 ${
                confirmDelete ? "text-red-600" : "text-slate-600"
              }`}
            >
              {deleting ? "삭제 중…" : confirmDelete ? "확인" : "삭제"}
            </button>
            {confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-500 transition hover:bg-white/60"
              >
                취소
              </button>
            )}
          </div>
        </div>

        {/* 카드 바디 */}
        <div className="px-4 py-4 space-y-3">
          {/* 영상 섹션 */}
          <div>
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

          {/* 인라인 편집 폼 */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[12px] font-semibold text-slate-700">
                    유형 수정
                  </p>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-600">
                      유형명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="예: 연립방정식 활용"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-600">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={editVideoUrl}
                      onChange={(e) => setEditVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                    {editVideoId && (
                      <p className="mt-1 text-[11px] text-emerald-600">
                        영상 ID 인식됨: {editVideoId}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-600">
                      손풀이 이미지
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editHandwrittenUrl}
                        onChange={(e) => setEditHandwrittenUrl(e.target.value)}
                        placeholder="이미지 URL 또는 파일 업로드"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:opacity-50"
                      >
                        {uploading ? "업로드…" : "파일"}
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                        e.target.value = "";
                      }}
                    />
                    {editHandwrittenUrl && (
                      <div className="mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editHandwrittenUrl}
                          alt="손풀이 미리보기"
                          className="h-24 w-full rounded-lg object-contain border border-slate-200 bg-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {editError && (
                    <p className="text-[12px] text-red-500">{editError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || uploading}
                      className="flex-1 rounded-xl bg-slate-900 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
                    >
                      {saving ? "저장 중…" : "저장"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={saving}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────
// 유형 추가 폼
// ──────────────────────────────────────────

function AddTypeForm({
  book,
  bookMeta,
  onAdded,
  onClose,
}: {
  book: BookKey;
  bookMeta: (typeof BOOKS)[number];
  onAdded: (type: SupType) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [handwrittenUrl, setHandwrittenUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tempIdRef = useRef<string>(Math.random().toString(36).slice(2, 14));

  const videoId = extractYoutubeId(videoUrl);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("typeId", tempIdRef.current);
      const res = await fetch("/api/supplementary/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "업로드 실패");
        return;
      }
      setHandwrittenUrl(data.url);
    } catch {
      setError("업로드 통신 오류");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("유형명을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/supplementary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book,
          name: name.trim(),
          videoUrl: videoUrl.trim(),
          handwrittenUrl: handwrittenUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "추가 실패");
        return;
      }
      onAdded(data as SupType);
      setName("");
      setVideoUrl("");
      setHandwrittenUrl("");
      onClose();
    } catch {
      setError("통신 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border ${bookMeta.bg} border-slate-200 p-5 shadow-sm`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-[14px] font-bold ${bookMeta.color}`}>
          {bookMeta.label} — 유형 추가
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/70"
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
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            유형명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 연립방정식 활용"
            maxLength={80}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            YouTube URL{" "}
            <span className="text-slate-400 font-normal">(선택)</span>
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtu.be/..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {videoId && (
            <p className="mt-1 text-[12px] text-emerald-600">
              영상 ID 인식됨: {videoId}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            손풀이 이미지{" "}
            <span className="text-slate-400 font-normal">(선택)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={handwrittenUrl}
              onChange={(e) => setHandwrittenUrl(e.target.value)}
              placeholder="이미지 URL 또는 파일 업로드"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:opacity-50"
            >
              {uploading ? "업로드…" : "파일"}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />
          {handwrittenUrl && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={handwrittenUrl}
                alt="손풀이 미리보기"
                className="h-24 w-full rounded-lg object-contain border border-slate-200 bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
        {error && <p className="text-[13px] text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting || uploading || !name.trim()}
          className="w-full rounded-xl bg-slate-900 py-3 text-[14px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
        >
          {submitting ? "추가 중…" : "유형 추가"}
        </button>
      </form>
    </motion.div>
  );
}

// ──────────────────────────────────────────
// 관리 콘텐츠 (인증 후)
// ──────────────────────────────────────────

function ManageContent() {
  const [activeBook, setActiveBook] = useState<BookKey>("올고");
  const [typesByBook, setTypesByBook] = useState<Partial<Record<BookKey, SupType[]>>>({});
  const [loadingBook, setLoadingBook] = useState<BookKey | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleAdded = (type: SupType) => {
    setTypesByBook((prev) => ({
      ...prev,
      [activeBook]: [...(prev[activeBook] ?? []), type],
    }));
  };

  const handleUpdated = (updated: SupType) => {
    setTypesByBook((prev) => ({
      ...prev,
      [activeBook]: (prev[activeBook] ?? []).map((t) =>
        t.id === updated.id ? updated : t
      ),
    }));
  };

  const handleDeleted = (id: string) => {
    setTypesByBook((prev) => ({
      ...prev,
      [activeBook]: (prev[activeBook] ?? []).filter((t) => t.id !== id),
    }));
  };

  return (
    <main
      className="min-h-screen bg-white px-3 py-8 sm:px-4 sm:py-12"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* 헤더 */}
        <header>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            부교재 관리
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
            올고·올유·올학·수신의 특수 유형과 풀이 영상, 손풀이를 관리합니다.
          </p>
        </header>

        {/* 탭 */}
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {BOOKS.map((book) => (
            <button
              key={book.key}
              type="button"
              onClick={() => {
                setActiveBook(book.key);
                setShowAddForm(false);
              }}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeBook}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-5"
          >
            {/* 유형 추가 버튼 / 폼 */}
            <div>
              <AnimatePresence mode="wait">
                {showAddForm ? (
                  <AddTypeForm
                    key="form"
                    book={activeBook}
                    bookMeta={bookMeta}
                    onAdded={handleAdded}
                    onClose={() => setShowAddForm(false)}
                  />
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-[13px] font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 sm:text-[14px]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className={bookMeta.color}>{bookMeta.label}</span>
                    유형 추가
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* 유형 목록 */}
            {isLoading ? (
              <LoadingDots />
            ) : currentTypes.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 py-14 text-center">
                <p className="text-[14px] text-slate-500">
                  등록된 유형이 없습니다.
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  위의 유형 추가 버튼을 눌러 첫 유형을 등록하세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {currentTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                    >
                      <TypeCard
                        type={type}
                        bookMeta={bookMeta}
                        onUpdated={handleUpdated}
                        onDeleted={handleDeleted}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 뒤로 가기 */}
        <Link
          href="/student-manage/supplementary"
          className="inline-block text-sm text-slate-500 underline"
        >
          ← 부교재
        </Link>
      </div>
    </main>
  );
}

// ──────────────────────────────────────────
// 페이지 루트 (인증 게이트 포함)
// ──────────────────────────────────────────

export default function SupplementaryManagePage() {
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
      <main
        className="flex min-h-screen items-center justify-center bg-white px-4"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <div className="w-full max-w-xs text-center">
          <h1 className="mb-6 text-xl font-bold text-slate-900">관리자 모드</h1>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="관리자 비밀번호"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-[15px] outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          {pinError && (
            <p className="mt-2 text-[13px] text-red-500">{pinError}</p>
          )}
          <button
            type="button"
            onClick={handleAuth}
            className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-[14px] font-semibold text-white transition hover:bg-slate-800"
          >
            입장
          </button>
          <Link
            href="/student-manage/supplementary"
            className="mt-4 inline-block text-sm text-slate-500 underline"
          >
            ← 부교재
          </Link>
        </div>
      </main>
    );
  }

  return <ManageContent />;
}
