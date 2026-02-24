import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, ApiError } from "@/lib/api-error";

const notionToken = process.env.NOTION_API_KEY;
const notionDbId = process.env.NOTION_QNA_DB_ID;

const PROP_BOOK = "Book";
const PROP_NUMBER = "Number";
const PROP_URL = "VideoUrl";
const NOTION_VERSION = "2022-06-28";

type VideoEntry = {
  id: string;
  book: string;
  number: string;
  title: string;
  url: string;
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty>;
};

type NotionProperty = {
  rich_text?: Array<{ plain_text: string }>;
  title?: Array<{ plain_text: string }>;
  url?: string;
};

type NotionQueryResponse = {
  results: NotionPage[];
};

const BodySchema = z.object({
  book: z.string().min(1, "교재를 입력해주세요.").max(100).transform((s) => s.trim()),
  number: z.string().min(1, "번호를 입력해주세요.").max(50).transform((s) => s.trim()),
});

export async function POST(req: NextRequest) {
  try {
    if (!notionToken || !notionDbId) {
      throw new ApiError(500, "노션 설정이 잘못되었습니다. (env 누락)");
    }

    const body = await req.json().catch(() => null);
    const { book, number } = BodySchema.parse(body);

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
              { property: PROP_BOOK, rich_text: { contains: book } },
              { property: PROP_NUMBER, rich_text: { contains: number } },
            ],
          },
        }),
      }
    );

    const data = (await notionRes.json()) as NotionQueryResponse;

    if (!notionRes.ok) {
      console.error("Notion query failed", data);
      throw new ApiError(notionRes.status, "노션 조회 중 오류가 발생했습니다.");
    }

    const videos: VideoEntry[] = (data.results ?? [])
      .map((page): VideoEntry | null => {
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
          bookText && numberText
            ? `${bookText} - ${numberText}`
            : bookText || numberText || "질문 영상";

        return { id: page.id, book: bookText, number: numberText, title: titleText, url: urlText };
      })
      .filter((v): v is VideoEntry => v !== null);

    return NextResponse.json({ videos }, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}
