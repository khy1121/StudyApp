// ProblemList/ChoiceItem.jsx
import React from "react";

const ChoiceItem = ({ idx, choice, isCorrect, isUserSelected, showMarkers }) => {
    let className = "";

    if (showMarkers) {
        if (isCorrect) className = "correct";
        else if (isUserSelected) className = "wrong";
    } else {
        if (isUserSelected) className = "user-selected";
    }

    return (
        <li className={`choice-item ${className}`}>
            ({idx + 1}) {choice}
            {showMarkers && isCorrect && <span style={{ float: "right" }}>[정답]</span>}
            {showMarkers && isUserSelected && !isCorrect && (
                <span style={{ float: "right" }}>[사용자 오답]</span>
            )}
        </li>
    );
};

export default ChoiceItem;
