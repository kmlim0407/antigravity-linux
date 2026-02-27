const INTRO_VIDEO = {
  id: "SLaBGKGeveo",
  title: "1학기 소개영상",
  desc: "1학기 전체 운영 방향, 수업 컨셉, 시간표, 교재(IM LOGIC) 등을 한 번에 소개합니다.",
  descShort: "1학기 운영 방향, 수업 컨셉, 교재 소개.",
  duration: "12:34",
};

const CLASS_VIDEOS = [
  {
    id: "lrqH3Jv88x0",
    title: "고1 S1반 수업 영상",
    desc: "대치동 내신에서 변별력을 챙기는 컴팩트한 심화 수업. 내신 고득점 목표반.",
    tags: [
      { label: "심화", color: "text-violet-700 bg-violet-50 border-violet-200" },
      { label: "고1", color: "text-blue-700 bg-blue-50 border-blue-200" },
    ],
    duration: "45:20",
  },
  {
    id: "9C-NCcWhbK8",
    title: "고1 B3반 수업 영상",
    desc: "기초부터 심화까지 단계별로. 기초 탄탄 + 심화 문제까지 한 번에.",
    tags: [
      { label: "기초~심화", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
      { label: "고1", color: "text-blue-700 bg-blue-50 border-blue-200" },
    ],
    duration: "52:10",
  },
];

const SPECIAL_VIDEOS = [
  {
    id: "r0sUTFws8No",
    title: "미적분 1 기본+심화 특강",
    desc: "정의 → 그래프 → 문제 적용을 한 흐름으로. 미적분 1 핵심 정리.",
    tags: [
      { label: "특강", color: "text-amber-700 bg-amber-50 border-amber-200" },
      { label: "미적분", color: "text-rose-700 bg-rose-50 border-rose-200" },
    ],
    duration: "1:03:45",
  },
];

function Thumbnail({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt={title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition group-hover:bg-red-600 group-hover:scale-110 sm:h-14 sm:w-14">
          <svg className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${color}`}>
      {label}
    </span>
  );
}

function Duration({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 sm:text-[12px]">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      {time}
    </span>
  );
}

export default function PortfolioPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden bg-white px-3 py-8 sm:px-4 sm:py-16 lg:py-20 xl:py-24"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-5xl min-w-0 space-y-10 sm:space-y-14 lg:max-w-6xl lg:space-y-16 xl:max-w-7xl">
        {/* ── 헤더 ── */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            수업영상
          </h1>
          <p className="text-[13px] text-slate-500 sm:text-sm lg:text-base">
            실제 수업 방식과 흐름을 영상으로 확인하세요.
          </p>
        </header>

        {/* ── 1학기 소개영상 (히어로) ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
              1학기 소개영상
            </h2>
            <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
              OVERVIEW
            </span>
          </div>

          <a
            href={`https://youtu.be/${INTRO_VIDEO.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
          >
            <Thumbnail videoId={INTRO_VIDEO.id} title={INTRO_VIDEO.title} />
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-slate-900 sm:text-base lg:text-lg">
                  {INTRO_VIDEO.title}
                </h3>
                <Duration time={INTRO_VIDEO.duration} />
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
                <span className="block sm:hidden">{INTRO_VIDEO.descShort}</span>
                <span className="hidden sm:block">{INTRO_VIDEO.desc}</span>
              </p>
            </div>
          </a>
        </section>

        {/* ── 고등부 수업 영상 ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
              고등부 수업 영상
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 sm:text-[11px]">
              CLASS
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
            <span className="block sm:hidden">반별 수업 영상으로 설명 방식·난이도를 확인하세요.</span>
            <span className="hidden sm:block">
              반별 실제 수업 영상으로 설명 방식과 난이도를 확인할 수 있습니다. 실제 수업 분위기와 진도, 문제 난이도 등을 미리 체험해 보세요.
            </span>
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {CLASS_VIDEOS.map((v) => (
              <a
                key={v.id}
                href={`https://youtu.be/${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
              >
                <Thumbnail videoId={v.id} title={v.title} />
                <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    {v.tags.map((t) => (
                      <Tag key={t.label} label={t.label} color={t.color} />
                    ))}
                    <Duration time={v.duration} />
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 sm:text-[15px]">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
                    {v.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 고등부 특강 ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
              고등부 특강
            </h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 sm:text-[11px]">
              SPECIAL
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
            <span className="block sm:hidden">단원별 집중 특강, 개념부터 적용까지.</span>
            <span className="hidden sm:block">
              단원별 집중 특강으로 개념부터 적용까지 한 흐름으로 학습합니다. 결석한 단원 복습이나 약한 부분 보완 시 활용하기 좋습니다.
            </span>
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {SPECIAL_VIDEOS.map((v) => (
              <a
                key={v.id}
                href={`https://youtu.be/${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
              >
                <Thumbnail videoId={v.id} title={v.title} />
                <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    {v.tags.map((t) => (
                      <Tag key={t.label} label={t.label} color={t.color} />
                    ))}
                    <Duration time={v.duration} />
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 sm:text-[15px]">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
                    {v.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 맞춤 상담 CTA ── */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 lg:p-10">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg lg:text-xl">
            맞춤 상담
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-500 sm:text-[13px] lg:text-[14px]">
            <span className="block sm:hidden">우리 아이에게 맞는지 궁금하시면 상담 안내드립니다.</span>
            <span className="hidden sm:block">
              이 수업이 우리 아이에게 맞을지 궁금하시다면 상담을 통해 안내드립니다. 현재 성적, 목표, 일정을 말씀해 주시면 맞춤 제안을 드립니다.
            </span>
          </p>
          <a
            href="/#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-slate-800 sm:text-[14px]"
          >
            상담 / 문의
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </section>
      </div>
    </main>
  );
}
