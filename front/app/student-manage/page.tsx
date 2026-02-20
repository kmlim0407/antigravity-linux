import Link from "next/link";

const STUDENT_MANAGE_CARDS = [
  {
    label: "학생 성취도",
    desc: "학생별 학습 진도·성취도를 한눈에 확인하고 개별 맞춤 관리를 진행할 수 있습니다.",
    bullets: ["캘린더 기반 진도 확인", "개별 학생 상세 페이지", "성적·활동 이력 조회"],
    href: "/student",
    icon: "📊",
  },
  {
    label: "질문 / Q&A",
    desc: "교재명과 문제 번호로 노션 DB에 등록된 풀이 영상을 검색하고 바로 시청할 수 있습니다.",
    bullets: ["교재·문제번호로 영상 검색", "노션 DB 실시간 연동", "학생별 질문 이력 추적"],
    href: "/student-manage/qna",
    icon: "🎬",
  },
  {
    label: "오답 / 기록",
    desc: "학생별 오답·질문을 입력해 노션에 저장하고, 통계 확인 및 엑셀 행렬 내보내기가 가능합니다.",
    bullets: ["오답·질문 기록 입력", "질문번호별 통계", "학생별 행렬 엑셀 내보내기"],
    href: "/student-manage/records",
    icon: "📋",
  },
];

export default function StudentManagePage() {
  return (
    <main className="min-h-[80vh] overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-10 sm:py-12" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-5xl min-w-0 space-y-6 sm:space-y-8">
        <header className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">학생관리</h1>
            <span className="inline-block mt-2 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">내부전용</span>
          </div>
          <p className="max-w-2xl text-[12px] leading-relaxed text-slate-600 sm:text-[14px]">
            <span className="block sm:hidden">성취도·Q&A·오답 기록 통합 관리.</span>
            <span className="hidden sm:block">학생별 성취도 확인, 질문·Q&A 영상 검색, 오답·질문 기록을 한곳에서 관리합니다. 노션 DB와 실시간 연동되며, 엑셀 내보내기·통계 조회가 가능합니다.</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/makeup"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 sm:text-[14px]"
            >
              보강 예약
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </header>


        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">기능 선택</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
            {STUDENT_MANAGE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50/30 p-4 transition sm:p-6 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl shadow-sm ring-1 ring-slate-200/60 group-hover:ring-slate-300">
                  {card.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">{card.label}</h3>
                <p className="mb-4 text-[13px] leading-relaxed text-slate-600">{card.desc}</p>
                <ul className="space-y-1.5 border-t border-slate-200/80 pt-3 text-[12px] text-slate-500">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-slate-600 group-hover:text-slate-800">
                  이동
                  <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
