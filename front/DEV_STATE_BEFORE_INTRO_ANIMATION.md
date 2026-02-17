# 개발 상태 백업 문서 (인트로 애니메이션 작업 전)

**작성일**: 인트로 애니메이션(SMOOKTH → SMOOKTH MATH) 구현 전 롤백용  
**목적**: 실패 시 이 상태로 되돌리기 위한 참고 문서

---

## 1. Git으로 롤백하기

```bash
# 현재 변경사항 커밋 후 진행했다면:
git log --oneline -5   # 커밋 히스토리 확인
git checkout <이 문서 작성 시점의 커밋해시>

# 또는 stash 사용:
git stash push -m "before intro animation"
# 롤백 시:
git stash pop
```

**권장**: 작업 전에 `git add . && git commit -m "chore: 인트로 애니메이션 작업 전 백업"` 실행

---

## 2. 주요 파일 목록 및 역할

| 파일 | 역할 |
|------|------|
| `app/page.tsx` | 메인 페이지 (BE LOGICAL ∩ BE TACTICAL, 한글 문구, CTA, SinGraph) |
| `app/layout.tsx` | 루트 레이아웃 (NavBar + children) |
| `components/NavBar.tsx` | 네비게이션바 (햄버거, MENU, SMOOKTH/∩, ChatBot) |
| `components/SinGraph.tsx` | sin(x) 그래프 (x,y축 + 곡선) |

---

## 3. 현재 구조 요약

### Layout
- `NavBar` (sticky) + `main` (children)
- 폰트: Outfit, Plus Jakarta Sans, Noto Serif KR

### NavBar
- 상단: `pt-1 sm:pt-2`
- 햄버거 + MENU (모바일에서 MENU 숨김: `hidden sm:inline`)
- 가운데: 스크롤 시 SMOOKTH ↔ ∩ 전환
- SMOOKTH: `tracking-[-0.08em]`, `text-2xl sm:text-3xl md:text-4xl`
- 메뉴 열기 시 확장 (maxWidth 768 → 1152)

### Page (메인)
- 배경: 해변 이미지 + `bg-white/80 backdrop-blur-sm`
- 구조: `px-4` → `max-w-5xl mx-auto` (navbar와 동일)
- 패딩: `py-6 sm:py-8`
- 메인 문구: BE LOGICAL ∩ BE TACTICAL (lg에서 grid 1fr-auto-1fr로 ∩ 가운데)
- 한글: 문장 단위 block, "SMOOKTH와 함께합니다." semibold, sm:15px md:16px
- CTA: 수업 영상, 상담문의 버튼
- SinGraph: mt-24, sin(x) 그래프 + x,y축

---

## 4. CRTVReveal 제거됨

- `CRTVReveal` 컴포넌트는 `SinGraph`로 교체됨
- CRTVReveal 파일은 `components/CRTVReveal.tsx`에 남아있을 수 있음 (import만 page에서 제거)

---

## 5. 롤백 체크리스트

인트로 애니메이션 작업 후 문제 발생 시:

1. [ ] `app/page.tsx` - 현재 메인 콘텐츠 그대로 유지되는지
2. [ ] `app/layout.tsx` - NavBar + children 구조 유지
3. [ ] `components/NavBar.tsx` - 변경 없음
4. [ ] `components/SinGraph.tsx` - 변경 없음
5. [ ] 새로 추가한 인트로 관련 컴포넌트/로직 제거

---

## 6. 참고: 인트로 애니메이션 예정 시나리오

1. 빈 화면 → SMOOKTH 중앙 페이드인
2. SMOOKTH 오른쪽에 : A,B,C,D,F 룰렛 회전 → A에서 멈춤
3. SMOOKTH의 M,T,H 볼드 + A가 들어가며 MATH로 변환
4. 최종: SMOOKTH MATH → 메인 페이지로 전환

---

*이 문서는 인트로 애니메이션 구현 전 상태를 기록한 백업용 문서입니다.*
