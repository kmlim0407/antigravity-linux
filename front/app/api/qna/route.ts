import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Notion 클라이언트 (타입 스트레스 줄이려고 any 활용)
const notion: any = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_QNA_DATABASE_ID as string;

/**
 * GET /api/qna
 * QNA 목록 가져오기
 */
export async function GET() {
  try {
    if (!DATABASE_ID) {
      console.error("NOTION_QNA_DATABASE_ID 가 설정되어 있지 않습니다.");
      return NextResponse.json(
        { error: "서버 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // @ts-ignore - notion 타입 때문에 query에서 에러 나던 부분 무시
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "날짜",
          direction: "descending",
        },
      ],
    });

    const results = (response.results || []).map((page: any) => {
      const props = page.properties || {};

      return {
        id: page.id,
        studentName: props["학생"]?.title?.[0]?.plain_text ?? "",
        question: props["질문"]?.rich_text?.[0]?.plain_text ?? "",
        answer: props["답변"]?.rich_text?.[0]?.plain_text ?? "",
        subject: props["과목"]?.select?.name ?? "",
        date: props["날짜"]?.date?.start ?? "",
        solved: props["해결"]?.checkbox ?? false,
      };
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("QNA GET error:", error);
    return NextResponse.json(
      { error: "QNA 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/qna
 * QNA 추가
 */
export async function POST(req: Request) {
  try {
    if (!DATABASE_ID) {
      console.error("NOTION_QNA_DATABASE_ID 가 설정되어 있지 않습니다.");
      return NextResponse.json(
        { error: "서버 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      studentName,
      question,
      answer,
      subject,
      date,
      solved = false,
    } = body;

    if (!studentName || !question) {
      return NextResponse.json(
        { error: "학생 이름과 질문은 필수입니다." },
        { status: 400 }
      );
    }

    // 타입 에러 안 나게 any로 객체 따로 만든 다음에 key만 조건부로 추가
    const properties: any = {
      학생: {
        title: [
          {
            text: { content: studentName },
          },
        ],
      },
      질문: {
        rich_text: [
          {
            text: { content: question },
          },
        ],
      },
      해결: {
        checkbox: !!solved,
      },
    };

    if (answer && String(answer).trim().length > 0) {
      properties["답변"] = {
        rich_text: [
          {
            text: { content: answer },
          },
        ],
      };
    }

    if (subject && String(subject).trim().length > 0) {
      properties["과목"] = {
        select: {
          name: subject,
        },
      };
    }

    if (date && String(date).trim().length > 0) {
      properties["날짜"] = {
        date: {
          start: date,
        },
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties,
    });

    return NextResponse.json({ ok: true, id: response.id });
  } catch (error: any) {
    console.error("QNA POST error:", error);
    return NextResponse.json(
      { error: "QNA 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
