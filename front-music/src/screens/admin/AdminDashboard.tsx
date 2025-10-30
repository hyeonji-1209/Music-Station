import React, { useState } from 'react';
import { AdminSide, type AdminMenuType } from '../../components';
import MusicManagement from './MusicManagement';
import UserManagement from './UserManagement';
import PaymentManagement from './PaymentManagement';

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<AdminMenuType>('music');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'music':
        return <MusicManagement />;
      case 'users':
        return <UserManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'requests':
        return <div className="admin-dashboard__placeholder">요청 관리 (구현 예정)</div>;
      default:
        return <MusicManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSide
        selectedMenu={selectedMenu}
        onSelectMenu={setSelectedMenu}
      />
      <div className="admin-dashboard__content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;