import Link from "next/link";

const STUDENT_MANAGE_CARDS = [
  {
    label: "학생 성취도",
    desc: "학생마다 어디까지 왔는지 한눈에 볼 수 있습니다. 개별 페이지에서 진도와 이력을 확인하세요.",
    href: "/student",
    icon: "📊",
  },
  {
    label: "질문 / Q&A",
    desc: "교재와 문제 번호로 풀이 영상을 바로 찾을 수 있습니다. 노션 DB와 실시간으로 연결되어 있습니다.",
    href: "/student-manage/qna",
    icon: "🎬",
  },
  {
    label: "오답 / 기록",
    desc: "학생별 오답과 질문을 노션에 저장하고 통계로 볼 수 있습니다. 엑셀로 내보내는 것도 됩니다.",
    href: "/student-manage/records",
    icon: "📋",
  },
  {
    label: "개별 프린트",
    desc: "학생별 PDF를 업로드·배정하고, 풀이를 조회·첨삭합니다. 실시간 저장·동기화됩니다.",
    href: "/student-manage/prints",
    icon: "📄",
  },
];

export default function StudentManagePage() {
  return (
    <main className="min-h-[80vh] overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-12" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-5xl min-w-0 space-y-8 sm:space-y-10">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">학생관리</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
            내부 전용 페이지입니다.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {STUDENT_MANAGE_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md sm:p-6"
            >
              <span className="mb-4 text-2xl">{card.icon}</span>
              <h3 className="mb-2 text-[15px] font-semibold text-slate-900 sm:text-base">{card.label}</h3>
              <p className="text-[13px] leading-relaxed text-slate-500">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
