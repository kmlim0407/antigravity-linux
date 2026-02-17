This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 환경 변수 설정 (.env.local)

프로젝트 루트에 `.env.local`을 만들고 아래 키를 필요한 만큼 채우세요.  
템플릿은 `.env.example`을 참고하면 됩니다.

| 키 | 용도 | 발급/확인 |
|----|------|------------|
| `GEMINI_API_KEY` | 챗봇 (Gemini + Google Search) | [Google AI Studio](https://aistudio.google.com/apikey) (결제 연결 시 검색, 월 5천회 무료) |
| `NOTION_API_KEY` / `NOTION_TOKEN` | Notion 연동 (QnA, 오답기록 등) | [Notion 연동](https://www.notion.so/my-integrations) 생성 후 토큰 복사 |
| `NOTION_WRONG_DB_ID` | 오답 기록 DB | Notion DB 페이지 URL의 `...?v=xxxx` 앞 부분 ID |
| `NOTION_QNA_DB_ID` | QnA 영상 목록 DB | 위와 동일하게 DB ID 복사 |
| `UPSTASH_REDIS_REST_URL` | 학생 성취도 저장 (Redis) | [Upstash Console](https://console.upstash.com) → DB 생성 → REST API 탭 |
| `UPSTASH_REDIS_REST_TOKEN` | 위와 쌍으로 사용 | 동일 |

- 챗봇만 쓸 경우: `GEMINI_API_KEY`만 설정하면 됩니다.
- Vercel 배포 시: 프로젝트 **Settings → Environment Variables**에 같은 키를 추가하세요.
