import React from 'react';

export type AdminMenuType = 'music' | 'users' | 'payments' | 'requests';

interface AdminSideProps {
  selectedMenu?: AdminMenuType;
  onSelectMenu?: (menu: AdminMenuType) => void;
  onLogout?: () => void;
}

const adminMenus = [
  { id: 'music' as AdminMenuType, label: '음악 관리' },
  { id: 'users' as AdminMenuType, label: '회원 관리' },
  { id: 'payments' as AdminMenuType, label: '결제 관리' },
  { id: 'requests' as AdminMenuType, label: '요청 관리' },
];

const AdminSide: React.FC<AdminSideProps> = ({ selectedMenu = 'music', onSelectMenu, onLogout }) => {
  return (
    <aside className="admin-side">
      <div className="admin-side__container">
        <div className="admin-side__section">
          <h2 className="admin-side__title">관리자</h2>
          <ul className="admin-side__menu">
            {adminMenus.map((menu) => (
              <li
                key={menu.id}
                className={`admin-side__menu-item ${selectedMenu === menu.id ? 'admin-side__menu-item--active' : ''}`}
                onClick={() => onSelectMenu?.(menu.id)}
              >
                <span className="admin-side__menu-label">{menu.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-side__footer">
          <button
            type="button"
            className="admin-side__logout"
            onClick={() => {
              if (onLogout) return onLogout();
              // 기본 동작: 홈으로 이동 또는 콘솔 로그아웃
              try {
                window.location.href = '/';
              } catch {
                // noop
              }
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSide;

