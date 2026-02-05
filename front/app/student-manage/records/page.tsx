"use client";

import React, { useEffect, useState } from "react";

type RecordItem = {
  id: string;
  studentName: string;
  date: string;
  subject: string;
  wrongNumbers: string; // "3, 5, 12" 같은 문자열 (오답 번호)
  question: string;     // "3, 5" 같은 문자열 (질문 번호)
  memo: string;
};

const STORAGE_KEY = "student_records_v3";

// 질문 번호 통계 만들기: "3번 2명: 유하은, 신연우" 이런 데이터
const buildQuestionStats = (items: RecordItem[]) => {
  // key: 질문 번호, value: 그 번호를 질문한 학생 이름 Set
  const map = new Map<string, Set<string>>();

  for (const r of items) {
    const name = r.studentName.trim();
    if (!name) continue;

    // "3,5" / "3, 5" / "3 5" 모두 처리
    const tokens = (r.question || "")
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    for (const num of tokens) {
      if (!map.has(num)) {
        map.set(num, new Set());
      }
      map.get(num)!.add(name);
    }
  }

  const result = Array.from(map.entries()).map(([num, set]) => ({
    number: num,
    students: Array.from(set),
  }));

  // 숫자면 숫자 기준 오름차순, 아니면 문자열 기준
  result.sort((a, b) => {
    const na = Number(a.number);
    const nb = Number(b.number);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.number.localeCompare(b.number, "ko");
  });

  return result;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [form, setForm] = useState({
    studentName: "",
    date: "",
    subject: "",
    wrongNumbers: "",
    question: "",
    memo: "",
  });

  // 처음 로딩 시 localStorage에서 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as RecordItem[];
      setRecords(parsed);
    } catch (e) {
      console.error("Failed to parse records from localStorage", e);
    }
  }, []);

  // records 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.studentName.trim()) {
      alert("학생 이름은 반드시 입력해주세요.");
      return;
    }

    const newItem: RecordItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...form,
      date:
        form.date ||
        new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    };

    setRecords((prev) => [newItem, ...prev]);

    // 일부 필드 초기화 (이름/날짜/과목은 유지)
    setForm((prev) => ({
      ...prev,
      wrongNumbers: "",
      question: "",
      memo: "",
    }));
  };

  const handleDelete = (id: string) => {
    if (!confirm("정말 삭제할까요?")) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // ----- 엑셀(CSV) 내보내기 (가로: 학생 이름, 세로: 오답 번호만) -----

  const escapeCSV = (value: string | null | undefined) => {
    if (value == null) return '""';
    const v = String(value).replace(/"/g, '""'); // " -> ""
    return `"${v}"`;
  };

  const generatePivotCSV = (items: RecordItem[]) => {
    // 학생별로 오답 번호를 전부 모아서 배열로 만들기
    const map = new Map<string, string[]>(); // key: 학생 이름, value: 번호 리스트

    for (const r of items) {
      const name = r.studentName.trim();
      if (!name) continue;

      // "3, 5,12" / "3 5 12" 둘 다 처리
      const tokens = (r.wrongNumbers || "")
        .split(/[,\s]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (tokens.length === 0) continue;

      if (!map.has(name)) {
        map.set(name, []);
      }
      map.get(name)!.push(...tokens);
    }

    const studentNames = Array.from(map.keys());
    if (studentNames.length === 0) {
      throw new Error("오답 번호가 있는 기록이 없습니다.");
    }

    // 학생별 번호 개수 중 최대값
    const maxLen = Math.max(
      ...studentNames.map((name) => map.get(name)!.length)
    );

    // 1행: "번호", 학생1, 학생2, ...
    const header = ["번호", ...studentNames];

    const rows: string[][] = [];
    for (let i = 0; i < maxLen; i++) {
      const row: string[] = [];
      row.push(String(i + 1)); // 첫 칸은 순번

      for (const name of studentNames) {
        const arr = map.get(name)!;
        row.push(arr[i] ?? ""); // i번째 번호가 없으면 빈칸
      }

      rows.push(row);
    }

    const lines = [
      header.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ];

    // 한글 깨짐 방지용 BOM 포함
    const csvContent = "\uFEFF" + lines.join("\r\n");
    return csvContent;
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("내보낼 기록이 없습니다.");
      return;
    }

    try {
      const csv = generatePivotCSV(records);
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      a.href = url;
      a.download = `student-wrong-numbers-${today}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message ?? "CSV 생성 중 오류가 발생했습니다.");
    }
  };

  // 질문 번호 통계 계산
  const questionStats = buildQuestionStats(records);

  // ------------------------------------------------

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>학생 오답 · 질문 기록</h1>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>
              학생 이름<span style={requiredStyle}>*</span>
            </label>
            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              placeholder="예) 김지호"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>날짜</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>과목</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="예) 공통수학1"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>오답 번호</label>
            <input
              name="wrongNumbers"
              value={form.wrongNumbers}
              onChange={handleChange}
              placeholder="예) 3, 5, 12"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>질문 번호</label>
            <input
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="예) 3, 7 (쉼표로 구분)"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>메모</label>
            <input
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="예) 다음 시간 질문 받기로 함"
              style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" style={submitButtonStyle}>
          기록 추가
        </button>
      </form>

      {/* 기록 리스트 + 엑셀 버튼 */}
      <section style={listSectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h2 style={subtitleStyle}>기록 목록 ({records.length}개)</h2>
          <button
            type="button"
            onClick={handleExportCSV}
            style={exportButtonStyle}
          >
            엑셀(CSV)로 내보내기
          </button>
        </div>

        {records.length === 0 ? (
          <p style={{ fontSize: 14, color: "#666" }}>
            아직 저장된 기록이 없습니다.
          </p>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>학생</th>
                  <th>과목</th>
                  <th>오답 번호</th>
                  <th>질문 번호</th>
                  <th>메모</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>{r.studentName}</td>
                    <td>{r.subject}</td>
                    <td>{r.wrongNumbers}</td>
                    <td>{r.question}</td>
                    <td>{r.memo}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        style={deleteButtonStyle}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 질문 번호 시각화 섹션 */}
      <section style={{ marginTop: 32 }}>
        <h2 style={subtitleStyle}>질문 번호 통계</h2>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
          각 질문 번호를 적은 학생 수와 이름을 모아서 보여줍니다.
          (한 학생이 같은 번호를 여러 번 적어도 1명으로만 카운트)
        </p>

        {questionStats.length === 0 ? (
          <p style={{ fontSize: 14, color: "#666" }}>
            질문 번호가 입력된 기록이 없습니다.
          </p>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>질문 번호</th>
                  <th>질문 학생 수</th>
                  <th>학생들</th>
                </tr>
              </thead>
              <tbody>
                {questionStats.map((q) => (
                  <tr key={q.number}>
                    <td>{q.number}번</td>
                    <td>{q.students.length}명</td>
                    <td>{q.students.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/** --- 인라인 스타일 --- */

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
};

const fieldStyle: React.CSSProperties = {
  flex: 1,
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

const textareaStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
  resize: "vertical",
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

const exportButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  border: "1px solid #d1d5db",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  backgroundColor: "white",
};

const listSectionStyle: React.CSSProperties = {
  marginTop: 16,
};

const tableWrapperStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const deleteButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 4,
  padding: "2px 6px",
  cursor: "pointer",
  fontSize: 12,
  backgroundColor: "#fee2e2",
};
