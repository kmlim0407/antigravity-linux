export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* SECTION 1 – 브랜드 메인 (Tesla Hero 느낌) */}
      <section className="relative flex h-[92vh] min-h-[640px] flex-col items-center justify-between pt-24">
        {/* 가운데 텍스트 */}
        <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <p className="mb-2 text-xs font-medium tracking-[0.2em] text-slate-300 uppercase">
            SMOOKTH&apos;S MOOK T
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          IM LOGIC
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
            개념을 구조로 묶고, 데이터로 오답을 관리하는{" "}
            <span className="font-semibold text-slate-100">
              임경묵T 전용 수학 브랜드 페이지
            </span>
            입니다.
            <br />
            내신 · 모의고사 · 수능까지 한 흐름으로 연결해 준비합니다.
          </p>

          {/* CTA 버튼들 */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <a
              href="/makeup"
              className="rounded-full bg-white px-6 py-2.5 font-semibold text-black shadow hover:bg-slate-100"
            >
              📅 보강 예약하기
            </a>
            <a
              href="/students"
              className="rounded-full border border-slate-500 px-6 py-2.5 text-slate-100 hover:border-slate-300"
            >
              학생용 안내 보기
            </a>
            <a
              href="/parents"
              className="rounded-full border border-slate-500 px-6 py-2.5 text-slate-100 hover:border-slate-300"
            >
              학부모용 안내 보기
            </a>
          </div>
        </div>

        {/* 하단 작은 텍스트 */}
        <div className="mb-6 flex flex-col items-center gap-2 text-[11px] text-slate-400">
          <p>스크롤하여 프로그램을 확인하세요</p>
          <span className="animate-bounce text-lg">⌄</span>
        </div>
      </section>

      {/* SECTION 2 – 중·고등 학년별 프로그램 (Tesla 모델 카드 느낌) */}
      <section className="flex min-h-[80vh] flex-col justify-center bg-white text-black">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16">
          <header className="text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              학년별 대표 프로그램
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tesla 모델 카드처럼, 학년별 핵심 프로그램만 깔끔하게 정리했습니다.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            {/* 중등 */}
            <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold">중등 프로그램</h3>
              <p className="mt-2 text-xs text-slate-600">
                개념 흐름부터 학교 내신 대비까지,
                <br />
                중3까지의 기초 체력을 완성합니다.
              </p>
              <ul className="mt-4 space-y-1 text-xs text-slate-700">
                <li>• 개념 · 유형 흐름 정리</li>
                <li>• 학교별 내신 기출 분석</li>
                <li>• 시험 전 실전 모의</li>
              </ul>
            </article>

            {/* 고등 내신 */}
            <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold">고등 내신 프로그램</h3>
              <p className="mt-2 text-xs text-slate-600">
                공통수학 · 수1/수2 내신을
                <br />
                단원별 데이터로 관리합니다.
              </p>
              <ul className="mt-4 space-y-1 text-xs text-slate-700">
                <li>• 단원별 오답률 분석</li>
                <li>• 서술형/고난도 집중 훈련</li>
                <li>• 수행평가 &amp; 시험 대비</li>
              </ul>
            </article>

            {/* 수능/모의고사 */}
            <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold">수능 · 모의고사 프로그램</h3>
              <p className="mt-2 text-xs text-slate-600">
                실전 난이도 모의고사를 통해
                <br />
                시간 관리 · 전략을 함께 설계합니다.
              </p>
              <ul className="mt-4 space-y-1 text-xs text-slate-700">
                <li>• 실전 모의고사 운영</li>
                <li>• 문항별 난이도 분석</li>
                <li>• 커트라인 기준 목표 설정</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 3 – 보강 · 학생관리 (Tesla Energy/Charging 섹션 느낌) */}
      <section className="flex min-h-[80vh] flex-col justify-center bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center">
          {/* 왼쪽 텍스트 */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold md:text-3xl">
              보강 · 학생 관리를 한 화면에서
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Tesla가 충전 · 서비스까지 한 앱에서 관리하듯,
              <br />
              보강 예약부터 질문 관리까지 한 페이지에서 정리합니다.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• 보강 캘린더로 시간대별 예약 관리</li>
              <li>• 질문 게시판으로 수업 외 질문 정리</li>
              <li>• 학생별 기록을 바탕으로 개별 피드백 제공</li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                href="/makeup"
                className="rounded-full bg-white px-6 py-2.5 font-semibold text-black hover:bg-slate-100"
              >
                📅 보강 예약 페이지 열기
              </a>
              <a
                href="/qna"
                className="rounded-full border border-slate-400 px-6 py-2.5 text-slate-100 hover:border-slate-200"
              >
                ❓ 질문 게시판 바로가기
              </a>
              <a
                href="/student-manage"
                className="rounded-full border border-slate-400 px-6 py-2.5 text-slate-100 hover:border-slate-200"
              >
                학생관리 페이지
              </a>
            </div>
          </div>

          {/* 오른쪽 카드 */}
          <div className="flex-1">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/60 p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                DATA DASHBOARD
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                학생별 오답 · 보강 · 출석 한눈에
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                실제 사이트에서는 이 영역에 Notion/DB에서 가져온 학생별
                대시보드를 연결할 수 있습니다.
                <br />
                현재는 레이아웃만 구현되어 있으니, 나중에 데이터 연결만 추가하면
                됩니다.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-200">
                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-[10px] text-slate-400">이번 주 보강</p>
                  <p className="mt-1 text-lg font-semibold">4</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-[10px] text-slate-400">질문 처리</p>
                  <p className="mt-1 text-lg font-semibold">12</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-[10px] text-slate-400">관리 학생</p>
                  <p className="mt-1 text-lg font-semibold">18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 – 데이터 기반 철학 (마지막 섹션 + 푸터) */}
      <section className="flex min-h-[60vh] flex-col justify-center bg-white text-black">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                데이터로 설계하는 수업 철학
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                Tesla가 주행 데이터를 기반으로 계속 업데이트되듯, 수업 역시
                학생 데이터를 기반으로 매 시간 조정됩니다.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-800">
                <li>• 학생별 오답/실수 유형 기록</li>
                <li>• 수업 후 분석표를 기반으로 다음 시간 계획</li>
                <li>• 모의고사 성적 추이를 보고 전략 재설계</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p>
                상담이 필요하시면 상단 메뉴의{" "}
                <span className="font-semibold">상담 문의</span> 섹션 또는
                카카오 채널을 통해 편하게 남겨 주세요.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                실제 운영 시에는 이 영역에 자세한 상담 안내, 시간표, 위치,
                카카오 채널 링크 등을 추가할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
            © Smookths Math · 임경묵T
          </div>
        </div>
      </section>
    </main>
  );
}
