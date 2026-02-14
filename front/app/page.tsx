"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type NavCardInfo = {
  label: string;
  href: string;
  description: string;
};

const NAV_CARDS: NavCardInfo[] = [
  { label: "보강 예약", href: "/makeup", description: "시간대 선택 후 보강 예약" },
  { label: "질문 · 영상", href: "/qna", description: "교재·번호로 질문 영상 검색" },
  { label: "학생 관리", href: "/student-manage", description: "출석·오답·진도 관리" },
  { label: "학생용 안내", href: "/students", description: "수업·과제 안내" },
  { label: "학부모용 안내", href: "/parents", description: "운영·커리큘럼 안내" },
];

const INTRO_VIDEO_URL = "https://youtu.be/SLaBGKGeveo";

const MARQUEE_ITEMS = [
  "SMOOKTH'S MATH",
  "IM LOGIC",
  "STRUCTURED THINKING",
  "DATA-DRIVEN TEACHING",
  "QUESTION ARCHIVE",
];

// 카드별 그라데이션 (index 순환)
const CARD_GRADIENTS: string[] = [
  // 1번 카드: 블루톤
  "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.18), transparent 55%)",
  // 2번 카드: 퍼플/핑크
  "radial-gradient(circle at top left, rgba(168,85,247,0.20), transparent 55%), radial-gradient(circle at bottom right, rgba(236,72,153,0.18), transparent 55%)",
  // 3번 카드: 오렌지/골드
  "radial-gradient(circle at top left, rgba(251,146,60,0.22), transparent 55%), radial-gradient(circle at bottom right, rgba(234,179,8,0.18), transparent 55%)",
  // 4번 카드: 민트/에메랄드
  "radial-gradient(circle at top left, rgba(45,212,191,0.20), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.18), transparent 55%)",
  // 5번 카드: 인디고/스카이
  "radial-gradient(circle at top left, rgba(79,70,229,0.22), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.16), transparent 55%)",
];

export default function HomePage() {
  const [introDone, setIntroDone] = useState(false);

  // 예고편 종료 타이밍
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className="min-h-screen text-slate-900"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <motion.div
        className="relative min-h-screen overflow-hidden bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 1.03, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <IntroOverlay introDone={introDone} />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col space-y-10 px-4 py-10 sm:space-y-12 sm:px-6 md:px-8">
          <LogicLogo introDone={introDone} />
          <HeroSection introDone={introDone} />
          <IntroVideoSection introDone={introDone} />
          <NavGridSection introDone={introDone} />
        </div>
      </motion.div>
    </main>
  );
}

/* ================== 화이트톤 예고편 전체 덮개 ================== */

