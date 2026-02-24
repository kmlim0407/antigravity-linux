import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, ApiError } from "@/lib/api-error";

const notionToken = process.env.NOTION_API_KEY;
const wrongDbId = process.env.NOTION_WRONG_DB_ID;

const NOTION_VERSION = "2022-06-28";

type NotionTextProp = {
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
};

type NotionDateProp = {
  date?: { start: string };
};

type NotionProperties = {
  "학생 이름"?: NotionTextProp;
  날짜?: NotionDateProp;
  과목?: NotionTextProp;
  "오답 번호"?: NotionTextProp;
  "질문 번호"?: NotionTextProp;
  메모?: NotionTextProp;
};

type NotionPage = {
  id: string;
  properties: NotionProperties;
};

type NotionQueryResponse = {
  results: NotionPage[];
};

type NotionCreateResponse = {
  id: string;
};

function getTextFromProp(prop: NotionTextProp | undefined): string {
  if (!prop) return "";
  if (prop.title?.[0]?.plain_text) return prop.title[0].plain_text;
  if (prop.rich_text?.[0]?.plain_text) return prop.rich_text[0].plain_text;
  return "";
}

const PostBodySchema = z.object({
  studentName: z.string().min(1, "학생 이름을 입력해주세요.").max(20),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 YYYY-MM-DD 형식이어야 합니다.")
    .optional(),
  subject: z.string().max(100).optional().default(""),
  wrongNumbers: z.string().max(500).optional().default(""),
  questionNumbers: z.string().max(500).optional().default(""),
  memo: z.string().max(1000).optional().default(""),
});

export async function GET() {
  try {
    if (!notionToken || !wrongDbId) {
      throw new ApiError(500, "노션 설정이 잘못되었습니다. (env 누락)");
    }

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
          sorts: [{ timestamp: "created_time", direction: "descending" }],
        }),
      }
    );

    const data = (await notionRes.json()) as NotionQueryResponse;

    if (!notionRes.ok) {
      console.error("Notion GET query failed (question-records):", data);
      throw new ApiError(notionRes.status, "노션에서 오답 기록을 불러오지 못했습니다.");
    }

    const records = (data.results ?? []).map((page) => {
      const props = page.properties;
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
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    if (!notionToken || !wrongDbId) {
      throw new ApiError(500, "노션 설정이 잘못되었습니다. (env 누락)");
    }

    const body = await request.json();
    const { studentName, date, subject, wrongNumbers, questionNumbers, memo } =
      PostBodySchema.parse(body);

    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: wrongDbId },
        properties: {
          "학생 이름": {
            title: [{ text: { content: studentName } }],
          },
          날짜: {
            date: { start: date ?? new Date().toISOString().slice(0, 10) },
          },
          과목: {
            rich_text: [{ text: { content: subject } }],
          },
          "오답 번호": {
            rich_text: [{ text: { content: wrongNumbers } }],
          },
          "질문 번호": {
            rich_text: [{ text: { content: questionNumbers } }],
          },
          메모: {
            rich_text: [{ text: { content: memo } }],
          },
        },
      }),
    });

    const data = (await notionRes.json()) as NotionCreateResponse;

    if (!notionRes.ok) {
      console.error("Notion POST failed (question-records):", data);
      throw new ApiError(notionRes.status, "노션에 오답 기록을 저장하지 못했습니다.");
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
