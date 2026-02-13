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

export default function ParentsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO – 학부모 인트로 */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 md:px-10 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.45),transparent_55%),radial-gradient(circle_at_bottom,_rgba(8,47,73,0.7),transparent_65%)] opacity-70" />

        <motion.div
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
          variants={sectionFadeUp}
          initial="hidden"
          animate="visible"
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.28em] text-slate-300 md:text-xs">
            PARENT GUIDE · IM MATH STUDIO
          </p>
          <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl md:text-[38px] md:leading-[1.18]">
            자녀 수학 현황을
            <br className="hidden sm:block" />
            <span className="text-slate-100">데이터로</span>
          </h1>
          <p className="mt-4 max-w-xl text-[11px] text-slate-200 sm:text-sm md:text-base md:text-slate-300">
            수업·관리·보강·질문을 한눈에. 감이 아닌 데이터로 설명합니다.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <a
              href="/students"
              className="rounded-full bg-white px-5 py-2 font-semibold text-black shadow-sm transition hover:bg-slate-100 sm:px-6 sm:py-2.5"
            >
              학생용 안내
            </a>
            <a
              href="/makeup"
              className="rounded-full border border-slate-400 px-5 py-2 text-slate-100 transition hover:border-slate-200 hover:bg-white/5 sm:px-6 sm:py-2.5"
            >
              📅 보강 예약
            </a>
          </div>

          <p className="mt-4 text-[10px] text-slate-400 sm:text-[11px]">
            * 일부 화면은 예시입니다.
          </p>
        </motion.div>
      </section>

      {/* SECTION 1 – 수업/관리 구조 설명 */}
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
              SYSTEM OVERVIEW
            </p>
            <h2 className="mt-2 text-xl font-semibold md:text-2xl">
              구조화된 관리 시스템
            </h2>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              수업–숙제–오답–보강–성취도, 한 흐름.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
            <OverviewCard
              title="수업 구조"
              desc="개념을 단순 암기가 아닌 ‘구조’로 이해하도록 지도합니다."
              bullets={[
                "단원·개념 간 연결 구조 설명",
                "핵심 예제 위주 훈련",
                "실전형 문제와 병행",
              ]}
            />
            <OverviewCard
              title="숙제 · 오답 관리"
              desc="학생이 직접 사이트에 틀린 번호와 질문을 입력합니다."
              bullets={[
                "구글폼/웹폼 기반 오답 입력",
                "오답 데이터 자동 누적",
                "유형별·단원별 취약점 파악",
              ]}
            />
            <OverviewCard
              title="보강 · 성취도 관리"
              desc="필요한 학생에게 필요한 시점에만 보강을 배정합니다."
              bullets={[
                "온라인 보강 예약 시스템",
                "출석·보강 내역 기록",
                "성취도·모의고사 성적과 연계",
              ]}
            />
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 – 학부모가 보게 될 정보 (대시보드 느낌) */}
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
              PARENT VIEW
            </p>
            <h2 className="mt-2 text-xl font-semibold sm:text-2xl md:text-3xl">
              자녀의 공부 상황을
              <br className="hidden sm:block" />
              <span className="text-slate-100">이렇게 정리해서 안내드립니다</span>
            </h2>
            <p className="mt-3 text-xs text-slate-200 sm:text-sm">
              “열심히 하고 있습니다”가 아니라, 실제로{" "}
              <span className="font-semibold text-white">어떤 단원에서 몇 문제를
              틀렸는지, 성적이 어떻게 변화하는지</span>를 데이터를 기반으로 설명드립니다.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-100 sm:text-sm">
              <li>• 최근 4~8주간 단원별 오답률 요약</li>
              <li>• 모의고사 및 내신 성적 추이 그래프</li>
              <li>• 보강·질문 기록과 피드백 요약</li>
            </ul>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5 shadow-xl sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                DASHBOARD EXAMPLE
              </p>
              <h3 className="mt-2 text-base font-semibold sm:text-lg">
                예시 대시보드 카드
              </h3>
              <p className="mt-2 text-[11px] text-slate-300 sm:text-xs">
                아래 정보들은 실제 운영 시, 학부모 상담 또는 안내 메시지에서
                활용되는 대표 지표들입니다.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-200 sm:gap-3 sm:text-xs">
                <StatBox label="최근 4주 오답 상위 단원" value="수열 · 함수" />
                <StatBox label="최근 모의고사 평균" value="3등급" />
                <StatBox label="주간 보강 횟수" value="1회 이내" />
              </div>

              <p className="mt-4 text-[11px] text-slate-400 sm:text-xs">
                * 실제 값은 자녀의 데이터에 따라 자동으로 갱신되며,
                학부모 상담 시 이 데이터를 기반으로 구체적인 계획을 제안드립니다.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 – 소통 원칙 / 학부모와의 약속 */}
      <motion.section
        className="bg-white text-black"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 sm:text-xs">
                COMMUNICATION POLICY
              </p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl md:text-3xl">
                학부모님과의 소통 원칙
              </h2>
              <p className="mt-3 text-xs text-slate-700 sm:text-sm">
                수업 방향과 관리 방식은 항상{" "}
                <span className="font-semibold">
                  “학생의 장기적인 성장을 최우선”
                </span>
                으로 두고 설계합니다. 그 과정에서 학부모님께는 다음 원칙에 따라
                안내드립니다.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-800 sm:text-sm">
                <li>• 단기 성적뿐 아니라 개념 이해도와 학습 태도를 함께 보고 판단합니다.</li>
                <li>• 필요 이상의 과도한 보강·숙제는 지양합니다.</li>
                <li>• 정기적으로 학습 현황을 정리해 보고 드립니다.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 sm:p-5 sm:text-sm">
              <p>
                상세 상담이 필요하신 경우, 상단 메뉴의{" "}
                <span className="font-semibold">상담 문의</span> 섹션 또는
                카카오 채널을 통해 편하게 남겨 주세요.
              </p>
              <p className="mt-3 text-[11px] text-slate-500 sm:text-xs">
                상담 요청 시에는 자녀의 학교, 학년, 최근 수학 성적, 고민하시는
                부분(예: 내신, 수능, 기초 부족 등)을 간단히 적어 주시면
                보다 정확한 안내가 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 – 자주 받는 질문 (FAQ) */}
      <motion.section
        className="bg-slate-950 text-white"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12 md:py-16">
          <header className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 sm:text-xs">
              FAQ
            </p>
            <h2 className="mt-2 text-xl font-semibold md:text-2xl">
              학부모님들이 자주 물어보시는 내용
            </h2>
          </header>

          <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            <FaqItem
              q="보강은 얼마나 자주 진행되나요?"
              a="보강은 ‘많이 할수록 좋다’는 방식으로 운영하지 않습니다. 오답 데이터와 수업 이해도를 보고, 꼭 필요할 때만 배정하거나 신청을 권유드립니다."
            />
            <FaqItem
              q="숙제를 다 못 해오면 어떻게 되나요?"
              a="단순히 혼내기보다는, 왜 못 했는지를 먼저 파악합니다. 시간 관리 문제인지, 난이도 문제인지에 따라 숙제량·유형을 조정하고, 필요시 보강이나 추가 설명으로 보완합니다."
            />
            <FaqItem
              q="수업 진도는 학교에 맞추나요, 선행을 하나요?"
              a="학생의 현재 실력과 목표에 따라 달라집니다. 내신이 중요할 시기에는 학교 진도와 시험 일정을 기준으로 맞추고, 장기적으로 수능을 준비해야 하는 학생은 일정 부분 선행과 심화를 병행합니다."
            />
          </div>

          <div className="mt-8 border-t border-slate-700 pt-4 text-[11px] text-slate-400 sm:text-xs">
            이 외의 내용은 언제든지 상담을 통해 개별적으로 안내드리겠습니다.
          </div>
        </div>
      </motion.section>
    </main>
  );
}

/* ---- 작은 컴포넌트들 ---- */

type OverviewCardProps = {
  title: string;
  desc: string;
  bullets: string[];
};

function OverviewCard({ title, desc, bullets }: OverviewCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-slate-400 hover:bg-white sm:p-6">
      <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
      <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">{desc}</p>
      <ul className="mt-3 space-y-1 text-[11px] text-slate-700 sm:mt-4 sm:text-xs">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

type StatBoxProps = {
  label: string;
  value: string;
};

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-slate-900 p-2 sm:p-3">
      <p className="text-[9px] text-slate-400 sm:text-[10px]">{label}</p>
      <p className="mt-1 text-base font-semibold sm:text-lg">{value}</p>
    </div>
  );
}

type FaqItemProps = {
  q: string;
  a: string;
};

function FaqItem({ q, a }: FaqItemProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-xs font-semibold text-slate-50 sm:text-sm">Q. {q}</p>
      <p className="mt-1 text-[11px] text-slate-300 sm:mt-2 sm:text-xs">A. {a}</p>
    </div>
  );
}
