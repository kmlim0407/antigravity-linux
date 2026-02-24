"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __pwaPromptEvent: BeforeInstallPromptEvent | null;
  }
}

export default function PwaInstallButton() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }
    if (window.__pwaPromptEvent) setPromptEvent(window.__pwaPromptEvent);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      window.__pwaPromptEvent = ev;
      setPromptEvent(ev);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      window.__pwaPromptEvent = null;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!showHint) return;
    const handler = (e: MouseEvent) => {
      if (hintRef.current && !hintRef.current.contains(e.target as Node)) {
        setShowHint(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHint]);

  const handleClick = async () => {
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === "accepted") {
          setInstalled(true);
          setPromptEvent(null);
          window.__pwaPromptEvent = null;
        }
      } catch { /* silent */ }
      return;
    }
    setShowHint((v) => !v);
  };

  if (!mounted || installed) return null;

  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !navigator.userAgent.includes("Chrome");

  return createPortal(
    <>
      {/* 힌트 팝업 */}
      {showHint && (
        <div
          ref={hintRef}
          style={{ position: "fixed", bottom: 88, right: 20, zIndex: 9999 }}
          className="w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          {isIOS ? (
            <>
              <p className="mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">홈 화면에 추가</p>
              <ol className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li>1. 하단 <strong className="text-slate-700 dark:text-slate-200">공유</strong> 버튼 탭</li>
                <li>2. <strong className="text-slate-700 dark:text-slate-200">홈 화면에 추가</strong> 선택</li>
                <li>3. 오른쪽 상단 <strong className="text-slate-700 dark:text-slate-200">추가</strong> 탭</li>
              </ol>
              <p className="mt-1.5 text-[10px] text-slate-400">Safari에서만 지원됩니다.</p>
            </>
          ) : (
            <>
              <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">앱 설치</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chrome 주소창 오른쪽의 설치 아이콘을 클릭하거나, 잠시 후 다시 시도해 주세요.
              </p>
            </>
          )}
        </div>
      )}

      {/* FAB 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9998 }}
        className="group flex h-[52px] w-[52px] items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="앱 설치"
        title="홈 화면에 설치"
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-[1px] rounded-[14px] bg-slate-900 shadow-lg transition-shadow group-hover:shadow-xl dark:bg-slate-100">
          <span
            className="select-none font-bold leading-none text-white dark:text-slate-900"
            style={{ fontSize: "1.1rem", fontFamily: "serif", lineHeight: 1 }}
          >
            ∩
          </span>
          <span
            className="select-none font-bold leading-none text-white dark:text-slate-900"
            style={{ fontSize: "0.34rem", letterSpacing: "0.08em", fontFamily: "var(--font-outfit)" }}
          >
            SMOOKTH
          </span>

          {/* 다운로드 뱃지 */}
          {!promptEvent && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 shadow-sm">
              <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                <path d="M5 1v5M3 4L5 6.5L7 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
      </button>
    </>,
    document.body
  );
}
