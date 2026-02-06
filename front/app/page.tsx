export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 24px",
        boxSizing: "border-box",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* 제목 */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 800,
          marginBottom: "12px",
        }}
      >
        Smookths 수학
      </h1>

      {/* 소개 */}
      <p
        style={{
          fontSize: "15px",
          color: "#555",
          marginBottom: "32px",
          lineHeight: 1.6,
        }}
      >
        학생 관리 · 보강 예약 · 질문 관리가 한 곳에서 이루어지는
        <br />
        스무크쓰 수학 전용 페이지입니다.
      </p>

      {/* 🔥 핵심 버튼 영역 */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "360px",
        }}
      >
        {/* 보강 예약 */}
        <a
          href="/makeup"
          style={{
            display: "block",
            padding: "14px 16px",
            borderRadius: "10px",
            border: "1px solid #222",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 600,
            color: "#000",
            textAlign: "center",
          }}
        >
          📅 보강 예약하기
        </a>

        {/* 기존에 쓰던 다른 페이지들용 예시 버튼 */}
        <a
          href="/qna"
          style={{
            display: "block",
            padding: "14px 16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            textDecoration: "none",
            fontSize: "14px",
            color: "#333",
            textAlign: "center",
          }}
        >
          ❓ 질문 게시판
        </a>
      </section>

      {/* 하단 안내 */}
      <footer
        style={{
          marginTop: "48px",
          fontSize: "13px",
          color: "#888",
        }}
      >
        © Smookths Math
      </footer>
    </main>
  );
}
