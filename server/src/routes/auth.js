// 인증 관련 라우트 모듈
// - 책임: 회원가입, 로그인, 로그아웃, 세션 확인
// - 데이터 저장: Prisma(SQLite) 사용
// - 인증 수단: JWT를 httpOnly 쿠키로 발급/검증
// 보안 메모:
//   - 비밀번호는 Argon2로 해시하여 저장합니다(복호화 불가).
//   - JWT는 httpOnly + sameSite=lax 쿠키에 저장하여 XSS 접근을 차단합니다.
//   - 프로덕션에서는 secure=true(HTTPS 필수) 설정을 권장합니다.
import express from 'express'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

// JWT 서명에 사용할 비밀키
// - 실제 운영에서는 환경변수로만 주입하고, 충분히 긴 랜덤 문자열을 사용하세요.
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

/**
 * 사용자 정보를 기반으로 JWT 토큰을 생성합니다.
 * 입력:
 *  - user: { id:number, email:string, name:string }
 * 출력:
 *  - string(JWT): payload = { sub, email, name }, 만료=7d
 */
function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * 인증용 JWT를 httpOnly 쿠키로 설정합니다.
 * - httpOnly: JS로 접근 불가(XSS 대비)
 * - sameSite=lax: CSRF 위험 감소
 * - secure: HTTPS 환경에서 true 권장(개발환경에서는 false)
 * - maxAge: 7일
 */
function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // 프로덕션(HTTPS)에서는 true 권장
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

/**
 * 회원가입
 * POST /api/auth/sign-up
 * 요청 바디: { email:string, password:string, name:string }
 * 응답:
 *  - 201 { id, email, name }
 *  - 400 필수값 누락
 *  - 409 이메일 중복
 *  - 500 서버 오류
 */
router.post('/sign-up', async (req, res) => {
  try {
    const { email, password, name } = req.body || {}
    if (!email || !password || !name) return res.status(400).json({ message: '이메일/비밀번호/이름이 필요합니다.' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: '이미 가입된 이메일입니다.' })

    const passwordHash = await argon2.hash(password)
    const user = await prisma.user.create({ data: { email, name, passwordHash } })
    return res.status(201).json({ id: user.id, email: user.email, name: user.name })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: '서버 오류' })
  }
})

/**
 * 로그인
 * POST /api/auth/login
 * 요청 바디: { email:string, password:string }
 * 동작: 자격 증명 확인 후 JWT 쿠키 발급
 * 응답:
 *  - 200 { id, email, name } (+ httpOnly 쿠키에 token 설정)
 *  - 400 필수값 누락
 *  - 401 자격 증명 불일치
 *  - 500 서버 오류
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ message: '이메일/비밀번호가 필요합니다.' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })

    const ok = await argon2.verify(user.passwordHash, password)
    if (!ok) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })

    const token = signToken(user)
    setAuthCookie(res, token)
    return res.json({ id: user.id, email: user.email, name: user.name })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: '서버 오류' })
  }
})

/**
 * 로그아웃
 * POST /api/auth/logout
 * 동작: 인증 쿠키(token) 삭제
 * 응답: 200 { ok: true }
 */
router.post('/logout', async (_req, res) => {
  res.clearCookie('token', { path: '/' })
  res.json({ ok: true })
})

/**
 * 현재 로그인한 사용자 조회
 * GET /api/auth/me
 * 동작: 쿠키의 JWT를 검증하여 사용자의 최소 정보 반환
 * 응답:
 *  - 200 { id, email, name }
 *  - 401 토큰 없음/만료/검증 실패
 */
router.get('/me', async (req, res) => {
  try {
    const { token } = req.cookies || {}
    if (!token) return res.status(401).json({ message: '인증 필요' })
    const payload = jwt.verify(token, JWT_SECRET)
    return res.json({ id: payload.sub, email: payload.email, name: payload.name })
  } catch (e) {
    return res.status(401).json({ message: '세션 만료' })
  }
})

export default router
