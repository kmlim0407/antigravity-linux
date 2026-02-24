"use client";

import { useEffect } from "react";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function canScrollMore(el: Element, direction: number): boolean {
  if (direction > 0) return el.scrollTop < el.scrollHeight - el.clientHeight - 2;
  return el.scrollTop > 2;
}

export function useSmoothSnapScroll(
  containerSelector = ".snap-scroll-container",
  duration = 700,
) {
  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement | null;
    if (!container) return;

    let isAnimating = false;
    let rafId: number;

    // 섹션 목록 캐싱 — DOM 변경 시 갱신
    let sections: HTMLElement[] = [];
    const refreshSections = () => {
      sections = Array.from(container.querySelectorAll(".snap-section"));
    };
    refreshSections();

    const observer = new MutationObserver(refreshSections);
    observer.observe(container, { childList: true, subtree: false });

    // 섹션별 scrollTop 위치 (레이아웃 안정 후 한 번 계산, resize 시 갱신)
    let sectionTops: number[] = [];
    const refreshTops = () => {
      const containerRect = container.getBoundingClientRect();
      sectionTops = sections.map(
        (s) => s.getBoundingClientRect().top - containerRect.top + container.scrollTop
      );
    };
    refreshTops();

    const resizeObserver = new ResizeObserver(refreshTops);
    resizeObserver.observe(container);

    const getCurrentIndex = (): number => {
      const scrollTop = container.scrollTop;
      let idx = 0;
      for (let i = 0; i < sectionTops.length; i++) {
        if ((sectionTops[i] ?? 0) <= scrollTop + 10) idx = i;
      }
      return idx;
    };

    const animateToSection = (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= sections.length) return;
      if (isAnimating) return;

      const from = container.scrollTop;
      const to = sectionTops[targetIndex] ?? 0;
      if (Math.abs(from - to) < 5) return;

      isAnimating = true;
      container.style.scrollSnapType = "none";

      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = from + (to - from) * easeInOutCubic(progress);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          container.scrollTop = to;
          container.style.scrollSnapType = "";
          isAnimating = false;
          refreshTops(); // 애니메이션 후 위치 갱신
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    // 내부 스크롤 가능 요소 찾기 (getComputedStyle 없이 빠르게)
    const getInnerScrollable = (target: Element): Element | null => {
      let el: Element | null = target;
      while (el && el !== container) {
        if (!el.classList.contains("snap-section")) {
          if (
            el.scrollHeight > el.clientHeight + 2 &&
            (el as HTMLElement).offsetHeight > 0
          ) {
            const oy = (el as HTMLElement).style.overflowY ||
              getComputedStyle(el).overflowY;
            if (oy === "auto" || oy === "scroll") return el;
          }
        }
        el = el.parentElement;
      }
      return null;
    };

    const onWheel = (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      const inner = getInnerScrollable(e.target as Element);
      if (inner && canScrollMore(inner, direction)) return;

      e.preventDefault();
      if (isAnimating) return;
      animateToSection(getCurrentIndex() + direction);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (!isAnimating) animateToSection(getCurrentIndex() + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (!isAnimating) animateToSection(getCurrentIndex() - 1);
      }
    };

    let touchStartY = 0;
    let touchStartTime = 0;
    let touchInnerEl: Element | null = null;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      touchInnerEl = getInnerScrollable(e.target as Element);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const elapsed = Date.now() - touchStartTime;
      const isSwipe = Math.abs(deltaY) > 40 || (Math.abs(deltaY) > 15 && elapsed < 250);
      if (!isSwipe) return;

      const direction = deltaY > 0 ? 1 : -1;
      if (touchInnerEl && canScrollMore(touchInnerEl, direction)) return;

      e.preventDefault();
      animateToSection(getCurrentIndex() + direction);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [containerSelector, duration]);
}
