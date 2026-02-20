import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenAI,
  Type,
  createPartFromFunctionCall,
  createPartFromFunctionResponse,
} from "@google/genai";
import { getScheduleText } from "@/lib/schedule";

const CHAT_MODEL = "gemini-2.0-flash";

const SYSTEM_PROMPT = `당신은 smookth 수학 사이트의 챗봇입니다.
정중하고 도움이 되는 말투로 답변해 주세요.
시간표·수업 일정 관련 질문에는 get_schedule 도구를 사용해 실제 데이터로 안내합니다.
맛집·지역 추천(한티역, 대치동 등)은 Google Search를 사용해 실제 검색 결과를 바탕으로 답하세요.
일정, 학습, 사이트 이용 등 다양한 질문에 폭넓게 대응합니다.`;

function isQuotaError(err: unknown): boolean {
  const msg = String(err instanceof Error ? err.message : err);
  return msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API 키가 설정되지 않았습니다. GEMINI_API_KEY를 .env.local에 추가하세요." },
        { status: 500 }
      );
    }

    const { messages } = (await req.json()) as {
      messages: { role: "user" | "model"; content: string }[];
    };

    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      { role: "user" as const, parts: [{ text: `${SYSTEM_PROMPT}\n\n---\n이제 아래 대화에 이어서 마지막 사용자 메시지에 답해주세요.` }] },
      { role: "model" as const, parts: [{ text: "알겠습니다. 궁금하신 것을 편하게 질문해 주세요." }] },
      ...messages.map((m) => ({
        role: m.role as "user" | "model",
        parts: [{ text: m.content }],
      })),
    ];

    const tools = [
      {
        googleSearch: {},
        functionDeclarations: [
          {
            name: "get_schedule",
            description: "수업 시간표를 가져옵니다. 사용자가 시간표, 수업 일정, 언제 수업해 등의 질문을 하면 호출합니다.",
            parameters: { type: Type.OBJECT, properties: {} },
          },
        ],
      },
    ];

    let response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: { tools },
    });

    // function call이 있으면 실행하고 다시 요청
    while (response.functionCalls && response.functionCalls.length > 0) {
      const fc = response.functionCalls[0];
      const name = fc.name ?? "";
      let result: string;

      if (name === "get_schedule") {
        result = getScheduleText();
      } else {
        result = JSON.stringify({ error: "Unknown function" });
      }

      contents.push({
        role: "model",
        parts: [createPartFromFunctionCall(fc.name ?? "", (fc.args ?? {}) as Record<string, unknown>)],
      } as (typeof contents)[0]);
      contents.push({
        role: "user",
        parts: [
          createPartFromFunctionResponse(
            fc.id ?? "",
            fc.name ?? "",
            { output: result } as Record<string, unknown>
          ),
        ],
      } as (typeof contents)[0]);

      response = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents,
        config: { tools },
      });
    }

    const text =
      response.text?.trim() || "죄송합니다. 답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Chat API error:", err);
    if (isQuotaError(err)) {
      return NextResponse.json(
        { error: "요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "챗봇 오류" },
      { status: 500 }
    );
  }
}
