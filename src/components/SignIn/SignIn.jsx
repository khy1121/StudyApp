// 회원가입 화면
// - 책임: 이메일/이름/비밀번호 입력 검증, /api/auth/sign-up 호출, 성공 시 로그인 화면 이동
// - 비고: 비밀번호는 8자 이상, 확인 일치, 약관 동의 필요
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../styles/auth.css'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 폼 제출 처리: 기본 유효성 검사 후 백엔드 회원가입 API 호출
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !name || !password || !confirm) {
      setError('모든 필드를 입력해주세요.')
      return
    }
    if (!/.+@.+\..+/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!agree) {
      setError('약관에 동의해주세요.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      })
      if (res.status === 201) {
        navigate('/auth/login', { replace: true })
        return
      }
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.message || '회원가입 실패')
    } catch (e) {
      setError(e.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <h1>시작해볼까요? ✨</h1>
          <p>이메일과 비밀번호를 입력해 계정을 생성하세요.</p>
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

          <label className="auth-label" htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            className="auth-input"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

          <label className="auth-label" htmlFor="password">비밀번호</label>
          <div className="auth-input-row">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              className="auth-input"
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button type="button" className="auth-toggle" onClick={() => setShowPw(!showPw)}>
              {showPw ? '숨김' : '표시'}
            </button>
          </div>

          <label className="auth-label" htmlFor="confirm">비밀번호 확인</label>
          <input
            id="confirm"
            type={showPw ? 'text' : 'password'}
            className="auth-input"
            placeholder="한 번 더 입력"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />

          <label className="agree-row">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>서비스 약관 및 개인정보 처리방침에 동의합니다.</span>
          </label>

          <button type="submit" className="btn primary block" disabled={loading}>
            {loading ? '생성 중…' : '계정 생성'}
          </button>
        </form>

        <div className="auth-footer">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/auth/login" className="link">로그인</Link>
        </div>

        <div className="auth-secondary-actions">
          <button className="btn ghost" onClick={() => navigate('/')}>← 홈으로</button>
        </div>
      </div>
    </div>
  )
}
