// @ts-nocheck
// 질문 / 오답 기록 조회 + 저장 API (Notion REST v1 사용)

import { NextResponse } from "next/server";

const notionToken = process.env.NOTION_API_KEY;        // 공용 토큰
const wrongDbId = process.env.NOTION_WRONG_DB_ID;      // ✅ 오답 기록 DB ID

const NOTION_VERSION = "2022-06-28";

// 공통: 텍스트 꺼내는 헬퍼
function getTextFromProp(prop: any): string {
  if (!prop) return "";

  if (prop.title && prop.title[0]?.plain_text) {
    return prop.title[0].plain_text;
  }

  if (prop.rich_text && prop.rich_text[0]?.plain_text) {
    return prop.rich_text[0].plain_text;
  }

  return "";
}

// ===== GET: 저장된 오답 기록 목록 가져오기 =====
export async function GET() {
  try {
    if (!notionToken || !wrongDbId) {
      console.error("Notion env missing in question-records GET", {
        hasToken: !!notionToken,
        hasDbId: !!wrongDbId,
      });
      return NextResponse.json(
        { error: "노션 설정이 잘못되었습니다. (env 누락)" },
        { status: 500 }
      );
    }

    // Notion DB 쿼리
    const notionRes = await fetch(
      `https://api.notion.com/v1/databases/${wrongDbId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionToken}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          sorts: [
            {
              // 생성 시간 기준 내림차순
              timestamp: "created_time",
              direction: "descending",
            },
          ],
        }),
      }
    );

    const data = (await notionRes.json()) as any;

    if (!notionRes.ok) {
      console.error("Notion GET query failed (question-records):", data);
      return NextResponse.json(
        { error: "노션에서 오답 기록을 불러오지 못했습니다." },
        { status: notionRes.status }
      );
    }

    const results = (data.results ?? []) as any[];

    const records = results.map((page: any) => {
      const props = page.properties || {};

      return {
        id: page.id,
        studentName: getTextFromProp(props["학생 이름"]),
        date: props["날짜"]?.date?.start ?? "",
        subject: getTextFromProp(props["과목"]),
        wrongNumbers: getTextFromProp(props["오답 번호"]),
        questionNumbers: getTextFromProp(props["질문 번호"]),
        memo: getTextFromProp(props["메모"]),
      };
    });

    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error("Notion GET error (question-records):", err);
    return NextResponse.json(
      { error: "Failed to fetch records from Notion" },
      { status: 500 }
    );
  }
}

// ===== POST: 새 오답 기록 한 줄 저장하기 =====
export async function POST(request: Request) {
  try {
    if (!notionToken || !wrongDbId) {
      console.error("Notion env missing in question-records POST", {
        hasToken: !!notionToken,
        hasDbId: !!wrongDbId,
      });
      return NextResponse.json(
        { error: "노션 설정이 잘못되었습니다. (env 누락)" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      studentName,
      date,
      subject,
      wrongNumbers,
      questionNumbers,
      memo,
    } = body;

    // Notion 페이지 생성
    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: {
          database_id: wrongDbId,
        },
        properties: {
          "학생 이름": {
            title: [
              {
                text: { content: studentName || "" },
              },
            ],
          },
          날짜: {
            date: {
              start:
                date ||
                new Date().toISOString().slice(0, 10), // yyyy-mm-dd
            },
          },
          과목: {
            rich_text: [
              {
                text: { content: subject || "" },
              },
            ],
          },
          "오답 번호": {
            rich_text: [
              {
                text: { content: wrongNumbers || "" },
              },
            ],
          },
          "질문 번호": {
            rich_text: [
              {
                text: { content: questionNumbers || "" },
              },
            ],
          },
          메모: {
            rich_text: [
              {
                text: { content: memo || "" },
              },
            ],
          },
        },
      }),
    });

    const data = (await notionRes.json()) as any;

    if (!notionRes.ok) {
      console.error("Notion POST failed (question-records):", data);
      return NextResponse.json(
        { error: "노션에 오답 기록을 저장하지 못했습니다." },
        { status: notionRes.status }
      );
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Notion POST error (question-records):", err);
    return NextResponse.json(
      { error: "Failed to save record to Notion" },
      { status: 500 }
    );
  }
}
