const INTRO_VIDEO_URL = "https://youtu.be/SLaBGKGeveo";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-800">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* 제목 */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            임경묵T 수업영상
          </h1>
          <p className="text-slate-600">
            실제 수업 영상 일부를 통해
            수업 설명 방식과 흐름을 확인하실 수 있습니다.
          </p>
        </header>

        {/* 1학기 소개영상 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1학기 소개영상</h2>
          <a
            href={INTRO_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full max-w-md items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg sm:gap-6 sm:px-8 sm:py-6"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 group-hover:bg-red-100 sm:h-16 sm:w-16">
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-semibold text-slate-900 sm:text-[19px]">
                1학기 소개영상
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 sm:text-[14px]">
                영상 보러가기 →
              </p>
            </div>
          </a>
        </section>

        {/* 고등부 수업 영상 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">고등부 수업 영상</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <a
              href="https://youtu.be/lrqH3Jv88x0"
              target="_blank"
              className="block rounded-xl border bg-white p-5 hover:bg-slate-50 transition"
            >
              <h3 className="font-semibold text-lg">
                고1 S1반 수업 영상
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                대치동 내신에서의 변별력을 챙길수있는 컴팩트한 심화수업
              </p>
              <p className="mt-3 text-sm font-semibold text-blue-600">
                ▶ 유튜브에서 영상 보기
              </p>
            </a>

            <a
              href="https://youtu.be/9C-NCcWhbK8"
              target="_blank"
              className="block rounded-xl border bg-white p-5 hover:bg-slate-50 transition"
            >
              <h3 className="font-semibold text-lg">
                고1 B3반 수업 영상
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                "기초부터 심화까지 너도할수있어"
              </p>
              <p className="mt-3 text-sm font-semibold text-blue-600">
                ▶ 유튜브에서 영상 보기
              </p>
            </a>
          </div>
        </section>

        {/* 고등 수업 영상 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">고등부 특강 수업 영상</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <a
              href="https://youtu.be/r0sUTFws8No"
              target="_blank"
              className="block rounded-xl border bg-white p-5 hover:bg-slate-50 transition"
            >
              <h3 className="font-semibold text-lg">
                미적분 1 기본 + 심화 특강
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                정의 → 그래프 → 문제 적용을 한 흐름으로 설명합니다.
              </p>
              <p className="mt-3 text-sm font-semibold text-blue-600">
                ▶ 유튜브에서 영상 보기
              </p>
            </a>
          </div>
        </section>

        {/* 상담 유도 */}
        <section className="rounded-2xl border bg-white p-8">
          <h2 className="text-xl font-bold">
            이 수업이 우리 아이에게 맞을지 궁금하시다면
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            영상만으로는 판단하기 어려울 수 있습니다.
            현재 상황을 기준으로 상담을 통해 안내드립니다.
          </p>

          <div className="mt-5">
            <a
              href="/#contact"
              className="inline-block rounded-xl bg-blue-600 px-7 py-3 text-sm md:text-base font-semibold text-white hover:bg-blue-700 transition"
            >
              상담 / 문의하기
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
