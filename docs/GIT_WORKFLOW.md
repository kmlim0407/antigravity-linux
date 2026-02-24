# Git 브랜치 전략 & 롤백 가이드

## 현재 구조

- `main`: 프로덕션 (Vercel 배포)
- `develop`: 개발용
- 태그 `v0.1.0`: 롤백 포인트 (학생 성취도 캘린더, Upstash Redis 버전)

## 브랜치 구조

| 브랜치 | 용도 |
|--------|------|
| `main` | 프로덕션용. Vercel 배포 연결. 안정된 버전만 머지 |
| `develop` | 개발 통합. 일상 작업은 여기서 진행 |
| `feature/기능명` | 새 기능 개발 시 사용 (예: `feature/student-auth`) |

## 개발 단계별 작업 흐름

### 1. 새 기능 시작
```bash
git checkout develop
git pull origin develop
git checkout -b feature/기능이름   # 예: feature/achievement-calendar
# 작업 후...
git add .
git commit -m "feat: 기능 설명"
git push origin feature/기능이름
```

### 2. develop에 머지 (기능 완료 시)
```bash
git checkout develop
git merge feature/기능이름
git push origin develop
```

### 3. 프로덕션 배포 (main 머지)
```bash
git checkout main
git merge develop
git tag v0.2.0   # 롤백용 태그 (버전 올려서)
git push origin main --tags
```

### 4. 롤백 (문제 발생 시)

**방법 A: 이전 태그로 되돌리기**
```bash
git checkout main
git reset --hard v0.1.0   # 돌아갈 태그
git push origin main --force   # 주의: force push
```

**방법 B: 이전 커밋으로 되돌리기**
```bash
git log --oneline   # 커밋 해시 확인
git reset --hard abc1234
git push origin main --force
```

**방법 C: 특정 브랜치 상태로 롤백**
```bash
# develop의 3일 전 상태로 롤백하고 싶다면
git reflog   # 이전 HEAD 위치 확인
git reset --hard HEAD@{n}
git push origin main --force
```

## 롤백 포인트 (태그) 만들기

배포 전에 반드시 태그를 달아두면 나중에 쉽게 돌아갈 수 있습니다.

```bash
git tag v0.1.0 -m "학생 성취도 캘린더, Upstash Redis 연동"
git push origin v0.1.0
```

## 요약

- **일상 작업**: `develop` 또는 `feature/xxx` 브랜치
- **배포 준비됐을 때**: `develop` → `main` 머지 + 태그
- **롤백 필요 시**: `git reset --hard <태그또는커밋>` 후 force push
