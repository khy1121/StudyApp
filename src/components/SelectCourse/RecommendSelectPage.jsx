// 오늘 추천 문제 선택 화면
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SelectPage from "./selectPage";
import { getBySubjectAndDifficulty } from '../../services/wrongProblems';

const urlMap = {
  os: "/data/problems/os.json",
  ds: "/data/problems/ds.json",
  web: "/data/problems/web.json",
};

const DIFF_MAP = {
  '초급': 'easy',
  '중급': 'medium',
  '고급': 'hard'
};

export default function RecommendSelectPage(props) {
  const navigate = useNavigate();
  const [showNoWrongAlert, setShowNoWrongAlert] = useState(false);
  
  // onStart: SelectPage가 시작 직전에 호출함. 여기서 오답 리스트 기반으로 문제를 필터링하여
  // 수정된 payload를 반환하면 SelectPage가 반환값을 사용해 이후 네비게이션을 수행함.
  const onStart = async (payload) => {
    // 서비스에서 과목+난이도별 오답 목록을 가져옴
    const { subject, difficulty } = payload;
    let wrongProblems = [];
    try {
      wrongProblems = getBySubjectAndDifficulty(subject, difficulty) || [];
    } catch (e) {
      console.error('오답 문제 불러오기 실패:', e);
      wrongProblems = [];
    }
    const wrongIds = wrongProblems.map(w => w.id);

    // 오답이 없다면 알림 표시
    if (!wrongIds.length) {
      setShowNoWrongAlert(true);
      // 3초 후 알림 자동 숨김
      setTimeout(() => setShowNoWrongAlert(false), 3000);
      return null; // 네비게이션 중단
    }

    // 해당 과목 JSON을 불러와 오답 ID로 필터링
    try {
  const res = await fetch(urlMap[subject]);
  const json = await res.json();
  const diffKey = DIFF_MAP[difficulty];
  let pool = diffKey ? (json[diffKey] || []) : ([]);
      const filtered = pool.filter(p => wrongIds.includes(p.id));
      
      if (filtered.length) {
        return { 
          ...payload, 
          problems: filtered, 
          problemCount: filtered.length, 
          isRecommend: true 
        };
      } else {
        setShowNoWrongAlert(true);
        setTimeout(() => setShowNoWrongAlert(false), 3000);
        return null;
      }
    } catch (e) {
      console.error('오늘 추천 문제 불러오기 실패:', e);
      return null;
    }
  };

  return (
    <div className="recommend-page">
      {showNoWrongAlert && (
        <div className="alert-overlay">
          <div className="alert-box">
            <p>해당 과목과 난이도에 대한 오답 문제가 없습니다.</p>
            <p>다른 과목이나 난이도를 선택해보세요!</p>
          </div>
        </div>
      )}
      <SelectPage {...props} isRecommend onStart={onStart} />
    </div>
  );
}
