"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ── 가상 데이터 ── */

type MockData = {
  name: string;
  class: string;
  grade: string;
  overall: number;
  subjects: { label: string; score: number; delta: number }[];
  weakAreas: { label: string; pct: number; color: string }[];
  recentTests: { label: string; score: number }[];
  habits: { label: string; value: number; unit: string }[];
  wrongPatterns: { label: string; count: number; color: string }[];
  memo: string;
};

function generateMock(name: string): MockData {
  const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number) =>
    Math.floor(min + ((seed * 7 + min * 13) % (max - min + 1)));
  const r2 = (min: number, max: number, offset: number) =>
    Math.floor(min + ((seed * 11 + offset * 17) % (max - min + 1)));

  return {
    name,
    class: ["고1 S1반", "고1 B3반", "고2 A반", "고2 B반"][seed % 4],
    grade: ["상위 5%", "상위 12%", "상위 20%", "상위 30%"][seed % 4],
    overall: r(68, 96),
    subjects: [
      { label: "미적분", score: r2(55, 98, 1), delta: r2(-8, 12, 10) },
      { label: "확률과 통계", score: r2(60, 95, 2), delta: r2(-5, 10, 20) },
      { label: "기하", score: r2(50, 92, 3), delta: r2(-10, 8, 30) },
      { label: "수열", score: r2(58, 97, 4), delta: r2(-6, 15, 40) },
      { label: "함수", score: r2(62, 99, 5), delta: r2(-4, 11, 50) },
      { label: "지수·로그", score: r2(55, 94, 6), delta: r2(-7, 9, 60) },
    ],
    weakAreas: [
      { label: "킬러 문항 정답률", pct: r2(20, 55, 1), color: "bg-red-500" },
      { label: "그래프 해석 정확도", pct: r2(35, 70, 2), color: "bg-amber-500" },
      { label: "조건 누락 빈도", pct: r2(10, 40, 3), color: "bg-orange-500" },
      { label: "시간 내 풀이 완료율", pct: r2(45, 80, 4), color: "bg-blue-500" },
    ],
    recentTests: [
      { label: "1월 모의", score: r2(60, 92, 1) },
      { label: "2월 단원", score: r2(55, 95, 2) },
      { label: "3월 모의", score: r2(58, 90, 3) },
      { label: "4월 단원", score: r2(62, 96, 4) },
      { label: "5월 중간", score: r2(65, 98, 5) },
    ],
    habits: [
      { label: "숙제 완수율", value: r2(70, 100, 1), unit: "%" },
      { label: "출석률", value: r2(85, 100, 2), unit: "%" },
      { label: "주간 질문 수", value: r2(1, 8, 3), unit: "회" },
      { label: "오답노트 작성률", value: r2(30, 90, 4), unit: "%" },
    ],
    wrongPatterns: [
      { label: "계산 실수", count: r2(3, 18, 1), color: "bg-red-100 text-red-700" },
      { label: "개념 혼동", count: r2(2, 12, 2), color: "bg-amber-100 text-amber-700" },
      { label: "조건 누락", count: r2(1, 10, 3), color: "bg-orange-100 text-orange-700" },
      { label: "시간 초과", count: r2(1, 8, 4), color: "bg-blue-100 text-blue-700" },
      { label: "풀이 생략", count: r2(0, 6, 5), color: "bg-violet-100 text-violet-700" },
    ],
    memo: "전반적으로 개념 이해도가 높으나 킬러 문항에서 조건을 놓치는 경우가 잦음. 그래프 해석 연습과 시간 배분 전략 보완 필요.",
  };
}

/* ── 컴포넌트 ── */

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90 ? "#2563eb" : score >= 75 ? "#0891b2" : score >= 60 ? "#d97706" : "#dc2626";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-900 sm:text-3xl">{score}</span>
        <span className="text-[10px] text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

function Bar({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
      />
    </div>
  );
}

function StatCard({ label, value, unit, delay }: { label: string; value: number; unit: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <p className="text-[11px] font-medium text-slate-400 sm:text-[12px]">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
        {value}
        <span className="ml-0.5 text-[13px] font-medium text-slate-400">{unit}</span>
      </p>
    </motion.div>
  );
}

/* ── 메인 ── */

