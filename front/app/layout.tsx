import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900">
        {/* 상단 네비게이션바 (모든 페이지 공통) */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            {/* 로고 */}
            <Link href="/" className="text-lg font-bold tracking-tight">
              smookth&apos;s <span className="text-blue-600">Mook T</span>
            </Link>

            {/* 메뉴 */}
            <nav className="flex gap-4 overflow-x-auto whitespace-nowrap text-sm text-slate-600">
              <Link href="/" className="hover:text-blue-600">
                홈
              </Link>

              {/* 기존 학생용 안내 페이지 */}
              <Link href="/students" className="hover:text-blue-600">
                학생용 안내
              </Link>

              {/* ✅ 새로 추가: 학생 개인 성취도 탭 (/student) */}
              <Link href="/student" className="hover:text-blue-600">
                학생 성취도
              </Link>

              <Link href="/parents" className="hover:text-blue-600">
                학부모용 안내
              </Link>

              <Link href="/portfolio" className="hover:text-blue-600">
                포트폴리오
              </Link>

              <Link href="/student-manage" className="hover:text-neutral-900">
                학생관리
              </Link>

              <Link href="/makeup" className="hover:text-blue-600">
                보강 관리
              </Link>

              <Link href="/#contact" className="hover:text-blue-600">
                상담 문의
              </Link>
            </nav>
          </div>
        </header>

        {/* 각 페이지 내용 */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
