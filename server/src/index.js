// 서버 부트스트랩 파일
// - 책임: Express 앱 초기화, 미들웨어 순서 지정, CORS 정책, 라우트 마운트, 헬스체크 엔드포인트
// - 주의: 미들웨어의 순서가 중요합니다. (로깅 → 파서 → 쿠키 → CORS → 라우트)
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'

// .env 로드 (PORT, WEB_ORIGINS, JWT_SECRET, DATABASE_URL 등)
dotenv.config()

const app = express()

// 1) 요청 로깅: 개발용 간단 로그 포맷
app.use(morgan('dev'))

// 2) JSON 본문 파싱: application/json 요청 바디를 req.body에 파싱
app.use(express.json())

// 3) 쿠키 파싱: httpOnly 쿠키(token) 접근용 → req.cookies
app.use(cookieParser())

// 허용 Origin 정의
// - 기본 개발 도메인: 5173(브라우저 Vite 서버)
// - 운영/다른 도메인은 WEB_ORIGINS 환경변수에 콤마(,)로 추가
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
const allowedOrigins = (process.env.WEB_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .concat(defaultOrigins)

// 4) CORS 설정
// - origin: 허용 리스트 검사 (Postman 같은 no-origin 요청은 허용)
// - credentials: true → 쿠키(세션) 포함 요청 허용
// - optionsSuccessStatus: 일부 구형 브라우저의 preflight 처리 호환용
app.use(cors({
  origin: (origin, callback) => {
    // no-origin(예: Postman, 서버-서버 통신) 허용
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS: ' + origin))
  },
  credentials: true,
  optionsSuccessStatus: 200,
}))

// 헬스체크: 인프라/모니터링용 간단 엔드포인트
app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// 라우트 마운트: 인증 API
app.use('/api/auth', authRouter)

// 서버 시작
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}`)
})
