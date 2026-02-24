// front/lib/students.ts

export type Student = {
  id: string;   // URL에 들어갈 영어 id (예: "kim-jiho")
  name: string; // 화면에 보여줄 이름 (예: "김지호")
};

// 여기 명단만 수정해서 쓰면 됨
export const students: Student[] = [
  { id: "shin-yeonwoo", name: "신연우" },
  { id: "go-sua", name: "고수아" },
  { id: "kim-jiho", name: "김지호" },
  { id: "shin-seunghyo", name: "신승효" },
  { id: "lee-dongeun", name: "이동은" },
  { id: "lee-seongyoon", name: "이성윤" },
  { id: "yu-haeun", name: "유하은" },
  { id: "kim-taegyu", name: "김태규" },
  { id: "kim-taein", name: "김태인" },
  { id: "kim-naeun", name: "김나은" },
  { id: "kim-yeonwoo", name: "김연우" },
];

export function findStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}
