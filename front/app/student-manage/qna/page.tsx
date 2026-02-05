"use client";

import React, { useState } from "react";

type VideoEntry = {
  id: string;
  book: string;
  number: string;
  title: string;
  url: string;
};

export default function QnaPage() {
  const [studentName, setStudentName] = useState("");
  const [book, setBook] = useState("");
  const [number, setNumber] = useState("");
  const [results, setResults] = useState<VideoEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setResults([]);
    setSearched(false);
    setErrorMsg("");

    if (!book.trim() || !number.trim()) {
      setErrorMsg("교재와 문제 번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/qna/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, number }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "영상 조회 중 오류가 발생했습니다.");
      } else {
        setResults(data.videos ?? []);
        setSearched(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>질문 QnA · 노션 영상 연동</h1>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>학생 이름 (선택)</label>
            <input
              style={inputStyle}
              placeholder="예) 김지호"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              교재 / 키워드<span style={requiredStyle}>*</span>
            </label>
            <input
              style={inputStyle}
              placeholder="예) 고쟁이, 쎈, 자이스토리"
              value={book}
              onChange={(e) => setBook(e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              문제 번호<span style={requiredStyle}>*</span>
            </label>
            <input
              style={inputStyle}
              placeholder="예) 120"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" style={submitButtonStyle} disabled={loading}>
          {loading ? "영상 찾는 중..." : "영상 찾기"}
        </button>
      </form>

      {/* 오류 메시지 */}
      {errorMsg && (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0, fontSize: 14 }}>{errorMsg}</p>
        </div>
      )}

      {/* 결과 섹션 */}
      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>결과</h2>

        {!searched && !loading && !errorMsg && (
          <p style={hintTextStyle}>
            예) <strong>고쟁이</strong> / <strong>120</strong> 을 입력하면,
            노션 DB에서 해당 교재·번호로 등록된 영상 링크를 찾아
            아래에 보여줍니다.
          </p>
        )}

        {searched && !loading && results.length === 0 && !errorMsg && (
          <div style={noResultBoxStyle}>
            <p style={{ margin: 0, fontSize: 14 }}>
              해당 교재 / 번호로 등록된 영상이 없습니다.
              <br />
              노션 DB의 교재/번호를 확인하거나, 영상을 새로 등록해주세요.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div style={videoGridStyle}>
            {results.map((v) => (
              <article key={v.id} style={videoCardStyle}>
                <h3 style={videoTitleStyle}>{v.title}</h3>

                <div style={iframeWrapperStyle}>
                  <iframe
                    src={`/embed?url=${encodeURIComponent(v.url)}`}
                    title={v.title}
                    style={iframeStyle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {studentName.trim() && (
                  <p style={smallTextStyle}>
                    조회 학생: <strong>{studentName}</strong>
                  </p>
                )}

                <p style={smallTextStyle}>
                  교재: <strong>{v.book || book}</strong> / 번호:{" "}
                  <strong>{v.number || number}</strong>
                </p>

                <p style={smallTextStyle}>
                  원본 링크:{" "}
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb" }}
                  >
                    새 창에서 열기
                  </a>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/** ---- 인라인 스타일 ---- */

const containerStyle: React.CSSProperties = {
  maxWidth: "960px",
  margin: "0 auto",
  padding: "24px 16px 48px",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 24,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 12,
};

const formStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  marginBottom: 24,
  backgroundColor: "#fafafa",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
};

const fieldStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 180,
  display: "flex",
  flexDirection: "column",
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
};

const requiredStyle: React.CSSProperties = {
  color: "#ef4444",
  marginLeft: 4,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
};

const submitButtonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "8px 16px",
  borderRadius: 999,
  border: "none",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  backgroundColor: "#2563eb",
  color: "white",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 16,
};

const hintTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
};

const errorBoxStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid #fee2e2",
  backgroundColor: "#fef2f2",
  padding: 12,
  fontSize: 14,
  color: "#991b1b",
  marginTop: 8,
};

const noResultBoxStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  padding: 12,
  fontSize: 14,
  color: "#4b5563",
};

const videoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const videoCardStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  padding: 12,
  backgroundColor: "white",
};

const videoTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  margin: "0 0 8px",
};

const iframeWrapperStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  paddingBottom: "56.25%", // 16:9
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: 8,
};

const iframeStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: "none",
};

const smallTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#4b5563",
  margin: "2px 0",
};
