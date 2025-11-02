# StudyProgram

React(프론트) + Express/Prisma(SQLite) 백엔드로 구성된 학습 플랫폼입니다. 
회원가입/로그인, 보호 라우트, 홈 대시보드, 과목·난이도·모드 선택(SelectPage)까지 기본 흐름을 제공합니다.

## 주요 기능
- 랜딩(Welcome) 페이지: 서비스 소개 및 로그인/회원가입 CTA
- 회원가입/로그인: 이메일+이름+비밀번호(Argon2 해시), JWT(httpOnly 쿠키)
- 보호 라우트(ProtectedRoute): `/api/auth/me`로 세션 확인 후 접근
- 홈(Home) 대시보드: 사용자 이름 인사말, 통계 카드, 액션 카드(빠른 시작/추천/이어서 학습), 최근 활동 섹션
- 과목 선택(SelectPage): 과목/난이도/모드/시간 선택 → 이후 퀴즈/시험 페이지로 이동할 수 있도록 설계

## 기술 스택
- Frontend: Vite + React, React Router, CSS
- Backend: Node.js + Express, Prisma ORM + SQLite, Argon2, JSON Web Token, cookie-parser, CORS, morgan, dotenv
- Dev: Vite Dev Server 프록시(`/api` → `http://localhost:3001`)

## 디렉터리 구조
```
common-directory/
	├─ src/
	│  ├─ App.jsx
	│  ├─ main.jsx
	│  ├─ components/
	│  │  ├─ Home/Home.jsx
	│  │  ├─ Login/Login.jsx
	│  │  ├─ SignIn/SignIn.jsx
	│  │  ├─ SelectCourse/selectPage.jsx
	│  │  └─ auth/ProtectedRoute.jsx
	│  └─ pages/
	│     └─ Welcome/WelcomePage.jsx
	├─ server/
	│  ├─ src/
	│  │  ├─ index.js          # Express 앱 부트스트랩(CORS/미들웨어/헬스체크/라우트)
	│  │  └─ routes/auth.js    # /api/auth (sign-up, login, logout, me)
	│  └─ prisma/
	│     ├─ schema.prisma     # User 모델(id, email(unique), name, passwordHash, createdAt)
	│     └─ migrations/...     # Prisma 마이그레이션 파일
	├─ vite.config.js           # /api 프록시 설정
	├─ .gitignore               # 데이터/비밀 제외 규칙 포함
	└─ README.md
```

## 빠른 시작(Windows PowerShell)
사전 준비: Node.js LTS(>=18)

1) 프론트엔드 의존성 설치
```powershell
cd C:\studyApp\common-directory
npm install
```

2) 백엔드 준비(.env 생성 → 마이그레이션 → 클라이언트 생성)
```powershell
cd C:\studyApp\common-directory\server
New-Item -ItemType File .env -Force | Out-Null
"""
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="dev_secret_change_me"
PORT=3001
""" | Set-Content .env

npx prisma migrate dev --name init
npx prisma generate
```

3) 백엔드 서버 실행(3001)
```powershell
node src/index.js
```

4) 프론트엔드 개발 서버 실행(5173)
```powershell
cd C:\studyApp\common-directory
npm run dev
```
브라우저에서 http://localhost:5173 접속 → 회원가입 → 로그인 → Home에서 이름 확인

## 환경 변수(.env 예시)
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="<임의의 긴 랜덤 문자열>"
PORT=3001
WEB_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 인증 흐름 요약
- POST `/api/auth/sign-up` → { email, name, password } → 201 { id, email, name }
- POST `/api/auth/login` → { email, password } → JWT를 httpOnly 쿠키로 발급
- GET `/api/auth/me` → 쿠키 검증 → { id, email, name }
- POST `/api/auth/logout` → 쿠키 삭제

보안 메모
- 비밀번호는 Argon2 해시로 저장(복호화 불가)
- JWT는 httpOnly + sameSite=lax 쿠키 사용(XSS 접근 차단)
- 운영 환경에서는 HTTPS(secure=true) 권장

## 개발 메모 / 프록시
- `vite.config.js`에서 `/api`를 `http://localhost:3001`으로 프록시하여 CORS 없이 개발
- 포트: 프론트 5173, 백엔드 3001

## 데이터/비밀 커밋 방지(.gitignore)
- 데이터셋: `public/data/` 전체 제외
- 비밀/로컬DB: `server/.env`, `server/prisma/**/*.db`, `**/*.db-journal` 제외
- 이미 커밋된 기록을 히스토리에서 제거하려면 BFG 또는 `git filter-repo`로 재작성 필요

## 트러블슈팅
- Failed to fetch / ECONNREFUSED: 백엔드 미기동 → `node server/src/index.js`
- CORS 관련 메시지: 프론트는 `http://localhost:5173`에서 접속, 프록시 설정 확인
- 이름이 "사용자"로만 표시: 기존 토큰일 가능성 → 로그아웃/쿠키 삭제 후 재로그인
- Prisma Client 관련 오류: `cd server; npx prisma generate`
- 포트 충돌: `netstat -ano | findstr :3001` / `:5173`로 점유 PID 확인 후 종료

## 로드맵
- 문제 JSON 로딩(SelectPage의 fetch 주석 활성화) 및 퀴즈/시험 페이지 구현
- 시험 모드 타이머(useEffect+setInterval)와 자동 제출
- 활동/통계 백엔드 API(/api/user/stats, /recent-activities 등)

## 라이선스
추후 명시 예정

## 기여
이슈/PR 환영합니다. 코드 스타일과 커밋 메시지는 명확하게 작성 부탁드립니다.
