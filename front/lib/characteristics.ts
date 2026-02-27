import { Redis } from "@upstash/redis";

/* ── 태그 상수 ── */

export const TAG_CATEGORIES = [
  {
    key: "개념",
    label: "개념 취약",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    tags: [
      "함수 개념",
      "미분 개념",
      "적분 개념",
      "확통 개념",
      "기하 개념",
      "수열 개념",
      "지수·로그",
      "삼각함수",
    ],
  },
  {
    key: "풀이",
    label: "풀이 습관",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tags: [
      "계산 실수 잦음",
      "풀이 과정 생략",
      "조건 누락",
      "경우의 수 빠뜨림",
      "그래프 해석 약함",
      "문제 독해 부족",
    ],
  },
  {
    key: "유형",
    label: "유형별 약점",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tags: [
      "킬러 문항",
      "준킬러 문항",
      "빈칸 추론",
      "도형 활용",
      "속도·가속도",
      "넓이·부피",
      "확률 분포",
      "조합론",
    ],
  },
  {
    key: "태도",
    label: "학습 태도",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tags: [
      "시간 관리 필요",
      "복습 부족",
      "오답 반복",
      "자신감 부족",
      "집중력 저하",
      "질문 적극적",
    ],
  },
] as const;

export type TagCategory = (typeof TAG_CATEGORIES)[number]["key"];

export const ALL_TAGS = TAG_CATEGORIES.flatMap((c) =>
  c.tags.map((t) => ({ tag: t, category: c.key, color: c.color, bg: c.bg, border: c.border }))
);

/* ── 타입 ── */

export type StudentCharacteristics = {
  studentId: string;
  tags: string[];
  memo: string;
  updatedAt: string;
};

/* ── Redis helpers ── */

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const KEY = (studentId: string) => `char:student:${studentId}`;

export async function getCharacteristics(
  studentId: string
): Promise<StudentCharacteristics | null> {
  const redis = getRedis();
  const raw = await redis.hgetall<Record<string, string>>(KEY(studentId));
  if (!raw || !raw.tags) return null;
  return {
    studentId,
    tags: JSON.parse(raw.tags),
    memo: raw.memo ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}

export async function setCharacteristics(
  studentId: string,
  tags: string[],
  memo: string
): Promise<StudentCharacteristics> {
  const redis = getRedis();
  const updatedAt = new Date().toISOString();
  await redis.hset(KEY(studentId), {
    tags: JSON.stringify(tags),
    memo,
    updatedAt,
  });
  return { studentId, tags, memo, updatedAt };
}

export async function getAllCharacteristics(
  studentIds: string[]
): Promise<Record<string, StudentCharacteristics>> {
  const redis = getRedis();
  const result: Record<string, StudentCharacteristics> = {};
  const entries = await Promise.all(
    studentIds.map(async (sid) => {
      const raw = await redis.hgetall<Record<string, string>>(KEY(sid));
      return { sid, raw };
    })
  );
  for (const { sid, raw } of entries) {
    if (raw && raw.tags) {
      result[sid] = {
        studentId: sid,
        tags: JSON.parse(raw.tags),
        memo: raw.memo ?? "",
        updatedAt: raw.updatedAt ?? "",
      };
    }
  }
  return result;
}
