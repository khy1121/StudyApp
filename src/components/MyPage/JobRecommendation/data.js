//임시 데이터
export const JOB_RECOMMENDATION_DATA = {
    overall: {
        job: '백엔드 개발자',
        description: '전체 학습 성과를 종합한 결과, 이 직무가 가장 적합합니다',
        match: '79%',
    },
    subjects: [
        {
            key: 'ds', name: '자료구조', accuracy: 88, style: '실전형',
            recommendedJobs: ['백엔드 개발자', 'AI 엔지니어', '알고리즘 엔지니어'],
            reason: '효율적인 알고리즘 설계 능력이 뛰어나며, 대규모 데이터 처리와 최적화에 특화되어 있습니다.',
            reasonIcon: '💡',
            skills: ['Spring Boot', 'Django', 'TensorFlow', 'PyTorch', 'Redis'],
        },
        {
            key: 'web', name: '웹프레임워크', accuracy: 75, style: '성장형',
            recommendedJobs: ['UI/UX 개발자', '프론트엔드 개발자'],
            reason: '웹 기술에 대한 직관적 이해를 바탕으로 사용자 경험 개발에 특화될 수 있습니다.',
            skills: ['HTML/CSS', 'JavaScript', 'Figma', '반응형 디자인'],
        },
        {
            key: 'os', name: '운영체제', accuracy: 73, style: '성장형',
            recommendedJobs: ['IT 컨설턴트', '기술 지원 엔지니어'],
            reason: '운영체제 기초 지식을 바탕으로 기술 지원과 컨설팅 분야에서 성장할 수 있습니다.',
            skills: ['문제 해결 방법론', '커뮤니케이션', '프로젝트 관리'],
        },
    ],
};
