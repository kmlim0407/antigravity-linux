"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactModalTrigger } from "@/components/ContactModal";
import YouTubePlayerCustomControls from "@/components/YouTubePlayerCustomControls";
import VideoCarousel3D from "@/components/VideoCarousel3D";
import ImLogicCarousel from "@/components/ImLogicCarousel";
import { useSmoothSnapScroll } from "@/hooks/useSmoothSnapScroll";

type ChatMessage = { role: "user" | "model"; content: string };

function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", content: "안녕하세요! SMOOKTH에 대해 궁금한 점을 편하게 물어보세요." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "model", content: res.ok ? data.text : (data.error || "오류가 발생했습니다.") }]);
    } catch {
      setMessages((m) => [...m, { role: "model", content: "통신 오류가 발생했습니다." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="snap-section relative flex w-full flex-col items-center justify-center bg-white px-4 py-6 sm:px-8 sm:py-10">
      <div className="w-full max-w-xl">

        {/* 헤더 */}
        <div className="mb-4">
          <h2
            className="text-[20px] font-bold tracking-[-0.02em] text-slate-900 sm:text-[26px]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Ask anything.
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-400 sm:text-[13px]">
            수업, 상담, 교재 — 무엇이든 바로 답해드립니다.
          </p>
        </div>

        {/* 채팅 컨테이너 */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* 대화창 */}
          <div
            ref={scrollRef}
            className="overflow-y-auto bg-slate-50 p-4"
            style={{ height: "clamp(240px, calc(100dvh - var(--nav-height) - 14rem), 420px)" }}
          >
            <div className="space-y-2.5">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "model" && (
                    <div className="mb-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[9px] font-bold text-white">
                      S
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2 text-[13px] leading-[1.6] ${
                      m.role === "user"
                        ? "rounded-br-sm bg-slate-900 text-white"
                        : "rounded-bl-sm bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/80"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-[13px]">{m.content}</pre>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="mb-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[9px] font-bold text-white">
                    S
                  </div>
                  <div className="rounded-xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200/80">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 입력창 */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요"
              disabled={loading}
              className="flex-1 bg-transparent py-1 text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-black disabled:opacity-30"
              aria-label="전송"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// 유튜브 영상 ID만 넣기 (예: watch?v=abc123 → abc123)
const YOUTUBE_VIDEO_ID = "SLaBGKGeveo";
// 유튜브 채널 URL (채널 페이지 링크)
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@user";

const PLAYLIST_VIDEOS = [
  { id: "lrqH3Jv88x0", title: "고1 S1반 수업 영상", subtitle: "대치동 내신 변별력, 컴팩트한 심화수업" },
  { id: "9C-NCcWhbK8", title: "고1 B3반 수업 영상", subtitle: "기초부터 심화까지" },
  { id: "r0sUTFws8No", title: "미적분 1 기본+심화 특강", subtitle: "정의 → 그래프 → 문제 적용" },
];

export default function HomePage() {
  useSmoothSnapScroll();

  const [videoFullscreenOpen, setVideoFullscreenOpen] = useState(false);
  const [expandDone, setExpandDone] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imLogicOpen, setImLogicOpen] = useState(false);

  const openFullscreen = () => {
    setExpandDone(false);
    setIsClosing(false);
    setVideoFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsClosing(true);
  };

  const onExpandComplete = () => {
    if (!isClosing) setExpandDone(true);
  };

  const onShrinkComplete = () => {
    setVideoFullscreenOpen(false);
    setIsClosing(false);
    setExpandDone(false);
  };

  return (
    <div
      className="snap-scroll-container w-full text-slate-900"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {/* 1. 대표문구 ~ 상담문의 */}
      <section
        className="snap-section relative flex w-full items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-6xl px-3 py-3 sm:px-4 sm:py-8 lg:px-12 lg:py-12 xl:max-w-7xl xl:px-20 xl:py-16 2xl:max-w-[90rem] 2xl:px-24 2xl:py-20">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:gap-5 lg:gap-6 xl:gap-10 2xl:gap-12">
            <p className="flex flex-col items-center gap-1.5 text-slate-900 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-8 lg:whitespace-nowrap text-[20px] font-bold leading-tight sm:text-[44px] md:text-[52px] lg:text-[72px] xl:text-[90px] 2xl:text-[100px]">
              <span className="tracking-[0.03em] lg:justify-self-end">BE LOGICAL</span>
              <span className="font-bold text-slate-700 lg:justify-self-center" style={{ fontFamily: "Georgia, 'Noto Serif KR', serif" }}>∩</span>
              <span className="tracking-[0.03em] lg:justify-self-start">BE TACTICAL</span>
            </p>
            <p className="max-w-2xl text-[13px] leading-relaxed text-slate-600 sm:text-[14px] md:text-[15px] lg:text-[17px] xl:text-[19px] 2xl:text-[20px]">
              <span className="block">논리적인 이해 × 전략적인 훈련.</span>
              <span className="hidden sm:block">직접 만든 교재(IM LOGIC), 오답 데이터로 설계하는 수업입니다.</span>
              <span className="mt-1 block font-semibold text-slate-700">SMOOKTH와 함께합니다.</span>
            </p>
            <div id="contact" className="flex flex-wrap justify-center gap-2 pt-1 lg:gap-4 lg:pt-2 xl:gap-5 xl:pt-3">
              <ContactModalTrigger className="inline-flex min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[13px] font-medium text-slate-700 transition active:bg-slate-50 sm:text-[14px] lg:px-6 lg:py-3 lg:text-[16px] xl:px-8 xl:py-4 xl:text-[17px] 2xl:px-10 2xl:py-4 2xl:text-[18px]">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                상담문의
              </ContactModalTrigger>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 영상 — OT 섹션 */}
      <section className="snap-section relative flex w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-white">
        <div className="relative z-10 flex w-full flex-1 min-h-0 flex-col items-center justify-center gap-3 p-3 sm:gap-6 sm:p-5 md:gap-6 md:p-6 lg:gap-8 lg:px-8 lg:py-8 xl:gap-10 xl:px-12 xl:py-12 2xl:gap-12 2xl:px-16 2xl:py-14">
          {/* 1. Editorial 헤드라인 */}
          <div className="flex w-full flex-col items-center text-center">
            <h2
              className="text-[28px] font-bold leading-[1.05] tracking-[-0.02em] text-slate-900 sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[110px] 2xl:text-[120px]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              OT
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-snug text-slate-600 sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
              <span className="block">묵T만의 수업을 A부터 Z까지 투명하게 보여드립니다.</span>
              <span className="hidden sm:block">수업시간표, 개별교재, 그리고 이 사이트까지.</span>
              <span className="hidden sm:block mt-0.5 font-medium text-slate-700">2026 1학기 OT에서 만나보실 수 있습니다.</span>
            </p>
          </div>

          {/* 2. 비디오 */}
          <div className="flex w-full max-w-[280px] flex-col items-center gap-2 sm:max-w-[360px] sm:gap-4 md:max-w-[520px] lg:max-w-[560px] xl:max-w-[640px] 2xl:max-w-[720px]">
          <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 shadow-2xl aspect-video sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px] xl:max-w-[640px] 2xl:max-w-[720px]">
            {!YOUTUBE_VIDEO_ID ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                page.tsx에서 YOUTUBE_VIDEO_ID에 영상 ID 입력
              </div>
            ) : (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&start=0&end=60`}
                  title="2026학년도 1학기 OT"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 transition hover:bg-black/35"
                  aria-label="전체화면으로 보기"
                >
                  <span
                    className="rounded-full border-2 border-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-white transition group-hover:scale-105 sm:text-[14px] lg:text-[15px] xl:text-[16px]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Play
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/80">
                    2026 1학기 OT
                  </span>
                </button>
              </>
            )}
          </div>

          <div
            className="w-full min-w-0 shrink-0 max-w-md mx-auto overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-sm sm:px-4 sm:max-w-md lg:px-4 lg:py-2.5 xl:max-w-lg xl:px-5 xl:py-3 2xl:px-6 2xl:py-3.5"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <div className="space-y-1 text-[13px] sm:text-[14px] xl:text-[15px] 2xl:text-[16px] lg:space-y-1.5 xl:space-y-2">
              <div className="flex min-w-0 items-center justify-between gap-2 border-b border-slate-100 py-1 last:border-0 lg:gap-3 lg:py-1.5">
                <span className="font-medium text-slate-800">고1 S1반</span>
                <span className="shrink-0 text-slate-600">월·금 17:30–22:00</span>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2 border-b border-slate-100 py-1 last:border-0 lg:gap-3 lg:py-1.5">
                <span className="font-medium text-slate-800">고1 A2반</span>
                <span className="min-w-0 max-w-[45%] truncate text-right text-[11px] text-slate-600 sm:max-w-none sm:text-[13px]" title="수 17:30–22:00 / 토 09:00–13:30">수 17:30–22:00 / 토 09:00–13:30</span>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2 py-1 lg:gap-3 lg:py-1.5">
                <span className="font-medium text-slate-800">중3 상심화반</span>
                <span className="shrink-0 text-slate-600">화·목 17:00–22:00</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setImLogicOpen(true)}
              className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg sm:min-h-[44px] sm:gap-2 sm:rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[14px] font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:shadow sm:text-[15px] lg:px-6 lg:py-3 lg:text-[16px] xl:text-[17px] 2xl:text-[18px]"
            >
              IM LOGIC 구경하기
            </button>
            <a
              href="#playlist"
              className="group/btn inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg sm:min-h-[44px] sm:gap-2 sm:rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[14px] font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:shadow sm:text-[15px] lg:px-6 lg:py-3 lg:text-[16px] xl:text-[17px] 2xl:text-[18px]"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              반별 수업영상
              <motion.span
              className="shrink-0 text-slate-500"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.span>
          </a>
          </div>
          </div>

        <ImLogicCarousel open={imLogicOpen} onClose={() => setImLogicOpen(false)} />

        {/* 시어터 모드: TV 켜지는 듯한 애니메이션 */}
        <AnimatePresence>
          {videoFullscreenOpen && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={closeFullscreen}
            >
              <motion.div
                className="absolute left-1/2 top-1/2 flex max-w-6xl flex-col overflow-hidden bg-black -translate-x-1/2 -translate-y-1/2"
                onClick={(e) => e.stopPropagation()}
                initial={{ width: 4, opacity: 0.7 }}
                animate={{
                  width: isClosing ? 4 : "90vw",
                  opacity: isClosing ? 0 : 1,
                }}
                transition={{
                  duration: isClosing ? 0.3 : 0.65,
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
                    <YouTubePlayerCustomControls videoId={YOUTUBE_VIDEO_ID} />
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
        </div>
      </section>

      {/* 3. 반별 수업영상 플레이리스트 */}
      <section id="playlist" className="snap-section relative flex min-h-screen w-full flex-col overflow-hidden bg-white">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-6 sm:py-10 lg:py-24 xl:py-32 2xl:py-36">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-slate-500 sm:text-sm xl:text-base 2xl:text-lg">
            수업 영상 둘러보기
          </p>
          <VideoCarousel3D videos={PLAYLIST_VIDEOS} variant="boxed" />
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex sm:mt-6 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:text-[14px] xl:px-6 xl:py-3 xl:text-[15px] 2xl:text-[16px]"
          >
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            유튜브 채널에서 더 보기
          </a>
        </div>
      </section>

      {/* 4. 상담 섹션 */}
      <section id="contact-section" className="snap-section relative flex w-full flex-col items-center justify-center overflow-hidden bg-white">
        <div className="relative z-10 w-full max-w-3xl px-4 py-12 sm:py-16 lg:py-20 xl:py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl xl:text-5xl mb-6 sm:mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
            상담 · 문의
          </h2>
          <ul className="space-y-3 sm:space-y-4 text-[14px] sm:text-[15px] lg:text-[16px] xl:text-[17px] text-slate-700 mb-8 sm:mb-10">
            <li className="flex items-center justify-center gap-2">
              <span className="text-slate-400">·</span>
              <span>수업을 <strong className="text-slate-900">투명하게</strong> 보여드립니다. OT, 영상, 교재까지.</span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-slate-400">·</span>
              <span><strong className="text-slate-900">모든 학생</strong>이 수업 가능합니다. 기초부터 심화까지.</span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-slate-400">·</span>
              <span>현재 성적·목표에 맞춘 <strong className="text-slate-900">맞춤 상담</strong>을 드립니다.</span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="text-slate-400">·</span>
              <span>궁금한 점이 있으시면 언제든 <strong className="text-slate-900">문의</strong>해 주세요.</span>
            </li>
          </ul>
          <ContactModalTrigger className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-black hover:border-black sm:text-[16px] lg:text-[17px]">
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            상담 문의하기
          </ContactModalTrigger>
        </div>
      </section>

      {/* 5. 챗봇 섹션 */}
      <ChatSection />
    </div>
  );
}
