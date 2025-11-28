// ReviewNote.jsx
import React, { useState, useMemo, useEffect } from "react";
import * as wrongProblemsService from "../../../services/wrongProblems";
import SubjectFilter from "./SubjectFilter";
import DifficultyFilter from "./DifficultyFilter";
import ProblemItem from "./ProblemItem";

import "./ReviewNote.css";

const SUBJECT_MAP = {
    os: "운영체제",
    ds: "자료구조",
    web: "웹프레임워크",
};

const DIFFICULTY_MAP = {
    easy: "초급",
    medium: "중급",
    hard: "고급",
};

const REVERSE_DIFFICULTY_MAP = {
    "초급": "easy",
    "중급": "medium",
    "고급": "hard",
};

const ReviewNote = () => {
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [showExplanation, setShowExplanation] = useState({});
    const [allWrongProblems, setAllWrongProblems] = useState([]);

    useEffect(() => {
        // wrongProblems에서 ID 목록 가져오기
        const loadWrongProblems = async () => {
            try {
                const wrongIds = wrongProblemsService.getAll(); 

                // 과목별로 문제 데이터 로드
                const problemsBySubject = {};
                for (const subject of ['os', 'ds', 'web']) {
                    try {
                        const base = import.meta.env.BASE_URL || '/';
                        const url = `${base}data/problems/${subject}.json`;
                        console.log('Fetching from URL:', url);
                        const res = await fetch(url);
                        if (res.ok) {
                            const json = await res.json();
                            problemsBySubject[subject] = json;
                            console.log(`Successfully loaded ${subject}.json`);
                        } else {
                            console.warn(`Failed to fetch ${subject}.json: status ${res.status}`);
                        }
                    } catch (e) {
                        console.error(`failed to load ${subject}.json`, e);
                    }
                }

                // wrongIds에서 실제 문제 데이터를 찾아 병합
                const enrichedProblems = wrongIds.map(entry => {
                    const { subject, id, difficulty } = entry;
                    const problemData = problemsBySubject[subject];
                    
                    if (!problemData) return null;

                    // easy/medium/hard 키로 문제 배열 접근
                    const diffKey = REVERSE_DIFFICULTY_MAP[difficulty] || difficulty;
                    const problemList = problemData[diffKey] || [];
                    const problem = problemList.find(p => String(p.id) === String(id));

                    if (!problem) return null;

                    return {
                        ...problem,
                        id,
                        subject,
                        subjectKey: subject,
                        difficulty,
                        difficultyKey: diffKey,
                        subjectLabel: SUBJECT_MAP[subject]
                    };
                }).filter(p => p !== null);

                setAllWrongProblems(enrichedProblems);
            } catch (e) {
                console.error('failed to load wrong problems', e);
                setAllWrongProblems([]);
            }
        };

        loadWrongProblems();
    }, []);

    const filteredProblems = useMemo(() => {
        return allWrongProblems.filter(
            p =>
                (selectedSubject === "all" || p.subjectKey === selectedSubject) &&
                (selectedDifficulty === "all" || p.difficultyKey === selectedDifficulty)
        );
    }, [allWrongProblems, selectedSubject, selectedDifficulty]);

    const toggleExplanation = id => {
        setShowExplanation(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="review-note-container">
            <SubjectFilter
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                totalCount={allWrongProblems.length}
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
