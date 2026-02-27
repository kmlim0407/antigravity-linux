import { NextRequest, NextResponse } from "next/server";
import { ALL_TAGS } from "@/lib/characteristics";

const notionToken = process.env.NOTION_API_KEY;
const wrongDbId = process.env.NOTION_WRONG_DB_ID;
const NOTION_VERSION = "2022-06-28";

type NotionTextProp = {
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
};

type NotionPage = {
  id: string;
  properties: {
    "학생 이름"?: NotionTextProp;
    과목?: NotionTextProp;
    "오답 번호"?: NotionTextProp;
    메모?: NotionTextProp;
  };
};

function getText(prop: NotionTextProp | undefined): string {
  if (!prop) return "";
  if (prop.title?.[0]?.plain_text) return prop.title[0].plain_text;
  if (prop.rich_text?.[0]?.plain_text) return prop.rich_text[0].plain_text;
  return "";
}

/** 키워드 → 태그 매핑 */
const KEYWORD_MAP: Record<string, string[]> = {
  함수: ["함수 개념"],
  미분: ["미분 개념"],
  적분: ["적분 개념"],
  확률: ["확통 개념", "확률 분포"],
  통계: ["확통 개념"],
  기하: ["기하 개념", "도형 활용"],
  수열: ["수열 개념"],
  지수: ["지수·로그"],
  로그: ["지수·로그"],
  삼각: ["삼각함수"],
  계산: ["계산 실수 잦음"],
  실수: ["계산 실수 잦음"],
  킬러: ["킬러 문항"],
  준킬: ["준킬러 문항"],
  빈칸: ["빈칸 추론"],
  도형: ["도형 활용"],
  속도: ["속도·가속도"],
  넓이: ["넓이·부피"],
  부피: ["넓이·부피"],
  조합: ["조합론"],
  그래프: ["그래프 해석 약함"],
};

const VALID_TAGS = new Set(ALL_TAGS.map((t) => t.tag));

/**
 * POST { studentName }
 * Notion 오답 데이터를 분석해서 추천 태그를 반환
 */
export async function POST(req: NextRequest) {
  try {
    if (!notionToken || !wrongDbId) {
      return NextResponse.json(
        { error: "노션 설정이 잘못되었습니다." },
        { status: 500 }
      );
    }

    const { studentName } = await req.json();
    if (!studentName) {
      return NextResponse.json(
        { error: "studentName required" },
        { status: 400 }
      );
    }

    // Notion에서 해당 학생의 오답 기록 가져오기
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
          filter: {
            property: "학생 이름",
            title: { equals: studentName },
          },
          sorts: [{ timestamp: "created_time", direction: "descending" }],
        }),
      }
    );

    if (!notionRes.ok) {
      console.error("Notion query failed:", await notionRes.text());
      return NextResponse.json(
        { error: "노션에서 데이터를 불러오지 못했습니다." },
        { status: 502 }
      );
    }

    const data = (await notionRes.json()) as { results: NotionPage[] };
    const records = data.results ?? [];

    // 텍스트 합치기
    const allText = records
      .map(
        (r) =>
          `${getText(r.properties["과목"])} ${getText(r.properties["오답 번호"])} ${getText(r.properties["메모"])}`
      )
      .join(" ")
      .toLowerCase();

    // 키워드 매칭으로 태그 추천
    const tagCounts = new Map<string, number>();
    for (const [keyword, tags] of Object.entries(KEYWORD_MAP)) {
      const regex = new RegExp(keyword, "gi");
      const matches = allText.match(regex);
      if (matches) {
        for (const tag of tags) {
          if (VALID_TAGS.has(tag)) {
            tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + matches.length);
          }
        }
      }
    }

    // 오답 반복 패턴 감지: 같은 과목에서 3개 이상 오답이면 추가
    if (records.length >= 5) {
      tagCounts.set("오답 반복", (tagCounts.get("오답 반복") ?? 0) + records.length);
    }

    // 빈도순 정렬
    const suggested = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));

    return NextResponse.json({
      studentName,
      totalRecords: records.length,
      suggested,
    });
  } catch (e) {
    console.error("POST /api/characteristics/analyze error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
