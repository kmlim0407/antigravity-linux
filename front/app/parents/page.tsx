export default function ParentsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">학부모용 안내</h1>
        <p className="text-slate-600">
          이 페이지는 학부모님을 위한 전용 안내 페이지입니다.
          수업 철학, 상담 방향, 성적 관리 방식을 설명합니다.
        </p>

        <section className="mt-8 space-y-3 text-sm md:text-base text-slate-700">
          <h2 className="text-xl font-semibold">수업 철학</h2>
          <p>• 단기 성적도 중요하지만, 장기적인 수학 체력을 목표로 합니다.</p>
          <p>• “문제 푸는 기계”가 아니라, 스스로 사고하는 학생을 지향합니다.</p>
        </section>

        <section className="mt-8 space-y-3 text-sm md:text-base text-slate-700">
          <h2 className="text-xl font-semibold">상담 방향</h2>
          <p>• 현재 상황(학교, 성적, 목표)과 학생 성향을 함께 고려합니다.</p>
          <p>• 무리한 목표보다, 현실적으로 도달 가능한 계획을 제안합니다.</p>
        </section>

        <div className="mt-10">
          <a
            href="/#contact"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm md:text-base font-semibold text-white hover:bg-blue-700 transition"
          >
            상담 / 문의로 가기
          </a>
        </div>
      </div>
    </main>
  );
}
