// ReviewNote.jsx
import React, { useState, useMemo } from "react";
import { ALL_WRONG_PROBLEMS } from "./data";
import SubjectFilter from "./SubjectFilter";
import DifficultyFilter from "./DifficultyFilter";
import ProblemItem from "./ProblemItem";

import "./ReviewNote.css";

const ReviewNote = () => {
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [showExplanation, setShowExplanation] = useState({});

    const filteredProblems = useMemo(() => {
        return ALL_WRONG_PROBLEMS.filter(
            p =>
                (selectedSubject === "all" || p.subjectKey === selectedSubject) &&
                (selectedDifficulty === "all" || p.difficultyKey === selectedDifficulty)
        );
    }, [selectedSubject, selectedDifficulty]);

    const toggleExplanation = id => {
        setShowExplanation(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="review-note-container">
            <SubjectFilter
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                totalCount={ALL_WRONG_PROBLEMS.length}
            />

            <DifficultyFilter
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
            />

            <div className="wrong-list">
                {filteredProblems.length === 0 ? (
                    <div className="no-wrong-note">해당 조건의 오답이 없습니다 🎉</div>
                ) : (
                    filteredProblems.map((p, index) => (
                        <ProblemItem
                            key={p.id}
                            p={p}
                            index={index}
                            showExplanation={showExplanation}
                            toggleExplanation={toggleExplanation}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewNote;
