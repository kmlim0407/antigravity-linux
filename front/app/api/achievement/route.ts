import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { handleApiError, ApiError } from "@/lib/api-error";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const KEY_PREFIX = "achievement:";
// 1년 후 만료 (초 단위)
const TTL_SECONDS = 60 * 60 * 24 * 365;

const ChecklistMonSchema = z.object({
  과제: z.boolean(),
  "교재 오답프린트": z.boolean(),
  과제오답: z.boolean(),
});

const ChecklistFriSchema = z.object({
  과제: z.boolean(),
  "모의고사 오답프린트": z.boolean(),
  "교재 오답프린트": z.boolean(),
  과제오답: z.boolean(),
});

const GetQuerySchema = z.object({
  studentId: z.string().min(1, "studentId가 필요합니다."),
  dateKey: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateKey는 YYYY-MM-DD 형식이어야 합니다."),
});

const PutBodySchema = z.object({
  studentId: z.string().min(1, "studentId가 필요합니다."),
  dateKey: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateKey는 YYYY-MM-DD 형식이어야 합니다."),
  mon: ChecklistMonSchema.optional(),
  fri: ChecklistFriSchema.optional(),
});

type AchievementData = {
  mon: z.infer<typeof ChecklistMonSchema>;
  fri: z.infer<typeof ChecklistFriSchema>;
};

function makeKey(studentId: string, dateKey: string) {
  return `${KEY_PREFIX}${studentId}:${dateKey}`;
}

export async function GET(request: Request) {
  try {
    if (!redis) {
      throw new ApiError(500, "DB가 설정되지 않았습니다. UPSTASH_REDIS 환경변수를 확인하세요.");
    }

    const { searchParams } = new URL(request.url);
    const query = GetQuerySchema.parse({
      studentId: searchParams.get("studentId"),
      dateKey: searchParams.get("dateKey"),
    });

    const key = makeKey(query.studentId, query.dateKey);
    const data = (await redis.get(key)) as AchievementData | null;

    return NextResponse.json(data ?? { mon: null, fri: null });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(request: Request) {
  try {
    if (!redis) {
      throw new ApiError(500, "DB가 설정되지 않았습니다.");
    }

    const body = await request.json();
    const { studentId, dateKey, mon, fri } = PutBodySchema.parse(body);

    const data: AchievementData = {
      mon: mon ?? { 과제: false, "교재 오답프린트": false, 과제오답: false },
      fri: fri ?? {
        과제: false,
        "모의고사 오답프린트": false,
        "교재 오답프린트": false,
        과제오답: false,
      },
    };

    const key = makeKey(studentId, dateKey);
    await redis.set(key, data, { ex: TTL_SECONDS });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
