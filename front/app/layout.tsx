import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900">
        {/* 상단 네비게이션바 (모든 페이지 공통) */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            {/* 로고 */}
            <a href="/" className="text-lg font-bold tracking-tight">
              smookth's <span className="text-blue-600">Mook T</span>
            </a>

            {/* 메뉴 */}
            <nav className="flex gap-6 text-sm text-slate-600">
              <a href="/" className="hover:text-blue-600">
                홈
              </a>
              <a href="/students" className="hover:text-blue-600">
                학생용 안내
              </a>
              <a href="/parents" className="hover:text-blue-600">
                학부모용 안내
              </a>
              <a href="/portfolio" className="hover:text-blue-600">
                포트폴리오
              </a>
              <a href="/student-manage" className="hover:text-neutral-900">학생관리</a>
              <a href="/makeup" className="hover:text-blue-600">
                보강 관리
              </a>
              <a href="/#contact" className="hover:text-blue-600">
                상담 문의
              </a>
            </nav>
          </div>
        </header>

        {/* 각 페이지 내용 */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
