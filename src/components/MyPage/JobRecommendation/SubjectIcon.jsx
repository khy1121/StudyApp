const SubjectIcon = ({ type }) => {
    let color, icon, bgColor;
    switch (type) {
        case 'ds': color = '#10b981'; icon = '💾'; bgColor = '#d1fae5'; break; // 자료구조
        case 'web': color = '#3b82f6'; icon = '🌐'; bgColor = '#eff6ff'; break; // 웹프레임워크
        case 'os': color = '#8b5cf6'; icon = '💻'; bgColor = '#ede9fe'; break; // 운영체제 
        default: color = '#6b7280'; icon = '❓'; bgColor = '#f3f4f6';
    }

    return (
        <div className="subject-icon-box" style={{ backgroundColor: bgColor }}>
            <span style={{ color: color }}>{icon}</span>
        </div>
    );
};

export default SubjectIcon;