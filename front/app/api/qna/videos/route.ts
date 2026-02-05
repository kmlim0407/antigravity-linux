// app/api/qna/videos/route.ts
import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";

/**
 * 네 노션 DB 컬럼명
 *  - Book     : 교재 (예: "고쟁이")
 *  - Number   : 문제 번호 텍스트 (예: "고쟁이 29")
 *  - VideoUrl : 유튜브 링크 (예: youtu.be/...)
 */
const NOTION_BOOK_PROP = "Book";
const NOTION_NUMBER_PROP = "Number";
const NOTION_URL_PROP = "VideoUrl";

/**
 * youtu.be / youtube.com/watch 링크를
 * iframe에서 쓸 수 있는 embed URL로 변환
 *
 *  - youtu.be/ID?t=123          -> https://www.youtube.com/embed/ID?start=123
 *  - youtube.com/watch?v=ID&t=123 -> https://www.youtube.com/embed/ID?start=123
 */
function toYoutubeEmbedUrl(url: string): string {
  try {
    if (!url) return url;

    // youtu.be 형식
    if (url.includes("youtu.be")) {
      const [base, query] = url.split("?");
      const videoId = base.split("/").pop() ?? "";

      let start = "";
      if (query) {
        const params = new URLSearchParams(query);
        const t = params.get("t");
        if (t) start = `?start=${t}`;
      }

      return `https://www.youtube.com/embed/${videoId}${start}`;
    }

    // youtube.com/watch 형식
    if (url.includes("youtube.com")) {
      const u = new URL(url);
      const videoId = u.searchParams.get("v");
      const t = u.searchParams.get("t");

      if (!videoId) return url;

      return `https://www.youtube.com/embed/${videoId}${
        t ? `?start=${t}` : ""
      }`;
    }

    // 다른 도메인은 그대로 반환
    return url;
  } catch {
    return url;
  }
}

export async function POST(req: NextRequest) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error("Notion env missing");
    return NextResponse.json(
      { error: "Notion 설정이 되어 있지 않습니다." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({} as any));
  const rawBook = String(body.book ?? "");
  const rawNumber = String(body.number ?? "");

  const trimmedBook = rawBook.trim();
  // "29", "고쟁이 29", "29번" 이런 것들에서 숫자만 추출
  const digitNumber = rawNumber.replace(/[^\d]/g, "");

  if (!trimmedBook || !digitNumber) {
    return NextResponse.json(
      { error: "교재와 문제 번호를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const resp = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            and: [
              {
                // Book == "고쟁이"
                property: NOTION_BOOK_PROP,
                rich_text: {
                  equals: trimmedBook,
                },
              },
              {
                // Number 안에 "29" 가 포함되어 있는지 (예: "고쟁이 29")
                property: NOTION_NUMBER_PROP,
                rich_text: {
                  contains: digitNumber,
                },
              },
            ],
          },
        }),
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Notion error:", resp.status, text);
      return NextResponse.json(
        { error: "Notion 조회 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const data = (await resp.json()) as any;

    const videos = (data.results ?? []).map((page: any) => {
      const props = page.properties ?? {};

      const bookProp = props[NOTION_BOOK_PROP];
      const numberProp = props[NOTION_NUMBER_PROP];
      const urlProp = props[NOTION_URL_PROP];

      const bookText =
        bookProp?.rich_text?.[0]?.plain_text ??
        bookProp?.title?.[0]?.plain_text ??
        "";

      const numberText =
        numberProp?.rich_text?.[0]?.plain_text ??
        numberProp?.title?.[0]?.plain_text ??
        "";

      const rawUrl =
        urlProp?.url ??
        urlProp?.rich_text?.[0]?.href ??
        urlProp?.rich_text?.[0]?.plain_text ??
        "";

      const title =
        numberText ||
        bookText ||
        (props.Name?.title?.[0]?.plain_text ?? "제목 없음");

      return {
        id: page.id as string,
        title,
        book: bookText,
        number: numberText,
        url: toYoutubeEmbedUrl(rawUrl), // 🔹 여기서 임베드용 URL로 변환
      };
    });

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("Notion fetch error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
