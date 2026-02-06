export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* SECTION 1 – 브랜드 메인 (Tesla Hero 느낌) */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-between pt-20 md:h-[92vh] md:min-h-[640px] md:pt-24">
        {/* 가운데 텍스트 */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300 md:text-xs">
            SMOOKTH&apos;S MOOK T
          </p>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-3xl md:text-5xl">
            중·고등 구조 수학 프로그램
          </h1>
          <p className="mt-4 max-w-xl text-xs text-slate-300 sm:text-sm md:text-base">
            개념을 구조로 묶고, 데이터로 오답을 관리하는{" "}
            <span className="font-semibold text-slate-100">
              임경묵T 전용 수학 브랜드 페이지
            </span>
            입니다.
            <br className="hidden sm:block" />
            내신 · 모의고사 · 수능까지 한 흐름으로 연결해 준비합니다.
          </p>

          {/* CTA 버튼들 */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <a
              href="/makeup"
              className="rounded-full bg-white px-5 py-2 font-semibold text-black shadow hover:bg-slate-100 sm:px-6 sm:py-2.5"
            >
              📅 보강 예약하기
            </a>
            <a
              href="/students"
              className="rounded-full border border-slate-500 px-5 py-2 text-slate-100 hover:border-slate-300 sm:px-6 sm:py-2.5"
            >
              학생용 안내 보기
            </a>
            <a
              href="/parents"
              className="rounded-full border border-slate-500 px-5 py-2 text-slate-100 hover:border-slate-300 sm:px-6 sm:py-2.5"
            >
              학부모용 안내 보기
            </a>
          </div>
        </div>

        {/* 하단 작은 텍스트 */}
        <div className="mb-4 flex flex-col items-center gap-1 text-[10px] text-slate-400 sm:mb-6">
          <p>스크롤하여 프로그램을 확인하세요</p>
          <span className="text-base animate-bounce">⌄</span>
        </div>
      </section>

      {/* SECTION 2 – 중·고등 학년별 프로그램 */}
      <section className="flex bg-white text-black">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:py-12 md:py-16 md:min-h-[80vh] md:justify-center">
          <header className="text-center">
            <h2 className="text-xl font-semibold md:text-2xl">
              학년별 대표 프로그램
            </h2>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Tesla 모델 카드처럼, 학년별 핵심 프로그램만 깔끔하게 정리했습니다.
            </p>
          </header>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {/* 중등 */}
            <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm sm:p-6">
              <h3 className="text-base font-semibold sm:text-lg">중등 프로그램</h3>
              <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">
                개념 흐름부터 학교 내신 대비까지,
                <br />
                중3까지의 기초 체력을 완성합니다.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 sm:mt-4 sm:text-xs">
                <li>• 개념 · 유형 흐름 정리</li>
                <li>• 학교별 내신 기출 분석</li>
                <li>• 시험 전 실전 모의</li>
              </ul>
            </article>

            {/* 고등 내신 */}
            <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm sm:p-6">
              <h3 className="text-base font-semibold sm:text-lg">고등 내신 프로그램</h3>
              <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">
                공통수학 · 수1/수2 내신을
                <br />
                단원별 데이터로 관리합니다.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 sm:mt-4 sm:text-xs">
                <li>• 단원별 오답률 분석</li>
                <li>• 서술형/고난도 집중 훈련</li>
                <li>• 수행평가 &amp; 시험 대비</li>
              </ul>
            </article>

            {/* 수능/모의고사 */}
            <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm sm:p-6">
              <h3 className="text-base font-semibold sm:text-lg">
                수능 · 모의고사 프로그램
              </h3>
              <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">
                실전 난이도 모의고사를 통해
                <br />
                시간 관리 · 전략을 함께 설계합니다.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 sm:mt-4 sm:text-xs">
                <li>• 실전 모의고사 운영</li>
                <li>• 문항별 난이도 분석</li>
                <li>• 커트라인 기준 목표 설정</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 3 – 보강 · 학생관리 */}
      <section className="flex bg-slate-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-12 md:flex-row md:items-center md:gap-10 md:py-16 md:min-h-[80vh]">
          {/* 왼쪽 텍스트 */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold sm:text-2xl md:text-3xl">
              보강 · 학생 관리를 한 화면에서
            </h2>
            <p className="mt-3 text-xs text-slate-300 sm:text-sm">
              Tesla가 충전 · 서비스까지 한 앱에서 관리하듯,
              <br />
              보강 예약부터 질문 관리까지 한 페이지에서 정리합니다.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-200 sm:text-sm">
              <li>• 보강 캘린더로 시간대별 예약 관리</li>
              <li>• 질문 게시판으로 수업 외 질문 정리</li>
              <li>• 학생별 기록을 바탕으로 개별 피드백 제공</li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 text-xs sm:mt-6 sm:gap-3 sm:text-sm">
              <a
                href="/makeup"
                className="rounded-full bg-white px-5 py-2 font-semibold text-black hover:bg-slate-100 sm:px-6 sm:py-2.5"
              >
                📅 보강 예약 페이지 열기
              </a>
              <a
                href="/qna"
                className="rounded-full border border-slate-400 px-5 py-2 text-slate-100 hover:border-slate-200 sm:px-6 sm:py-2.5"
              >
                ❓ 질문 게시판 바로가기
              </a>
              <a
                href="/student-manage"
                className="rounded-full border border-slate-400 px-5 py-2 text-slate-100 hover:border-slate-200 sm:px-6 sm:py-2.5"
              >
                학생관리 페이지
              </a>
            </div>
          </div>

          {/* 오른쪽 카드 */}
          <div className="flex-1">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/60 p-4 shadow-xl sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                DATA DASHBOARD
              </p>
              <h3 className="mt-2 text-base font-semibold text-white sm:text-lg">
                학생별 오답 · 보강 · 출석 한눈에
              </h3>
              <p className="mt-2 text-[11px] text-slate-300 sm:text-xs">
                실제 사이트에서는 이 영역에 Notion/DB에서 가져온 학생별
                대시보드를 연결할 수 있습니다.
                <br />
                현재는 레이아웃만 구현되어 있으니, 나중에 데이터 연결만 추가하면
                됩니다.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-200 sm:gap-3 sm:text-xs">
                <div className="rounded-2xl bg-slate-900 p-2 sm:p-3">
                  <p className="text-[9px] text-slate-400 sm:text-[10px]">
                    이번 주 보강
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">4</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-2 sm:p-3">
                  <p className="text-[9px] text-slate-400 sm:text-[10px]">
                    질문 처리
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">12</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-2 sm:p-3">
                  <p className="text-[9px] text-slate-400 sm:text-[10px]">
                    관리 학생
                  </p>
                  <p className="mt-1 text-base font-semibold sm:text-lg">18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 – 데이터 기반 철학 */}
      <section className="flex bg-white text-black">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12 md:py-16 md:min-h-[60vh] md:justify-center">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:gap-8">
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl md:text-3xl">
                데이터로 설계하는 수업 철학
              </h2>
              <p className="mt-3 text-xs text-slate-700 sm:text-sm">
                Tesla가 주행 데이터를 기반으로 계속 업데이트되듯, 수업 역시
                학생 데이터를 기반으로 매 시간 조정됩니다.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-800 sm:text-sm">
                <li>• 학생별 오답/실수 유형 기록</li>
                <li>• 수업 후 분석표를 기반으로 다음 시간 계획</li>
                <li>• 모의고사 성적 추이를 보고 전략 재설계</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 sm:p-5 sm:text-sm">
              <p>
                상담이 필요하시면 상단 메뉴의{" "}
                <span className="font-semibold">상담 문의</span> 섹션 또는
                카카오 채널을 통해 편하게 남겨 주세요.
              </p>
              <p className="mt-3 text-[11px] text-slate-500">
                실제 운영 시에는 이 영역에 자세한 상담 안내, 시간표, 위치,
                카카오 채널 링크 등을 추가할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-3 text-[11px] text-slate-500 sm:mt-8 sm:pt-4 sm:text-xs">
            © Smookths Math · 임경묵T
          </div>
        </div>
      </section>
    </main>
  );
}
