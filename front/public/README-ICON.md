# PWA 아이콘 적용 방법 (Vercel 포함)

브라우저·앱 설치 시 보이는 아이콘은 **이 폴더(`public`)의 파일**을 사용합니다.

## 반드시 해야 할 일

1. **사용할 이미지 2개를 이 폴더에 넣고 이름을 아래처럼 맞춰 주세요.**
   - `icon.png` — 메인 아이콘 (512×512 권장)
   - `apple-icon.png` — iOS용 (같은 파일 복사해도 됨)

2. **Git에 추가 후 푸시해야 Vercel에 반영됩니다.**

   ```bash
   cd ~/antigravity-linux/front
   git add public/icon.png public/apple-icon.png
   git commit -m "Add custom PWA icons"
   git push
   ```

3. **Vercel에서 다시 배포**  
   (보통 push만 하면 자동 배포됩니다.)

## 요약

- 로컬에만 파일을 넣고 **git add / commit / push를 안 하면** Vercel에는 예전 아이콘이 그대로 보입니다.
- `icon.png`, `apple-icon.png`를 `front/public/`에 두고, 위처럼 커밋·푸시한 뒤 배포하면 적용됩니다.
