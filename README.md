# Draw-A-Day

학습 지원 서비스 프로젝트


# 도메인 
[CSTIME](https://study-app-sigma-lemon.vercel.app/)

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [실행 환경](#실행-환경)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)

## 프로젝트 소개

학습자들을 위한 문제 풀이 및 학습 관리 플랫폼입니다. 과목별 문제 풀이, 오답 노트, 학습 분석, 직업 추천 등의 기능을 제공합니다.

## 주요 기능

- **문제 풀이**: 운영체제(OS), 자료구조(DS), 웹(Web) 과목별 문제 제공
- **오답 노트**: 틀린 문제를 과목별, 난이도별로 관리
- **학습 분석**: 학습 진도, 과목별 정답률 등을 시각화
- **직업 추천**: 과목별 성취도를 바탕으로 적합한 직업 추천
- **다크/라이트 테마**: 사용자 선호에 따른 테마 지원

## 실행 환경

### 필수 요구사항

- **Node.js**: v18.0.0 이상
- **npm**: v9.0.0 이상 (Node.js 설치 시 함께 설치됨)
- **운영체제**: Windows, macOS, Linux 모두 지원
- **브라우저**: 최신 버전의 Chrome, Firefox, Safari, Edge

### 권장 사양

- **Node.js**: v20.0.0 이상
- **메모리**: 최소 4GB RAM
- **디스크 공간**: 500MB 이상의 여유 공간

## 설치 및 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/Learning-support-service/common-directory.git
cd common-directory
```

### 2. 의존성 설치

프로젝트에 필요한 모든 패키지를 설치합니다:

```bash
npm install
```

### 3. 개발 서버 실행

다음 명령어 중 하나를 사용하여 개발 서버를 실행할 수 있습니다:

**방법 1: 자동으로 브라우저 열기**
```bash
npm start
```

**방법 2: 수동으로 브라우저 접속**
```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 다음 주소로 접속합니다:
```
http://localhost:3000
```

### 4. 프로덕션 빌드

프로덕션용 빌드를 생성하려면:

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 5. 프로덕션 미리보기

빌드된 프로덕션 파일을 로컬에서 미리 확인:

```bash
npm run preview
```

### 6. 코드 린팅

ESLint를 실행하여 코드 품질을 확인:

```bash
npm run lint
```

## 프로젝트 구조

```
common-directory/
├── public/                 # 정적 파일
│   └── data/              # 문제 데이터 (JSON)
│       └── problems/
│           ├── ds.json    # 자료구조 문제
│           ├── os.json    # 운영체제 문제
│           └── web.json   # 웹 문제
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── auth/         # 인증 관련
│   │   ├── Home/         # 홈 화면
│   │   ├── Login/        # 로그인
│   │   ├── SignIn/       # 회원가입
│   │   ├── SelectCourse/ # 과목 선택
│   │   ├── Problem/      # 문제 풀이
│   │   ├── MyPage/       # 마이페이지
│   │   └── layout/       # 레이아웃
│   ├── pages/            # 페이지 컴포넌트
│   ├── contexts/         # React Context (테마 등)
│   ├── services/         # 비즈니스 로직
│   │   ├── localAuth.js  # 로컬 인증
│   │   └── wrongProblems.js # 오답 관리
│   ├── styles/           # CSS 파일
│   │   └── *.css           
│   ├── App.jsx           # 메인 앱 컴포넌트
│   └── main.jsx          # 엔트리 포인트
├── package.json          # 프로젝트 설정 및 의존성
├── vite.config.js        # Vite 설정
├── tailwind.config.js    # Tailwind CSS 설정
├── eslint.config.js      # ESLint 설정
└── README.md             # 프로젝트 문서
```

## 기술 스택

### Frontend

- **React** (v19.1.1) - UI 라이브러리
- **React Router DOM** (v7.8.2) - 라우팅

### Styling

- **Tailwind CSS** (v4.1.13) - 유틸리티 기반 CSS 프레임워크
- **PostCSS** (v8.5.6) - CSS 후처리

### Build Tools

- **Vite** (v7.1.2) - 빌드 도구 및 개발 서버
- **ESLint** (v9.33.0) - 코드 품질 관리

### Storage

- **LocalStorage** - 사용자 데이터 및 오답 노트 저장

## 트러블슈팅

### 포트가 이미 사용 중인 경우

3000 포트가 이미 사용 중이면 다른 포트가 자동으로 할당됩니다. 터미널에 표시되는 URL을 확인하세요.

### 의존성 설치 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

Windows에서는:
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### 빌드 오류

Node.js 버전을 확인하세요:
```bash
node --version
```

v18.0.0 이상이어야 합니다.

## 라이선스

이 프로젝트는 공용 저장소입니다.

## 기여

이 프로젝트는 Learning-support-service 팀에서 관리합니다.
