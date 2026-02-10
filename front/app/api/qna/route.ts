// app/api/qna/route.ts
import { NextRequest, NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_QNA_DB_ID = process.env.NOTION_QNA_DB_ID;

export async function POST(req: NextRequest) {
  try {
    if (!NOTION_TOKEN || !NOTION_QNA_DB_ID) {
      console.error("Missing Notion env");
      return NextResponse.json(
        { ok: false, error: "서버 환경변수 설정 오류" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      studentName, // 학생 이름
      book,        // 교재 이름
      page,        // 페이지
      number,      // 문제 번호
      content,     // 질문 내용
    } = body;

    // Notion 페이지 생성 요청
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_QNA_DB_ID },
        properties: {
          // ⬇⬇⬇ 여기부터는 네가 만든 Notion DB 속성 이름에 맞게 수정하면 됨
          이름: {
            title: [
              {
                text: { content: studentName || "이름 없음" },
              },
            ],
          },
          교재: {
            rich_text: [
              {
                text: { content: book || "" },
              },
            ],
          },
          페이지: page
            ? {
                number: Number(page),
              }
            : undefined,
          번호: number
            ? {
                number: Number(number),
              }
            : undefined,
          질문내용: {
            rich_text: [
              {
                text: { content: content || "" },
              },
            ],
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Notion error:", text);
      return NextResponse.json(
        { ok: false, error: "Notion 요청 에러" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "알 수 없는 서버 오류" },
      { status: 500 }
    );
  }
}
