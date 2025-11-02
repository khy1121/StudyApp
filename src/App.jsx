import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LandingPage from "./pages/SelectCourse/LandingPage";
import DashBoard from './components/layout/DashBoard/DashBoard';
import LoginPage from './pages/Login/LoginPage';
import SignInPage from './pages/SignIn/SignInPage';
import WelcomePage from './pages/Welcome/WelcomePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;