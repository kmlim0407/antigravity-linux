"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["A", "B", "C", "D", "E"];
const SMOOKTH_MS = 500;
const COLON_TO_ROULETTE_MS = 500;
const ROULETTE_SPIN_MS = 2400;
const ROULETTE_INTERVAL_MS = 140;
const SHOW_A_MS = 1000;
const FADE_OUT_LETTERS_MS = 600;
const REARRANGE_TO_MATH_MS = 700;
const SHOW_MATH_BEFORE_WITH_MS = 600;
const SHOW_WITH_SMOOKTH_MS = 3000;
const FADE_OUT_MS = 400;

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const SMOOKTH_LETTERS = ["S", "M", "O", "O", "K", "T", "H"];
const KEEP_INDICES = [1, 5, 6]; // M, T, H in SMOOKTH

export default function IntroAnimation() {
  const [phase, setPhase] = useState<"smookth" | "colon" | "roulette" | "done" | "fadeToMath" | "math" | "withSmookth">("smookth");
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("colon"), SMOOKTH_MS);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "colon") return;
    const t2 = setTimeout(() => setPhase("roulette"), COLON_TO_ROULETTE_MS);
    return () => clearTimeout(t2);
  }, [phase]);

  useEffect(() => {
    if (phase !== "roulette") return;
    const interval = setInterval(
      () => setRouletteIndex((i) => (i + 1) % LETTERS.length),
      ROULETTE_INTERVAL_MS
    );
    const stop = setTimeout(() => {
      clearInterval(interval);
      setRouletteIndex(0);
      setPhase("done");
    }, ROULETTE_SPIN_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase("fadeToMath"), SHOW_A_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fadeToMath") return;
    const t = setTimeout(() => setPhase("math"), FADE_OUT_LETTERS_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "math") return;
    const t = setTimeout(() => setPhase("withSmookth"), SHOW_MATH_BEFORE_WITH_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "withSmookth") return;
    const t1 = setTimeout(() => setShowing(false), SHOW_WITH_SMOOKTH_MS);
    const t2 = setTimeout(() => setVisible(false), SHOW_WITH_SMOOKTH_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  if (!visible) return null;

  const showFaded = phase === "fadeToMath" || phase === "math";
  const showMathOnly = phase === "math" || phase === "withSmookth";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-300 ${showing ? "opacity-100" : "opacity-0"}`}
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="flex w-full justify-center items-baseline gap-2 text-5xl font-medium uppercase tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl">
        {/* 1~2단계: SMOOKTH만 또는 SMOOKTH + : */}
        {phase === "smookth" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            SMOOKTH
          </motion.span>
        )}

        {/* 3단계~: SMOOKTH 글자별 (done부터 페이드아웃 대상 제어) */}
        {(phase === "colon" || phase === "roulette" || phase === "done" || phase === "fadeToMath") && !showMathOnly && (
          <>
            <span className="inline-flex items-baseline gap-0">
              {SMOOKTH_LETTERS.map((letter, i) => (
                <motion.span
                  key={`smookth-${i}-${letter}`}
                  layout
                  layoutId={KEEP_INDICES.includes(i) ? letter : undefined}
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: showFaded && !KEEP_INDICES.includes(i) ? 0 : 1,
                  }}
                  transition={{ duration: FADE_OUT_LETTERS_MS / 1000, ease: EASE }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            {/* H와 : 사이 공백은 애초부터 있음 */}
            {(phase === "colon" || phase === "roulette" || phase === "done" || phase === "fadeToMath") && <span> </span>}
            <AnimatePresence initial={false}>
              {(phase === "colon" || phase === "roulette" || phase === "done" || phase === "fadeToMath") && (
                <motion.span
                  key="colon"
                  className="inline-flex items-baseline"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{
                    opacity: phase === "fadeToMath" ? 0 : 1,
                    x: 0,
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className="mx-2">:</span>
                  <span> </span>
                </motion.span>
              )}
            </AnimatePresence>
            {(phase === "roulette" || phase === "done" || phase === "fadeToMath") && (
              <motion.span
                layout
                layoutId="A"
                className="inline-block min-w-[0.5em] border-b-2 border-black"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {(phase === "roulette" || phase === "done" || phase === "fadeToMath") && (
                    <motion.span
                      key={rouletteIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {phase === "roulette" ? LETTERS[rouletteIndex] : "A"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
            )}
          </>
        )}

        {/* MATH 재배치 + WITH SMOOKTH (withSmookth 시 MATH 왼쪽으로 살짝, 전체가 중심에) */}
        <AnimatePresence initial={false}>
          {showMathOnly && (
            <motion.span
              key="math"
              className="relative inline-flex items-baseline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <span className="inline-flex">
                {["M", "A", "T", "H"].map((letter, i) => (
                  <motion.span
                    key={letter}
                    layout
                    layoutId={letter}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: REARRANGE_TO_MATH_MS / 1000,
                      delay: i * 0.06,
                      ease: EASE,
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              {phase === "withSmookth" && (
                <motion.span
                  key="with"
                  className="ml-4 whitespace-nowrap text-xl font-medium normal-case tracking-wide text-slate-500 sm:text-2xl md:text-3xl"
                  initial={{ opacity: 0, x: 10, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    ease: EASE,
                  }}
                >
                  WITH SMOOKTH
                </motion.span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
