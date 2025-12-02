import React from "react";

const SUBJECT_MAP = {
    os: "운영체제",
    ds: "자료구조",
    web: "웹프레임워크",
};

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
