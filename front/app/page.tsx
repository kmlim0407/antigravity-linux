export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero 섹션 */}
      <section className="border-b bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-50">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
          {/* 왼쪽: 프로필 + 카피 */}
          <div className="flex-1">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-5">
              {/* 프로필 사진 */}
              <img
                src="/profile.jpg"
                alt="임경묵T 프로필"
                className="h-24 w-24 rounded-full object-cover border border-slate-700 shadow-lg"
              />

              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  임경묵<span className="text-blue-400">T</span>
                </h1>
                <p className="mt-2 text-sm md:text-base text-slate-300">
                  중·고등 수학 전문 강사 · 구조로 설명하는 수업
                </p>
              </div>
            </div>

            {/* 태그 라인 */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs md:justify-start md:text-sm">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-200 ring-1 ring-blue-500/40">
                개념 → 유형 → 실전 일관 커리큘럼
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200 ring-1 ring-emerald-500/40">
                데이터 기반 오답 분석
              </span>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-200 ring-1 ring-violet-500/40">
                학생별 맞춤 학습 플랜
              </span>
            </div>

            {/* 설명 문구 */}
            <p className="mt-6 max-w-xl text-sm md:text-base text-slate-300">
              단순히 문제를 많이 풀게 하는 수업이 아니라,  
              <span className="font-semibold">“왜 이렇게 푸는지”가 남는 수업</span>을
              지향합니다.  
              중등 내신부터 고등 모의고사·수능까지, 하나의 흐름으로 연결해 지도합니다.
            </p>

            {/* CTA 버튼 */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href="/students"
                className="rounded-xl bg-blue-500 px-7 py-3 text-sm md:text-base font-semibold text-white shadow hover:bg-blue-600 transition"
              >
                학생용 안내 보기
              </a>
              <a
                href="/parents"
                className="rounded-xl border border-slate-500/70 px-7 py-3 text-sm md:text-base font-semibold text-slate-100 hover:bg-slate-800/60 transition"
              >
                학부모용 안내 보기
              </a>
              <a
                href="/portfolio"
                className="rounded-xl border border-slate-500/70 px-7 py-3 text-sm md:text-base font-semibold text-slate-100 hover:bg-slate-800/60 transition"
              >
                수업 포트폴리오(영상) 보기
              </a>
            </div>
          </div>

          {/* 오른쪽: 신뢰 포인트 카드 */}
          <div className="flex-1 md:max-w-sm">
            <div className="rounded-2xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-slate-700/70 backdrop-blur">
              <h2 className="text-base md:text-lg font-semibold text-slate-50">
                이런 흐름으로 수업합니다
              </h2>
              <ul className="mt-4 space-y-3 text-xs md:text-sm text-slate-200">
                <li>• 개념을 구조로 정리하고, 예제를 통해 바로 적용합니다.</li>
                <li>• 학교·기출 문제를 유형별로 묶어 사고 과정을 훈련합니다.</li>
                <li>• 시험 전에는 실제 난이도에 맞춘 실전 모의·내신 대비를 합니다.</li>
                <li>• 오답 데이터와 실수를 기록해 다음 수업에 반영합니다.</li>
              </ul>
              <p className="mt-4 text-[11px] md:text-xs text-slate-400">
                자세한 내용은 상단의 <span className="font-semibold">학생용 안내</span>와{" "}
                <span className="font-semibold">학부모용 안내</span>에서 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3가지 수업 철학 카드 */}
      <section className="border-b bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            임경묵T 수업의 3가지 철학
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            눈앞의 점수만이 아니라, 장기적인 수학 체력을 만드는 것을 목표로 합니다.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="text-2xl">📌</div>
              <h3 className="mt-3 text-base md:text-lg font-semibold">
                구조가 보이는 개념
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                공식 암기가 아니라,  
                “왜 이런 식이 나오는지”를 그림·상황과 함께 설명합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="text-2xl">🧩</div>
              <h3 className="mt-3 text-base md:text-lg font-semibold">
                연결되는 유형 훈련
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                비슷한 구조의 문제를 묶어서  
                “이 문제와 저 문제가 어떻게 같은지”를 보게 합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="text-2xl">📊</div>
              <h3 className="mt-3 text-base md:text-lg font-semibold">
                데이터 기반 피드백
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                학생별 오답·실수 유형을 기록하고,  
                다음 수업과 과제에 그대로 반영합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 커리큘럼 흐름 섹션 */}
      <section className="border-b bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            한 눈에 보는 수업 흐름
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            단기 특강이 아니라, 개념부터 실전까지 이어지는 커리큘럼으로 지도합니다.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-sm md:text-base">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm border border-slate-200">
                ① 현재 수준 진단 · 상담
              </span>
              <span className="text-slate-400">→</span>
              <span className="rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm border border-slate-200">
                ② 개념 정리 · 구멍 메우기
              </span>
              <span className="text-slate-400">→</span>
              <span className="rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm border border-slate-200">
                ③ 유형별 문제 훈련
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm border border-slate-200">
                ④ 내신/모의고사 실전 대비
              </span>
              <span className="text-slate-400">→</span>
              <span className="rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm border border-slate-200">
                ⑤ 시험 후 분석 · 다음 계획
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 소개 + 이런 학생에게 맞습니다 섹션 */}
      <section className="border-b bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-[1.6fr,1.4fr]">
          {/* 임경묵T 소개 */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              임경묵T는 이런 방식으로 지도합니다
            </h2>
            <div className="mt-4 space-y-2 text-sm md:text-base text-slate-700">
              <p>• 문제 풀이 “스킬”보다, 개념과 구조를 먼저 세웁니다.</p>
              <p>• 같은 문제를 반복하기보다는, 비슷한 구조의 문제를 연결해 줍니다.</p>
              <p>• 학생이 어디서 막히는지, 말로 설명할 수 있게 만드는 것을 목표로 합니다.</p>
              <p>• 혼자 공부할 때 어떤 순서로 무엇을 해야 하는지도 함께 설계합니다.</p>
            </div>
          </div>

          {/* 이런 학생에게 잘 맞습니다 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              이런 학생에게 잘 맞습니다
            </h3>
            <ul className="mt-4 space-y-2 text-sm md:text-base text-slate-700">
              <li>• 개념은 안다고 느끼지만, 문제 적용이 잘 안 되는 학생</li>
              <li>• 시험 때만 되면 실수가 반복되고, 원인을 모르겠는 학생</li>
              <li>• 양치기 공부보다 “이해 기반 공부”를 하고 싶은 학생</li>
              <li>• 중·장기적으로 수학 점수를 안정적으로 올리고 싶은 학생</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 상담 / 문의 섹션 (상단 메뉴에서 #contact로 연결되는 곳) */}
      <section
        id="contact"
        className="bg-slate-900 px-6 py-20 text-slate-50 text-center"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">상담 / 문의</h2>
          <p className="text-sm md:text-base text-slate-300">
            학생의 현재 상황과 목표, 학교 내신 난이도 등을 기준으로
            <br className="hidden md:block" />
            수업 방향이 맞을지, 어떤 계획이 현실적인지 함께 이야기합니다.
          </p>
          <p className="text-xs md:text-sm text-slate-400">
            구체적인 연락처, 상담 방식(카카오톡/문자/전화 등)은 추후 이 영역에
            정리해 넣을 수 있습니다.
          </p>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} 임경묵T. All rights reserved.
      </footer>
    </main>
  );
}
