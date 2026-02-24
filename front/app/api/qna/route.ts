import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, ApiError } from "@/lib/api-error";

const notionToken = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
const NOTION_QNA_DB_ID = process.env.NOTION_QNA_DB_ID;

const BodySchema = z.object({
  studentName: z.string().min(1, "학생 이름을 입력해주세요.").max(20),
  book: z.string().max(100).optional().default(""),
  page: z.number().int().positive().optional(),
  number: z.number().int().positive().optional(),
  content: z.string().max(2000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    if (!notionToken || !NOTION_QNA_DB_ID) {
      throw new ApiError(500, "서버 환경변수 설정 오류");
    }

    const body = await req.json();
    const { studentName, book, page, number, content } = BodySchema.parse(body);

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_QNA_DB_ID },
        properties: {
          이름: {
            title: [{ text: { content: studentName } }],
          },
          교재: {
            rich_text: [{ text: { content: book } }],
          },
          ...(page !== undefined && { 페이지: { number: page } }),
          ...(number !== undefined && { 번호: { number: number } }),
          질문내용: {
            rich_text: [{ text: { content: content } }],
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Notion error:", text);
      throw new ApiError(500, "Notion 요청 에러");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
