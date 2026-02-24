"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "./ChatBot";
import PwaInstallButton from "./PwaInstallButton";

const SCROLL_THRESHOLD = 80;

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/portfolio", label: "수업영상" },
  { href: "/student-manage", label: "학생관리" },
  { href: "/makeup", label: "보강관리" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const snapContainer = document.querySelector(".snap-scroll-container");

    const onScroll = () => {
      if (snapContainer) {
        setScrolled(snapContainer.scrollTop > SCROLL_THRESHOLD);
      } else {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
      }
    };

    onScroll();

    if (snapContainer) {
      snapContainer.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (snapContainer) {
        snapContainer.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const snapContainer = document.querySelector(".snap-scroll-container");
    if (snapContainer) {
      snapContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-50 px-4 pt-1 sm:pt-2">
        <div className="mx-auto flex w-full max-w-5xl justify-center">
          <motion.header
            initial={false}
            animate={{
              maxWidth: open ? 1152 : 768,
              boxShadow: open
                ? "0 25px 50px -12px rgba(0,0,0,0.12)"
                : "0 1px 3px 0 rgba(0,0,0,0.05)",
            }}
            transition={{
              maxWidth: {
                type: "tween",
                duration: 0.55,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: open ? 0 : 0.45,
              },
              boxShadow: { duration: 0.35, delay: open ? 0 : 0.4 },
            }}
            className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/95"
          >
            {/* 상단 행: 햄버거(2줄)+MENU(왼쪽) + 로고(가운데) + 채팅(오른쪽) */}
            <div className="grid min-h-[36px] grid-cols-3 items-center px-2 py-1.5 sm:min-h-[44px] sm:px-4 sm:py-2">
              <div className="flex min-w-0 shrink items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:h-9 sm:w-9 sm:gap-1"
                  aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
                >
                  <motion.svg
                    className="h-3.5 w-5 sm:h-4 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.75} d="M2 8h20M2 16h20" />
                  </motion.svg>
                </button>
                <span className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300 sm:inline sm:text-sm md:text-base md:tracking-[0.12em] lg:text-lg lg:tracking-[0.15em]" style={{ fontFamily: "var(--font-outfit)" }}>Menu</span>
              </div>
              <div className="flex min-h-[48px] min-w-[48px] items-center justify-center justify-self-center sm:min-h-[52px] sm:min-w-[52px]">
                <AnimatePresence mode="wait">
                  {scrolled ? (
                    <motion.button
                      key="intersect"
                      type="button"
                      onClick={scrollToTop}
                      className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[2.15rem] font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:h-14 sm:w-14 sm:text-[2.4rem]"
                      aria-label="맨 위로"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [1, 0.25, 1, 0.4, 1],
                      }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{
                        opacity: {
                          duration: 3.5,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <span style={{ fontFamily: "Georgia, 'Noto Serif KR', serif" }}>∩</span>
                    </motion.button>
                  ) : (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/"
                      className="text-2xl font-bold uppercase tracking-[-0.08em] text-slate-900 dark:text-slate-100 sm:text-3xl md:text-4xl"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      SMOOKTH
                    </Link>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-end gap-1">
                <PwaInstallButton />
                <ChatBot />
              </div>
            </div>

            {/* 확장되는 네비 링크 영역 */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.nav
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: {
                        type: "tween",
                        duration: 0.45,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.5,
                      },
                      opacity: { duration: 0.35, delay: 0.55 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        type: "tween",
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                      opacity: { duration: 0.25 },
                    },
                  }}
                  className="overflow-hidden border-t border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="flex flex-nowrap justify-between items-center gap-1 overflow-x-auto px-2 py-2 sm:gap-3 sm:px-6 sm:py-4 md:gap-4 md:px-8 md:py-5 lg:gap-6 lg:px-10 lg:py-6 nav-scroll-hide">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-medium tracking-[0.06em] text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:px-3 sm:py-2 sm:text-sm sm:tracking-[0.08em] md:px-4 md:text-sm md:tracking-[0.1em] lg:px-5 lg:text-[15px] lg:tracking-[0.12em] xl:text-[16px] xl:tracking-[0.15em]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.header>
        </div>
      </div>
    </>
  );
}
