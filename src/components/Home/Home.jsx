// 홈 대시보드 컴포넌트
// - 책임: 인사말, 간단 통계, 주요 액션 카드(빠른 시작/추천/이어서 학습), 최근 활동
// - 인증: localAuth.getUser()로 로컬스토리지에서 사용자 이름 조회하여 인사말에 표시
// - 추후 연동: 통계/최근활동은 백엔드 API 연동 예정
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import * as localAuth from '../../services/localAuth';
import '../../styles/home.css';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // ============================================
  // 사용자 로그인 상태 관리
  // ============================================
  // 로그인 토글(데모용). 실제 앱에서는 전역 상태/세션 검사로 관리 권장
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 인사말 표시용 사용자 이름. 기본값은 "사용자"
  const [userName, setUserName] = useState('사용자');
  
  // 실제 통계 데이터
  const [statsData, setStatsData] = useState({
    todayProblems: 0,
    correctRate: 0,
    studyStreak: 0
  });
  useEffect(() => {
      const refreshUser = () => {
        // localStorage에서 닉네임 다시 읽기
        const cur = JSON.parse(localStorage.getItem('currentUser'));
        setUserName(cur?.name || '사용자');
      };
      window.addEventListener('nicknameChanged', refreshUser);
      return () => window.removeEventListener('nicknameChanged', refreshUser);
    }, []);
  
  // 실제 최근 활동 데이터
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // localAuth 서비스로 로그인한 사용자 정보 가져오기
    const fetchUser = async () => {
      try {
        const result = await localAuth.getUser()
        console.log('User data from localAuth:', result)
        if (result.success && result.user?.name) {
          console.log('Name field:', result.user.name)
          setUserName(result.user.name)
        } else {
          console.log('No user logged in')
          setUserName('사용자')
        }
      } catch (e) {
        console.error('Error fetching user:', e)
        // 에러 시 기본값 유지
        setUserName('사용자')
      }
    }
    fetchUser()
    
    // 데이터 로드 함수
    const loadData = () => {
      calculateStats()
      loadRecentActivities()
    }

    
    
    // 초기 로드
    loadData()
    
    // 페이지가 포커스될 때마다 데이터 새로고침
    const handleFocus = () => {
      console.log('Page focused, refreshing data...')
      loadData()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // 주기적으로 데이터 새로고침 (5초마다)
    const interval = setInterval(loadData, 5000)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])
  
  // localStorage에서 학습 기록을 분석하여 통계 계산
  const calculateStats = () => {
    try {
      // 학습 기록 키: studyHistory, wrongProblems 등
      const studyHistoryKey = 'studyHistory';
      let studyHistory = [];
      
      try {
        const raw = localStorage.getItem(studyHistoryKey);
        if (raw) {
          studyHistory = JSON.parse(raw);
          console.log('📊 Study history loaded:', studyHistory);
        } else {
          console.log('⚠️ No study history found in localStorage');
        }
      } catch (e) {
        console.error('❌ Failed to parse study history:', e);
      }
      
      // 오늘 날짜를 YYYY-MM-DD 형식으로
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      
      console.log('📅 Today date:', today);
      
      // 오늘 푼 문제 수 계산
      let todayProblems = 0;
      let totalCorrect = 0;
      let totalProblems = 0;
      
      studyHistory.forEach((record, index) => {
        const recordDate = record.date?.split(' ')[0]; // 날짜 부분만 추출
        console.log(`Record ${index}:`, {
          date: recordDate,
          subject: record.subjectLabel,
          total: record.total,
          correct: record.correctCount,
          isToday: recordDate === today
        });
        
        if (recordDate === today) {
          todayProblems += record.total || 0;
          console.log(`✅ Today's problem count increased to: ${todayProblems}`);
        }
        
        // 전체 정답률 계산
        totalProblems += record.total || 0;
        totalCorrect += record.correctCount || 0;
      });
      
      const correctRate = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;
      
      // 연속 학습 일수 계산
      const studyStreak = calculateStudyStreak(studyHistory);
      
      console.log('📈 Stats calculated:', { 
        todayProblems, 
        correctRate, 
        studyStreak,
        totalProblems,
        totalCorrect
      });
      
      setStatsData({
        todayProblems,
        correctRate,
        studyStreak
      });
    } catch (e) {
      console.error('❌ Failed to calculate stats:', e);
    }
  }
  
  // 연속 학습 일수 계산
  const calculateStudyStreak = (history) => {
    if (!history || history.length === 0) return 0;
    
    // 날짜별로 학습 여부 확인
    const studyDates = new Set();
    history.forEach(record => {
      if (record.date) {
        const date = record.date.split(' ')[0];
        studyDates.add(date);
      }
    });
    
    // 오늘부터 역순으로 연속 일수 계산
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (studyDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  // 최근 활동 가져오기
  const loadRecentActivities = () => {
    try {
      const studyHistoryKey = 'studyHistory';
      let studyHistory = [];
      
      try {
        const raw = localStorage.getItem(studyHistoryKey);
        if (raw) {
          studyHistory = JSON.parse(raw);
          console.log('Recent activities loaded:', studyHistory);
        }
      } catch (e) {
        console.error('Failed to parse study history:', e);
      }
      
      // 최근 5개 활동만 표시
      const recent = studyHistory
        .slice(0, 5)
        .map((record, index) => {
          const subjectLabels = {
            os: '운영체제',
            ds: '자료구조',
            web: '웹프레임워크'
          };
          
          const colors = ['green', 'blue', 'purple', 'orange', 'pink'];
          
          return {
            id: index,
            subject: subjectLabels[record.subject] || record.subjectLabel || record.subject,
            difficulty: record.difficulty || '중급',
            problemCount: record.total || 0,
            timestamp: formatTimestamp(record.date),
            color: colors[index % colors.length]
          };
        });
      
      console.log('Recent activities formatted:', recent);
      setRecentActivities(recent);
    } catch (e) {
      console.error('Failed to load recent activities:', e);
    }
  }
  
  // 타임스탬프 포맷팅
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '최근';
    
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000); // 초 단위
      
      if (diff < 60) return '방금 전';
      if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
      
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '최근';
    }
  }

  // ============================================
  // 이벤트 핸들러
  // ============================================
  
  // 빠른 시작: 과목 선택 페이지로 이동
  const handleQuickStart = () => {
    navigate('/select-course');
  };

  // 오늘 추천: AI 추천 학습 페이지로 이동
  const handleTodayRecommend = () => {
    navigate('/select-recommend');
  };

  // 이어서 학습: 마지막 학습 이어하기
  const handleContinueStudy = () => {
    navigate('/continue-study');
  };

  // 마이페이지 이동
  const handleMyPage = () => {
    navigate('/mypage');
    //console.log('마이페이지로 이동 (구현 예정)');
  };

  // 로그인/로그아웃 처리
  const handleAuthToggle = () => {
    if (isLoggedIn) {
      // 로그아웃 처리 - localStorage에서 현재 사용자 정보 제거
      localStorage.removeItem('currentUser');
      setIsLoggedIn(false);
      setUserName('사용자');
      navigate('/auth/login');
      console.log('로그아웃 완료');
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
            <h1 className="brand-title">CSTime</h1>
          </div>
          <div className="header-actions">
            {/* 테마 토글 버튼 */}
            <button className="header-btn theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ 라이트' : '🌙 다크'}
            </button>
            
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
            <h3 className="action-title">이어서 학습</h3>
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
