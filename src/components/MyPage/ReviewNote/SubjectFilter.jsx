// Filters/SubjectFilter.jsx
import React from "react";
import { SUBJECT_MAP } from "./data";

const SubjectFilter = ({ selectedSubject, setSelectedSubject, totalCount }) => {
    const subjects = Object.keys(SUBJECT_MAP);

    return (
        <div className="subject-tabs">
            <button
                className={selectedSubject === "all" ? "active" : ""}
                onClick={() => setSelectedSubject("all")}
            >
                전체 과목 ({totalCount})
            </button>

            {subjects.map(key => (
                <button
                    key={key}
                    className={selectedSubject === key ? "active" : ""}
                    onClick={() => setSelectedSubject(key)}
                >
                    {SUBJECT_MAP[key]}
                </button>
            ))}
        </div>
    );
};

export default SubjectFilter;
