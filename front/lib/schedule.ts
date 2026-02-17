/**
 * 수업 시간표 데이터
 * 필요에 따라 수정하세요.
 */
export type ScheduleItem = {
  day: string;
  time: string;
  subject: string;
  note?: string;
};

export const SCHEDULE: ScheduleItem[] = [
  { day: "월", time: "14:00", subject: "수학", note: "고1 S반" },
  { day: "월", time: "16:00", subject: "수학", note: "고2 B반" },
  { day: "화", time: "14:00", subject: "수학", note: "중3반" },
  { day: "화", time: "16:00", subject: "수학", note: "고1 A반" },
  { day: "수", time: "14:00", subject: "수학", note: "특강" },
  { day: "목", time: "14:00", subject: "수학", note: "고2반" },
  { day: "금", time: "14:00", subject: "수학", note: "보강·질문" },
];

export function getScheduleText(): string {
  return SCHEDULE.map(
    (s) => `${s.day}요일 ${s.time} - ${s.subject}${s.note ? ` (${s.note})` : ""}`
  ).join("\n");
}
