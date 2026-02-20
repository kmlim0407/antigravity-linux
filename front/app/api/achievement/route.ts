import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const KEY_PREFIX = "achievement:";

type AchievementData = {
  mon: { 과제: boolean; "교재 오답프린트": boolean; 과제오답: boolean };
  fri: {
    과제: boolean;
    "모의고사 오답프린트": boolean;
    "교재 오답프린트": boolean;
    과제오답: boolean;
  };
};

function makeKey(studentId: string, dateKey: string) {
  return `${KEY_PREFIX}${studentId}:${dateKey}`;
}

export async function GET(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json(
        { error: "DB가 설정되지 않았습니다. UPSTASH_REDIS 환경변수를 확인하세요." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const dateKey = searchParams.get("dateKey");

    if (!studentId || !dateKey) {
      return NextResponse.json(
        { error: "studentId와 dateKey가 필요합니다." },
        { status: 400 }
      );
    }

    const key = makeKey(studentId, dateKey);
    const data = (await redis.get(key)) as AchievementData | null;

    return NextResponse.json(data ?? { mon: null, fri: null });
  } catch (err) {
    console.error("Achievement GET error:", err);
    return NextResponse.json(
      { error: "데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json(
        { error: "DB가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { studentId, dateKey, mon, fri } = body;

    if (!studentId || !dateKey) {
      return NextResponse.json(
        { error: "studentId와 dateKey가 필요합니다." },
        { status: 400 }
      );
    }

    const data: AchievementData = {
      mon: mon ?? {
        과제: false,
        "교재 오답프린트": false,
        과제오답: false,
      },
      fri:
        fri ?? {
          과제: false,
          "모의고사 오답프린트": false,
          "교재 오답프린트": false,
          과제오답: false,
        },
    };

    const key = makeKey(studentId, dateKey);
    await redis.set(key, data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Achievement PUT error:", err);
    return NextResponse.json(
      { error: "저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
