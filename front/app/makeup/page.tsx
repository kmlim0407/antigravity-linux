export default function MakeupPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* 상단 히어로 / 타이틀 영역 */}
      <section className="flex items-center justify-center px-4 pt-20 md:px-10 md:pt-24">
        <div className="w-full max-w-5xl">
          <div className="mb-6 text-xs font-semibold tracking-[0.28em] text-slate-400 md:text-sm">
            MAKE-UP SESSION · RESERVATION
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-[32px] md:leading-snug">
                보강 예약 페이지
              </h1>
              <p className="mt-3 text-[11px] text-slate-300 sm:text-xs md:text-sm">
                캘린더에서 날짜·시간 선택 → 신청 → 선생님 확인 후 확정.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[10px] text-slate-300 sm:text-[11px]">
              <p className="font-semibold text-slate-100">📌 안내</p>
              <ul className="mt-1 space-y-1">
                <li>· 시험 기간 보강 수요 많음</li>
                <li>· 당일 취소 자제</li>
                <li>· 개념/유형 보완 위주로</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 – 좌측 설명 / 우측 Calendly 카드 */}
      <section className="flex justify-center px-4 pb-12 pt-6 md:px-10 md:pb-16">
        <div className="flex w-full max-w-5xl flex-col gap-6 md:flex-row md:gap-8">
          {/* 왼쪽 – 보강 프로세스 설명 */}
          <div className="md:w-[32%]">
            <h2 className="text-sm font-semibold text-slate-100 sm:text-base">
              진행 순서
            </h2>
            <ol className="mt-3 space-y-2 text-[11px] text-slate-300 sm:text-xs">
              <li><span className="font-semibold text-slate-100">1.</span> 캘린더에서 날짜·시간 선택</li>
              <li><span className="font-semibold text-slate-100">2.</span> 이름·연락처·단원/사유 입력</li>
              <li><span className="font-semibold text-slate-100">3.</span> 선생님 확인 후 확정</li>
              <li><span className="font-semibold text-slate-100">4.</span> 학생 관리 데이터 반영</li>
            </ol>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[11px] text-slate-300 sm:text-xs">
              <p className="font-semibold text-slate-100">추천</p>
              <ul className="mt-1 space-y-1">
                <li>· 계속 틀리는 단원 정리</li>
                <li>· 결석 수업 따라잡기</li>
                <li>· 개념은 아는데 적용이 안 될 때</li>
              </ul>
            </div>
          </div>

          {/* 오른쪽 – Calendly 임베드 카드 */}
          <div className="md:w-[68%]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-3 shadow-xl sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 sm:text-[11px]">
                    ONLINE BOOKING
                  </p>
                  <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
                    보강 예약 캘린더
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-[11px]">
                    아래 캘린더에서 직접 가능한 시간을 선택해 주세요.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black/40">
                <iframe
                  src="https://calendly.com/kmlim0407/meet-with-me"
                  title="보강 예약 캘린더"
                  style={{
                    width: "100%",
                    height: "700px",
                    border: "none",
                  }}
                  scrolling="yes"
                />
              </div>

              <p className="mt-2 text-[10px] text-slate-500 sm:text-[11px]">
                예약이 정상적으로 완료되면 Calendly에서 확인 메일(또는 알림)이
                발송되며, 필요 시 선생님이 별도로 연락을 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
