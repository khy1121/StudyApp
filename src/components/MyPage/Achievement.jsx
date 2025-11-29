import React, { useState, useEffect } from 'react'
import * as wrongProblems from '../../services/wrongProblems'
import '../../styles/mypage.css'

const achievementsSample = [
    { id: 1, title: '첫 걸음', desc: '첫 문제 풀이 완료', icon: '🥇' },
    { id: 2, title: '연속 학습자', desc: '5일 연속 학습', icon: '🔥' },
    { id: 3, title: '정확한 사수', desc: '정답률 90% 달성', icon: '🎯' },
    { id: 4, title: '얼리버드', desc: '주로 오전에 학습', icon: '🕊️' },
    { id: 5, title: '완벽주의자', desc: '한 과목 100% 정답률', icon: '⭐' },
    { id: 6, title: '도전자', desc: '고급 문제 10개 풀이', icon: '🛡️' },
]

export default function Achievement() {
    const [achievements, setAchievements] = useState([])
    const [stats, setStats] = useState({
        totalAchieved: 0,
        completionRate: 0,
        exp: 0,
        nextGoal: { title: '', subtitle: '', progress: 0, target: 0 }
    })

    useEffect(() => {
        // 로컬 데이터에서 성취도 조건 평가
        const evaluateAchievements = () => {
            try {
                // studyHistory에서 학습 통계 계산
                const historyRaw = localStorage.getItem('studyHistory')
                const history = historyRaw ? JSON.parse(historyRaw) : []

                // 총 문제수, 정답수
                let totalSolved = 0
                let totalCorrect = 0
                let subjectStats = {} // 과목별 정답률 계산용
                let advancedCount = 0 // 고급 문제 풀이 수

                history.forEach(rec => {
                    totalSolved += Number(rec.total || 0)
                    totalCorrect += Number(rec.correctCount || 0)

                    // 과목별 통계
                    if (!subjectStats[rec.subject]) {
                        subjectStats[rec.subject] = { total: 0, correct: 0 }
                    }
                    subjectStats[rec.subject].total += Number(rec.total || 0)
                    subjectStats[rec.subject].correct += Number(rec.correctCount || 0)

                    // 고급 문제 개수 계산 (difficulty가 '고급'인 레코드)
                    if (rec.difficulty === '고급') {
                        advancedCount += Number(rec.total || 0)
                    }
                })

                    // 시간대별 학습 통계 (오전/오후/저녁/밤) - LearningTrendChart와 동일한 로직 사용
                    const timeStats = { 오전: 0, 오후: 0, 저녁: 0, 밤: 0 }
                    history.forEach(rec => {
                        if (rec.date) {
                            const match = rec.date.match(/(\d{2}):(\d{2})/)
                            if (match) {
                                const hour = parseInt(match[1])
                                let slot = '밤'
                                if (hour >= 5 && hour < 12) slot = '오전'
                                else if (hour >= 12 && hour < 17) slot = '오후'
                                else if (hour >= 17 && hour < 21) slot = '저녁'
                                timeStats[slot] += Number(rec.total || 0)
                            }
                        }
                    })

                // 5일 연속 학습 여부
                const studyDates = new Set()
                history.forEach(r => {
                    if (r.date) studyDates.add(r.date.split(' ')[0])
                })
                let streak = 0
                const today = new Date()
                for (let i = 0; i < 365; i++) {
                    const d = new Date(today)
                    d.setDate(today.getDate() - i)
                    const ds = d.toISOString().split('T')[0]
                    if (studyDates.has(ds)) streak++
                    else break
                }

                // 각 성취도 평가
                const evaluatedAchievements = achievementsSample.map(a => {
                    let achieved = false

                    if (a.id === 1) {
                        // 첫 걸음: 최소 1개 문제를 풀었는가?
                        achieved = totalSolved > 0
                    } else if (a.id === 2) {
                        // 연속 학습자: 5일 연속 학습
                        achieved = streak >= 5
                    } else if (a.id === 3) {
                        // 정확한 사수: 전체 정답률 90% 이상
                        achieved = totalSolved > 0 && (totalCorrect / totalSolved) >= 0.9
                    } else if (a.id === 4) {
                        // 얼리버드: 주로 오전에 학습 > 오전 타임(05~11시)의 학습량이 다른 시간대보다 큰 경우 달성
                        const maxOther = Math.max(timeStats['오후'], timeStats['저녁'], timeStats['밤'])
                        achieved = timeStats['오전'] > maxOther
                    } else if (a.id === 5) {
                        // 완벽주의자: 특정 과목의 정답률 100%
                        achieved = Object.values(subjectStats).some(s => 
                            s.total > 0 && s.correct === s.total
                        )
                    } else if (a.id === 6) {
                        // 도전자: 고급 문제 10개 이상 풀이
                        achieved = advancedCount >= 10
                    }

                    return {
                        ...a,
                        achieved
                    }
                })

                setAchievements(evaluatedAchievements)

                // 통계 계산
                const totalAchieved = evaluatedAchievements.filter(a => a.achieved).length
                const completionRate = Math.round((totalAchieved / achievementsSample.length) * 100)
                const exp = totalCorrect * 10 // 정답 1개당 10포인트

                // 다음 목표: 달성되지 않은 첫 번째 성취도 찾기
                const unachievedAchievement = evaluatedAchievements.find(a => !a.achieved)
                let nextGoal = {}

                if (unachievedAchievement) {
                    // 각 id별 조건에 맞는 progress와 target 계산
                    let progress = 0
                    let target = 0

                    switch (unachievedAchievement.id) {
                        case 1: // 첫 걸음: 첫 문제 풀이 완료
                            progress = totalSolved > 0 ? 1 : 0
                            target = 1
                            break
                        case 2: // 연속 학습자: 5일 연속 학습
                            progress = streak
                            target = 5
                            break
                        case 3: // 정확한 사수: 정답률 90% 달성
                            progress = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0
                            target = 90
                            break
                        case 4: // 얼리버드 : 오전 학습량이 가장 많은 경우
                            progress = timeStats['오전']
                            target = Math.max(
                                timeStats['오후'], 
                                timeStats['저녁'],
                                timeStats['밤'],
                                1 // division by zero 방지
                            )
                            break
                        case 5: // 완벽주의자: 한 과목 100% 정답률
                            // 최고 정답률인 과목의 정답률
                            progress = Object.values(subjectStats).length > 0
                                ? Math.max(...Object.values(subjectStats).map(s => s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0))
                                : 0
                            target = 100
                            break
                        case 6: // 도전자: 고급 문제 10개 풀이
                            progress = advancedCount
                            target = 10
                            break
                        default:
                            progress = 0
                            target = 1
                    }

                    nextGoal = {
                        title: unachievedAchievement.title,
                        subtitle: unachievedAchievement.desc,
                        progress,
                        target,
                        isCompleted: false
                    }
                } else {
                    // 모든 성취도 달성
                    nextGoal = {
                        title: '모든 업적을 달성했습니다! 🎉',
                        subtitle: '축하합니다!',
                        progress: 100,
                        target: 100,
                        isCompleted: true
                    }
                }

                setStats({
                    totalAchieved,
                    completionRate,
                    exp,
                    nextGoal
                })
            } catch (e) {
                console.error('Failed to evaluate achievements:', e)
                setAchievements(achievementsSample.map(a => ({ ...a, achieved: false })))
            }
        }

        evaluateAchievements()
    }, [])

    return (
        <div className="achievement-root">
            <header className="achievement-header">
                <h2>성취도</h2>
                <p className="achievement-sub">학습 과정에서 달성한 성과들을 확인해보세요</p>
            </header>

            <section className="achievement-stats">
                <div className="stat-box orange">
                    <div className="stat-label">획득한 성취</div>
                    <div className="stat-value">{stats.totalAchieved}</div>
                </div>
                <div className="stat-box purple">
                    <div className="stat-label">완료율</div>
                    <div className="stat-value">{stats.completionRate}%</div>
                </div>
                <div className="stat-box green">
                    <div className="stat-label">경험치</div>
                    <div className="stat-value">{stats.exp.toLocaleString()}</div>
                </div>
            </section>

            <section className="achievement-cards">
                {achievements.length > 0 ? achievements.map(a => (
                    <div key={a.id} className={`achievement-card ${a.achieved ? 'done' : ''}`}>
                        <div className="achievement-icon">{a.icon}</div>
                        <div className="achievement-body">
                            <div className="achievement-title">{a.title}</div>
                            <div className="achievement-desc">{a.desc}</div>
                        </div>
                        <div className={`achievement-badge ${a.achieved ? 'badge-done' : 'badge-progress'}`}>{a.achieved ? '달성 완료' : '진행 중'}</div>
                    </div>
                )) : <p>성취도 데이터를 로드 중...</p>}
            </section>

            <section className="next-goal">
                <div className="next-head">
                    <h4>다음 목표</h4>
                    <div className="next-meta">
                        <div className="next-title">{stats.nextGoal.title}</div>
                        <div className="next-sub">{stats.nextGoal.subtitle}</div>
                    </div>
                </div>

                {stats.nextGoal.isCompleted ? (
                    <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                        ✨ 모든 업적을 달성했습니다! ✨
                    </div>
                ) : (
                    <div className="progress-container">
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${Math.min((stats.nextGoal.progress / (stats.nextGoal.target || 1)) * 100, 100)}%` }}
                            />
                        </div>
                        <div className="progress-label">{stats.nextGoal.progress}/{stats.nextGoal.target}</div>
                    </div>
                )}
            </section>
        </div>
    )
}