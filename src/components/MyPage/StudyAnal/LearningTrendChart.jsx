import React, { useEffect, useState } from 'react';

const LearningTrendChart = () => {
    const [weeklyLearningData, setWeeklyLearningData] = useState([
        { day: '월', count: 0, color: '#6366F1' },
        { day: '화', count: 0, color: '#6366F1' },
        { day: '수', count: 0, color: '#6366F1' },
        { day: '목', count: 0, color: '#6366F1' },
        { day: '금', count: 0, color: '#6366F1' },
        { day: '토', count: 0, color: '#6366F1' },
        { day: '일', count: 0, color: '#6366F1' },
    ]);
    const [timeActivityData, setTimeActivityData] = useState([
        { time: '오전(05~12)', count: 0, percent: 0, color: '#8B5CF6' },
        { time: '오후(12~17)', count: 0, percent: 0, color: '#A78BFA' },
        { time: '저녁(17~21)', count: 0, percent: 0, color: '#C4B5FD' },
        { time: '밤(21~05)', count: 0, percent: 0, color: '#DDD6FE' },
    ]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('studyHistory');
            const history = raw ? JSON.parse(raw) : [];

            //지난 7일간의 날짜 계산
            const today = new Date();
            const dayOrder = ['일', '월', '화', '수', '목', '금', '토'];
            const last7Days = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayIdx = d.getDay();
                const dayName = dayOrder[dayIdx];
                last7Days[dateStr] = { day: dayName, count: 0 };
            }

            // 주간 학습량 계산
            history.forEach(rec => {
                if (rec.date) {
                    const dateStr = rec.date.split(' ')[0];
                    if (dateStr in last7Days) {
                        last7Days[dateStr].count += Number(rec.total || 0);
                    }
                }
            });

            const weekly = Object.values(last7Days).map(d => ({ ...d, color: '#6366F1' }));
            setWeeklyLearningData(weekly);

            //시간대별 학습 (date에서 시간 추출해 오전/오후/저녁/밤 분류)
            const timeStats = { 오전: 0, 오후: 0, 저녁: 0, 밤: 0 };
            history.forEach(rec => {
                if (rec.date) {
                    const match = rec.date.match(/(\d{2}):(\d{2})/);
                    if (match) {
                        const hour = parseInt(match[1]);
                        let timeSlot = '밤';
                        if (hour >= 5 && hour < 12) timeSlot = '오전';
                        else if (hour >= 12 && hour < 17) timeSlot = '오후';
                        else if (hour >= 17 && hour < 21) timeSlot = '저녁';
                        timeStats[timeSlot] += Number(rec.total || 0);
                    }
                }
            });

            const totalTime = Object.values(timeStats).reduce((a, b) => a + b, 0) || 1;
            const timeData = [
                { time: '오전', count: timeStats['오전'], percent: Math.round((timeStats['오전'] / totalTime) * 100), color: '#8B5CF6' },
                { time: '오후', count: timeStats['오후'], percent: Math.round((timeStats['오후'] / totalTime) * 100), color: '#A78BFA' },
                { time: '저녁', count: timeStats['저녁'], percent: Math.round((timeStats['저녁'] / totalTime) * 100), color: '#C4B5FD' },
                { time: '밤', count: timeStats['밤'], percent: Math.round((timeStats['밤'] / totalTime) * 100), color: '#DDD6FE' },
            ];
            setTimeActivityData(timeData);
        } catch (e) {
            console.error('failed to load learning trend data', e);
        }
    }, []);

    const maxWeeklyCount = Math.max(...weeklyLearningData.map(d => d.count), 1);
    return (
        <div className="analysis-section learning-trend-section">
            <h3 className="section-title">학습 트렌드</h3>

            <div className="trend-content">

                {/*주간 학습량 (왼쪽) */}
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

                {/*시간대별 학습 활동 (오른쪽) */}
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