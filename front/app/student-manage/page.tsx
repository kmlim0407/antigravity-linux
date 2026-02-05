type Student = {
  id: number;
  name: string;
  grade: string;
  school: string;
  track: "내신" | "선행" | "모의고사";
  focus: string;
  nextPlan: string;
};

const mockStudents: Student[] = [
  {
    id: 1,
    name: "김지호",
    grade: "고1",
    school: "○○고",
    track: "선행",
    focus: "공통수학Ⅱ 함수 단원 구조 정리",
    nextPlan: "다음 수업에서 유형별 함수 최댓값/최솟값 정리",
  },
  {
    id: 2,
    name: "고수아",
    grade: "중3",
    school: "○○중",
    track: "내신",
    focus: "다항식 전개/인수분해 실수 줄이기",
    nextPlan: "학교 기출+유사문항으로 내신 대비 세트 진행",
  },
  {
    id: 3,
    name: "신연우",
    grade: "고2",
    school: "○○고",
    track: "모의고사",
    focus: "기하 중 벡터 파트 약점 보완",
    nextPlan: "6월 모평 난이도 기준 실전 세트 1회분",
  },
];

const trackLabelClass: Record<Student["track"], string> = {
  내신: "bg-emerald-50 text-emerald-700 border-emerald-100",
  선행: "bg-sky-50 text-sky-700 border-sky-100",
  모의고사: "bg-amber-50 text-amber-800 border-amber-100",
};

// 상단 탭 UI
function StudentTabs(props: {
  active: "dashboard" | "list" | "qna" | "records";
}) {
  const { active } = props;
  const base =
    "flex-1 whitespace-nowrap rounded-lg border px-3 py-2 text-center text-xs md:text-sm transition";
  const inactive =
    "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100";
  const activeClass = "border-neutral-900 bg-neutral-900 text-white";

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      <a
        href="/student-manage"
        className={
          base + " " + (active === "dashboard" ? activeClass : inactive)
        }
      >
        대시보드
      </a>
      <a
        href="/student-manage/list"
        className={base + " " + (active === "list" ? activeClass : inactive)}
      >
        학생 목록
      </a>
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

export default function StudentManageDashboardPage() {
  const total = mockStudents.length;
  const nNaesin = mockStudents.filter((s) => s.track === "내신").length;
  const nSeonhang = mockStudents.filter((s) => s.track === "선행").length;
  const nMoyi = mockStudents.filter((s) => s.track === "모의고사").length;

  return (
    <main className="min-h-[80vh] bg-neutral-100 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            학생관리
          </h1>
          <p className="text-xs md:text-sm text-neutral-600">
            임경묵T가 내부에서만 보는 페이지입니다. 학생별 현재 상태·진도·다음
            계획을 한 눈에 정리하는 용도입니다.
          </p>
        </header>

        {/* 탭 */}
        <StudentTabs active="dashboard" />

        {/* 요약 카드들 */}
        <section className="grid gap-3 md:grid-cols-3 text-xs md:text-sm">
          <div className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="text-[11px] text-neutral-500">총 학생 수</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">
              {total}
            </div>
            <p className="mt-1 text-[11px] text-neutral-600">
              지금은 예시 데이터입니다. 나중에는 DB/엑셀과 연동해 자동 집계할
              수 있습니다.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="text-[11px] text-neutral-500">
              내신 / 선행 / 모의고사
            </div>
            <div className="mt-2 flex flex-col gap-1 text-[11px] text-neutral-700">
              <div>• 내신 대비: {nNaesin}명</div>
              <div>• 선행 위주: {nSeonhang}명</div>
              <div>• 모의·수능: {nMoyi}명</div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="text-[11px] text-neutral-500">다음에 할 일</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-neutral-700">
              <li>학생 추가/수정 폼 설계</li>
              <li>엑셀/노션 데이터 구조 정리</li>
              <li>Q&amp;A / 오답 기록 연동 방향 결정</li>
            </ul>
          </div>
        </section>

        {/* 오늘 확인할 학생 */}
        <section className="rounded-xl border border-neutral-300 bg-white p-4 md:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold text-neutral-900">
              오늘 확인할 학생 (예시)
            </h2>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] text-neutral-600">
              실제 운영 시에는 날짜 기준으로 필터링 가능합니다.
            </span>
          </div>

          <div className="space-y-2">
            {mockStudents.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-neutral-900">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {s.grade} · {s.school}
                  </div>
                  <span
                    className={
                      "rounded-full border px-2 py-0.5 text-[10px] " +
                      trackLabelClass[s.track]
                    }
                  >
                    {s.track}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-700 md:text-right">
                  <span className="font-medium text-neutral-900">포인트: </span>
                  {s.focus}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 상세 요약 테이블 */}
        <section className="rounded-xl border border-neutral-300 bg-white p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold text-neutral-900">
              학생별 상세 요약 (예시)
            </h2>
            <button
              type="button"
              className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-700 hover:bg-neutral-100"
            >
              + 학생 추가 (추후 구현)
            </button>
          </div>

          <div className="overflow-x-auto text-xs md:text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-[11px] text-neutral-500">
                  <th className="px-3 py-2 font-medium">이름</th>
                  <th className="px-3 py-2 font-medium">학년 / 학교</th>
                  <th className="px-3 py-2 font-medium">구분</th>
                  <th className="px-3 py-2 font-medium">현재 포인트</th>
                  <th className="px-3 py-2 font-medium">다음 계획</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-neutral-900">
                      {s.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-700">
                      {s.grade} · {s.school}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-neutral-700">
                      {s.track}
                    </td>
                    <td className="px-3 py-2 text-neutral-700">{s.focus}</td>
                    <td className="px-3 py-2 text-neutral-700">
                      {s.nextPlan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
