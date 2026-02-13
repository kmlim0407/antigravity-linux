"use client";

import { motion } from "framer-motion";

const sectionFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function StudentsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO – 학생 전용 인트로 */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 md:px-10 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.45),transparent_55%),radial-gradient(circle_at_bottom,_rgba(30,64,175,0.6),transparent_65%)] opacity-70" />

        <motion.div
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
          variants={sectionFadeUp}
          initial="hidden"
          animate="visible"
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.28em] text-slate-300 md:text-xs">
            STUDENT GUIDE · IM MATH STUDIO
          </p>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-3xl md:text-[40px] md:leading-[1.12]">
            수업·숙제·보강
            <br className="hidden sm:block" />
            <span className="text-slate-100">한 곳에서</span>
          </h1>
          <p className="mt-4 max-w-xl text-[11px] text-slate-200 sm:text-sm md:text-base md:text-slate-300">
            수업 흐름, 숙제, 오답, 보강 신청 — 매 수업 후 5분이면 끝.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <a
              href="/qna"
              className="rounded-full bg-white px-5 py-2 font-semibold text-black shadow-sm transition hover:bg-slate-100 sm:px-6 sm:py-2.5"
            >
              ❓ 오답 / 질문 제출하기
            </a>
            <a
              href="/makeup"
              className="rounded-full border border-slate-400 px-5 py-2 text-slate-100 transition hover:border-slate-200 hover:bg-white/5 sm:px-6 sm:py-2.5"
            >
              📅 보강 예약하러 가기
            </a>
          </div>

          <p className="mt-4 text-[10px] text-slate-400 sm:text-[11px]">
            * 실제 페이지와 연결됨
          </p>
        </motion.div>
      </section>

      {/* SECTION 1 – 수업 참여 흐름 3단계 */}
      <motion.section
        className="bg-white text-black"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:py-12 md:py-16">
          <header className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 sm:text-xs">
              HOW TO USE
            </p>
            <h2 className="mt-2 text-xl font-semibold md:text-2xl">
              사용 방법
            </h2>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              수업–숙제–오답–보강, 세 단계.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
            <StepCard
              step="01"
              title="수업 듣기 & 체크"
              desc="수업 시간에 선생님이 강조한 개념과 유형에 표시해 두세요. 중요한 예제 번호는 따로 체크해 두면 좋습니다."
              bullets={["개념 흐름 위주로 듣기", "예제·유형 번호 표시", "모르는 건 바로 질문하기"]}
            />
            <StepCard
              step="02"
              title="숙제 & 오답 입력"
              desc="수업 후 숙제를 풀고, 틀린 번호는 이 사이트의 오답/질문 페이지에 그대로 입력합니다."
              bullets={["숙제 풀면서 체크", "틀린 번호 사이트에 입력", "필요하면 질문까지 남기기"]}
            />
            <StepCard
              step="03"
              title="보강 & 관리"
              desc="필요하면 보강 예약 페이지에서 원하는 시간대를 선택해 신청하면 됩니다."
              bullets={["보강 필요하면 바로 신청", "출석/보강 내역 자동 기록", "선생님이 다음 수업에 반영"]}
            />
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 – 학생에게 주는 약속 */}
      <motion.section
        className="bg-slate-950"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-12 md:flex-row md:items-center md:gap-10 md:py-16">
          <div className="flex-1">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-teal-300 sm:text-xs">
              PROMISE TO STUDENTS
            </p>
            <h2 className="mt-2 text-xl font-semibold sm:text-2xl md:text-3xl">
              “열심히만 해라”가 아니라
              <br className="hidden sm:block" />
              <span className="text-slate-100">데이터로 도와주는 수업</span>
            </h2>
            <p className="mt-3 text-xs text-slate-200 sm:text-sm">
              그냥 문제 많이 풀라고만 하지 않습니다. 네가 남긴 오답 데이터와
              모의고사 결과를 바탕으로, 어떤 단원을 어떻게 다시 잡아야 할지
              같이 결정합니다.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-100 sm:text-sm">
              <li>• 같은 실수를 반복하지 않도록, 유형별로 정리해 줍니다.</li>
              <li>• 실력에 맞는 난이도와 속도를 함께 조절합니다.</li>
              <li>• 목표 대학 / 점수에 맞는 계획을 같이 세웁니다.</li>
            </ul>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5 shadow-xl sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                EXAMPLE VIEW
              </p>
              <h3 className="mt-2 text-base font-semibold sm:text-lg">
                실제 화면에서는 이런 것들이 보입니다
              </h3>
              <ul className="mt-3 space-y-2 text-[11px] text-slate-300 sm:text-xs">
                <li>• 최근 4주간 네 오답이 가장 많이 쌓인 단원</li>
                <li>• 시험별 점수 변화 그래프</li>
                <li>• 보강/질문 기록과 피드백 요약</li>
              </ul>
              <p className="mt-3 text-[11px] text-slate-400 sm:text-xs">
                아직은 레이아웃만 만들어 둔 상태이며, 나중에 Notion/DB와 연동하면
                실제 데이터가 자동으로 채워집니다.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 – 자주 묻는 질문 (간단 FAQ) */}
      <motion.section
        className="bg-white text-black"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12 md:py-16">
          <header className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 sm:text-xs">
              FAQ
            </p>
            <h2 className="mt-2 text-xl font-semibold md:text-2xl">
              학생들이 자주 하는 질문
            </h2>
          </header>

          <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            <FaqItem
              q="오답 입력을 깜빡하면 어떻게 되나요?"
              a="당장 혼나지는 않습니다. 다만 네 오답 데이터가 비게 되기 때문에, 다음 수업에서 뭘 도와줘야 할지 정확히 보이지 않아요. 가능하면 그날 안에, 늦어도 다음 수업 전까지는 꼭 입력해 주세요."
            />
            <FaqItem
              q="보강은 마음대로 신청해도 되나요?"
              a="가능한 시간대를 보고 선택하면 되지만, 너무 잦은 보강은 피하는 게 좋습니다. 보강 신청 전, 평소 수업과 숙제만으로 해결 가능한지 먼저 고민해 보고 신청해 주세요."
            />
            <FaqItem
              q="질문이 너무 사소해도 올려도 되나요?"
              a="당연히 됩니다. 오히려 사소해 보이는 질문일수록 개념의 뿌리와 연결된 경우가 많아요. 대신, 문제 사진과 네 생각(어디까지는 이해했는지)을 한 줄만이라도 함께 적어 주세요."
            />
          </div>

          <div className="mt-8 border-t border-slate-200 pt-4 text-[11px] text-slate-500 sm:text-xs">
            더 궁금한 점이 있으면{" "}
            <span className="font-medium">질문 게시판 / 카카오 채널</span>로
            편하게 남겨 주세요.
          </div>
        </div>
      </motion.section>
    </main>
  );
}

/* --- 작은 컴포넌트들 --- */

type StepCardProps = {
  step: string;
  title: string;
  desc: string;
  bullets: string[];
};

function StepCard({ step, title, desc, bullets }: StepCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-slate-400 hover:bg-white sm:p-6">
      <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-500 sm:text-xs">
        STEP {step}
      </p>
      <h3 className="mt-1 text-base font-semibold sm:text-lg">{title}</h3>
      <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">{desc}</p>
      <ul className="mt-3 space-y-1 text-[11px] text-slate-700 sm:mt-4 sm:text-xs">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

type FaqItemProps = {
  q: string;
  a: string;
};

function FaqItem({ q, a }: FaqItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-xs font-semibold text-slate-900 sm:text-sm">Q. {q}</p>
      <p className="mt-1 text-[11px] text-slate-700 sm:mt-2 sm:text-xs">A. {a}</p>
    </div>
  );
}
