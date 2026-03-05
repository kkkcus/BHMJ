// src/pages/MyMenu.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './MyMenu.module.css';
import { useAuth } from '../context/AuthContext';

const AVOID_KEY    = 'bhmj_avoid';
const PRIVACY_KEY  = 'bhmj_privacy';
const PHOTO_KEY    = 'bhmj_profile_photo';
const NICKNAME_KEY = 'bhmj_nickname';

export default function MyMenu() {
  const nav = useNavigate();
  const { user: profile, refetch, logout } = useAuth();

  // ── 로그아웃 ──────────────────────────────────
  const handleLogout = async () => {
    // 게스트 모드 체크
    if (profile?.isGuest) {
      logout();
      nav('/', { replace: true });
      return;
    }

    await fetch('/auth/kakao/logout', { method: 'POST', credentials: 'include' });
    refetch();
    nav('/', { replace: true });
  };

  // ── 수정 메뉴 모달 ────────────────────────────
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [nicknameMode, setNicknameMode] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');

  // ── 커스텀 닉네임 ─────────────────────────────
  const [customNickname, setCustomNickname] = useState<string | null>(
    () => localStorage.getItem(NICKNAME_KEY)
  );
  const displayName = customNickname || profile?.nickname || '';

  const saveNickname = () => {
    const v = nicknameInput.trim();
    if (!v) return;
    setCustomNickname(v);
    localStorage.setItem(NICKNAME_KEY, v);
    setNicknameMode(false);
    setNicknameInput('');
    setEditMenuOpen(false);
  };

  // ── 커스텀 프로필 사진 ────────────────────────
  const [customPhoto, setCustomPhoto] = useState<string | null>(
    () => localStorage.getItem(PHOTO_KEY)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setCustomPhoto(dataUrl);
      localStorage.setItem(PHOTO_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const displayPhoto = customPhoto || profile?.profile_image_url || null;

  const openPhotoEdit = () => {
    setEditMenuOpen(false);
    setNicknameMode(false);
    fileInputRef.current?.click();
  };

  const openNicknameEdit = () => {
    setNicknameInput(displayName);
    setNicknameMode(true);
  };

  // ── 피하고 싶은 재료 ──────────────────────────
  const [avoidList, setAvoidList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(AVOID_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [avoidInput, setAvoidInput] = useState('');

  // ── 북마크된 레시피 ────────────────────────────
  const [bookmarkedRecipes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bhmj_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(AVOID_KEY, JSON.stringify(avoidList));
  }, [avoidList]);

  const addAvoid = () => {
    const v = avoidInput.trim();
    if (!v || avoidList.includes(v)) { setAvoidInput(''); return; }
    setAvoidList(prev => [...prev, v]);
    setAvoidInput('');
  };

  const removeAvoid = (item: string) =>
    setAvoidList(prev => prev.filter(i => i !== item));

  // ── 개인정보 활용 동의 ────────────────────────
  const [privacy, setPrivacy] = useState(() => {
    try { return localStorage.getItem(PRIVACY_KEY) === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem(PRIVACY_KEY, String(privacy));
  }, [privacy]);

  return (
    <div className="shell">
      <main className={`card ${s.pageWrap}`}>

        {/* 상단바 */}
        <div className={s.topbar}>
          <button className={s.iconCircle} onClick={() => nav(-1)} aria-label="뒤로">
            <img src="/back.png" alt="" className={s.icon} />
          </button>
          <div className={s.title}>마이메뉴</div>
          <div style={{ width: 40 }} />
        </div>

        <div className={s.content}>

          {/* 프로필 카드 */}
          <section className={`${s.section} ${s.sectionBrown}`}>
            <div className={s.profileCard}>
              <div className={s.avatarWrap}>
                {displayPhoto ? (
                  <img src={displayPhoto} alt="" className={s.avatar} />
                ) : (
                  <div className={s.avatarPlaceholder} />
                )}
                <img src="/chef-hatscarf.png.png" alt="" className={s.avatarFrame} />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={s.fileInput}
                onChange={handlePhotoChange}
              />
              <div className={s.profileInfo}>
                <div className={s.profileName}>{displayName}</div>
                <div className={s.profileRank}>요리 견습생</div>
              </div>
              <button
                className={s.editBtn}
                onClick={() => { setNicknameMode(false); setEditMenuOpen(true); }}
              >
                수정하기
              </button>
            </div>
          </section>

          {/* 나의 요리집 바로가기 */}
          <button
            onClick={() => nav('/my-recipes')}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#f5f6fa',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '16px 0',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f6fa'}
          >
            <span>🔖 나의 요리집</span>
            <span style={{ fontSize: '14px' }}>({bookmarkedRecipes.length})</span>
          </button>

          {/* 피하고 싶은 재료 */}
          <section className={s.section}>
            <div className={s.sectionTitle}>🚫 피하고 싶은 재료</div>
            <div className={s.chipRow}>
              {avoidList.map(item => (
                <div key={item} className={s.chip}>
                  <span className={s.chipLabel}>{item}</span>
                  <button
                    className={s.chipX}
                    onClick={() => removeAvoid(item)}
                    aria-label={`${item} 제거`}
                  >×</button>
                </div>
              ))}
            </div>
            <div className={s.inputRow}>
              <input
                className={s.avoidInput}
                placeholder="재료 입력 후 + 버튼"
                value={avoidInput}
                onChange={e => setAvoidInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAvoid()}
              />
              <button className={s.addBtn} onClick={addAvoid} aria-label="추가">+</button>
            </div>
          </section>

          {/* 개인정보 활용 동의 */}
          <section className={s.section}>
            <div className={s.toggleRow}>
              <div className={s.toggleLabel}>개인정보 활용 동의</div>
              <button
                className={`${s.toggle} ${privacy ? s.toggleOn : ''}`}
                onClick={() => setPrivacy(p => !p)}
                aria-pressed={privacy}
                aria-label="개인정보 활용 동의"
              >
                <span className={s.toggleThumb} />
              </button>
            </div>
            <p className={s.toggleDesc}>
              재료 입력 정보를 레시피 추천 개선에 활용하는 데 동의합니다.
            </p>
          </section>

          {/* 로그아웃 */}
          <button className={s.logoutBtn} onClick={handleLogout}>
            로그아웃
          </button>

        </div>
      </main>

      {/* 수정 모달 */}
      {editMenuOpen && (
        <div className={s.modalOverlay} onClick={() => { setEditMenuOpen(false); setNicknameMode(false); }}>
          <div className={s.modalCard} onClick={e => e.stopPropagation()}>
            {!nicknameMode ? (
              <>
                <div className={s.modalTitle}>프로필 수정</div>
                <button className={s.modalOption} onClick={openPhotoEdit}>
                  프로필 사진 등록
                </button>
                <button className={s.modalOption} onClick={openNicknameEdit}>
                  닉네임 바꾸기
                </button>
                <button className={s.modalCancel} onClick={() => setEditMenuOpen(false)}>
                  취소
                </button>
              </>
            ) : (
              <>
                <div className={s.modalTitle}>닉네임 바꾸기</div>
                <input
                  className={s.modalInput}
                  value={nicknameInput}
                  onChange={e => setNicknameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveNickname()}
                  placeholder="새 닉네임 입력"
                  autoFocus
                />
                <button className={s.modalOption} onClick={saveNickname}>
                  저장
                </button>
                <button className={s.modalCancel} onClick={() => { setNicknameMode(false); }}>
                  뒤로
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
