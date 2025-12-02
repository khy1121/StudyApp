// src/pages/Problem/ResultsPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import ResultsPageComponent from '../../components/Problem/ResultsPage';
import '../../styles/problem.css';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const results = location.state || {
    correctCount: 0,
    wrongCount: 0,
    totalScore: 0,
    problems: [],
    subject: '',
    difficulty: ''
  };

  const handleRetry = () => {
    const payload = {
      subject: results.subject,
      difficulty: results.difficulty,
      mode: results.mode || 'quiz'
    };


    if (results.timeLimitMin) payload.timeLimitMin = results.timeLimitMin;
    if (results.studyTimeMin) payload.studyTimeMin = results.studyTimeMin;

    navigate('/problem', { state: payload });
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <ResultsPageComponent
      results={results}
      onRetry={handleRetry}
      onHome={handleHome}
      theme={theme}
    />
  );
}
