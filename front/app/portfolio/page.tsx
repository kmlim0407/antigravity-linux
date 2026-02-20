const INTRO_VIDEO_URL = "https://youtu.be/SLaBGKGeveo";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-16 lg:py-20 xl:py-24 2xl:py-28" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-5xl min-w-0 space-y-8 sm:space-y-12 lg:max-w-6xl lg:space-y-14 xl:max-w-7xl xl:space-y-16 2xl:max-w-[80rem] 2xl:space-y-20">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">수업영상</h1>
          <p className="text-[13px] text-slate-600 sm:text-sm lg:text-base xl:text-lg">수업 방식·흐름 확인</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 sm:text-xl lg:text-2xl xl:text-3xl">1학기 소개영상</h2>
          <p className="text-[12px] leading-relaxed text-slate-600 sm:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-base"><span className="block sm:hidden">1학기 운영 방향, 수업 컨셉, 교재 소개.</span><span className="hidden sm:block">1학기 전체 운영 방향, 수업 컨셉, 시간표, 교재(IM LOGIC) 등을 한 번에 소개합니다. 수업이 어떻게 진행되는지 전체 그림을 파악하는 데 도움이 됩니다.</span></p>
          <a href={INTRO_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="group flex max-w-md items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 lg:gap-5 lg:px-6 lg:py-5 xl:gap-6 xl:px-8 xl:py-6 2xl:px-10 2xl:py-7 shadow-sm transition hover:border-slate-300 hover:shadow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[4.5rem] xl:w-[4.5rem] 2xl:h-20 2xl:w-20">
              <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-slate-900 sm:text-base lg:text-lg xl:text-xl">1학기 소개영상</h3>
              <p className="mt-0.5 text-[12px] text-slate-500 sm:text-[13px]">보기 →</p>
            </div>
          </a>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 sm:text-xl lg:text-2xl xl:text-3xl">고등부 수업 영상</h2>
          <p className="text-[12px] leading-relaxed text-slate-600 sm:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-base"><span className="block sm:hidden">반별 수업 영상으로 설명·난이도 확인.</span><span className="hidden sm:block">반별 실제 수업 영상으로 설명 방식과 난이도를 확인할 수 있습니다. 고1 S1반은 내신 변별력을 위한 심화 위주, B3반은 기초부터 단계별로 진행됩니다. 실제 수업 분위기와 진도, 문제 난이도 등을 미리 체험해 보세요.</span></p>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 xl:gap-8">
            <a href="https://youtu.be/lrqH3Jv88x0" target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-slate-200 bg-white p-4 transition lg:p-5 xl:p-6 2xl:p-7 hover:border-slate-300 hover:bg-slate-50">
              <h3 className="font-semibold text-slate-900">고1 S1반</h3>
              <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">대치동 내신에서 변별력을 챙기는 컴팩트한 심화 수업. 내신 고득점 목표반.</p>
              <p className="mt-2 text-[12px] font-medium text-slate-700">영상 보기 →</p>
            </a>
            <a href="https://youtu.be/9C-NCcWhbK8" target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-slate-200 bg-white p-4 transition lg:p-5 xl:p-6 2xl:p-7 hover:border-slate-300 hover:bg-slate-50">
              <h3 className="font-semibold text-slate-900">고1 B3반</h3>
              <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">기초부터 심화까지 단계별로. 기초 탄탄 + 심화 문제까지 한 번에.</p>
              <p className="mt-2 text-[12px] font-medium text-slate-700">영상 보기 →</p>
            </a>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 sm:text-xl lg:text-2xl xl:text-3xl">고등부 특강</h2>
          <p className="text-[12px] leading-relaxed text-slate-600 sm:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-base"><span className="block sm:hidden">단원별 집중 특강, 개념→적용 흐름.</span><span className="hidden sm:block">단원별 집중 특강으로 개념부터 적용까지 한 흐름으로 학습할 수 있습니다. 정의 → 그래프 → 문제 적용 순으로 이어지는 수업 흐름을 영상에서 확인할 수 있으며, 결석한 단원 복습이나 약한 부분 보완 시 활용하기 좋습니다.</span></p>
          <a href="https://youtu.be/r0sUTFws8No" target="_blank" rel="noopener noreferrer" className="block max-w-md rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50">
            <h3 className="font-semibold text-slate-900">미적분 1 기본+심화 특강</h3>
            <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">정의 → 그래프 → 문제 적용을 한 흐름으로. 미적분 1 핵심 정리.</p>
            <p className="mt-2 text-[12px] font-medium text-slate-700">영상 보기 →</p>
          </a>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 lg:p-7 xl:p-8 2xl:p-10">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg xl:text-xl 2xl:text-2xl">맞춤 상담</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600 sm:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-base"><span className="block sm:hidden">맞는지 궁금하시면 상담 안내드립니다.</span><span className="hidden sm:block">이 수업이 우리 아이에게 맞을지 궁금하시다면 상담을 통해 안내드립니다. 영상만으로는 판단하기 어려울 수 있으니, 현재 성적·목표·일정을 말씀해 주시면 맞춤 제안을 드립니다.</span></p>
          <a href="/#contact" className="mt-4 inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-700 lg:px-6 lg:py-3 lg:text-[14px] xl:px-7 xl:py-3.5 xl:text-base transition hover:bg-slate-50 sm:text-[14px]">상담 / 문의</a>
        </section>
      </div>
    </main>
  );
}
