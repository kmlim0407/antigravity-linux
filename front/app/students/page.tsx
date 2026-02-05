export default function StudentsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">학생용 안내</h1>
        <p className="text-slate-600">
          이 페이지는 학생을 위한 전용 안내 페이지입니다.
          수업 방식, 과제, 평가 방식을 학생 입장에서 설명합니다.
        </p>

        <section className="mt-8 space-y-3 text-sm md:text-base text-slate-700">
          <h2 className="text-xl font-semibold">수업 방식</h2>
          <p>• 개념 정리 → 예제 → 유형 연습 → 테스트 흐름으로 진행됩니다.</p>
          <p>• 수업 시간에 이해한 내용은 과제로 한 번 더 복습하게 됩니다.</p>
        </section>

        <section className="mt-8 space-y-3 text-sm md:text-base text-slate-700">
          <h2 className="text-xl font-semibold">과제 / 피드백</h2>
          <p>• 과제는 “양”보다 “질” 위주로 내며, 오답은 다음 수업에 반영됩니다.</p>
          <p>• 본인이 어디서 막히는지 스스로 체크할 수 있도록 도와줍니다.</p>
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
