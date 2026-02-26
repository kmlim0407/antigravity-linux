# SMOOKTH — 코드·기능·디자인 근거

> 모든 코드, 기능, 디자인 결정에 담긴 "이유"를 정리한 문서

---

## 1. 프로젝트 개요

**SMOOKTH**는 수학 학원/스튜디오 통합 관리 플랫폼이다.  
학생·학부모·선생님이 사용하는 랜딩·성취도·QnA·오답·보강·프린트 풀이·첨삭까지 하나의 사이트에서 처리한다.

---

## 2. 기술 스택 선택 이유

### 2.1 Next.js 16 + React 19
- **이유**: App Router로 라우팅·레이아웃·API를 한 프로젝트에서 관리. Vercel 배포와 최적화.
- **서버 컴포넌트·클라이언트 분리**: 인터랙션이 필요한 페이지만 `"use client"`, 나머지는 서버 렌더링.

### 2.2 Tailwind CSS 4
- **이유**: 유틸리티 기반으로 빠른 스타일링, 일관된 디자인 토큰, 번들 크기 최적화.
- **CSS 변수 (`:root`)**: `--background`, `--foreground`, `--surface` 등으로 다크 모드·테마 전환에 대비.

### 2.3 Upstash Redis
- **이유**: Vercel Serverless와 잘 맞는 서버리스 Redis. REST API라 람다 환경에서 안정적.
- **용도**: 성취도, 보강 슬롯·예약, 프린트 과제·풀이·첨삭 저장.

### 2.4 Notion API
- **이유**: QnA 영상·오답 기록을 Notion DB로 관리. 스키마 변경·검색을 Notion에서 처리.
- **제약**: API 한도·의존성이 있어, 장기적으로 DB 이전 고려.

### 2.5 Vercel Blob
- **이유**: 업로드된 PDF 파일 저장. Vercel과 통합되어 배포·환경 변수 관리가 단순함.
- **Private 스토어**: 민감한 학생 자료라 private로 설정하고, `/api/prints/blob` 프록시로만 접근.

### 2.6 Framer Motion
- **이유**: 인트로 애니메이션·네비 확장·페이지 전환 등 부드러운 UX.
- **시네마틱 인트로**: 첫 진입 시 브랜드 인상 강화.

---

## 3. 라우트 구조

| 경로 | 역할 | 접근 |
|------|------|------|
| `/` | 홈, 랜딩, 챗봇 | 공개 |
| `/portfolio` | 수업 영상 (유튜브) | 공개 |
| `/students` | 학생 목록 | 공개 |
| `/student/[id]` | 학생별 성취도·체크리스트 | 비밀번호 |
| `/student/[id]/solve` | 프린트 풀이 목록 | 비밀번호 |
| `/student/[id]/solve/[assignmentId]` | PDF 풀이 화면 | 해당 학생 |
| `/student-manage` | 학생관리 허브 | 내부 |
| `/student-manage/prints` | 프린트 업로드·배정 | 관리자 비밀번호 |
| `/student-manage/prints/[id]` | 첨삭 화면 | 관리자 |
| `/student-manage/makeup` | 보강 관리 | 관리자 비밀번호 |
| `/makeup` | 보강 예약 (Calendly) | 공개 |
| `/qna` | QnA / 질문 영상 | 공개 |
| `/wrong-answer-print` | 오답 프린트 생성 | 내부 |
| `/parents` | 학부모 안내 | 공개 |

- **동적 라우트 `[id]`**: 학생·과제 등 식별자로 URL 구분.
- **관리 페이지 분리**: `/student-manage/*`로 내부 기능을 묶고, 별도 비밀번호로 보호.

---

## 4. 주요 기능별 설계 이유

### 4.1 홈 / 랜딩

- **스냅 스크롤**: 한 화면 단위로 이동해 각 섹션을 명확히 구분.
- **인트로 애니메이션**: 첫 방문 시 브랜드 강조.
- **챗봇**: Gemini/OpenAI로 수업·상담 관련 질문 응답.
- **비디오 캐러셀**: 대표 영상을 한곳에 노출.

