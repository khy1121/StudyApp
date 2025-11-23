import { useNavigate, Outlet } from 'react-router-dom'
//import '../../styles/home.css';
import '../../styles/mypage.css';
const MyPage = () => {
    const navigate = useNavigate()
    return (
        <div>
            <header className="home-header">
                <div className="header-content">
                    <div className="brand">
                        <div className="brand-icon">📘</div>
                        <h1 className="brand-title">마이페이지</h1>
                    </div>
                </div>
            </header>
            <div>
                {/*상단 탭 메뉴*/}
                <nav className='selectTab'>
                    <span onClick={() => navigate("/mypage")}>대시보드</span>
                    <span onClick={() => navigate("/mypage/study-anal")}>학습 분석</span>
                    <span onClick={() => navigate("/mypage/wrong-note")}>오답 노트</span>
                    <span onClick={()=> navigate("/mypage/achievment")}>성취도</span>
                    <span onClick={()=> navigate("/mypage/settings")}>설정</span>
                </nav>
            </div>
            <div className='mypage-container'>
                <Outlet/>
            </div>
        </div>
    );
}
export default MyPage;