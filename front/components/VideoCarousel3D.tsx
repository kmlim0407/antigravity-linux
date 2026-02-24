"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import YouTubePlayerCustomControls from "./YouTubePlayerCustomControls";

type VideoItem = { id: string; title: string; subtitle: string };

export default function VideoCarousel3D({ videos, variant = "horizontal" }: { videos: VideoItem[]; variant?: "horizontal" | "vertical" | "boxed" }) {
  const isVertical = variant === "vertical";
  const isBoxed = variant === "boxed";
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [expandDone, setExpandDone] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dragX = useMotionValue(0);

  const openFullscreen = () => {
    setExpandDone(false);
    setIsClosing(false);
    setFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsClosing(true);
  };

  const onExpandComplete = () => {
    if (!isClosing) setExpandDone(true);
  };

  const onShrinkComplete = () => {
    setFullscreenOpen(false);
    setIsClosing(false);
    setExpandDone(false);
  };

  const goTo = (delta: number) => {
    setDirection(delta);
    setActiveIndex((prev) => ((prev + delta + videos.length) % videos.length));
  };

  const video = videos[activeIndex];

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const threshold = 50;
    if (isVertical) {
      if (info.offset.y < -threshold || info.velocity.y < -300) goTo(1);
      else if (info.offset.y > threshold || info.velocity.y > 300) goTo(-1);
    } else {
      if (info.offset.x < -threshold || info.velocity.x < -300) goTo(1);
      else if (info.offset.x > threshold || info.velocity.x > 300) goTo(-1);
    }
    dragX.set(0);
  };

  const arrowUp = (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
  const arrowDown = (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
  const arrowLeft = (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
  const arrowRight = (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const navButtons = (
    <>
      <button
        type="button"
        onClick={() => goTo(-1)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white sm:h-12 sm:w-12"
        aria-label="이전 영상"
      >
        {isBoxed || (!isVertical && !isBoxed) ? arrowLeft : arrowUp}
      </button>
      <button
        type="button"
        onClick={() => goTo(1)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white sm:h-12 sm:w-12"
        aria-label="다음 영상"
      >
        {isBoxed || (!isVertical && !isBoxed) ? arrowRight : arrowDown}
      </button>
    </>
  );

  const fullscreenModal = (
    <AnimatePresence>
      {fullscreenOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={closeFullscreen}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 flex max-w-6xl flex-col overflow-hidden -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
            initial={{ width: 4, opacity: 0.7 }}
            animate={{ width: isClosing ? 4 : "90vw", opacity: isClosing ? 0 : 1 }}
            transition={{ duration: isClosing ? 0.3 : 0.55, ease: isClosing ? [0.4, 0, 0.6, 1] : [0.2, 0.6, 0.2, 1.02] }}
            onAnimationComplete={() => { if (isClosing) onShrinkComplete(); else onExpandComplete(); }}
          >
            {expandDone && !isClosing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.05 }}>
                <YouTubePlayerCustomControls videoId={videos[activeIndex].id} />
              </motion.div>
            )}
          </motion.div>
          <button type="button" onClick={closeFullscreen} className="absolute right-4 top-4 z-[101] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="닫기">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isBoxed) {
    return (
      <>
      <div className="flex w-full max-w-[min(100%,340px)] flex-col overflow-hidden rounded-xl bg-black shadow-2xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
        <div className="shrink-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 text-base font-semibold text-white sm:text-lg xl:text-xl 2xl:text-2xl xl:py-3" style={{ fontFamily: "var(--font-outfit)" }}>
          반별 수업영상
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 p-2 sm:gap-2 sm:p-3 xl:gap-3 xl:p-4 2xl:p-5">
          <motion.div
            className="relative flex w-full max-w-[200px] cursor-grab sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[400px] 2xl:max-w-[440px] items-center justify-center overflow-hidden rounded-lg aspect-square"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDrag={(_, info) => dragX.set(info.offset.x)}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full overflow-hidden rounded-lg aspect-square bg-slate-900"
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.src.includes("maxresdefault")) el.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 transition hover:bg-black/35"
                  aria-label="전체화면으로 보기"
                >
                  <span className="rounded-full border-2 border-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">Play</span>
                  <span className="text-base font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-lg md:text-xl xl:text-2xl 2xl:text-3xl">{video.title}</span>
                  {video.subtitle && (
                    <span className="max-w-[85%] text-center text-[10px] font-medium text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] sm:text-xs xl:text-sm 2xl:text-base">
                      {video.subtitle}
                    </span>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 py-2 sm:gap-1.5 sm:py-2.5 xl:gap-2 xl:py-3 2xl:py-4">
          <div className="flex items-center justify-center gap-2">{navButtons}</div>
          <span className="text-[11px] font-medium text-white/60 sm:text-xs xl:text-sm" aria-live="polite">
            {activeIndex + 1} / {videos.length}
          </span>
          <p className="text-[11px] font-medium text-white/70 sm:text-xs xl:text-sm">김현정수학-임경묵T에 매일 수업 영상이 업로드 됩니다.</p>
        </div>
      </div>
      {fullscreenModal}
      </>
    );
  }

  return (
    <div className={`relative flex w-full max-w-5xl items-center justify-between gap-4 px-2 sm:gap-6 sm:px-4 ${isVertical ? "flex-col" : ""}`}>
      <button
        type="button"
        onClick={() => goTo(-1)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:h-14 sm:w-14"
        aria-label="이전 영상"
      >
        {isVertical ? arrowUp : arrowLeft}
      </button>

      {/* 중앙: 영상 디스플레이 */}
      <motion.div
        className={`relative flex cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing ${
          isVertical
            ? "w-full max-w-[320px] aspect-square sm:max-w-[400px] md:max-w-[480px] lg:max-w-[520px]"
            : "w-full max-w-[360px] flex-1 sm:max-w-[440px] md:max-w-[520px] lg:max-w-[600px] xl:max-w-[680px]"
        }`}
        drag={isVertical ? "y" : "x"}
        dragConstraints={isVertical ? { top: 0, bottom: 0 } : { left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => dragX.set(isVertical ? info.offset.y : info.offset.x)}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            initial={{
              opacity: 0,
              ...(isVertical ? { y: direction > 0 ? 60 : -60 } : { x: direction > 0 ? 60 : -60 }),
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              ...(isVertical ? { y: direction > 0 ? -60 : 60 } : { x: direction > 0 ? -60 : 60 }),
            }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-900 shadow-2xl dark:border-slate-700 ${isVertical ? "aspect-square" : "aspect-video"}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src.includes("maxresdefault")) {
                  el.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                }
              }}
            />
            <button
              type="button"
              onClick={openFullscreen}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 transition hover:bg-black/35"
              aria-label="전체화면으로 보기"
            >
              <span
                className="rounded-full border-2 border-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-white transition group-hover:scale-105 sm:text-[14px] lg:text-[15px]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Play
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/80">
                {video.title}
              </span>
            </button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 비디오 모드: 클릭 시 확대 애니메이션 */}
      <AnimatePresence>
        {fullscreenOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={closeFullscreen}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 flex max-w-6xl flex-col overflow-hidden -translate-x-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
              initial={{ width: 4, opacity: 0.7 }}
              animate={{
                width: isClosing ? 4 : "90vw",
                opacity: isClosing ? 0 : 1,
              }}
              transition={{
                duration: isClosing ? 0.3 : 0.55,
                ease: isClosing ? [0.4, 0, 0.6, 1] : [0.2, 0.6, 0.2, 1.02],
              }}
              onAnimationComplete={() => {
                if (isClosing) onShrinkComplete();
                else onExpandComplete();
              }}
            >
              {expandDone && !isClosing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  <YouTubePlayerCustomControls videoId={videos[activeIndex].id} />
                </motion.div>
              )}
            </motion.div>
            <button
              type="button"
              onClick={closeFullscreen}
              className="absolute right-4 top-4 z-[101] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 하단/우측 화살표 */}
      <button
        type="button"
        onClick={() => goTo(1)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:h-14 sm:w-14"
        aria-label="다음 영상"
      >
        {isVertical ? arrowDown : arrowRight}
      </button>
    </div>
  );
}
