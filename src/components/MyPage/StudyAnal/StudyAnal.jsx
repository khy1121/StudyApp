import SubjectProgressChart from "./SubjectProgressChart";
import LearningTrendChart from "./LearningTrendChart";

const StudyAnal = () => {
    return (
        <div className="analysis-page">
            <SubjectProgressChart />
            <LearningTrendChart />
        </div>
    );
}

export default StudyAnal;