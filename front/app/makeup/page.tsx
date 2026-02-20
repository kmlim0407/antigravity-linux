export default function MakeupPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[80rem]">
        <header className="mb-6 space-y-2 sm:mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">보강 예약</p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">보강관리</h1>
          <p className="text-[12px] text-slate-600 sm:text-[13px] lg:text-[14px] xl:text-base">날짜·시간 선택 → 신청 → 확인 후 확정</p>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 xl:gap-10 2xl:gap-12">
          <aside className="space-y-4 lg:w-[32%]">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
              <p className="text-[12px] font-semibold text-slate-800">안내</p>
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 sm:text-xs">
                <li>· 시험 기간 보강 수요 많음</li>
                <li>· 당일 취소 자제</li>
                <li>· 개념/유형 보완 위주</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
              <p className="text-[12px] font-semibold text-slate-800">추천</p>
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 sm:text-xs">
                <li>· 자주 틀리는 단원 정리</li>
                <li>· 결석 수업 따라잡기</li>
                <li>· 개념→적용 연습</li>
              </ul>
            </div>
          </aside>

          <section className="flex-1">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6 xl:p-8 2xl:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">캘린더 예약</p>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">보강 예약</h2>
              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">아래에서 가능한 시간 선택</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/30">
                <iframe src="https://calendly.com/kmlim0407/meet-with-me" title="보강 예약" className="h-[500px] w-full sm:h-[600px] md:h-[700px] lg:h-[750px] xl:h-[800px] 2xl:h-[850px] border-0" />
              </div>
              <p className="mt-2 text-[10px] text-slate-500 sm:text-[11px]">예약 완료 시 확인 메일 발송</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
