//import React, { useState } from 'react';
import { JOB_RECOMMENDATION_DATA } from './data.js';
import SubjectAnalysis from './SubjectAnalysis.jsx';

const JobRecommendation = () => {
    const { overall, subjects } = JOB_RECOMMENDATION_DATA;
    
    // // Note: Active tab logic handled by parent MyPage component
    // const [activeTab, setActiveTab] = useState('직무 추천'); 

    return (
        <div className="mypage-container">
            
            <main className="job-page-wrapper">
                
                {/* Header Simulation (MyPage.jsx에서 로드된 헤더 아래에 위치한다고 가정) */}
                <h2 className="page-title">직무 추천</h2>
                <p className="page-subtitle">학습 성과를 바탕으로 맞춤형 직무를 추천해드립니다</p>

                {/* 1. Overall Recommendation Card */}
                <div className="match-card">
                    <div>
                        <p style={{ opacity: 0.8 }}>가장 적합한 직무</p>
                        <h3 className="match-card-job">{overall.job}</h3>
                        <p>{overall.description}</p>
                    </div>
                    <div className="match-card-match">
                        <div className="match-ring">
                            {overall.match}
                        </div>
                        <span>종합 매칭도</span>
                    </div>
                </div>

                {/* 2. Subject Analysis Cards */}
                <h2 className="page-title" style={{ marginTop: '3rem' }}>과목별 직무 분석</h2>
                {subjects.map(subject => (
                    <SubjectAnalysis key={subject.key} subject={subject} />
                ))}
            </main>
        </div>
    );
}
export default JobRecommendation;