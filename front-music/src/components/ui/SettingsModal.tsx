import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsMenu = 'profile' | 'music';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeMenu, setActiveMenu] = useState<SettingsMenu>('profile');
  const [profileImage, setProfileImage] = useState<string>(''); // 프로필 이미지 URL
  const [userId, setUserId] = useState<string>('user123');
  const [email, setEmail] = useState<string>('user@example.com');
  const [musicType, setMusicType] = useState<string>('piano');
  const [tempo, setTempo] = useState<number>(120);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    // 로그아웃 로직
    console.log('로그아웃');
    onClose();
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal__header">
          <h2 className="settings-modal__title">Settings</h2>
          <button className="settings-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="settings-modal__body">
          <aside className="settings-modal__sidebar">
            <button
              className={`settings-modal__menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveMenu('profile')}
            >
              프로필 설정
            </button>
            <button
              className={`settings-modal__menu-item ${activeMenu === 'music' ? 'active' : ''}`}
              onClick={() => setActiveMenu('music')}
            >
              Music Setting
            </button>
          </aside>
          <div className="settings-modal__content">
            {activeMenu === 'profile' && (
              <div className="settings-profile">
                <h3 className="settings-profile__title">프로필 설정</h3>
                <div className="settings-profile__icon-section">
                  <div className="settings-profile__icon-preview">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="settings-profile__icon-image" />
                    ) : (
                      <div className="settings-profile__icon-placeholder">👤</div>
                    )}
                  </div>
                  <label className="settings-profile__icon-button">
                    프로필 아이콘 변경
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div className="settings-profile__info">
                  <div className="settings-profile__info-item">
                    <label className="settings-profile__label">아이디</label>
                    <div className="settings-profile__value">{userId}</div>
                  </div>
                  <div className="settings-profile__info-item">
                    <label className="settings-profile__label">이메일</label>
                    <div className="settings-profile__value">{email}</div>
                  </div>
                </div>
                <button className="settings-profile__logout" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
            {activeMenu === 'music' && (
              <div className="settings-music">
                <h3 className="settings-music__title">Music Setting</h3>
                <div className="settings-music__section">
                  <label className="settings-music__label">음악 종류</label>
                  <select
                    className="settings-music__select"
                    value={musicType}
                    onChange={(e) => setMusicType(e.target.value)}
                  >
                    <option value="piano">피아노</option>
                    <option value="drum">드럼</option>
                    <option value="guitar">기타</option>
                    <option value="violin">바이올린</option>
                  </select>
                </div>
                <div className="settings-music__section">
                  <label className="settings-music__label">
                    기본 템포: {tempo} BPM
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="200"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="settings-music__tempo-slider"
                  />
                  <div className="settings-music__tempo-display">{tempo} BPM</div>
                </div>
                <button className="settings-music__save" onClick={() => console.log('저장')}>
                  저장
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
