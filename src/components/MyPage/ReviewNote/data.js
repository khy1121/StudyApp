// data.js
export const MOCK_WRONG_DATA = {
    os: {
        easy: [
            { id: "os_e_02", type: "multiple_choice", question: "CPU가 여러 프로그램을 번갈아 실행하는 방식을 무엇이라 하는가?", choices: ["싱글태스킹", "멀티태스킹", "스레딩", "하이퍼스레딩"], answer: "멀티태스킹", answerIndex: 1, explanation: "멀티태스킹은 여러 프로그램이 동시에 실행되는 것처럼 보이게 하는 기술입니다.", userSelectedIndex: 0, isWrong: true },
            { id: "os_e_06", type: "multiple_choice", question: "프로세스가 I/O 작업을 기다리는 동안의 상태는?", choices: ["Ready", "Blocked", "Running", "Terminated"], answer: "Blocked", answerIndex: 1, explanation: "I/O 요청이 완료될 때까지 CPU를 사용할 수 없기 때문에 Blocked 상태가 됩니다.", userSelectedIndex: 3, isWrong: true }
        ],
        medium: [
            { id: "os_m_01", type: "multiple_choice", question: "라운드 로빈 스케줄링에서 중요한 매개변수는?", choices: ["타임 퀀텀", "우선순위", "프로세스 ID", "큐 길이"], answer: "타임 퀀텀", answerIndex: 0, explanation: "라운드 로빈은 각 프로세스에 일정한 타임 퀀텀만큼 CPU를 순차적으로 배분합니다.", userSelectedIndex: 2, isWrong: true },
        ],
        hard: [
            { id: "os_h_01", type: "multiple_choice", question: "교착 상태 발생의 필요조건 4가지는?", choices: ["상호배제, 점유와 대기, 비선점, 순환대기", "상호배제, 경쟁조건, 선점, 순환대기", "비선점, 스케줄링, 페이징, 교환", "순환대기, 캐시미스, 블로킹, 페이지폴트"], answer: "상호배제, 점유와 대기, 비선점, 순환대기", answerIndex: 0, explanation: "교착 상태는 네 가지 조건이 동시에 만족할 때 발생합니다.", userSelectedIndex: 1, isWrong: true }
        ]
    },
    ds: {
        easy: [
            { id: "algo_e_01", type: "multiple_choice", question: "스택의 주요 특징은?", choices: ["FIFO", "LIFO", "RANDOM", "HASH"], answer: "LIFO", answerIndex: 1, explanation: "스택(Stack)은 LIFO 구조입니다.", userSelectedIndex: 3, isWrong: true },
        ],
        medium: [],
        hard: []
    },
    web: {
        easy: [
            { id: "react_e_06", type: "multiple_choice", question: "React 개발 서버의 기본 포트 번호는?", choices: ["8080", "3000", "5000", "4200"], answer: "3000", answerIndex: 1, explanation: "CRA 기본 포트는 3000.", userSelectedIndex: 0, isWrong: true },
        ],
        medium: [
            { id: "react_m_02", type: "multiple_choice", question: "useEffect Hook의 기본 용도는?", choices: ["렌더링 후 부수 효과 처리", "상태 저장", "함수 메모이제이션", "컴포넌트 스타일링"], answer: "렌더링 후 부수 효과 처리", answerIndex: 0, explanation: "useEffect는 부수효과 담당.", userSelectedIndex: 2, isWrong: true },
        ],
        hard: [
            { id: "react_h_01", type: "multiple_choice", question: "useMemo Hook의 주요 목적은?", choices: ["렌더링 방지", "값 메모이제이션", "이벤트 최적화", "비동기 요청"], answer: "값 메모이제이션", answerIndex: 1, explanation: "useMemo는 값 메모이제이션.", userSelectedIndex: 0, isWrong: true },
        ]
    }
};

export const SUBJECT_MAP = {
    os: "운영체제",
    ds: "자료구조",
    web: "웹프레임워크",
};

export const DIFFICULTY_MAP = {
    easy: "초급",
    medium: "중급",
    hard: "고급",
};

// 평탄화된 전체 오답 배열
export const ALL_WRONG_PROBLEMS = Object.entries(MOCK_WRONG_DATA).flatMap(
    ([subjectKey, difficulties]) =>
        Object.entries(difficulties).flatMap(([difficultyKey, problems]) =>
            problems.filter(p => p.isWrong).map(p => ({
                ...p,
                subject: SUBJECT_MAP[subjectKey],
                difficulty: DIFFICULTY_MAP[difficultyKey],
                subjectKey,
                difficultyKey
            }))
        )
);
