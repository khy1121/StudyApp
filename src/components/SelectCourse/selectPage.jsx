// 과목/난이도/모드/시간을 선택하여 학습을 시작하는 화면
// - 계약(입력/출력):
//   입력 props: onStart?(payload)
//   출력 payload: { subject('os'|'ds'|'web'), difficulty('초급'|'중급'|'고급'|null), mode('quiz'|'exam'|null), studyTimeMin(number|null) }
// - 동작 개요:
//   1) 과목/난이도/모드/시간을 선택(일부 섹션은 HIDE로 숨김 가능)
//   2) [학습 시작] 클릭 시 payload 생성 → onStart 호출 또는 라우팅으로 전달
//   3) 추후: subject/difficulty에 따른 문제 JSON/API 로딩, exam 모드의 타이머는 /exam 페이지에서 처리
// - 접근성: 키보드 Enter로 시작, 버튼에 role/aria 명시 일부 적용
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/select.css";

/**
 * 데이터 연동/구조 안내 (설계 주석)
 *
 * 1) 과목별 문제 JSON 구조 예시 (subject -> difficulty -> problems)
 *    - 실제로는 public 폴더 또는 API에서 가져옵니다.
 *    - 예: /data/problems/os.json, /data/problems/ds.json, /data/problems/web.json
 *    {
 *      "subject": "os",                     // 과목 키 (os | ds | web)
 *      "difficulties": {
 *        "초급": [{ id: 1, type: "mcq", question: "...", options: [...], answer: 2 }],
 *        "중급": [{ id: 10, ... }],
 *        "고급": [{ id: 20, ... }]
 *      }
 *    }
 *
 * 2) 선택 로직
 *    - 과목(subject)과 난이도(difficulty) 선택 시 해당 JSON을 로드하고, 난이도에 맞는 문제 리스트를 준비합니다.
 *    - 퀴즈 모드(quiz): 한 문제씩 즉시 채점 UI로 이동
 *    - 시험 모드(exam): 전체 문제를 한 번에 풀고 제출, 타이머(학습 시간 설정) 적용
 *
 * 3) API/라우팅 예시 (추후 구현)
 *    - GET /api/problems?subject=os&difficulty=중급
 *    - navigate('/quiz',   { state: { problems, subject, difficulty } })
 *    - navigate('/exam',   { state: { problems, subject, difficulty, timeLimitMin } })
 */

/**
 * 학습 과목 선택 페이지 (단독 파일 버전)
 * - 과목 선택
 * - 난이도 선택 (HIDE 토글)
 * - 학습 모드 선택 (HIDE 토글)
 * - 학습 시간 슬라이더 (HIDE 토글)
 * - [학습 시작] 버튼 (선택 조건 충족 시 활성화)
 *
 * onStart(optional): (payload) => void
 *  payload = { subject, difficulty, mode, studyTimeMin }
 */
