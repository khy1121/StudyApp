// 웰컴/랜딩 페이지
// - 책임: 서비스 소개, 주요 CTA(로그인/회원가입) 제공
// - 라우팅: '/' 기본 진입점. 인증과 무관하게 접근 가능
// - 접근성: 버튼에 aria-label을 부여하여 내비게이션 의도 명확화
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/welcome.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  const goLogin = () => navigate("/auth/login");
  const goSignUp = () => navigate("/auth/signIn");

  return (
    <div className="welcome-root">
  {/* 상단 네비게이션 바 */}
      <header className="welcome-nav">
        <div className="welcome-container nav-inner">
          <div className="brand" onClick={() => navigate('/')}>📘 CSTime</div>
          <div className="nav-actions">
            <button className="btn ghost" onClick={goLogin}>로그인</button>
            <button className="btn primary" onClick={goSignUp}>회원가입</button>
          </div>
        </div>
      </header>

  {/* 히어로 섹션: 핵심 가치 제안 */}
      <main className="welcome-hero">
        <div className="welcome-container hero-inner">
          <div className="hero-badge">Beta</div>
          <h1 className="hero-title">
            학습에 집중하세요.
            <span className="accent"> 나머지는 우리가 돕겠습니다.</span>
          </h1>
          <p className="hero-sub">
            운영체제 · 자료구조 · 웹프레임워크를 중심으로
            당신의 속도에 맞춘 학습 경험을 제공합니다.
          </p>
          <div className="hero-ctas">
            <button className="btn xl primary" onClick={goLogin} aria-label="로그인 페이지로 이동">
              🔐 지금 로그인
            </button>
            <button className="btn xl secondary" onClick={goSignUp} aria-label="회원가입 페이지로 이동">
              ✨ 무료로 시작하기
            </button>
          </div>
          <div className="hero-footnote">계정이 없어도 둘러볼 수 있지만, 진행 저장을 위해 로그인/회원가입을 권장합니다.</div>
        </div>

  {/* 장식용 배경: 그라디언트/글로우 */}
        <div className="bg-gradient" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
      </main>

  {/* 기능 하이라이트 섹션 */}
      <section className="welcome-features">
        <div className="welcome-container features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>빠른 시작</h3>
            <p>로그인 후 즉시 학습을 시작하고, 진행 상황을 자동으로 저장합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>진행 추적</h3>
            <p>정답률과 학습 스트릭을 한눈에 확인하고 동기부여를 유지하세요.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧭</div>
            <h3>맞춤 흐름</h3>
            <p>난이도에 따라 단계적으로 학습하며, 곧 모의고사 모드도 제공됩니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
