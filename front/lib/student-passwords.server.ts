// 서버에서만 사용되는 파일입니다. "use client" 컴포넌트에서 import 금지.
// 비밀번호를 바꾸려면 이 파일만 수정하면 됩니다.

const passwords: Record<string, string> = {
  "shin-yeonwoo": "7294",
  "go-sua": "5831",
  "kim-jiho": "4167",
  "shin-seunghyo": "9620",
  "lee-dongeun": "3458",
  "lee-seongyoon": "8102",
  "yu-haeun": "2579",
  "kim-taegyu": "6943",
  "kim-taein": "1385",
  "kim-naeun": "4716",
  "kim-yeonwoo": "9032",
};

export function verifyStudentPassword(id: string, password: string): boolean {
  return passwords[id] === password;
}
