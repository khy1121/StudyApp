import React from "react";
import ChoiceItem from "./ChoiceItem";

const ProblemItem = ({ p, index, showExplanation, toggleExplanation }) => {
    const isOpen = showExplanation[p.id];

    return (
        <div className="wrong-item">
            <p className="question-meta">
                [{p.subject} - {p.difficulty}] 문제 ID: {p.id}
            </p>

            <p className="question-title">
                Q{index + 1}. {p.question}
            </p>

            <ul className="choices-list">
                {p.choices.map((choice, idx) => (
                    <ChoiceItem
                        key={idx}
                        idx={idx}
                        choice={choice}
                        isCorrect={idx === p.answerIndex}
                        isUserSelected={idx === p.userSelectedIndex}
                        showMarkers={isOpen}
                    />
                ))}
            </ul>

            <button className="explanation-toggle" onClick={() => toggleExplanation(p.id)}>
                {isOpen ? "▲ 해설 숨기기" : "▼ 해설 보기"}
            </button>

            {isOpen && <div className="explanation-content">{p.explanation}</div>}
        </div>
    );
};

export default ProblemItem;
