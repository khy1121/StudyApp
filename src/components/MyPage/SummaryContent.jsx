import React from 'react';

// --- Mock Data ---
const SUMMARY_DATA = [
    { label: "푼 문제 수", value: "156", icon: "📚", color: "#4a74f5" }, // 책 아이콘
    { label: "정답 수", value: "124", icon: "✅", color: "#10b981" }, // 체크마크 아이콘
    { label: "평균 시간", value:"45초", icon: "⏱️", color: "#9333ea" }, // 시계 아이콘
    { label: "연속 학습", value: "5일", icon: "🗓️", color: "#f59e0b" }, // 달력 아이콘
];

const RECENT_ACTIVITY = [
    { date: "2024-01-15", content: "12개 문제 풀이 · 정답률 75%", rating: "보통" },
    { date: "2024-01-14", content: "8개 문제 풀이 · 정답률 87.5%", rating: "우수" },
    { date: "2024-01-13", content: "15개 문제 풀이 · 정답률 80%", rating: "우수" },
    { date: "2024-01-12", content: "10개 문제 풀이 · 정답률 90%", rating: "우수" },
    { date: "2024-01-11", content: "6개 문제 풀이 · 정답률 83.3%", rating: "우수" },
];

const getRatingClass = (rating) => {
    switch (rating) {
        case '우수': return 'rating-excellent';
        case '보통': return 'rating-normal';
        default: return 'rating-poor';
    }
};


const SummaryContent = () => {
    return (
        <div>
            {/* 1. 인사 및 전체 정답률 탭 (welcomeTab) */}
            <section className='welcomeTab'>
                <div className='text'>
                    <p className="welcome">안녕하세요, 김학생님! 👏</p>
                    <p className='sub'>오늘도 열심히 학습하고 계시네요!</p>
                </div>
                <div className='progress'>
                    <span>79%</span>
                    <p>전체 정답률</p>
                </div>
            </section>

            {/* 2. 요약 카드 탭 (summaryTab) */}
            <section className='summaryTab'>
                {SUMMARY_DATA.map((item, index) => (
                    <div className='card' key={index}>
                        <div className='icon-box'>
                            <div className="summary-icon" style={{ backgroundColor: item.color }} ><div>{item.icon}</div> </div>
                            <p>{item.label}</p>
                        </div>
                        <h3>{item.value}</h3>
                    </div>
                ))}
            </section>

            {/* 3. AI 학습 조언 탭 (recommandTab) */}
            <section className='recommandTab'>
                <h4 style={{ color: '#9333ea' }}>AI 직무 추천</h4>
                <p>
                    학습 성과를 바탕으로 맞춤형 직무를 추천해드립니다!
                </p>
                <button>추천 직무 확인하기</button>
            </section>
            
            {/* 4. 최근 활동 목록 (recent-activity) - 이미지 하단 구현 */}
            <section className='recent-activity'>
                <h4 className="section-title" style={{ marginBottom: '20px' }}>최근 활동</h4>
                <div className='activity-list'>
                    {RECENT_ACTIVITY.map((item, index) => (
                        <div key={index} className='activity-item'>
                            <span className='activity-date'>{item.date}</span>
                            <span className='activity-content'>{item.content}</span>
                            <span className={`activity-rating ${getRatingClass(item.rating)}`}>
                                {item.rating}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default SummaryContent;