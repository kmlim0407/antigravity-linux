# PWA 아이콘

## 방법 1: public 폴더 (기본)

- `icon.png`, `apple-icon.png` 를 이 폴더에 넣으면 **서버 라우트 `/icon`, `/apple-icon`** 가 그 파일을 읽어서 서빙합니다.
- Git에 커밋·푸시하면 Vercel 배포에 포함됩니다.

## 방법 2: 외부 URL (캐시/배포 문제 없음)

아이콘이 계속 안 바뀌면 **이미지 호스팅**을 쓰세요.

1. 아이콘 이미지를 [imgur.com](https://imgur.com) 또는 [postimages.org](https://postimages.org) 등에 업로드.
2. **직접 링크 URL** 복사 (예: `https://i.imgur.com/xxxxx.png`).
3. Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables** 에 추가:
   - `NEXT_PUBLIC_ICON_URL` = 아이콘 이미지 URL
   - `NEXT_PUBLIC_APPLE_ICON_URL` = 같은 URL 또는 다른 이미지 URL
4. **Redeploy** 한 번 실행.

이렇게 하면 Git/캐시 없이 그 URL이 그대로 아이콘으로 사용됩니다.
