import SubjectIcon from './SubjectIcon';

const SubjectAnalysis = ({ subject }) => (
    <div className="subject-analysis-card">
        <div className="subject-analysis-header">
            <div className="subject-info">
                <SubjectIcon type={subject.key} />
                <div className="subject-details">
                    <h3>{subject.name}</h3>
                    <p className="subject-meta">
                        정확도: <span className="accent">{subject.accuracy}%</span>
                    </p>
                </div>
            </div>
            <span className="subject-style">
                {subject.style}
            </span>
        </div>

        {/* 추천 직무 */}
        <div className="analysis-sub-section">
            <p className="analysis-section-title" style={{ color: '#f472b6' }}>
                <span style={{ color: '#f97316' }}>🍎</span> 추천 직무
            </p>
            <div className="pill-container">
                {subject.recommendedJobs.map((job, i) => (
                    <span key={i} className="pill-job">
                        {job}
                    </span>
                ))}
            </div>
        </div>

        {/* 추천 이유 */}
        <div className="analysis-sub-section">
            <p className="analysis-section-title" style={{ color: '#8b5cf6' }}>
                <span className="icon">💡</span> 추천 이유
            </p>
            <p className="analysis-section-content">{subject.reason}</p>
        </div>

        {/* 추가 학습 기술 */}
        <div className="analysis-sub-section">
            <p className="analysis-section-title" style={{ color: '#4f46e5' }}>
                <span style={{ color: '#6366f1' }}>🗝️</span> 추가 학습 기술
            </p>
            <div className="pill-container">
                {subject.skills.map((skill, i) => (
                    <span key={i} className="pill-skill">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

export default SubjectAnalysis;