export default function CharacteristicsPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<MockData | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    setError("");
    setData(generateMock(name.trim()));
  };

  const handleLogout = () => {
    setData(null);
    setName("");
    setPassword("");
  };

  /* ── 로그인 화면 ── */
  if (!data) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <Link
              href="/student-manage"
              className="mb-4 inline-block text-sm text-slate-400 hover:text-slate-600"
            >
              &larr; 학생관리
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">학생 분석</h1>
            <p className="mt-2 text-[13px] text-slate-500">
              로그인하여 나의 학습 분석 리포트를 확인하세요.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[13px] text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-[14px] font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              로그인
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            비밀번호를 모르시면 선생님께 문의하세요.
          </p>
        </motion.div>
      </main>
    );
  }

  /* ── 대시보드 ── */
  const maxWrong = Math.max(...data.wrongPatterns.map((p) => p.count), 1);
  const testMax = Math.max(...data.recentTests.map((t) => t.score), 100);
  const testMin = Math.min(...data.recentTests.map((t) => t.score)) - 10;

  return (
    <main
      className="min-h-screen bg-slate-50 px-3 pb-12 pt-6 sm:px-4 sm:pt-8"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-slate-900 sm:text-2xl"
            >
              {data.name}
              <span className="ml-2 text-[13px] font-medium text-slate-400 sm:text-[14px]">
                {data.class}
              </span>
            </motion.h1>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {data.grade} · 최근 업데이트 2026.02.25
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 transition hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-[13px]"
          >
            로그아웃
          </button>
        </div>

        {/* 종합 점수 + 학습 습관 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 sm:col-span-2"
          >
            <p className="mb-3 text-[12px] font-semibold text-slate-500">종합 성취도</p>
            <ScoreRing score={data.overall} />
            <p className="mt-3 text-[11px] text-slate-400">최근 5회 시험 평균 기준</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:col-span-3">
            {data.habits.map((h, i) => (
              <StatCard key={h.label} label={h.label} value={h.value} unit={h.unit} delay={0.2 + i * 0.1} />
            ))}
          </div>
        </div>

        {/* 과목별 성취도 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <h2 className="mb-4 text-[14px] font-bold text-slate-900 sm:text-[15px]">
            과목별 성취도
          </h2>
          <div className="space-y-3">
            {data.subjects.map((s, i) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-slate-700 sm:text-[13px]">
                    {s.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-900 sm:text-[14px]">
                      {s.score}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        s.delta >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {s.delta >= 0 ? "+" : ""}
                      {s.delta}
                    </span>
                  </div>
                </div>
                <Bar
                  value={s.score}
                  max={100}
                  color={
                    s.score >= 85
                      ? "bg-blue-500"
                      : s.score >= 70
                        ? "bg-cyan-500"
                        : s.score >= 55
                          ? "bg-amber-500"
                          : "bg-red-500"
                  }
                  delay={0.4 + i * 0.08}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* 취약 영역 + 오답 패턴 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
          >
            <h2 className="mb-4 text-[14px] font-bold text-slate-900 sm:text-[15px]">
              취약 영역 분석
            </h2>
            <div className="space-y-3">
              {data.weakAreas.map((w, i) => (
                <div key={w.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12px] text-slate-600">{w.label}</span>
                    <span className="text-[12px] font-bold text-slate-900">{w.pct}%</span>
                  </div>
                  <Bar value={w.pct} max={100} color={w.color} delay={0.6 + i * 0.08} />
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
          >
            <h2 className="mb-4 text-[14px] font-bold text-slate-900 sm:text-[15px]">
              오답 패턴
            </h2>
            <div className="space-y-2.5">
              {data.wrongPatterns.map((p) => (
                <div key={p.label} className="flex items-center gap-3">
                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${p.color}`}
                  >
                    {p.count}건
                  </span>
                  <div className="flex-1">
                    <div className="mb-0.5 text-[12px] font-medium text-slate-700">
                      {p.label}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full bg-slate-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.count / maxWrong) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* 최근 시험 추이 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <h2 className="mb-4 text-[14px] font-bold text-slate-900 sm:text-[15px]">
            최근 시험 추이
          </h2>
          <div className="flex items-end gap-3 sm:gap-4">
            {data.recentTests.map((t, i) => {
              const height = ((t.score - testMin) / (testMax - testMin)) * 100;
              return (
                <div key={t.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900 sm:text-[12px]">
                    {t.score}
                  </span>
                  <motion.div
                    className="w-full rounded-lg bg-gradient-to-t from-blue-500 to-blue-400"
                    style={{ minHeight: 8 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 10)}px` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 + i * 0.1 }}
                  />
                  <span className="text-[10px] text-slate-400 sm:text-[11px]">{t.label}</span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* 선생님 메모 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <h2 className="mb-2 text-[14px] font-bold text-slate-900 sm:text-[15px]">
            선생님 코멘트
          </h2>
          <p className="text-[13px] leading-relaxed text-slate-600">{data.memo}</p>
        </motion.section>
      </div>
    </main>
  );
}
