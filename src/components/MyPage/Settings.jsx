// 헌영 코드
// src/components/MyPage/Settings.jsx (예시 경로)

import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import "../../styles/mypage.css";

// auth.js에서 쓰는 로컬스토리지 키와 동일하게 사용
const USERS_KEY = "studyapp_users";
const CURRENT_USER_KEY = "studyapp_current_user";
const CONTINUED_USER_KEY = "continueStudy";
const WRONG_PROBLEMS_KEY = "wrongProblems";
const STUDY_HISTORY_KEY = "studyHistory";


// 로컬스토리지에서 JSON 안전하게 파싱
function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } 
  catch {
    return fallback;
  }
}

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 현재 로그인 유저 정보
  const [user, setUser] = useState({ id: null, name: "", email: "" });

  // 알림 / 자동 저장 설정
  const [prefs, setPrefs] = useState({ notify: true, autosave: true });

  // 첫 렌더 시 현재 유저 / 설정 로딩
  useEffect(() => {
    // 1) 현재 로그인 유저 우선
    const cur = safeParse(CURRENT_USER_KEY, null);

    if (cur && cur.name) {
      setUser({
        id: cur.id ?? null,
        name: cur.name || "",
        email: cur.email || "",
      });
    } else {
      // 2) 없으면 전체 유저 목록에서 첫 번째 유저 사용 (fallback)
      const users = safeParse(USERS_KEY, []);
      if (users.length > 0) {
        const u = users[0];
        setUser({
          id: u.id ?? null,
          name: u.name || "",
          email: u.email || "",
        });
      }
    }

    // 앱 설정 로딩
    const s = safeParse("appSettings", null);
    if (s) setPrefs({ notify: !!s.notify, autosave: !!s.autosave });
  }, []);

  // 로그아웃: 현재 로그인 유저만 삭제
  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    navigate("/");
  };

  // 프로필 수정 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleEditProfile = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      passwordConfirm: "",
    });
    setShowModal(true);
  };

  const validateEmail = (e) => /.+@.+\..+/.test(e);

  // 프로필 수정 저장
  const submitProfile = () => {
    // 1) 검증
    if (!form.name) return alert("이름을 입력하세요");
    if (!validateEmail(form.email)) return alert("올바른 이메일을 입력하세요");
    if (form.password && form.password.length < 8)
      return alert("비밀번호는 8자 이상이어야 합니다");
    if (form.password && form.password !== form.passwordConfirm)
      return alert("비밀번호와 확인이 일치하지 않습니다");

    // 2) 화면 상태 갱신
    const updated = { ...user, name: form.name, email: form.email };
    setUser(updated);

    try {
      // === studyapp_current_user 갱신 (비밀번호는 저장하지 않음) ===
      const cur = safeParse(CURRENT_USER_KEY, null);
      if (cur) {
        const newCur = {
          ...cur,
          name: form.name, // 닉네임
          email: form.email, // 이메일
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newCur));
      }

      // === studyapp_users 배열 갱신 ===
      const users = safeParse(USERS_KEY, []);
      let idx = -1;

      // id로 먼저 찾기
      if (user.id != null) {
        idx = users.findIndex((u) => u.id === user.id);
      }

      // id가 없으면 이전 이메일 기준으로 찾기
      if (idx < 0) {
        idx = users.findIndex((u) => u.email === user.email);
      }

      if (idx >= 0) {
        const base = users[idx];
        const updatedUserInArray = {
          ...base,
          name: form.name, // 닉네임
          email: form.email, // 이메일
        };

        // 비밀번호를 입력한 경우에만 덮어쓰기 (login에서 사용하는 값)
        if (form.password) {
          updatedUserInArray.password = form.password;
        }

        users[idx] = updatedUserInArray;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error("프로필 저장 오류:", e);
    }

    // 다른 컴포넌트에 변경 알림
    try {
      window.dispatchEvent(new CustomEvent("user-updated"));
    } catch (e) {
      // ignore
    }

    setShowModal(false);
  };

  // 알림 / 자동 저장 토글
  const togglePref = (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    localStorage.setItem("appSettings", JSON.stringify(next));
  };

  const handleToggleDark = () => {
    toggleTheme();
  };

  return (
    <div className="settings-root">
      <h3>설정</h3>

      {/* 프로필 카드 */}
      <section className="settings-section profile-section">
        <div className="profile-card">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0) : "📘"}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user.name || "이름 없음"}</div>
            <div className="profile-email">{user.email || "이메일 없음"}</div>
          </div>
          <div className="profile-actions">
            <button className="btn ghost" onClick={handleEditProfile}>
              프로필 수정
            </button>
            {/* 필요하면 로그아웃 버튼도 같이 배치 가능 */}
            {/* <button className="btn ghost" onClick={handleLogout}>로그아웃</button> */}
          </div>
        </div>
      </section>

      {/* 학습 설정 */}
      <section className="settings-section">
        <h4>학습 설정</h4>

        <div className="settings-row">
          <div>
            <div className="settings-label">알림 설정</div>
            <div className="settings-desc">학습 리마인더 알림을 받습니다</div>
          </div>
          <button
            className={`toggle-switch ${prefs.notify ? "on" : ""}`}
            onClick={() => togglePref("notify")}
          >
            <span />
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">자동 저장</div>
            <div className="settings-desc">학습 진도 자동으로 저장합니다</div>
          </div>
          <button
            className={`toggle-switch ${prefs.autosave ? "on" : ""}`}
            onClick={() => togglePref("autosave")}
          >
            <span />
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">다크 모드</div>
            <div className="settings-desc">어두운 테마를 사용합니다</div>
          </div>
          <button
            className={`toggle-switch ${theme === "dark" ? "on" : ""}`}
            onClick={handleToggleDark}
          >
            <span />
          </button>
        </div>
      </section>

      {/* 프로필 수정 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3>프로필 수정</h3>
            <div className="modal-row">
              <label>닉네임</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="modal-row">
              <label>이메일</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="modal-row">
              <label>비밀번호</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder="변경할 비밀번호(선택)"
              />
            </div>
            <div className="modal-row">
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    passwordConfirm: e.target.value,
                  }))
                }
                placeholder="비밀번호 확인"
              />
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className="btn primary" onClick={submitProfile}>
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 데이터 관리 */}
      <section className="settings-section">
        <h4>데이터 관리</h4>

        <div className="settings-row">
          <div>
            <div className="settings-label">학습 데이터 내보내기</div>
            <div className="settings-desc">
              학습 기록을 JSON 파일로 다운로드
            </div>
          </div>
          <button
            className="btn ghost"
            onClick={() => alert("다운로드 (데모)")}
          >
            내보내기
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">캐시 데이터 삭제</div>
            <div className="settings-desc">임시 저장된 데이터를 삭제합니다</div>
          </div>
          <button
            className="btn ghost"
            onClick={() => {
              try {
                localStorage.removeItem("appCache");
                localStorage.removeItem("tempData");
                alert("캐시 데이터가 삭제되었습니다");
              } catch (e) {
                console.error(e);
                alert("삭제 중 오류가 발생했습니다");
              }
            }}
          >
            삭제
          </button>
        </div>

        <div className="danger-row">
          <button
            className="btn"
            style={{
              background: "#fff",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.12)",
            }}
            onClick={() => {
              if (confirm("모든 학습 기록을 삭제하시겠습니까?")) {
                // 전체 초기화 시
                localStorage.removeItem(CONTINUED_USER_KEY);
                localStorage.removeItem(WRONG_PROBLEMS_KEY);
                localStorage.removeItem(STUDY_HISTORY_KEY);
                alert("삭제됨");
              }
            }}
          >
            모든 학습 기록 삭제
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
