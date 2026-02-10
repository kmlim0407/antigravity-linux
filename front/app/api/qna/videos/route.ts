import { NextRequest, NextResponse } from "next/server";

// 🔹 1. 환경변수에서 토큰/DB ID 읽기
const notionToken = process.env.NOTION_API_KEY;
const notionDbId = process.env.NOTION_QNA_DB_ID;

// 🔹 2. 노션 DB 컬럼 이름 (네 노션 DB 스샷 기준)
const PROP_BOOK = "Book";       // 교재명 들어있는 컬럼
const PROP_NUMBER = "Number";   // "고쟁이 29" 이런 텍스트 컬럼
const PROP_URL = "VideoUrl";    // 유튜브 링크(URL 타입 컬럼)

type VideoEntry = {
  id: string;
  book: string;
  number: string;
  title: string;
  url: string;
};

const NOTION_VERSION = "2022-06-28";

// 🔹 POST /api/qna/videos
export async function POST(req: NextRequest) {
  try {
    // 1) env 체크
    if (!notionToken || !notionDbId) {
      console.error("Notion env missing", {
        hasToken: !!notionToken,
        hasDbId: !!notionDbId,
      });
      return NextResponse.json(
        { error: "노션 설정이 잘못되었습니다. (env 누락)" },
        { status: 500 }
      );
    }

    // 2) 요청 바디 파싱
    const body = (await req.json().catch(() => null)) as
      | {
          book?: string;
          number?: string;
        }
      | null;

    const book = body?.book?.trim() ?? "";
    const number = body?.number?.trim() ?? "";

    if (!book || !number) {
      return NextResponse.json(
        { error: "교재와 번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 3) Notion REST API 직접 호출
    const notionRes = await fetch(
      `https://api.notion.com/v1/databases/${notionDbId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionToken}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            and: [
              {
                property: PROP_BOOK,
                rich_text: {
                  // "고쟁이" 이런 값 포함인지 체크
                  contains: book,
                },
              },
              {
                property: PROP_NUMBER,
                rich_text: {
                  // Number 컬럼 값이 "고쟁이 29" 이런 식이라서
                  // equals가 아니라 contains 로 검색
                  contains: number,
                },
              },
            ],
          },
        }),
      }
    );

    const data = (await notionRes.json()) as any;

    if (!notionRes.ok) {
      console.error("Notion query failed", data);
      return NextResponse.json(
        { error: "노션 조회 중 오류가 발생했습니다. (쿼리 실패)" },
        { status: notionRes.status }
      );
    }

    const results = (data.results ?? []) as any[];

    // 4) 결과를 VideoEntry 배열로 변환
    const videos: VideoEntry[] = results
      .map((page: any): VideoEntry | null => {
        const props = page.properties ?? {};

        const bookProp = props[PROP_BOOK];
        const numberProp = props[PROP_NUMBER];
        const urlProp = props[PROP_URL];

        const bookText =
          bookProp?.rich_text?.[0]?.plain_text ??
          bookProp?.title?.[0]?.plain_text ??
          "";
        const numberText =
          numberProp?.rich_text?.[0]?.plain_text ??
          numberProp?.title?.[0]?.plain_text ??
          "";
        const urlText =
          urlProp?.url ??
          urlProp?.rich_text?.[0]?.plain_text ??
          "";

        if (!urlText) return null;

        const titleText =
          (bookText && numberText
            ? `${bookText} - ${numberText}`
            : bookText || numberText || "질문 영상");

        return {
          id: page.id,
          book: bookText,
          number: numberText,
          title: titleText,
          url: urlText,
        };
      })
      .filter((v: VideoEntry | null): v is VideoEntry => v !== null);

    return NextResponse.json({ videos }, { status: 200 });
  } catch (err: any) {
    console.error("QNA Notion Error:", err?.message || err);

    return NextResponse.json(
      { error: "노션 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
