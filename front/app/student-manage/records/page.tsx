"use client";

import { useEffect, useMemo, useState } from "react";

type RecordItem = {
  id: string;
  studentName: string;
  date: string;
  subject: string;
  wrongNumbers: string;
  questionNumbers: string;
  memo: string;
};

type QuestionStat = {
  question: string;
  count: number;
  students: string[];
};

export default function StudentManageRecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 입력 폼 상태
  const [studentName, setStudentName] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [wrongNumbers, setWrongNumbers] = useState("");
  const [questionNumbers, setQuestionNumbers] = useState("");
  const [memo, setMemo] = useState("");

  // 최초 로딩 시 기록 불러오기
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/question-records");
        if (!res.ok) {
          throw new Error("기록을 불러오지 못했습니다.");
        }
        const data: RecordItem[] = await res.json();
        setRecords(data || []);
      } catch (err) {
        console.error(err);
        setError("기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // 기록 추가
  const handleAddRecord = async () => {
    if (!studentName.trim()) {
      setError("학생 이름은 필수입니다.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/question-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          date,
          subject,
          wrongNumbers,
          questionNumbers,
          memo,
        }),
      });

      if (!res.ok) {
        throw new Error("저장에 실패했습니다.");
      }

      // 폼 초기화
      setStudentName("");
      setDate("");
      setSubject("");
      setWrongNumbers("");
      setQuestionNumbers("");
      setMemo("");

      // 새로고침
      const refreshed = await fetch("/api/question-records");
      const refreshedData: RecordItem[] = await refreshed.json();
      setRecords(refreshedData || []);
    } catch (err) {
      console.error(err);
      setError("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 🔽 질문번호 통계 (questionNumbers 기준)
  const questionStats: QuestionStat[] = useMemo(() => {
    const map: Record<
      string,
      {
        count: number;
        students: Set<string>;
      }
    > = {};

    for (const r of records) {
      if (!r.questionNumbers) continue;

      const normalized = r.questionNumbers
        .replace(/[\/;|]/g, ",")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const q of normalized) {
        if (!map[q]) {
          map[q] = { count: 0, students: new Set<string>() };
        }
        map[q].count += 1;
        if (r.studentName) {
          map[q].students.add(r.studentName);
        }
      }
    }

    const arr: QuestionStat[] = Object.entries(map).map(([question, info]) => ({
      question,
      count: info.count,
      students: Array.from(info.students),
    }));

    arr.sort((a, b) => {
      const na = Number(a.question);
      const nb = Number(b.question);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.question.localeCompare(b.question);
    });

    return arr;
  }, [records]);

  // 🔽 엑셀로 내보내기 (행렬 버전)
  // 1행: 학생 이름들 (김지호, 고수아, … 가 가로로)
  // 2행 이후: 각 열 밑으로 그 학생의 오답번호들 (숫자 하나 = 셀 하나)
  const handleExportCsv = () => {
    if (!records.length) {
      setError("내보낼 기록이 없습니다.");
      return;
    }

    setError(null);

    // 학생별 오답번호 배열 만들기
    const studentOrder: string[] = [];
    const numberMap: Record<string, string[]> = {};

    for (const r of records) {
      const name = r.studentName || "(이름 없음)";

      if (!studentOrder.includes(name)) {
        studentOrder.push(name);
      }

      if (!numberMap[name]) {
        numberMap[name] = [];
      }

      if (r.wrongNumbers) {
        const nums = r.wrongNumbers
          .replace(/[\/;|]/g, ",")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        numberMap[name].push(...nums);
      }
    }

    if (studentOrder.length === 0) {
      setError("학생 이름 데이터가 없습니다.");
      return;
    }

    // 각 학생 중 가장 많이 기록한 오답 개수 찾기
    let maxLen = 0;
    for (const name of studentOrder) {
      const len = numberMap[name]?.length ?? 0;
      if (len > maxLen) maxLen = len;
    }

    if (maxLen === 0) {
      setError("오답 번호 데이터가 없습니다.");
      return;
    }

    // CSV 생성
    const lines: string[] = [];

    // 1행: 학생 이름들
    lines.push(studentOrder.join(","));

    // 2행 이후: i번째 행 = 각 학생의 i번째 오답번호
    for (let i = 0; i < maxLen; i++) {
      const row = studentOrder.map((name) => {
        const nums = numberMap[name] || [];
        return nums[i] ?? "";
      });
      lines.push(row.join(","));
    }

    const csvContent = "\uFEFF" + lines.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute(
      "download",
      `wrong_numbers_matrix_${today}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col gap-8">
      {/* 헤더 */}
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">질문 / 오답 기록 관리</h1>
        <p className="text-sm text-slate-500">
          기록 입력 → 노션 저장 → 학생별 오답 행렬 엑셀 → 질문번호 통계까지 한 번에.
        </p>
      </header>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* 입력 폼 */}
      <section className="bg-white border rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">기록 추가</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="학생 이름 *"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="과목"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="오답 번호 (예: 3,5,7)"
            value={wrongNumbers}
            onChange={(e) => setWrongNumbers(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="질문 번호 (예: 10,12)"
            value={questionNumbers}
            onChange={(e) => setQuestionNumbers(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="메모"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="border rounded px-3 py-2 text-sm md:col-span-2"
          />
        </div>

        <button
          onClick={handleAddRecord}
          disabled={saving}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full text-sm"
        >
          {saving ? "저장 중..." : "기록 추가"}
        </button>
      </section>

      {/* 기록 목록 + 오답번호 엑셀 내보내기 */}
      <section className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">기록 목록</h2>
          <button
            onClick={handleExportCsv}
            className="text-xs border px-3 py-1.5 rounded-full"
          >
            학생별 오답번호 행렬 엑셀 내보내기
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">불러오는 중...</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-slate-400">
            아직 기록이 없습니다. 위에서 먼저 기록을 추가해 주세요.
          </p>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            {records.map((r) => (
              <div
                key={r.id}
                className="bg-slate-50 border rounded px-3 py-2"
              >
                <div className="font-semibold">{r.studentName}</div>
                <div className="text-xs text-slate-600">
                  날짜: {r.date || "-"} · 과목: {r.subject || "-"}
                </div>
                <div className="text-xs text-slate-600">
                  오답: {r.wrongNumbers || "-"} / 질문:{" "}
                  {r.questionNumbers || "-"}
                </div>
                {r.memo && (
                  <div className="text-xs text-slate-500 mt-1">
                    메모: {r.memo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 질문 번호 통계 */}
      <section className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">질문 번호 통계</h2>
          <p className="text-xs text-slate-400">
            질문 번호 기준으로 등장 횟수와 학생들 정리.
          </p>
        </div>

        {questionStats.length === 0 ? (
          <p className="text-sm text-slate-400">
            질문 번호가 입력된 기록이 아직 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600">
                  <th className="px-2 py-1.5">질문 번호</th>
                  <th className="px-2 py-1.5">등장 횟수</th>
                  <th className="px-2 py-1.5">학생들</th>
                </tr>
              </thead>
              <tbody>
                {questionStats.map((q) => (
                  <tr key={q.question} className="border-b last:border-b-0">
                    <td className="px-2 py-1.5 font-medium text-slate-800">
                      {q.question}
                    </td>
                    <td className="px-2 py-1.5 text-slate-700">
                      {q.count}
                    </td>
                    <td className="px-2 py-1.5 text-slate-600">
                      {q.students.length
                        ? q.students.join(", ")
                        : "(학생 이름 없음)"}
                    </td>
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