function IntroOverlay({ introDone }: { introDone: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(248,250,252,0.96), rgba(248,250,252,0.9))",
        backdropFilter: "blur(10px)",
      }}
      initial={{ opacity: 1, scale: 1, y: 0 }}
      animate={{
        opacity: introDone ? 0 : 1,
        scale: introDone ? 1.06 : 1,
        y: introDone ? -12 : 0,
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* 중앙에서 스쳐 지나가는 시네마틱 라이트 */}
      <motion.div
        className="absolute inset-y-0 left-[-30%] w-1/2 bg-gradient-to-r from-white/0 via-white/60 to-white/0"
        animate={{ x: ["-40%", "120%"] }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

/* ================== SMOOKTH'S 시네마틱 예고편 ================== */

function LogicLogo({ introDone }: { introDone: boolean }) {
  const marqueeText = MARQUEE_ITEMS.join("  ·  ");

  return (
    <motion.section
      className="relative z-20 flex flex-col items-center"
      initial={{ y: 0, scale: 1 }}
      animate={introDone ? { y: -80, scale: 0.9 } : { y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── 배경: 여러 위치에 빛 + 링 + 라인 ── */}
      <div className="pointer-events-none absolute inset-x-0 top-[-100px] bottom-[-100px]">
        {/* 라디얼 빛 1: 상단 왼쪽 */}
        <motion.div
          className="absolute -left-10 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/80 via-white to-indigo-100/80 blur-[60px]"
          animate={{
            y: [0, -16, 8, 0],
            opacity: [0.6, 1, 0.7, 0.9],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* 라디얼 빛 2: 중앙 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-slate-100 via-white to-indigo-100 blur-[80px]"
          animate={{
            scale: [1, 1.12, 0.96, 1],
            opacity: [0.7, 1, 0.8, 0.9],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* 라디얼 빛 3: 하단 오른쪽 */}
        <motion.div
          className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-200/70 via-white to-slate-200 blur-[60px]"
          animate={{
            y: [0, 12, -8, 0],
            opacity: [0.5, 0.95, 0.65, 0.85],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 회전 링 1 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-300/60"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        {/* 회전 링 2 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/80"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
        {/* 회전 링 3 (추가) */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-200/50"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* 세로 라인 */}
        <motion.div
          className="absolute left-[12%] top-[12%] h-[260px] w-[1px] bg-gradient-to-b from-slate-200/0 via-slate-400/90 to-slate-200/0"
          animate={{ y: [0, 20, -14, 0], opacity: [0.4, 1, 0.6, 0.9] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* 대각선 라인 1 */}
        <motion.div
          className="absolute right-[10%] bottom-[12%] h-[300px] w-[1px] bg-gradient-to-b from-slate-200/0 via-slate-400/90 to-slate-200/0 rotate-[-14deg]"
          animate={{ y: [0, -24, 16, 0], opacity: [0.5, 1, 0.65, 0.9] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* 대각선 라인 2 */}
        <motion.div
          className="absolute right-[32%] top-[8%] h-[240px] w-[1px] bg-gradient-to-b from-slate-200/0 via-slate-400/90 to-slate-200/0 rotate-[10deg]"
          animate={{ y: [0, 14, -18, 0], opacity: [0.45, 0.95, 0.55, 0.85] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 1단계: 네비 바로 밑 - be logical */}
      <motion.p
        className="relative mb-5 text-[13px] font-medium tracking-[0.4em] text-slate-500 sm:mb-6 sm:text-[15px] sm:tracking-[0.45em]"
        initial={{ opacity: 0, y: 28 }}
        animate={{
          opacity: [0, 1, 0.85],
          y: [28, 0, -8],
        }}
        transition={{ duration: 1.6 }}
      >
        be logical
      </motion.p>

      {/* 2단계: S / M / OO / K / TH / 'S */}
      <motion.div
        className="relative flex flex-col items-center gap-3 text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.95] }}
        transition={{ duration: 2.0, delay: 0.8 }}
      >
        <div className="flex gap-6 text-3xl font-semibold tracking-[0.6em] sm:gap-8 sm:text-4xl sm:tracking-[0.7em]">
          <motion.span
            animate={{
              x: [-90, -35, 4, -5, 0],
              y: [-12, 0, 6, -3, 0],
              rotate: [-8, 0, 3, 0],
            }}
            transition={{ duration: 2.0, delay: 0.8 }}
          >
            S
          </motion.span>
          <motion.span
            animate={{
              x: [90, 35, -4, 5, 0],
              y: [12, 0, -8, 3, 0],
              rotate: [8, 0, -3, 0],
            }}
            transition={{ duration: 2.0, delay: 0.85 }}
          >
            M
          </motion.span>
          <motion.span
            animate={{
              x: [80, 30, -5, 4, 0],
              y: [-10, 4, -6, 2, 0],
              rotate: [6, 0, -2, 0],
            }}
            transition={{ duration: 2.0, delay: 0.9 }}
          >
            OO
          </motion.span>
          <motion.span
            animate={{
              x: [-85, -30, 5, -4, 0],
              y: [14, -4, 7, -3, 0],
              rotate: [-7, 0, 2, 0],
            }}
            transition={{ duration: 2.0, delay: 0.95 }}
          >
            K
          </motion.span>
        </div>
        <div className="flex gap-8 text-2xl font-semibold tracking-[0.65em] sm:text-3xl sm:tracking-[0.75em]">
          <motion.span
            animate={{
              x: [100, 45, -5, 4, 0],
              y: [16, -5, 8, -4, 0],
              rotate: [10, 0, -4, 0],
            }}
            transition={{ duration: 2.0, delay: 1.0 }}
          >
            TH
          </motion.span>
          <motion.span
            animate={{
              x: [-95, -45, 5, -4, 0],
              y: [-16, 5, -8, 4, 0],
              rotate: [-10, 0, 4, 0],
            }}
            transition={{ duration: 2.0, delay: 1.05 }}
          >
            &apos;S
          </motion.span>
        </div>
      </motion.div>

      {/* 3단계: 중앙 BE LOGICAL (작은 글씨) + SMOOKTH'S (큰 글씨) */}
      <motion.div
        className="relative mt-8 text-center sm:mt-10"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: [0.85, 1.08, 1],
        }}
        transition={{ duration: 1.2, delay: 2.2 }}
      >
        {/* 글로우 / 플래시 효과 */}
        <motion.div
          className="pointer-events-none absolute inset-x-[-60px] top-1/2 h-32 -translate-y-1/2 bg-gradient-to-r from-white/0 via-white/80 to-white/0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: 2.4 }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/20 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.35], scale: [0.95, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.p
          className="relative mb-2 text-[13px] font-medium tracking-[0.4em] text-slate-500 sm:text-[15px] sm:tracking-[0.45em]"
          animate={{ opacity: [0, 1], y: [6, 0] }}
          transition={{ duration: 0.7, delay: 2.1 }}
        >
          be logical
        </motion.p>
        <motion.p
          className="
            relative
            bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400
            bg-clip-text
            text-[84px]
            font-bold
            tracking-[0.2em]
            text-transparent
            drop-shadow-[0_0_40px_rgba(148,163,184,0.3)]
            sm:text-[110px]
            md:text-[136px]
          "
          animate={{
            letterSpacing: ["0.28em", "0.18em", "0.24em"],
            y: [16, 0, -6, 0],
          }}
          transition={{ duration: 1.3, delay: 2.2 }}
        >
          SMOOKTH&apos;S
        </motion.p>
        <motion.p
          className="mt-4 text-[11px] font-medium tracking-[0.35em] text-slate-500 sm:text-[13px]"
          animate={{ opacity: [0, 1], y: [8, 0] }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          IM LOGIC · STRUCTURED THINKING
        </motion.p>
      </motion.div>

      {/* 하단 마키 */}
      <div className="relative mt-8 w-full max-w-2xl overflow-hidden rounded-full border border-slate-200 bg-white/90 shadow-[0_12px_36px_rgba(15,23,42,0.1)]">
        <motion.div
          className="flex gap-10 whitespace-nowrap px-8 py-3 text-[11px] font-medium tracking-[0.35em] text-slate-500 sm:text-[12px]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ================== 메인 HERO 섹션 ================== */

function HeroSection({ introDone }: { introDone: boolean }) {
  return (
    <motion.section
      className="relative z-10 overflow-hidden rounded-[32px] bg-white/94 px-6 py-10 shadow-[0_16px_40px_rgba(15,23,42,0.18)] sm:px-10 sm:py-12 md:px-16 md:py-14"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={
        introDone
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.98 }
      }
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-slate-100 via-white to-sky-50 blur-3xl" />
        <div className="absolute right-[-60px] top-20 h-80 w-80 rounded-full bg-gradient-to-tl from-sky-100 via-white to-slate-50 blur-3xl" />
        <div className="absolute bottom-[-70px] left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-100 via-white to-slate-50 blur-3xl" />
      </div>

      <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-slate-500">
            SMOOKTH&apos;S MATH · STRUCTURED PROGRAM
          </p>

          <motion.h1
            className="text-[32px] font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-[40px] md:text-[48px]"
            initial={{ opacity: 0, y: 18 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            생각은 부드럽게 
            <br />
            <span className="inline-block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
              판단은 날카롭게
            </span>
            
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-[13px] leading-relaxed text-slate-600 sm:text-[14px]"
            initial={{ opacity: 0, y: 14 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            내신→모의고사→수능 구조 수학. 오답·질문 데이터로 다음 수업 설계.
          </motion.p>

          <motion.div
            className="mt-5 flex flex-wrap gap-2 text-[11px] text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="rounded-full bg-slate-50 px-3 py-1">
              구조적 개념 설계
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1">
              데이터 기반 진단
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1">
              질문 아카이브
            </span>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <motion.div
            className="relative h-[220px] w-full max-w-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.18)]"
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.75, delay: 0.45 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/75 to-slate-900/25" />

            <motion.div
              className="relative z-10 flex h-full flex-col justify-between p-6"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-200">
                  SEA OF LOGIC
                </p>
                <h2 className="mt-2 text-[24px] font-semibold text-slate-50 sm:text-[26px]">
                  질문을 구조로 정리하는 엔진
                </h2>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-200/90">
                  오답·질문 데이터로 다음 수업 방향 설계 —{" "}
                  <span className="font-semibold text-slate-50">IM LOGIC</span>
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-200/90">
                <span>데이터 기반 수업 설계</span>
                <span className="rounded-full bg-slate-950/70 px-3 py-1 text-[10px] text-slate-100">
                  SMOOKTH&apos;S MATH
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ================== 1학기 소개영상 카드 ================== */

function IntroVideoSection({ introDone }: { introDone: boolean }) {
  return (
    <motion.section
      className="flex justify-end"
      initial={{ opacity: 0, x: 20 }}
      animate={
        introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
      }
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <a
        href={INTRO_VIDEO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full max-w-md items-center gap-5 rounded-2xl border border-slate-200/70 bg-white/95 px-6 py-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg sm:max-w-lg sm:gap-6 sm:px-8 sm:py-6"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 group-hover:bg-red-100 sm:h-16 sm:w-16">
          <svg
            className="h-7 w-7 sm:h-8 sm:w-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[17px] font-semibold text-slate-900 sm:text-[19px]">
            1학기 소개영상
          </h4>
          <p className="mt-1 text-[13px] text-slate-500 sm:text-[14px]">
            영상 보러가기 →
          </p>
        </div>
      </a>
    </motion.section>
  );
}

/* ================== NAV 카드 그리드 ================== */

function NavGridSection({ introDone }: { introDone: boolean }) {
  return (
    <section className="mb-4 mt-2 sm:mt-4">
      <motion.div
        className="mb-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-[15px] font-semibold text-slate-900 sm:text-[16px]">
          바로가기
        </h3>
      </motion.div>

      <div className="grid auto-rows-[160px] gap-4 sm:auto-rows-[190px] md:auto-rows-[210px] md:grid-cols-3">
        {NAV_CARDS.map((card, index) => (
          <NavCard
            key={card.href}
            card={card}
            index={index}
            introDone={introDone}
          />
        ))}
      </div>
    </section>
  );
}

function NavCard({
  card,
  index,
  introDone,
}: {
  card: NavCardInfo;
  index: number;
  introDone: boolean;
}) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.a
      href={card.href}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 px-5 py-5 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-xl sm:px-6 sm:py-6"
      style={{
        backgroundImage: gradient,
        backgroundBlendMode: "soft-light",
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.45, delay: 0.6 + index * 0.07 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500/80">
          {index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}
        </p>
        <h4 className="mt-2 text-[17px] font-semibold text-slate-900">
          {card.label}
        </h4>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-700">
          {card.description}
        </p>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between text-[12px] text-slate-600">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
          바로가기
        </span>
        <span>→</span>
      </div>
    </motion.a>
  );
}