export default function SelectPage({ onStart }) {
  // 라우팅을 위한 navigate 훅
  const navigate = useNavigate();
  // 섹션 표시 토글(HIDE ON/OFF)
  // - true: 섹션 노출 및 값 필요(시작 조건에 반영)
  // - false: 섹션 숨김 및 값 불필요(시작 조건에서 제외)
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [showMode, setShowMode] = useState(true);
  const [showTime, setShowTime] = useState(true);

  // 선택 상태
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [mode, setMode] = useState(null);
  const [studyTime, setStudyTime] = useState(30); // 분 (10~120)

  /**
   * [추가 예정] 문제 데이터 로딩 가이드
   * - 과목/난이도 변경될 때마다 문제 세트를 로드하는 흐름입니다.
   * - 아래 코드는 예시이며, 실제 구현 시 주석 해제 후 API/파일 경로를 맞춰주세요.
   */
  // (문제 데이터 로딩) 여기에 추가 (구현방법 : subject/difficulty 의존성 useEffect에서 과목별 JSON fetch →
  //  difficulty 키로 필터링해 setProblems(list) 수행. public/data/problems/*.json 또는 API 사용)
  // const [problems, setProblems] = useState([]); // 선택된 문제 리스트
  // React.useEffect(() => {
  //   if (!subject) return;
  //   const urlMap = {
  //     os:  "/data/problems/os.json",
  //     ds:  "/data/problems/ds.json",
  //     web: "/data/problems/web.json",
  //   };
  //   fetch(urlMap[subject])
  //     .then((res) => res.json())
  //     .then((json) => {
  //       // json.difficulties["초급" | "중급" | "고급"] 형태라고 가정
  //       const list = difficulty ? (json.difficulties[difficulty] || []) : [];
  //       setProblems(list);
  //     })
  //     .catch(console.error);
  // }, [subject, difficulty]);

  // 유효성 검사: 시작 버튼 활성화 조건
  const canStart = useMemo(() => {
    // - 과목(subject): 항상 필수
    // - 난이도(difficulty): 섹션이 보일 때만 필수(showDifficulty)
    // - 모드(mode): 섹션이 보일 때만 필수(showMode)
    // - 시간(studyTime): 시작 여부와 무관하며 exam 모드일 때만 의미 있게 사용
    return !!subject && (!!difficulty || !showDifficulty) && (!!mode || !showMode);
  }, [subject, difficulty, mode, showDifficulty, showMode]);

  const handleStart = () => {
    if (!canStart) return;
    const payload = {
      subject,
      difficulty: showDifficulty ? difficulty : null,
      mode: showMode ? mode : null,
      studyTimeMin: showTime ? Number(studyTime) : null,
      // [확장 필드 제안]
      // problems,            // 위 useEffect로 로딩한 문제 배열
      // problemCount: problems?.length,
    };

    /**
     * [시작 동작 가이드]
     * - 퀴즈 모드(quiz): 즉시 채점형 퀴즈 화면으로 이동
     *     navigate('/quiz', { state: payload })
     * - 시험 모드(exam): 타이머 적용 시험 화면으로 이동
     *     navigate('/exam', { state: { ...payload, timeLimitMin: payload.studyTimeMin } })
     * - 타이머는 시험 화면에서 카운트다운 훅(useEffect + setInterval)으로 구현
     *     1) 종료 시 자동 제출 핸들러 호출
     *     2) 남은 시간은 전역/페이지 상태로 관리하여 재진입 시 복구 가능
  *
  * (시작 네비게이션) 여기에 추가 (구현방법 : 위 navigate 주석을 실제 코드로 적용하고
  *  App.jsx에 /quiz, /exam 라우트를 개설. quiz는 단건 즉시 채점 흐름, exam은 timeLimitMin으로
  *  타이머 시작 → 제출 시 일괄 채점 및 결과 페이지 이동)
     */

    // 콜백 방식(onStart) 우선, 미제공 시 콘솔 출력(추후 navigate로 교체 권장)
    if (typeof onStart === "function") onStart(payload);
    else console.log("START:", payload);
  };

  // 키보드: Enter로 시작
  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canStart, subject, difficulty, mode, studyTime, showDifficulty, showMode, showTime]);

  return (
    <div className="select-root">
      {/* HEADER */}
      <header className="select-header">
        <div className="header-inner">
          {/* 뒤로가기: 브라우저 히스토리 대신 /home 으로 명시적 이동 */}
          <button className="icon-back" aria-label="뒤로가기" onClick={() => navigate('/home')}>
            ←
          </button>
          <div className="brand">
            <div className="brand-icon">📘</div>
            <h1 className="brand-title">학습 플랫폼</h1>
          </div>
          <a className="link-home" href="/">메인으로</a>
        </div>
      </header>

      {/* BODY */}
      <main className="select-body">
        <section className="container">
          {/* 타이틀 */}
          <div className="section-head">
            <h2 className="title">과목 선택</h2>
            <p className="subtitle">학습할 과목과 설정을 선택하세요</p>
          </div>

          {/* 과목 선택 */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">과목 선택</h3>
            </div>
            <div className="card-grid">
        {/* (과목 선택 처리) 여기에 추가 (구현방법 : 과목 카드 클릭 시 setSubject('os'|'ds'|'web');
                  이후 위 useEffect에서 해당 과목 JSON을 가져와 난이도 선택값이 있으면
                  json.difficulties[difficulty]로 필터링하여 setProblems(list) 실행) */}
              <SubjectCard
                active={subject === "os"}
                color="blue"
                title="운영체제"
                onClick={() => setSubject("os")}
              />
              <SubjectCard
                active={subject === "ds"}
                color="green"
                title="자료구조"
                onClick={() => setSubject("ds")}
              />
              <SubjectCard
                active={subject === "web"}
                color="purple"
                title="웹프레임워크"
                onClick={() => setSubject("web")}
              />
            </div>
          </div>

          {/* 난이도 (HIDE 토글) */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">난이도 선택</h3>
              <HideToggle on={showDifficulty} onToggle={() => setShowDifficulty(v => !v)} />
            </div>
            {showDifficulty && (
              <div className="pill-grid">
        {/* (난이도 선택 처리) 여기에 추가 (구현방법 : setDifficulty('초급'|'중급'|'고급') 호출 후
                    메모된 과목 데이터 또는 fetch 결과에서 해당 난이도 배열만 골라 setProblems(list)) */}
                <Pill
                  active={difficulty === "초급"}
                  onClick={() => setDifficulty("초급")}
                  title="초급"
                  desc="기본 개념 중심"
                />
                <Pill
                  active={difficulty === "중급"}
                  onClick={() => setDifficulty("중급")}
                  title="중급"
                  desc="응용 문제 포함"
                />
                <Pill
                  active={difficulty === "고급"}
                  onClick={() => setDifficulty("고급")}
                  title="고급"
                  desc="심화 문제 중심"
                />
              </div>
            )}
          </div>

          {/* 학습 모드 (HIDE 토글) */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">학습 모드</h3>
              <HideToggle on={showMode} onToggle={() => setShowMode(v => !v)} />
            </div>
            {showMode && (
              <div className="mode-grid">
        {/* (모드 선택 처리) 여기에 추가 (구현방법 : setMode('quiz'|'exam') 선택값 저장 →
                    handleStart에서 mode 값에 따라 navigate('/quiz'|'/exam', { state: payload })로 분기) */}
                <ModeCard
                  active={mode === "quiz"}
                  highlight
                  title="퀴즈 모드"
                  desc="정답 즉시 확인"
                  onClick={() => setMode("quiz")}
                />
                <ModeCard
                  active={mode === "exam"}
                  title="시험 모드"
                  desc="전체 완료 후 채점"
                  onClick={() => setMode("exam")}
                />
              </div>
            )}
          </div>

          {/* 학습 시간 (HIDE 토글) */}
          <div className="block">
            <div className="block-head">
              <h3 className="block-title">학습 시간 설정</h3>
              <HideToggle on={showTime} onToggle={() => setShowTime(v => !v)} />
            </div>
            {showTime && (
              <div className="time-box">
                <div className="time-row">
                  <span className="time-label">학습 시간</span>
                  <span className="time-value">{studyTime}분</span>
                </div>
        {/* (시험 시간 적용) 여기에 추가 (구현방법 : exam 모드에서만 의미 있게 사용.
                    handleStart에서 payload.studyTimeMin으로 넘긴 뒤 /exam 페이지에서
                    useEffect+setInterval로 카운트다운을 구현하고 0이 되면 자동 제출) */}
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  className="time-range"
                />
                <div className="time-minmax">
                  <span>10분</span>
                  <span>120분</span>
                </div>
              </div>
            )}
          </div>

          {/* 시작 버튼 */}
          <div className="action-row">
            <button
              className={`btn-start ${canStart ? "on" : "off"}`}
              disabled={!canStart}
              onClick={handleStart}
            >
              ▶ 학습 시작
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ------- Sub Components ------- */

function SubjectCard({ active, color, title, onClick }) {
  return (
    <button
      className={`subject-card ${active ? "active" : ""} color-${color}`}
      onClick={onClick}
      type="button"
    >
      <div className={`subject-icon ${color}`}>{/* icon placeholder */}</div>
      <div className="subject-title">{title}</div>
    </button>
  );
}

function Pill({ active, title, desc, onClick }) {
  return (
    <button className={`pill ${active ? "active" : ""}`} onClick={onClick} type="button">
      <div className="pill-title">{title}</div>
      <div className="pill-desc">{desc}</div>
    </button>
  );
}

function ModeCard({ active, title, desc, onClick, highlight = false }) {
  return (
    <button
      className={`mode-card ${active ? "active" : ""} ${highlight ? "highlight" : ""}`}
      onClick={onClick}
      type="button"
    >
      <div className="mode-title">{title}</div>
      <div className="mode-desc">{desc}</div>
    </button>
  );
}

function HideToggle({ on, onToggle }) {
  return (
    <button
      type="button"
      className={`hide-toggle ${on ? "on" : "off"}`}
      onClick={onToggle}
      aria-pressed={on}
      title="HIDE ON/OFF"
    >
      {on ? "HIDE: OFF" : "HIDE: ON"}
    </button>
  );
}
