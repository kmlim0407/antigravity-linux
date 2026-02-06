export default function MakeupPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          minHeight: "800px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          보강 예약
        </h1>

        <p
          style={{
            marginBottom: "12px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          아래 캘린더에서 날짜와 시간을 선택해서 보강을 예약하세요.
        </p>

        <iframe
          src="https://calendly.com/kmlim0407/meet-with-me"
          style={{
            width: "100%",
            height: "700px",
            border: "none",
          }}
          scrolling="yes"
        />
      </div>
    </main>
  );
}
