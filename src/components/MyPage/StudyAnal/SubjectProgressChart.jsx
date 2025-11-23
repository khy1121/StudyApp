const SubjectProgressChart = () => {

    {/*테스트를 위한 목업데이터 */}
    const subjectData = [
        { name: '운영체제', percent: 25, score: '10/40' },
        { name: '자료구조', percent: 88, score: '56/64' },
        { name: '웹프레임워크', percent: 75, score: '30/40' },
    ];
    {/*퍼센트 별 수준, 색깔 구분 함수 */}
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
                        {/* 1. 과목명 + 퍼센트/점수 헤더 */}
                        <div className="subject-header">
                            <h4 className="subject-name">{subject.name}</h4>
                            <div className="score-stats">
                                <p className="percent-score">{subject.percent}%</p>
                                <p className="score-value">{subject.score}</p>
                            </div>
                        </div>

                        {/* 2. 막대 그래프 및 등급 */}
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
                            {/* 등급 표시 (막대 그래프의 오른쪽에 위치) */}
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