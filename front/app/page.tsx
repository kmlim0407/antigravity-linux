"use client";

import Link from "next/link";
import { ContactModalTrigger } from "@/components/ContactModal";
import SinGraph from "@/components/SinGraph";

export default function HomePage() {
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
      <div className="relative min-h-screen overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="px-4">
          <div
            className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center py-6 sm:py-8"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
          {/* 히어로: 메인 문구 + 한글 + CTA - ∩를 max-w-5xl 중심에 맞춰 navbar와 같은 세로선 */}
          <div className="flex w-full flex-col items-center justify-center gap-5 sm:gap-6 text-center">
            <div className="flex w-full justify-center">
              {/* 모바일: 세로 배치 / 데스크톱: 한 줄, ∩를 정확히 가운데에 */}
              <p className="flex flex-col items-center justify-center gap-1.5 text-slate-900 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-6 lg:gap-y-0 lg:whitespace-nowrap text-[30px] font-bold sm:text-[44px] md:text-[52px] lg:text-[64px]">
                <span className="tracking-[0.03em] sm:tracking-[0.04em] lg:justify-self-end">BE LOGICAL</span>
                <span className="inline-flex items-center font-bold text-slate-700 lg:justify-self-center">∩</span>
                <span className="tracking-[0.03em] sm:tracking-[0.04em] lg:justify-self-start">BE TACTICAL</span>
              </p>
            </div>
            <p className="max-w-xl px-2 text-center text-[13px] leading-relaxed text-slate-600 sm:px-0 sm:text-[14px] md:text-[15px]">
              <span className="block">모든 유형에 대한 철저한 이해, 그 이해를 통한 확실한 수업,</span>
              <span className="block">그 수업을 관리할 수 있는 확실한 능력.</span>
              <span className="mt-1 block font-semibold text-slate-700 sm:text-[15px] md:text-[16px]">SMOOKTH와 함께합니다.</span>
            </p>
            <div id="contact" className="flex flex-wrap justify-center gap-2 pt-2">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                수업 영상
              </Link>
              <ContactModalTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                상담문의
              </ContactModalTrigger>
            </div>
          </div>

          <SinGraph />
          </div>
        </div>
      </div>
    </main>
  );
}
