// front/lib/students.ts

export type Student = {
  id: string;       // URL에 들어갈 영어 id (예: "kim-jiho")
  name: string;     // 화면에 보여줄 이름 (예: "김지호")
  password: string; // 학생 개인 비밀번호 (간단한 PIN)
};

// 여기 명단만 수정해서 쓰면 됨
export const students: Student[] = [
  { id: "kim-jiho", name: "김지호", password: "1234" },
  { id: "go-sua", name: "고수아", password: "2345" },
  { id: "shin-yeonwoo", name: "신연우", password: "3456" },
  { id: "lee-dongeun", name: "이동은", password: "4567" },
  { id: "shin-seunghyo", name: "신승효", password: "5678" },
  // 필요하면 아래로 계속 추가
];

export function findStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}
