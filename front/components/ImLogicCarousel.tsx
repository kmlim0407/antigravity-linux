"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

// 로컬 이미지가 없으면 placeholder URL 사용 (실제 교재는 public/images/imlogic/0.png~5.png 에 넣으면 자동 사용)
const IMAGES = [
  "/images/imlogic/0.png",
  "/images/imlogic/1.png",
  "/images/imlogic/2.png",
  "/images/imlogic/3.png",
  "/images/imlogic/4.png",
  "/images/imlogic/5.png",
];
// 로컬 파일 없을 때 fallback용 placeholder
const FALLBACK_IMAGES = [
  "https://picsum.photos/seed/imlogic0/500/700",
  "https://picsum.photos/seed/imlogic1/500/700",
  "https://picsum.photos/seed/imlogic2/500/700",
  "https://picsum.photos/seed/imlogic3/500/700",
  "https://picsum.photos/seed/imlogic4/500/700",
  "https://picsum.photos/seed/imlogic5/500/700",
];

// 이미지 로드 실패 시 사용할 플레이스홀더
const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect fill="%23222" width="400" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="16" font-family="sans-serif">이미지를 불러올 수 없습니다</text></svg>'
)}`;

export default function ImLogicCarousel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());
  const dragX = useMotionValue(0);

  const handleImageError = useCallback(() => {
    setFailedIndices((prev) => new Set(prev).add(index));
  }, [index]);

  useEffect(() => {
    if (open) setFailedIndices(new Set());
  }, [open]);

  const prev = useCallback(() => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % IMAGES.length), []);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (info.offset.x < -50 || info.velocity.x < -200) next();
      else if (info.offset.x > 50 || info.velocity.x > 200) prev();
      dragX.set(0);
    },
    [next, prev, dragX]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, prev, next]);

  return (
    <AnimatePresence>
      {open && (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="relative flex w-full max-w-4xl items-center gap-2 px-4 sm:gap-4" onClick={(e) => e.stopPropagation()}>
        {/* 웹에서만 버튼 표시, 모바일에서는 슬라이드만 */}
        <button
          type="button"
          onClick={prev}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white sm:flex sm:h-14 sm:w-14"
          aria-label="이전"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <motion.div
          className="relative flex min-h-[60vh] w-full min-w-0 flex-1 cursor-grab items-center justify-center overflow-hidden rounded-lg bg-black active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={(_, info) => dragX.set(info.offset.x)}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={failedIndices.has(index) ? FALLBACK_IMAGES[index] : IMAGES[index]}
                alt={`IM LOGIC 교재 ${index + 1}`}
                className="max-h-[65vh] max-w-full w-auto h-auto object-contain select-none"
                draggable={false}
                onError={handleImageError}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <button
          type="button"
          onClick={next}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white sm:flex sm:h-14 sm:w-14"
          aria-label="다음"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 6칸 표시 인디케이터 (크기 확대) */}
      <div
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2.5 sm:gap-3"
        role="tablist"
        aria-label="페이지 인디케이터"
      >
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 shrink-0 rounded-full transition-colors sm:h-4 sm:w-4 ${
              i === index ? "bg-white scale-110" : "bg-white/40"
            }`}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="닫기"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
