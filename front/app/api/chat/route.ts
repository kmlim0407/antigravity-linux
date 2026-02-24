import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getScheduleText } from "@/lib/schedule";
import { handleApiError, ApiError } from "@/lib/api-error";
import { checkRateLimit, type RateLimitBlocked } from "@/lib/rate-limit";

const CHAT_MODEL = "gpt-4o-mini";

function buildSystemPrompt(): string {
  return `당신은 SMOOKTH(묵T 수학) 사이트의 챗봇입니다.
정중하고 친절한 말투로 답변해 주세요.
사이트 관련 질문뿐 아니라 학습, 수업, 상담 등 다양한 질문에 폭넓게 대응합니다.

## SMOOKTH 소개
- 브랜드명: SMOOKTH (묵T 수학)
- 슬로건: BE LOGICAL ∩ BE TACTICAL
- 철학: 논리적인 이해 × 전략적인 훈련. 직접 만든 교재(IM LOGIC)와 오답 데이터로 설계하는 수업.
- 특징: 수업을 투명하게 공개 (OT 영상, 수업 영상, 교재까지 공개). 기초부터 심화까지 모든 학생 수업 가능. 현재 성적·목표에 맞춘 맞춤 상담 제공.

## 수업반 구성 (2026학년도 1학기)
- 고1 S1반: 월·금 17:30–22:00 (대치동 내신 변별력, 컴팩트한 심화수업)
- 고1 A2반: 수 17:30–22:00 / 토 09:00–13:30 (기초부터 심화까지)
- 중3 상심화반: 화·목 17:00–22:00

## 교재 (IM LOGIC)
- 선생님이 직접 제작한 자체 교재
- 사이트에서 "IM LOGIC 구경하기" 버튼으로 확인 가능

## 수업 영상
- 고1 S1반 수업 영상, 고1 B3반 수업 영상, 미적분 1 기본+심화 특강 등 유튜브에 공개
- 사이트 "반별 수업영상" 섹션에서 시청 가능

## 상담·연락처
- 휴대폰: 010-3658-7365
- 이메일: kmlim0407@gmail.com
- 학원 대표: 02-562-5050
- 사이트 내 "상담문의" 버튼으로도 연락 가능

## 현재 수업 시간표
${getScheduleText()}`;
}

const MessageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(4000),
});

const BodySchema = z.object({
  messages: z
    .array(MessageSchema)
    .min(1, "메시지가 필요합니다.")
    .max(50, "메시지가 너무 많습니다."),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      const { retryAfterMs, reason } = limit as RateLimitBlocked;
      const retrySec = Math.ceil(retryAfterMs / 1000);
      const msg =
        reason === "minute"
          ? `요청이 너무 많습니다. ${retrySec}초 후 다시 시도해 주세요.`
          : reason === "hour"
          ? `시간당 요청 한도에 도달했습니다. ${Math.ceil(retrySec / 60)}분 후 다시 시도해 주세요.`
          : `오늘 챗봇 사용량이 초과되었습니다. 내일 다시 이용해 주세요.`;
      return NextResponse.json({ error: msg }, { status: 429, headers: { "Retry-After": String(retrySec) } });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ApiError(500, "OpenAI API 키가 설정되지 않았습니다. OPENAI_API_KEY를 .env.local에 추가하세요.");
    }

    const body = await req.json();
    const { messages } = BodySchema.parse(body);

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages.map((m) => ({
          role: m.role === "model" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
      ],
      max_tokens: 1000,
    });

    const text =
      response.choices[0]?.message?.content?.trim() ||
      "죄송합니다. 답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";
    return NextResponse.json({ text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = (err && typeof err === "object" && "status" in err) ? (err as { status: number }).status : 0;

    if (status === 401 || msg.includes("401") || msg.includes("Unauthorized") || msg.includes("Invalid API")) {
      return NextResponse.json({ error: "OpenAI API 키가 유효하지 않습니다. 키를 확인해 주세요." }, { status: 500 });
    }
    if (status === 429 || msg.includes("429") || msg.includes("rate_limit")) {
      return NextResponse.json({ error: "OpenAI 요청 한도 초과. 잠시 후 다시 시도해 주세요." }, { status: 429 });
    }
    if (msg.includes("insufficient_quota") || msg.includes("billing") || msg.includes("quota")) {
      return NextResponse.json({ error: "OpenAI 크레딧이 부족합니다. platform.openai.com에서 충전해 주세요." }, { status: 500 });
    }
    return handleApiError(err);
  }
}
