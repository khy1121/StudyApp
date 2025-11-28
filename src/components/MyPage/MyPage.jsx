import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../../styles/mypage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/mypage') return location.pathname === '/mypage' || location.pathname === '/mypage/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <header className="mypage-header">
                <div className="mypage-header-inner">
                    <button className="mypage-btn-back" aria-label="뒤로가기" onClick={() => navigate(-1)}>← Back</button>

                    <div className="mypage-brand">
                        <div className="mypage-brand-icon">📘</div>
                        <h1 className="mypage-brand-title">마이페이지</h1>
                    </div>
                    <button className="mypage-btn-home" onClick={() => navigate('/home')}>메인으로</button>
                </div>
            </header>

            <div className="mypage-container">
                {/*상단 탭 메뉴*/}
                <nav className='selectTab'>
                    <button type="button" className={isActive('/mypage') ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/mypage')}>대시보드</button>
                    <button type="button" className={isActive('/mypage/study-anal') ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/mypage/study-anal')}>학습 분석</button>
                    <button type="button" className={isActive('/mypage/wrong-note') ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/mypage/wrong-note')}>오답 노트</button>
                    <button type="button" className={isActive('/mypage/achievment') ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/mypage/achievment')}>성취도</button>
                    <button type="button" className={isActive('/mypage/settings') ? 'tab-btn active' : 'tab-btn'} onClick={() => navigate('/mypage/settings')}>설정</button>
                </nav>

                {/*하위 페이지 컨텐츠가 여기에 로드됨 */}
                <div className='mypage-content'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
export default MyPage;