"use client";

import { useEffect } from "react";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 섹션의 실제 scrollTop 위치를 컨테이너 기준으로 계산 */
function getSectionScrollTop(section: HTMLElement, container: HTMLElement): number {
  return (
    section.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop
  );
}

/** snap-section이 아닌 내부 scrollable 요소 반환 */
function getInnerScrollable(target: Element, boundary: Element): Element | null {
  let el: Element | null = target;
  while (el && el !== boundary) {
    if (!el.classList.contains("snap-section")) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 2) {
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

function canScrollMore(el: Element, direction: number): boolean {
  if (direction > 0) return el.scrollTop < el.scrollHeight - el.clientHeight - 2;
  return el.scrollTop > 2;
}

export function useSmoothSnapScroll(
  containerSelector = ".snap-scroll-container",
  duration = 750,
) {
  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement | null;
    if (!container) return;

    let isAnimating = false;
    let rafId: number;

    const getSections = (): HTMLElement[] =>
      Array.from(container.querySelectorAll(".snap-section"));

    const getCurrentIndex = (): number => {
      const sections = getSections();
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (getSectionScrollTop(sections[i], container) <= container.scrollTop + 10) {
          idx = i;
        }
      }
      return idx;
    };

    const animateToSection = (targetIndex: number) => {
      const sections = getSections();
      if (targetIndex < 0 || targetIndex >= sections.length) return;
      if (isAnimating) return;

      const from = container.scrollTop;
      const to = getSectionScrollTop(sections[targetIndex], container);
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
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      const inner = getInnerScrollable(e.target as Element, container);
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
      touchInnerEl = getInnerScrollable(e.target as Element, container);
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
    };
  }, [containerSelector, duration]);
}
