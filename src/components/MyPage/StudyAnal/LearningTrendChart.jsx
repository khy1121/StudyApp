const LearningTrendChart = () => {


    const weeklyLearningData = [
        { day: '월', count: 11, color: '#6366F1' },
        { day: '화', count: 6, color: '#6366F1' },
        { day: '수', count: 10, color: '#6366F1' },
        { day: '목', count: 11, color: '#6366F1' },
        { day: '금', count: 17, color: '#6366F1' },
        { day: '토', count: 18, color: '#6366F1' },
        { day: '일', count: 14, color: '#6366F1' },
    ];

    const timeActivityData = [
        { time: '오전', count: 11, percent: 25, color: '#8B5CF6' },
        { time: '오후', count: 6, percent: 29, color: '#A78BFA' },
        { time: '저녁', count: 10, percent: 45, color: '#C4B5FD' },
        { time: '밤', count: 11, percent: 20, color: '#DDD6FE' },
    ];
        {/*차트 비율 설정을 위한 1주 내 학습 최대값*/}
    const maxWeeklyCount = Math.max(...weeklyLearningData.map(d => d.count));
    return (
        <div className="analysis-section learning-trend-section">
            <h3 className="section-title">학습 트렌드</h3>

            <div className="trend-content">

                {/* 주간 학습량 (왼쪽) */}
                <div className="weekly-learning">
                    <h4 className="trend-subtitle">주간 학습량</h4>
                    <div className="progress-list">
                        {weeklyLearningData.map((item, index) => (
                            <div key={index} className="progress-item">
                                <span className="item-label">{item.day}</span>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${(item.count / maxWeeklyCount) * 100}%`,
                                            backgroundColor: item.color
                                        }}
                                    ></div>
                                </div>
                                <span className="item-value">{item.count}개</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 시간대별 학습 활동 (오른쪽) */}
                <div className="time-activity">
                    <h4 className="trend-subtitle">시간대별 학습 활동</h4>
                    <div className="progress-list">
                        {timeActivityData.map((item, index) => (
                            <div key={index} className="progress-item">
                                <span className="time-label">{item.time}</span>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${item.percent}%`,
                                            backgroundColor: item.color
                                        }}
                                    ></div>
                                </div>
                                <span className="item-value">{item.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningTrendChart;