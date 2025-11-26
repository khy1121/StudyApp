import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import '../../styles/mypage.css'

function safeParse(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback
    } catch {
        return fallback
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem('users', JSON.stringify(users))
    } catch (e) {
        // ignore
    }
}

const Settings = () =>{
        const { theme, toggleTheme } = useTheme()
        const navigate = useNavigate()

        const [user, setUser] = useState({ name: '', email: '' })
        const [prefs, setPrefs] = useState({ notify: true, autosave: true })

        useEffect(() => {
            // load user from localStorage.currentUser first, else from users[0]
            const cur = safeParse('currentUser', null)
            if (cur && cur.name) {
                setUser({ name: cur.name, email: cur.email || '' })
            } else {
                const users = safeParse('users', [])
                if (users.length > 0) {
                    setUser({ name: users[0].name || '', email: users[0].email || '' })
                }
            }

            const s = safeParse('appSettings', null)
            if (s) setPrefs({ notify: !!s.notify, autosave: !!s.autosave })
        }, [])

        const handleLogout = () => {
            localStorage.removeItem('currentUser')
            navigate('/')
        }

            const [showModal, setShowModal] = useState(false)
            const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })

            const handleEditProfile = () => {
                setForm({ name: user.name || '', email: user.email || '', password: '', passwordConfirm: '' })
                setShowModal(true)
            }

            const validateEmail = (e) => /.+@.+\..+/.test(e)

            const submitProfile = () => {
                if (!form.name) return alert('이름을 입력하세요')
                if (!validateEmail(form.email)) return alert('올바른 이메일을 입력하세요')
                if (form.password && form.password.length < 8) return alert('비밀번호는 8자 이상이어야 합니다')
                if (form.password && form.password !== form.passwordConfirm) return alert('비밀번호와 확인이 일치하지 않습니다')

                const updated = { ...user, name: form.name, email: form.email }
                setUser(updated)
                try {
                    localStorage.setItem('currentUser', JSON.stringify(updated))
                    localStorage.setItem('studyapp_current_user', JSON.stringify(updated));
                    window.location.reload(); // 새로고침으로 Home의 이름 반영   
                    const users = safeParse('users', [])
                    const idx = users.findIndex(u => u.email === user.email)
                    if (idx >= 0) {
                        users[idx] = { ...users[idx], name: form.name, email: form.email }
                    } else {
                        if (users.length > 0) users[0] = { ...users[0], name: form.name, email: form.email }
                    }
                    if (form.password) {
                        // update password in users array (note: still plain-text in demo)
                        const targetIdx = users.findIndex(u => u.email === form.email)
                        if (targetIdx >= 0) users[targetIdx].password = form.password
                    }
                    saveUsers(users)
                } catch (e) {
                    console.error('profile save error', e)
                }
                // notify other components in this window that user changed
                try { window.dispatchEvent(new CustomEvent('user-updated')) } catch(e){}
                setShowModal(false)
            }

        const togglePref = (key) => {
            const next = { ...prefs, [key]: !prefs[key] }
            setPrefs(next)
            localStorage.setItem('appSettings', JSON.stringify(next))
        }

        const handleToggleDark = () => {
            toggleTheme()
        }

        return (
                <div className='settings-root'>
                    <h3>설정</h3>

                    <section className='settings-section profile-section'>
                        <div className='profile-card'>
                            <div className='profile-avatar'>
                                {user.name ? user.name.charAt(0) : '📘' }
                            </div>
                            <div className='profile-info'>
                                <div className='profile-name'>{user.name || '이름 없음'}</div>
                                <div className='profile-email'>{user.email || '이메일 없음'}</div>
                            </div>
                            <div className='profile-actions'>
                                <button className='btn ghost' onClick={handleEditProfile}>프로필 수정</button>
                            </div>
                        </div>
                    </section>

                    <section className='settings-section'>
                        <h4>학습 설정</h4>
                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>알림 설정</div>
                                <div className='settings-desc'>학습 리마인더 알림을 받습니다</div>
                            </div>
                            <button className={`toggle-switch ${prefs.notify ? 'on' : ''}`} onClick={() => togglePref('notify')}>
                                <span />
                            </button>
                        </div>

                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>자동 저장</div>
                                <div className='settings-desc'>학습 진도 자동으로 저장합니다</div>
                            </div>
                            <button className={`toggle-switch ${prefs.autosave ? 'on' : ''}`} onClick={() => togglePref('autosave')}>
                                <span />
                            </button>
                        </div>

                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>다크 모드</div>
                                <div className='settings-desc'>어두운 테마를 사용합니다</div>
                            </div>
                            <button className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`} onClick={handleToggleDark}>
                                <span />
                            </button>
                        </div>
                    </section>
                                {/* Modal for profile edit */}
                                {showModal && (
                                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                                        <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                                            <h3>프로필 수정</h3>
                                            <div className="modal-row">
                                                <label>닉네임</label>
                                                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                                            </div>
                                            <div className="modal-row">
                                                <label>이메일</label>
                                                <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                                            </div>
                                            <div className="modal-row">
                                                <label>비밀번호</label>
                                                <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="변경할 비밀번호(선택)" />
                                            </div>
                                            <div className="modal-row">
                                                <label>비밀번호 확인</label>
                                                <input type="password" value={form.passwordConfirm} onChange={(e) => setForm(f => ({ ...f, passwordConfirm: e.target.value }))} placeholder="비밀번호 확인" />
                                            </div>
                                            <div className="modal-actions">
                                                <button className='btn ghost' onClick={() => setShowModal(false)}>취소</button>
                                                <button className='btn primary' onClick={submitProfile}>수정 완료</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                    <section className='settings-section'>
                        <h4>데이터 관리</h4>
                        <div className='settings-row'>
                            <div>
                                <div className='settings-label'>학습 데이터 내보내기</div>
                                <div className='settings-desc'>학습 기록을 JSON 파일로 다운로드</div>
                            </div>
                            <button className='btn ghost' onClick={() => alert('다운로드 (데모)')}>내보내기</button>
                        </div>

                                    <div className='settings-row'>
                                        <div>
                                            <div className='settings-label'>캐시 데이터 삭제</div>
                                            <div className='settings-desc'>임시 저장된 데이터를 삭제합니다</div>
                                        </div>
                                        <button className='btn ghost' onClick={() => {
                                            // 안전: 전체 로컬스토리지를 지우지 않고 캐시 관련 키만 제거
                                            try {
                                                localStorage.removeItem('appCache')
                                                localStorage.removeItem('tempData')
                                                alert('캐시 데이터가 삭제되었습니다')
                                            } catch(e) {
                                                console.error(e)
                                                alert('삭제 중 오류가 발생했습니다')
                                            }
                                        }}>삭제</button>
                                    </div>

                        <div className='danger-row'>
                            <button className='btn' style={{background:'#fff', color:'#ef4444', border:'1px solid rgba(239,68,68,0.12)'}} onClick={() => { if (confirm('모든 학습 기록을 삭제하시겠습니까?')) { localStorage.removeItem('users'); localStorage.removeItem('currentUser'); alert('삭제됨'); } }}>모든 학습 기록 삭제</button>
                        </div>
                    </section>
                </div>
        )
}

export default Settings;