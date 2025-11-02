// 로그인 화면
// - 책임: 자격 증명 입력/검증, /api/auth/login 호출, 성공 시 /home으로 이동
// - 보안: 쿠키 기반 인증 → fetch에 credentials: 'include' 필수
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../styles/auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 폼 제출 처리: 기본 검증 후 백엔드 로그인 API 호출
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    // 간단한 이메일 형식 체크
    if (!/.+@.+\..+/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || '로그인 실패')
      }
      navigate('/home', { replace: true })
    } catch (e) {
      setError(e.message || '로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <h1>다시 만나서 반가워요 👋</h1>
          <p>이메일과 비밀번호로 로그인하세요.</p>
        </div>

        {error && <div className="auth-alert error" role="alert">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label" htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label className="auth-label" htmlFor="password">비밀번호</label>
          <div className="auth-input-row">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button type="button" className="auth-toggle" onClick={() => setShowPw(!showPw)}>
              {showPw ? '숨김' : '표시'}
            </button>
          </div>

          <button type="submit" className="btn primary block" disabled={loading}>
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <div className="auth-footer">
          <span>계정이 없으신가요?</span>
          <Link to="/auth/signIn" className="link">회원가입</Link>
        </div>

        <div className="auth-secondary-actions">
          <button className="btn ghost" onClick={() => navigate('/')}>← 홈으로</button>
        </div>
      </div>
    </div>
  )
}
