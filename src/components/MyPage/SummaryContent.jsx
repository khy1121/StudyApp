import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as localAuth from '../../services/localAuth';

const getRatingClass = (rating) => {
    switch (rating) {
        case '우수': return 'rating-excellent';
        case '보통': return 'rating-normal';
        default: return 'rating-poor';
    }
};

const SummaryContent = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('사용자');
    const [totalSolved, setTotalSolved] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [streak, setStreak] = useState(0);
    const [averageTime, setAverageTime] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        // 사용자 이름 로드
        const loadUser = async () => {
            try {
                const res = await localAuth.getUser();
                if (res.success && res.user?.name) setUserName(res.user.name);
            } catch (e) {
                console.error('사용자 정보 불러오기 실패:', e);
            }
        };

        // studyHistory에서 통계 계산
        const loadStats = () => {
            try {
                const raw = localStorage.getItem('studyHistory');
                const history = raw ? JSON.parse(raw) : [];

                // 총 푼 문제 수, 총 정답수, 평균 시간
                let solved = 0;
                let correct = 0;
                let totalDuration = 0;
                let recordCount = 0;

                history.forEach((rec) => {
                    solved += Number(rec.total || 0);
                    correct += Number(rec.correctCount || 0);
                    if (typeof rec.averageTime === 'number') {
                        totalDuration += rec.averageTime;
                        recordCount++;
                    }
                });

                setTotalSolved(solved);
                setTotalCorrect(correct);

                // 평균 시간 계산 (초 단위)
                const avgTime = recordCount > 0 ? Math.round(totalDuration / recordCount) : 0;
                setAverageTime(avgTime);

                // 최근 활동 (최신 5개)
                const recent = history.slice(0, 5).map((rec) => ({
                    date: rec.date ? rec.date.split(' ')[0] : '',
                    content: `${rec.total || 0}개 문제 풀이 · 정답률 ${rec.total ? Math.round((rec.correctCount||0) / rec.total * 100) : 0}%`,
                    rating: (rec.correctCount && rec.total && (rec.correctCount / rec.total) >= 0.85) ? '우수' : ((rec.correctCount && rec.total && (rec.correctCount / rec.total) >= 0.5) ? '보통' : '미흡')
                }));
                setRecentActivities(recent);

                // 연속 학습(streak) 계산
                const studyDates = new Set();
                history.forEach(r => { if (r.date) studyDates.add(r.date.split(' ')[0]); });
                let s = 0;
                const today = new Date();
                for (let i = 0; i < 365; i++) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const ds = d.toISOString().split('T')[0];
                    if (studyDates.has(ds)) s++; else break;
                }
                setStreak(s);
            } catch (e) {
                console.error('학습 기록에서 통계 로드 실패:', e);
            }
        };

        loadUser();
        loadStats();
    }, []);

    return (
        <div>
            {/*인사 및 전체 정답률 탭 */}
            <section className='welcomeTab'>
                <div className='text'>
                    <p className="welcome">안녕하세요, {userName}님! 👏</p>
                    <p className='sub'>오늘도 열심히 학습하고 계시네요!</p>
                </div>
                <div className='progress'>
                    <span>{totalSolved > 0 ? Math.round((totalCorrect / (totalSolved || 1)) * 100) : 0}%</span>
                    <p>전체 정답률</p>
                </div>
            </section>

            {/*요약 카드 탭*/}
            <section className='summaryTab'>
                <div className='card'>
                    <div className='icon-box'>
                        <div className="summary-icon" style={{ backgroundColor: '#4a74f5' }} ><div>📚</div> </div>
                        <p>푼 문제 수</p>
                    </div>
                    <h3>{totalSolved}개</h3>
                </div>
                <div className='card'>
                    <div className='icon-box'>
                        <div className="summary-icon" style={{ backgroundColor: '#10b981' }} ><div>✅</div> </div>
                        <p>정답 수</p>
                    </div>
                    <h3>{totalCorrect}개</h3>
                </div>
                <div className='card'>
                    <div className='icon-box'>
                        <div className="summary-icon" style={{ backgroundColor: '#9333ea' }} ><div>⏱️</div> </div>
                        <p>평균 시간</p>
                    </div>
                    <h3>{averageTime > 0 ? `${averageTime}초` : '-'}</h3>
                </div>
                <div className='card'>
                    <div className='icon-box'>
                        <div className="summary-icon" style={{ backgroundColor: '#f59e0b' }} ><div>🗓️</div> </div>
                        <p>연속 학습</p>
                    </div>
                    <h3>{streak}일</h3>
                </div>
            </section>

            {/*AI 직무 추천 탭*/}
            <section className='recommandTab'>
                <h4 style={{ color: '#9333ea' }}>AI 직무 추천</h4>
                <p>
                    학습 성과를 바탕으로 맞춤형 직무를 추천해드립니다!
                </p>
                <button onClick={() => navigate('/mypage/job-recommendation')}>추천 직무 확인하기</button>
            </section>
            
            {/*최근 활동 목록*/}
            <section className='recent-activity'>
                <h4 className="section-title" style={{ marginBottom: '20px' }}>최근 활동</h4>
                <div className='activity-list'>
                    {recentActivities.map((item, index) => (
                        <div key={index} className='activity-item'>
                            <span className='activity-date'>{item.date}</span>
                            <span className='activity-content'>{item.content}</span>
                            <span className={`activity-rating ${getRatingClass(item.rating)}`}>
                                {item.rating}
                            </span>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <div className='activity-item'>
                            <span className='activity-content'>최근 활동이 없습니다.</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default SummaryContent;