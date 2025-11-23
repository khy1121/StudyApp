import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LandingPage from "./pages/SelectCourse/LandingPage";
import DashBoard from './components/layout/DashBoard/DashBoard';
import LoginPage from './pages/Login/LoginPage';
import SignInPage from './pages/SignIn/SignInPage';
import WelcomePage from './pages/Welcome/WelcomePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MyPage from './pages/MyPage/MyPage';
import Achievment from "./components/MyPage/Achievement";
import SummaryContent from "./components/MyPage/SummaryContent";
import StudyAnal from "./components/MyPage/StudyAnal/StudyAnal";
import ReviewNote from "./components/MyPage/ReviewNote/ReviewNote";
import Settings from "./components/MyPage/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashBoard />}>
          <Route index element={<WelcomePage />} />
          <Route path="/select-course" element={<LandingPage />} />
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="signIn" element={<SignInPage />} />
          </Route>
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          {/*마이페이지 중첩 라우팅 */}
          <Route path="/mypage" element={<MyPage/>}>
            <Route index element={<SummaryContent/>}/>
            <Route path="study-anal" element={<StudyAnal/>}/>
            <Route path="wrong-note" element={<ReviewNote/>}/>
            <Route path="achievment" element={<Achievment/>}/>
            <Route path="settings" element={<Settings/>}/>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;