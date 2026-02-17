// 상단 탭 UI
function StudentTabs(props: { active: "qna" | "records" }) {
  const { active } = props;
  const base =
    "flex-1 whitespace-nowrap rounded-lg border px-3 py-2 text-center text-xs md:text-sm transition";
  const inactive =
    "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100";
  const activeClass = "border-neutral-900 bg-neutral-900 text-white";

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      <a
        href="/student-manage/qna"
        className={base + " " + (active === "qna" ? activeClass : inactive)}
      >
        질문 / Q&amp;A
      </a>
      <a
        href="/student-manage/records"
        className={
          base + " " + (active === "records" ? activeClass : inactive)
        }
      >
        오답 / 기록
      </a>
    </div>
  );
}

export default function StudentListPage() {
  return (
    <main className="min-h-[80vh] bg-neutral-100 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            학생관리
          </h1>
          <p className="text-xs md:text-sm text-neutral-600">
            학생 목록 / 개별 카드, 추후 상세 페이지로 이어질 영역입니다.
          </p>
        </header>

        <StudentTabs active="qna" />

        <section className="rounded-xl border border-neutral-300 bg-white p-4 md:p-5 shadow-sm text-xs md:text-sm text-neutral-700">
          <p className="mb-2 font-semibold text-neutral-900">
            학생 목록 페이지 (준비 중)
          </p>
          <p>
            이 페이지에서는 학생들을 카드/테이블 형태로 나열하고, 학생 이름을
            클릭하면 개별 페이지로 들어갈 수 있도록 만들 예정입니다.
          </p>
          <p className="mt-2 text-[11px] text-neutral-500">
            나중에 엑셀/노션에서 학생 데이터를 가져와서 여기서 관리하는 쪽으로
            확장하면 됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}
