// front/lib/students.ts

export type Student = {
  id: string;       // URL에 들어갈 영어 id (예: "kim-jiho")
  name: string;     // 화면에 보여줄 이름 (예: "김지호")
  password: string; // 학생 개인 비밀번호 (간단한 PIN)
};

// 여기 명단만 수정해서 쓰면 됨
export const students: Student[] = [
  { id: "shin-yeonwoo", name: "신연우", password: "7294" },
  { id: "go-sua", name: "고수아", password: "5831" },
  { id: "kim-jiho", name: "김지호", password: "4167" },
  { id: "shin-seunghyo", name: "신승효", password: "9620" },
  { id: "lee-dongeun", name: "이동은", password: "3458" },
  { id: "lee-seongyoon", name: "이성윤", password: "8102" },
  { id: "yu-haeun", name: "유하은", password: "2579" },
  { id: "kim-taegyu", name: "김태규", password: "6943" },
  { id: "kim-taein", name: "김태인", password: "1385" },
  { id: "kim-naeun", name: "김나은", password: "4716" },
  { id: "kim-yeonwoo", name: "김연우", password: "9032" },
];

export function findStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}
