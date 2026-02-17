import Link from "next/link";

const STUDENT_MANAGE_CARDS = [
  { label: "학생 성취도", href: "/student", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" },
  { label: "질문 / Q&A", href: "/student-manage/qna", image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=400&q=80" },
  { label: "오답 / 기록", href: "/student-manage/records", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" },
];

const CARD_GRADIENTS = [
  "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.18), transparent 55%)",
  "radial-gradient(circle at top left, rgba(168,85,247,0.20), transparent 55%), radial-gradient(circle at bottom right, rgba(236,72,153,0.18), transparent 55%)",
  "radial-gradient(circle at top left, rgba(251,146,60,0.22), transparent 55%), radial-gradient(circle at bottom right, rgba(234,179,8,0.18), transparent 55%)",
];

// 상단 탭 UI
function StudentTabs(props: { active: "qna" | "records" }) {
  const { active } = props;
  const base =
    "flex-1 whitespace-nowrap rounded-lg border px-3 py-2 text-center text-xs md:text-sm transition";
  const inactive =
    "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100";
  const activeClass = "border-neutral-900 bg-neutral-900 text-white";

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      <a
        href="/student-manage/qna"
        className={base + " " + (active === "qna" ? activeClass : inactive)}
      >
        질문 / Q&amp;A
      </a>
      <a
        href="/student-manage/records"
        className={
          base + " " + (active === "records" ? activeClass : inactive)
        }
      >
        오답 / 기록
      </a>
    </div>
  );
}

export default function StudentManagePage() {
  return (
    <main className="min-h-[80vh] bg-neutral-100 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            학생관리
          </h1>
          <a
            href="/makeup"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid #222",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            📅 보강 예약 하러 가기
          </a>
          <p className="text-xs md:text-sm text-neutral-600">
            임경묵T가 내부에서만 보는 페이지입니다.
          </p>
        </header>


        {/* 메인 카드 섹션 */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {STUDENT_MANAGE_CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-300/80 hover:shadow-lg"
              style={{ backgroundImage: CARD_GRADIENTS[i % CARD_GRADIENTS.length], backgroundBlendMode: "soft-light" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                <img src={card.image} alt={card.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 items-center justify-center px-4 py-4">
                <span className="text-center text-[15px] font-medium tracking-tight text-slate-800 sm:text-[17px]">{card.label}</span>
              </div>
            </Link>
          ))}
        </section>

        {/* 탭 */}
        <StudentTabs active="qna" />
      </div>
    </main>
  );
}
