function StudentTabs(props: { active: "qna" | "records" }) {
  const { active } = props;
  const base = "flex-1 whitespace-nowrap rounded-lg border px-3 py-2 text-center text-xs sm:text-[13px] transition";
  const inactive = "border-slate-300 bg-white text-slate-600 hover:bg-slate-50";
  const activeClass = "border-slate-700 bg-slate-700 text-white";

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      <a href="/student-manage/qna" className={base + " " + (active === "qna" ? activeClass : inactive)}>질문 / Q&A</a>
      <a href="/student-manage/records" className={base + " " + (active === "records" ? activeClass : inactive)}>오답 / 기록</a>
    </div>
  );
}

export default function StudentListPage() {
  return (
    <main className="min-h-[80vh] overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-10 sm:py-12 sm:py-12" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-5xl space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">학생관리</h1>
          <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">목록·개별 카드 (준비 중)</p>
        </header>

        <StudentTabs active="qna" />

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="font-semibold text-slate-900">학생 목록 (준비 중)</p>
          <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">카드/테이블 형태, 클릭 시 개별 페이지. 엑셀/노션 연동 예정.</p>
        </section>
      </div>
    </main>
  );
}
