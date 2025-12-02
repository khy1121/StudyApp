import React, { useEffect, useState } from 'react';

const SubjectProgressChart = () => {
    const [subjectData, setSubjectData] = useState([]);

    useEffect(() => {
        // studyHistory에서 과목별 정답률 계산
        try {
            const raw = localStorage.getItem('studyHistory');
            const history = raw ? JSON.parse(raw) : [];

            // 과목별로 정답 수, 총 문제 수 집계
            const subjectStats = {};
            history.forEach(rec => {
                const key = rec.subject || 'unknown';
                if (!subjectStats[key]) {
                    subjectStats[key] = { total: 0, correct: 0, label: rec.subjectLabel || key };
                }
                subjectStats[key].total += Number(rec.total || 0);
                subjectStats[key].correct += Number(rec.correctCount || 0);
            });

            // 과목별 정답률 계산
            const data = Object.entries(subjectStats).map(([key, stats]) => {
                const percent = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
                return {
                    name: stats.label,
                    percent,
                    score: `${stats.correct}/${stats.total}`
                };
            });

            setSubjectData(data);
        } catch (e) {
            console.error('과목별 진행 데이터 로드 실패:', e);
        }
    }, []);

    const getColor = (percent) => {
        let rating, color, textColorClass;
        if (percent < 30) {
            rating = '미흡';
            color = '#EF4444';
            textColorClass = 'rating-poor-text';
        }
        else if (percent < 80) {
            rating = '보통';
            color = '#D4AF37';
            textColorClass = 'rating-normal-text';
        }
        else {
            rating = '우수';
            color = '#4CAF50';
            textColorClass = 'rating-excellent-text';
        }
        return { rating, color, textColorClass };
    };
    return (
        <div className="analysis-section">
            <h3 className="section-title">과목별 성과 분석</h3>

            {subjectData.map((subject, index) => {
                const { rating, color, textColorClass } = getColor(subject.percent);

                return (
                    <div key={index} className="subject-item">
                        {/*과목명 + 퍼센트/점수 헤더 */}
                        <div className="subject-header">
                            <h4 className="subject-name">{subject.name}</h4>
                            <div className="score-stats">
                                <p className="percent-score">{subject.percent}%</p>
                                <p className="score-value">{subject.score}</p>
                            </div>
                        </div>

                        {/*막대 그래프 및 등급*/}
                        <div className="subject-chart-area">
                            <div className="chart-container">
                                <div
                                    className="chart-bar"
                                    style={{
                                        width: `${subject.percent}%`,
                                        backgroundColor: color
                                    }}
                                ></div>
                            </div>
                            {/*등급 표시 (막대 그래프의 오른쪽에 위치) */}
                            <span className={`rating-text-container ${textColorClass}`}>
                                {rating}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SubjectProgressChart;