### 4.2 학생 성취도 (`/student/[id]`)

- **비밀번호 인증**: 개인별 간단 보안.
- **날짜별 체크리스트**: 월·금 수업에 맞춘 항목 (과제, 교재 오답, 과제 오답 등).
- **localStorage → Redis**: 성취도 데이터는 API로 저장해 여러 기기에서 공유 가능.

### 4.3 QnA / 오답 기록

- **Notion 연동**: 영상·오답 데이터를 Notion에서 관리.
- **교재·문제 번호 검색**: 수학 문항 기준으로 빠르게 조회.

### 4.4 보강 관리

- **슬롯·예약 구조**: 날짜·시간별 슬롯, 학생별 예약을 Redis에 저장.
- **Calendly iframe**: `/makeup`는 Calendly로 보강 예약을 맡김.
- **관리자 화면**: 슬롯 추가·예약 승인·취소를 내부에서 처리.

### 4.5 프린트 풀이·첨삭

- **PDF 업로드**: 선생님이 학생별 PDF를 Blob에 업로드.
- **과제 배정**: `studentId` ↔ `pdfUrl` 매핑을 Redis에 저장.
- **굿노트 스타일 캔버스**: PDF 위에 Canvas로 그리기.
  - **펜**: 색·굵기 선택, 자유곡선 그리기.
  - **지우개**: 지우개 영역과 겹치는 스트로크 삭제 (흰 펜 아님).
  - **실행취소·다시실행**: 히스토리 스택으로 스트로크 단위 Undo/Redo.
- **풀이(annotation) / 첨삭(correction) 분리**: 학생 풀이와 선생님 첨삭을 별도 레이어로 저장.
- **자동 저장**: 그리기 후 2초 디바운스로 자동 저장.
- **프록시 API**: Private Blob은 브라우저 직접 접근 불가 → `/api/prints/blob`로 스트리밍.

### 4.6 오답 프린트 (`/wrong-answer-print`)

- **PDF 업로드 → OCR (Tesseract)**: 문제 번호 인식.
- **선택·크롭**: 필요한 문항만 골라 새 PDF 생성.
- **pdf-lib·pdfjs-dist**: PDF 생성·렌더링에 사용.

---

## 5. 데이터 모델 설계 이유

### 5.1 학생 (`lib/students.ts`)

- **하드코딩 명단**: 소규모 학원이라 코드에 직접 관리. 확장 시 Notion/DB로 이전 가능.
- **id (영어)**: URL·라우팅에 사용 (`kim-jiho` 등).

### 5.2 비밀번호 (`lib/student-passwords.server.ts`)

- **서버 전용**: `"use client"`에서 import 금지로 클라이언트 노출 방지.
- **현 구조**: Record로 저장. Phase 2에서 해시·별도 인증으로 개선 예정.

### 5.3 Redis 키 구조

| 키 패턴 | 용도 |
|---------|------|
| `makeup:slots` | 보강 슬롯 ID 집합 |
| `makeup:bookings` | 예약 목록 |
| `prints:assignments` | 과제 ID 집합 |
| `prints:assignment:{id}` | 과제 메타데이터 |
| `prints:annotation:{id}` | 학생 풀이 strokes |
| `prints:correction:{id}` | 선생님 첨삭 strokes |
| `prints:student:{studentId}` | 학생별 과제 ID 집합 |
| `achievement:*` | 성취도 (lib/achievement 참고) |

- **접두사**: 도메인별로 구분해 키 충돌 방지.
- **집합+개별**: ID 집합으로 목록 관리, 개별 데이터는 별도 키에 저장.

---

## 6. UI·UX 설계 이유

### 6.1 폰트

- **Outfit**: 제목·헤더.
- **Plus Jakarta Sans**: 본문·UI.
- **CSS 변수**: `--font-outfit`, `--font-jakarta`로 전역 적용.

### 6.2 네비게이션

