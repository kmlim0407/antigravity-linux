// @ts-nocheck
// 질문 / 오답 기록 조회 + 저장 API (Notion v5용)

import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2025-09-03",
});

const databaseId = process.env.NOTION_DATABASE_ID;

// ✅ databaseId → data_source_id로 바꿔주는 함수
async function getDataSourceId() {
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID 환경변수가 비어 있습니다.");
  }

  const db = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const dataSourceId = db.data_sources?.[0]?.id;

  if (!dataSourceId) {
    throw new Error("이 데이터베이스에 data_source_id를 찾을 수 없습니다.");
  }

  return dataSourceId;
}

// ===== GET: 저장된 기록 목록 가져오기 =====
export async function GET() {
  try {
    const dataSourceId = await getDataSourceId();

    // v5: databases.query → dataSources.query
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    const records = (response.results || []).map((page: any) => {
      const props = page.properties || {};

      const getText = (propName: string) =>
        props[propName]?.title?.[0]?.plain_text ??
        props[propName]?.rich_text?.[0]?.plain_text ??
        "";

      return {
        id: page.id,
        studentName: getText("학생 이름"),
        date: props["날짜"]?.date?.start ?? "",
        subject: getText("과목"),
        wrongNumbers: getText("오답 번호"),
        questionNumbers: getText("질문 번호"),
        memo: getText("메모"),
      };
    });

    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error("Notion GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch records from Notion" },
      { status: 500 }
    );
  }
}

// ===== POST: 새 기록 한 줄 저장하기 =====
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      studentName,
      date,
      subject,
      wrongNumbers,
      questionNumbers,
      memo,
    } = body;

    const dataSourceId = await getDataSourceId();

    const response = await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: dataSourceId,
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
    });

    return NextResponse.json({ id: response.id }, { status: 201 });
  } catch (err) {
    console.error("Notion POST error:", err);
    return NextResponse.json(
      { error: "Failed to save record to Notion" },
      { status: 500 }
    );
  }
}
