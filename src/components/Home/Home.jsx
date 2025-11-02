// 홈 대시보드 컴포넌트
// - 책임: 인사말, 간단 통계, 주요 액션 카드(빠른 시작/추천/이어서 학습), 최근 활동
// - 인증: /api/auth/me 로 사용자 이름을 조회하여 인사말에 표시
// - 추후 연동: 통계/최근활동은 백엔드 API 연동 예정
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';

export default function Home() {
  const navigate = useNavigate();

  // ============================================
  // 사용자 로그인 상태 관리
  // ============================================
  // 로그인 토글(데모용). 실제 앱에서는 전역 상태/세션 검사로 관리 권장
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 인사말 표시용 사용자 이름. 기본값은 "사용자"
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    // (인증) 로그인한 사용자 정보 가져오기
    // 계약: GET /api/auth/me → { id, email, name }
    // 쿠키 기반 인증이라 credentials: 'include' 필수
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          console.log('User data from /api/auth/me:', data)
          console.log('Name field:', data.name)
          console.log('Type of name:', typeof data.name)
          if (data.name) {
            setUserName(data.name)
          } else {
            console.warn('Name is missing or falsy:', data.name)
          }
        } else {
          console.log('Failed to fetch user:', res.status)
        }
      } catch (e) {
        console.error('Error fetching user:', e)
        // 에러 시 기본값 유지
      }
    }
    fetchUser()
  }, [])

  // ============================================
  // 통계 데이터 (API 연동 필요)
  // ============================================
  // TODO: 실제로는 백엔드 API에서 데이터를 가져와야 함
  // 예시 API 엔드포인트:
  // - GET /api/user/stats/today : 오늘의 학습 통계
  // - GET /api/user/stats/streak : 연속 학습 일수
  
  const statsData = {
    todayProblems: 12,      // 오늘 푼 문제 수 (API: /api/user/stats/today)
    correctRate: 85,        // 정답률 (%) (API: /api/user/stats/today)
    studyStreak: 5          // 연속 학습 일수 (API: /api/user/stats/streak)
  };

  // ============================================
  // 최근 활동 데이터 (API 연동 필요)
  // ============================================
  // TODO: 백엔드 API에서 최근 활동 내역을 가져와야 함
  // 예시 API 엔드포인트: GET /api/user/recent-activities?limit=5
  const recentActivities = [
    {
      id: 1,
      subject: "운영체제",
      difficulty: "중급",
      problemCount: 6,
      timestamp: "그냥 예시",
      color: "green",
      // TODO: 클릭 시 해당 학습 상세 페이지로 이동
      // navigate(`/study/result/${id}`) 형태로 구현
    },
    {
      id: 2,
      subject: "자료구조",
      difficulty: "초급",
      problemCount: 8,
      timestamp: "예시에용",
      color: "blue",
    },
    {
      id: 3,
      subject: "웹프레임워크",
      difficulty: "중급",
      problemCount: 3,
      timestamp: "데모로 넣어둠",
      color: "purple",
    }
  ];

  // ============================================
  // 이벤트 핸들러
  // ============================================
  
  // 빠른 시작: 과목 선택 페이지로 이동
  const handleQuickStart = () => {
    navigate('/select-course');
  };

  // 오늘 추천: AI 추천 학습 페이지로 이동
  const handleTodayRecommend = () => {
    // TODO: 오늘의 추천 문제 페이지로 이동
    // navigate('/study/recommend');
    console.log('오늘 추천 페이지로 이동 (구현 예정)');
  };

  // 이어서 학습: 마지막 학습 이어하기
  const handleContinueStudy = () => {
    // TODO: 마지막 학습 세션을 불러와서 이어하기
    // API: GET /api/user/last-session
    // navigate(`/study/continue/${lastSessionId}`);
    console.log('이어서 학습 페이지로 이동 (구현 예정)');
  };

  // 마이페이지 이동
  const handleMyPage = () => {
    // TODO: 마이페이지로 이동
    // navigate('/mypage');
    console.log('마이페이지로 이동 (구현 예정)');
  };

  // 로그인/로그아웃 처리
  const handleAuthToggle = () => {
    if (isLoggedIn) {
      // 로그아웃 처리
      // TODO: 실제로는 백엔드 API 호출 필요
      // API: POST /api/auth/logout
      // 로그아웃 후 토큰 제거, 상태 초기화
      setIsLoggedIn(false);
      // navigate('/auth/login');
      console.log('로그아웃 처리 (구현 예정)');
    } else {
      // 로그인 페이지로 이동
      navigate('/auth/login');
    }
  };

  // 최근 활동 항목 클릭
  const handleActivityClick = (activityId) => {
    // TODO: 해당 학습 결과 상세 페이지로 이동
    // navigate(`/study/result/${activityId}`);
    console.log(`활동 ${activityId} 상세 페이지로 이동 (구현 예정)`);
  };

  return (
    <div className="home-container">
      {/* ============================================ */}
      {/* 헤더 */}
      {/* ============================================ */}
      <header className="home-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">📘</div>
            <h1 className="brand-title">학습 플랫폼</h1>
          </div>
          <div className="header-actions">
            {/* 마이페이지 버튼 - 로그인 상태에서만 표시 */}
            {isLoggedIn && (
              <button className="header-btn" onClick={handleMyPage}>
                👤 마이페이지
              </button>
            )}
            
            {/* 로그인/로그아웃 토글 버튼 */}
            <button className="header-btn" onClick={handleAuthToggle}>
              {isLoggedIn ? '📋 로그아웃' : '🔐 로그인'}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* 메인 컨텐츠 */}
      {/* ============================================ */}
      <main className="home-main">
        {/* 인사말 - 사용자 이름 표시 */}
        <div className="greeting">
          <h2 className="greeting-title">
            안녕하세요, {isLoggedIn ? userName : ''}님!👋
          </h2>
          <p className="greeting-subtitle">오늘도 열심히 학습해봐요.</p>
        </div>

        {/* ============================================ */}
        {/* 통계 카드 - API 데이터 연동 필요 */}
        {/* ============================================ */}
        <div className="stats-grid">
          {/* 오늘 푼 문제 */}
          <div className="stat-card">
            <div className="stat-icon blue">ℹ️</div>
            <div className="stat-content">
              <p className="stat-label">오늘 푼 문제</p>
              {/* TODO: API에서 실시간 데이터 가져오기 */}
              <p className="stat-value">{statsData.todayProblems}개</p>
            </div>
          </div>
          
          {/* 정답률 */}
          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div className="stat-content">
              <p className="stat-label">정답률</p>
              {/* TODO: API에서 실시간 데이터 가져오기 */}
              <p className="stat-value">{statsData.correctRate}%</p>
            </div>
          </div>
          
          {/* 연속 학습 */}
          <div className="stat-card">
            <div className="stat-icon orange">🔥</div>
            <div className="stat-content">
              <p className="stat-label">연속 학습</p>
              {/* TODO: API에서 실시간 데이터 가져오기 */}
              <p className="stat-value">{statsData.studyStreak}일</p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 액션 카드 - 라우팅 연결 */}
        {/* ============================================ */}
        <div className="action-grid">
          {/* 빠른 시작 - 과목 선택 페이지로 이동 */}
          <div className="action-card green" onClick={handleQuickStart}>
            <div className="action-icon-box green">⏱️</div>
            <h3 className="action-title">빠른 시작</h3>
            <p className="action-desc">최근 학습 챕터 이어하기</p>
            <button className="action-btn">시작하기 →</button>
          </div>
          
          {/* 오늘 추천 */}
          {/* TODO: navigate('/study/recommend') 로 이동 */}
          <div className="action-card yellow" onClick={handleTodayRecommend}>
            <div className="action-icon-box yellow">⭐</div>
            <h3 className="action-title">오늘 추천</h3>
            <p className="action-desc">오늘의 맞춤 퀴즈 추천 문제</p>
            <button className="action-btn">시작하기 →</button>
          </div>
          
          {/* 이어서 학습 */}
          {/* TODO: navigate('/study/continue') 로 이동 */}
          <div className="action-card blue" onClick={handleContinueStudy}>
            <div className="action-icon-box blue">🔖</div>
            <h3 className="action-title">아이서 학습</h3>
            <p className="action-desc">이전 학습 이어가기</p>
            <button className="action-btn">시작하기 →</button>
          </div>
        </div>

        {/* ============================================ */}
        {/* 최근 활동 - API 데이터 & 라우팅 연결 */}
        {/* ============================================ */}
        {/* TODO: 백엔드 API에서 최근 활동 데이터 가져오기 */}
        {/* API: GET /api/user/recent-activities */}
        <div className="recent-activity">
          <h3 className="section-title">최근 활동</h3>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="activity-item"
                onClick={() => handleActivityClick(activity.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`activity-dot ${activity.color}`}></div>
                <div className="activity-content">
                  {/* TODO: 클릭 시 navigate(`/study/result/${activity.id}`) 로 이동 */}
                  <p className="activity-title">
                    {activity.subject} {activity.difficulty} 문제 {activity.problemCount}개 완료
                  </p>
                  <p className="activity-time">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
