import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/problem.css';
import QuestionCard from './QuestionCard';
import OptionList from './OptionList';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import { add as addWrongProblem, remove as removeWrongProblem } from '../../services/wrongProblems';

export default function ProblemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState({
    correctCount: 0,
    wrongCount: 0,
    totalScore: 0,
  });
  const [remainingTimeMin, setRemainingTimeMin] = useState(null);
  const [problemStartTime, setProblemStartTime] = useState(null); // 각 문제 시작 시간
  const [problemDurations, setProblemDurations] = useState([]); // 각 문제 소요 시간(초 단위)

  const studySettings = location.state || {};
  const isQuizMode = studySettings.mode === 'quiz';

  const DIFF_MAP = {
    '초급': 'easy',
    '중급': 'medium',
    '고급': 'hard'
  };

  const SUBJECT_LABEL = { os: '운영체제', ds: '자료구조', web: '웹프레임워크' };

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);
      if (!studySettings.subject) {
        setLoading(false);
        return;
      }

      // If problems are already provided via navigation state (e.g. Recommend flow or Continue Study), use them directly
      if (Array.isArray(studySettings.problems) && studySettings.problems.length > 0) {
        try {
          const formattedProblems = studySettings.problems.map(problem => ({
            ...problem,
            // normalize fields: ensure both answerIndex/answer and choices/options exist
            answerIndex: typeof problem.answerIndex !== 'undefined' ? problem.answerIndex : (problem.answer ?? null),
            answer: typeof problem.answer !== 'undefined' ? problem.answer : (problem.answerIndex ?? null),
            choices: problem.choices ?? problem.options ?? [],
            options: problem.options ?? problem.choices ?? [],
          }));
          setProblems(formattedProblems);
          
          // 이어서 학습인 경우: current 인덱스가 있으면 해당 위치부터 시작
          const startIndex = typeof studySettings.current === 'number' ? studySettings.current : 0;
          setCurrentProblemIndex(startIndex);
          setSelectedOption(null);
          setProgress(formattedProblems.length ? (((startIndex + 1) / formattedProblems.length) * 100) : 0);
          
          // 이미 답변한 문제들의 정답/오답 카운트 복원
          if (startIndex > 0) {
            let correctCount = 0;
            let wrongCount = 0;
            for (let i = 0; i < startIndex; i++) {
              const problem = formattedProblems[i];
              if (typeof problem.userSelectedIndex !== 'undefined') {
                const correctIndex = typeof problem.answerIndex !== 'undefined' ? problem.answerIndex : (problem.answer ?? null);
                const isCorrect = problem.userSelectedIndex === correctIndex;
                if (isCorrect) {
                  correctCount++;
                } else {
                  wrongCount++;
                }
              }
            }
            setResults({
              correctCount,
              wrongCount,
              totalScore: correctCount * 10,
            });
          }
          
          setLoading(false);
          return;
        } catch (e) {
          console.error('failed to use provided problems:', e);
          // fallback to normal loading
        }
      }

      try {
        const subjectFile = studySettings.subject; // ex: 'os'
        const base = import.meta.env.BASE_URL || '/';
        const url = `${base}data/problems/${subjectFile}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`문제 파일을 불러오지 못했습니다. status=${res.status}`);
        const json = await res.json();

        const difficultyKey = DIFF_MAP[studySettings.difficulty];
        if (!difficultyKey) throw new Error('올바르지 않은 난이도입니다: ' + studySettings.difficulty);

        const problemList = json[difficultyKey] || [];
        if (problemList.length === 0) throw new Error(`${studySettings.difficulty} 난이도의 문제가 없습니다.`);

        const formattedProblems = problemList.slice(0, 10).map(problem => ({
          ...problem,
          answer: problem.answerIndex,
          options: problem.choices
        }));

        setProblems(formattedProblems);
        setCurrentProblemIndex(0);
        setSelectedOption(null);
        setProgress(10);
      } catch (e) {
        console.error('문제 로딩 실패:', e);
        setProblems([]);
        setProgress(0);
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [studySettings.subject, studySettings.difficulty]);

  // 문제가 변경될 때마다 현재 문제의 시작 시간 기록
  useEffect(() => {
    if (problems.length > 0 && currentProblemIndex < problems.length) {
      setProblemStartTime(Date.now());
    }
  }, [currentProblemIndex, problems.length]);

  const currentProblem = problems[currentProblemIndex] || null;

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    // 퀴즈 모드에서는 선택만 하고 제출 버튼을 기다림
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsSubmitted(true);
    if (isQuizMode) {
      setShowAnswer(true);
    }
  };

  const calculateResults = () => {
    const results = problems.reduce(
      (acc, problem) => {
        const correctIndex = typeof problem.answerIndex !== 'undefined' ? problem.answerIndex : (problem.answer ?? null);
        const isCorrect = problem.userSelectedIndex === correctIndex;
        return {
          correctCount: acc.correctCount + (isCorrect ? 1 : 0),
          wrongCount: acc.wrongCount + (isCorrect ? 0 : 1),
          totalScore: acc.totalScore + (isCorrect ? 10 : 0),
        };
      },
      { correctCount: 0, wrongCount: 0, totalScore: 0 }
    );

    // 평균 시간 계산 (초 단위)
    const averageTime = problemDurations.length > 0
      ? Math.round(problemDurations.reduce((sum, duration) => sum + duration, 0) / problemDurations.length)
      : 0;

    console.log('Calculate Results - problems:', problems.length, 'results:', results, 'average time:', averageTime, 's');
    console.log('Problem durations:', problemDurations);

    // 학습 완료 시 이어서 학습 목록에서 제거
    try {
      const STORAGE_KEY = 'continueStudy';
      let raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        let arr = JSON.parse(raw);
        // 같은 subject, difficulty, mode인 항목 제거
        arr = arr.filter(e => !(
          e.subject === studySettings.subject && 
          e.difficulty === studySettings.difficulty && 
          e.mode === studySettings.mode
        ));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }
    } catch (e) {
      console.error('failed to remove from continue study list:', e);
    }
    
    // 학습 기록 저장 (홈 화면 통계용)
    try {
      const HISTORY_KEY = 'studyHistory';
      const now = new Date();
      const subjectLabel = SUBJECT_LABEL[studySettings.subject] || studySettings.subject;
      
      // 날짜를 YYYY-MM-DD HH:MM:SS 형식으로 변환
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      const historyEntry = {
        subject: studySettings.subject,
        subjectLabel,
        difficulty: studySettings.difficulty,
        mode: studySettings.mode,
        total: problems.length,
        correctCount: results.correctCount,
        wrongCount: results.wrongCount,
        totalScore: results.totalScore,
        averageTime, // 평균 풀이 시간 (초 단위)
        date: dateStr,
        timestamp: now.getTime()
      };
      
      console.log('Saving study history:', historyEntry);
      
      let historyRaw = localStorage.getItem(HISTORY_KEY);
      let historyArr = [];
      if (historyRaw) {
        try { 
          historyArr = JSON.parse(historyRaw);
          console.log('Existing history records:', historyArr.length);
        } catch (e) { 
          console.error('Failed to parse existing history:', e);
          historyArr = []; 
        }
      }
      
      // 최신 기록을 앞에 추가
      historyArr.unshift(historyEntry);
      
      // 최대 100개까지만 저장
      if (historyArr.length > 100) {
        historyArr = historyArr.slice(0, 100);
      }
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyArr));
      console.log('✅ Study history saved successfully. Total records:', historyArr.length);
      console.log('Saved entry date:', historyEntry.date);
    } catch (e) {
      console.error('❌ Failed to save study history:', e);
    }

    setResults(results);
    navigate('/results', {
      state: {
        ...results,
        problems,
        subject: studySettings.subject,
        difficulty: studySettings.difficulty,
        // pass through mode and any time settings so Results page can retry with same mode
        mode: studySettings.mode,
        studyTimeMin: studySettings.studyTimeMin,
        timeLimitMin: studySettings.timeLimitMin
      }
    });
  };

  const handleNext = () => {
    if (!currentProblem) return;
    
    // 퀴즈 모드에서는 제출이 완료된 경우에만 다음으로 진행
    if (isQuizMode && !isSubmitted) {
      alert('제출 버튼을 먼저 눌러주세요.');
      return;
    }
    
    if (selectedOption === null) {
      alert('보기를 선택하세요.');
      return;
    }

    // 현재 문제의 소요 시간 계산 및 저장
    if (problemStartTime) {
      const elapsedSeconds = Math.round((Date.now() - problemStartTime) / 1000);
      setProblemDurations([...problemDurations, elapsedSeconds]);
    }

    const updated = [...problems];
    updated[currentProblemIndex] = {
      ...updated[currentProblemIndex],
      userSelectedIndex: selectedOption
    };
    setProblems(updated);

    // 틀린 문제는 wrongProblems 서비스에 저장 (중복 저장 방지됨)
    try {
      const correctIndex = typeof currentProblem.answerIndex !== 'undefined' ? currentProblem.answerIndex : (currentProblem.answer ?? null);
      const isCorrect = selectedOption === correctIndex;
      if (!isCorrect) {
        // 문제 객체에 id가 있어야 함
        if (typeof currentProblem.id !== 'undefined') {
          addWrongProblem({
            subject: studySettings.subject,
            id: currentProblem.id,
            difficulty: studySettings.difficulty
          });
        }
      } else {
        // 정답인 경우 기존에 오답으로 저장되어 있으면 제거
        try {
          if (typeof currentProblem.id !== 'undefined') {
            removeWrongProblem(studySettings.subject, currentProblem.id);
          }
        } catch (e) {
          console.error('failed to remove wrong problem on correct answer:', e);
        }
      }
    } catch (e) {
      console.error('failed to record wrong problem:', e);
    }

    if (isQuizMode) setShowAnswer(false);

    if (currentProblemIndex === problems.length - 1) {
      calculateResults();
      return;
    }

    const nextIndex = currentProblemIndex + 1;
    setCurrentProblemIndex(nextIndex);
    setSelectedOption(null);
    setIsSubmitted(false); // 제출 상태 초기화
    setProgress(((nextIndex + 1) / problems.length) * 100);
  };

  const handlePrevious = () => {
    if (currentProblemIndex === 0) return;
    
    const prevIndex = currentProblemIndex - 1;
    setCurrentProblemIndex(prevIndex);
    
    // 이전 문제에서 선택했던 답변 복원
    const previousProblem = problems[prevIndex];
    if (typeof previousProblem.userSelectedIndex !== 'undefined') {
      setSelectedOption(previousProblem.userSelectedIndex);
      setIsSubmitted(true); // 이미 제출된 문제
    } else {
      setSelectedOption(null);
      setIsSubmitted(false); // 아직 제출하지 않은 문제
    }
    
    if (isQuizMode) setShowAnswer(false);
    setProgress(((prevIndex + 1) / problems.length) * 100);
  };

  const handleTimeUp = () => {
    if (!isQuizMode) calculateResults();
  };

  if (loading) return <div className="loading">문제를 불러오는 중...</div>;
  if (error) {
    return (
      <div className="error">
        <div>문제 로딩 오류: {error}</div>
        <div style={{ marginTop: 12 }}>
          <button className="btn-submit" type="button" onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--text-tertiary)' }}>
        {!studySettings.subject ? (
          <>
            <div>과목을 선택하고 학습을 시작하세요.</div>
            <div style={{ marginTop: 12 }}>
              <button className="btn-submit" type="button" onClick={() => navigate('/select-course')}>
                과목 선택으로 이동
              </button>
            </div>
          </>
        ) : (
          <div>선택한 난이도에 해당하는 문제가 없습니다.</div>
        )}
      </div>
    );
  }

  return (
    <div className={`problem-page ${theme}`}>
      <header className="problem-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="btn-main"
              onClick={() => {
                if (window.confirm("정말 메인으로 이동하시겠습니까?\n진행 중인 학습은 저장됩니다.")) {
                  // 이어서 학습용 데이터 저장
                  try {
                    const STORAGE_KEY = 'continueStudy';
                    const now = new Date();
                    const subjectLabel = SUBJECT_LABEL[studySettings.subject] || studySettings.subject;
                    
                    // 현재 진행 상황: 이미 답변한 문제 개수 계산
                    let answeredCount = 0;
                    let correctCount = 0;
                    for (let i = 0; i < currentProblemIndex; i++) {
                      if (typeof problems[i].userSelectedIndex !== 'undefined') {
                        answeredCount++;
                        const correctIndex = typeof problems[i].answerIndex !== 'undefined' 
                          ? problems[i].answerIndex 
                          : (problems[i].answer ?? null);
                        if (problems[i].userSelectedIndex === correctIndex) {
                          correctCount++;
                        }
                      }
                    }
                    
                    const progressPercent = problems.length ? ((currentProblemIndex + 1) / problems.length) * 100 : 0;
                    const correctRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
                    const timeSpent = '00분 00초'; // 실제 시간 측정 필요시 구현
                    const entry = {
                      subject: studySettings.subject,
                      subjectLabel,
                      difficulty: studySettings.difficulty,
                      date: now.toISOString().slice(0, 16).replace('T', ' '),
                      current: currentProblemIndex,
                      total: problems.length,
                      progressPercent,
                      correctRate,
                      timeSpent,
                      problems,
                      mode: studySettings.mode,
                      remainingTimeMin: remainingTimeMin, // 남은 시간 저장
                      studyTimeMin: studySettings.studyTimeMin, // 처음 선택한 학습 시간 저장
                    };
                    let raw = localStorage.getItem(STORAGE_KEY);
                    let arr = [];
                    if (raw) {
                      try { arr = JSON.parse(raw); } catch { arr = []; }
                    }
                    // 기존 동일 subject/difficulty/모드 데이터 제거 후 추가
                    arr = arr.filter(e => !(e.subject === entry.subject && e.difficulty === entry.difficulty && e.mode === entry.mode));
                    arr.unshift(entry);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
                  } catch (e) {
                    console.error('failed to save continue study data:', e);
                  }
                  navigate('/home');
                }
              }}
            >
              메인으로
            </button>
          </div>
          <h1>
            {SUBJECT_LABEL[studySettings.subject]} - {studySettings.difficulty}
            {isQuizMode ? ' (퀴즈 모드)' : ' (시험 모드)'}
          </h1>
          <div className="header-right">
            {studySettings.studyTimeMin && (
              <Timer 
                initialMinutes={studySettings.remainingTimeMin || studySettings.studyTimeMin} 
                onTimeUp={handleTimeUp}
                onTimeChange={setRemainingTimeMin}
              />
            )}
          </div>
        </div>
        <ProgressBar
          labelLeft={studySettings.difficulty}
          labelRight={`${currentProblemIndex + 1}/${problems.length}`}
          percent={progress}
        />
      </header>


      <main className="problem-content">
        <QuestionCard
          question={currentProblem.question}
          questionNumber={currentProblemIndex + 1}
        />

        <OptionList
          options={currentProblem.choices}
          selected={selectedOption}
          onSelect={handleOptionSelect}
          showAnswer={showAnswer && isQuizMode}
          correctAnswer={showAnswer ? (typeof currentProblem.answerIndex !== 'undefined' ? currentProblem.answerIndex : (currentProblem.answer ?? null)) : null}
        />

        {showAnswer && isQuizMode && (
          <div className={`answer-feedback ${selectedOption === currentProblem.answerIndex ? 'feedback-correct' : 'feedback-wrong'}`}>
            {selectedOption === currentProblem.answerIndex ? (
              <>
                <div className="feedback-header">
                  <div className="feedback-icon-wrapper correct-icon">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="3" fill="none">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="feedback-message">
                    <div className="feedback-title">정답입니다!</div>
                    <div className="feedback-subtitle">훌륭해요! 🎉</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="feedback-header">
                  <div className="feedback-icon-wrapper wrong-icon">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="3" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  <div className="feedback-message">
                    <div className="feedback-title">오답입니다</div>
                    <div className="feedback-subtitle">정답은 <strong>{currentProblem.answerIndex + 1}번</strong>입니다</div>
                  </div>
                </div>
                {currentProblem.explanation && (
                  <div className="explanation">
                    <div className="explanation-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      해설
                    </div>
                    <div className="explanation-text">{currentProblem.explanation}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {selectedOption !== null && (
          <div className="action-row">
            {currentProblemIndex > 0 && (
              <button className="btn-previous" onClick={handlePrevious}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                이전 문제
              </button>
            )}
            
            {/* 퀴즈 모드에서 아직 제출하지 않은 경우 제출 버튼 표시 */}
            {isQuizMode && !isSubmitted ? (
              <button className="btn-submit" onClick={handleSubmit}>
                제출하기
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            ) : (
              /* 시험 모드이거나 이미 제출한 경우 다음 버튼 표시 */
              <button className={isQuizMode ? "btn-next" : "btn-submit"} onClick={handleNext}>
                {currentProblemIndex === problems.length - 1 ? '결과 보기' : '다음 문제'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
