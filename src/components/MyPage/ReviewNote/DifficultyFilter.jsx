import React from "react";

const DIFFICULTY_MAP = {
    easy: "초급",
    medium: "중급",
    hard: "고급",
};

const DifficultyFilter = ({ selectedDifficulty, setSelectedDifficulty }) => {
    const diffs = Object.keys(DIFFICULTY_MAP);

    return (
        <div className="difficulty-tabs">
            <button
                className={selectedDifficulty === "all" ? "active" : ""}
                onClick={() => setSelectedDifficulty("all")}
            >
                전체 난이도
            </button>

            {diffs.map(key => (
                <button
                    key={key}
                    className={selectedDifficulty === key ? "active" : ""}
                    onClick={() => setSelectedDifficulty(key)}
                >
                    {DIFFICULTY_MAP[key]}
                </button>
            ))}
        </div>
    );
};

export default DifficultyFilter;