- **스크롤 시 하단 그림자**: 스크롤로 콘텐츠가 가려짐을 시각적으로 표현.
- **확장 메뉴**: 카드 형태로 메뉴 노출, 터치·클릭 모두 지원.
- **PWA 설치 버튼**: 홈 화면 추가 유도.

### 6.3 색상·테마

- **slate 계열**: 중립적이고 읽기 좋은 톤.
- **흰 배경 기본**: 깔끔하고 수학/교육에 잘 맞는 인상.
- **CSS 변수**: 다크 모드 대비 가능.

### 6.4 반응형

- **모바일 우선**: `sm:`, `md:` 브레이크포인트로 데스크톱 확장.
- **dvh (Dynamic Viewport Height)**: 모바일 주소창 등에 따른 뷰포트 변화 반영.
- **터치**: `touch-manipulation`, `min-h-[44px]`로 터치 영역 확보.

---

## 7. API 설계 이유

### 7.1 인증 (`/api/auth/verify`)

- **studentId + password**: 별도 세션 없이 요청마다 검증.
- **Zod 스키마**: 입력 검증·에러 메시지 일관성.

### 7.2 prints API

- **GET/POST /api/prints/assignments**: 과제 목록·생성.
- **GET/DELETE /api/prints/assignments/[id]**: 과제 조회·삭제.
- **GET/PUT /api/prints/assignments/[id]/annotation**: 풀이 조회·저장.
- **GET/PUT /api/prints/assignments/[id]/correction**: 첨삭 조회·저장.
- **GET /api/prints/blob**: Private Blob PDF 스트리밍 프록시.
- **POST /api/prints/upload**: Blob 업로드 후 URL 반환.

- **RESTful**: 리소스 단위로 GET/POST/PUT/DELETE 분리.

### 7.3 에러 처리 (`lib/api-error.ts`)

- **일관된 형식**: `{ error: string }` + HTTP 상태 코드.
- **ApiError 클래스**: status + message로 통일.

---

## 8. 외부 의존성·선택 이유

| 패키지 | 용도 | 대안 |
|--------|------|------|
| @vercel/blob | PDF 파일 저장 | S3, R2 |
| @upstash/redis | 데이터 저장 | Supabase, PlanetScale |
| @notionhq/client | QnA·오답 | 직접 DB |
| pdfjs-dist | PDF 렌더링 | react-pdf |
| pdf-lib | PDF 생성 | jsPDF |
| tesseract.js | OCR | Google Vision 등 |
| ably | 실시간 (선택) | Pusher, Supabase Realtime |
| framer-motion | 애니메이션 | CSS only |
| zod | 스키마 검증 | Yup, io-ts |

---

## 9. PWA·모바일

- **manifest.json**: 아이콘·앱 이름·설치 설정.
- **Service Worker (sw.js)**: 오프라인·캐시 (선택).
- **appleWebApp capable**: iOS 홈 화면 추가 시 앱처럼 동작.
- **viewport maximumScale=1**: 줌 제한으로 레이아웃 깨짐 방지.

---

## 10. 보안·운영 고려

- **관리자 비밀번호**: `NEXT_PUBLIC_ADMIN_KEY` (클라이언트 노출, 간단 관리용).
- **학생 비밀번호**: 서버 전용 파일에 보관.
- **env 변수**: API 키·토큰은 모두 `.env.local`, Git 제외.
- **Blob Private**: PDF는 토큰이 있는 서버 경유로만 접근.

---

## 11. 향후 개선 방향 (DEVELOPMENT_PLAN 참고)

- Phase 1: 라우트 오타 수정, 학생관리 인증, 비밀번호 해시.
- Phase 2: 성취도 서버 저장, 학생관리 실제 연동.
- Phase 3: 학부모 대시보드, 보강 관리 개선.
- Phase 4: DB 도입, 모니터링, PWA/앱 강화.

---

*이 문서는 코드·기능·디자인 결정의 근거를 추적하고, 유지보수·온보딩에 활용하기 위해 작성됨.*
