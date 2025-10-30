import React, { useState } from 'react';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import Checkbox from '../../components/ui/Checkbox';
import DeleteModal from '../../components/ui/DeleteModal';
import UserAddModal, { UserFormData } from '../../components/ui/UserAddModal';
import { useTableSelection } from '../../hooks/useTableSelection';
import {
  getPaymentTypeLabel,
  getPaymentMethodLabel,
  getPaymentPeriodLabel,
  getRoleLabel
} from '../../utils/labels';
import { mockUsers, User } from '../../constants/mockData';

const paymentTypeTabs = [
  { id: 'all', label: '전체' },
  { id: 'paid', label: '결제한 사용자' },
  { id: 'basic', label: '베이직' },
  { id: 'premium', label: '프리미엄' },
  { id: 'enterprise', label: '엔터프라이즈' }
].map(tab => ({
  ...tab,
  content: null,
}));

const UserManagement: React.FC = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const filteredUsers = selectedPaymentType === 'all'
    ? mockUsers
    : selectedPaymentType === 'paid'
      ? mockUsers.filter(user => user.paymentMethod !== 'none')
      : mockUsers.filter(user => user.paymentType === selectedPaymentType);

  const {
    selectedIds,
    selectedCount,
    hasSelection,
    isSelected,
    handleSelectAll,
    handleSelectOne,
    clearSelection,
  } = useTableSelection<User>(filteredUsers);

  const handleDeleteClick = () => {
    if (hasSelection) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    // TODO: 실제 삭제 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));

    clearSelection();
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleUserClick = (user: User) => {
    // 결제한 사용자인 경우 결제 관리 페이지로 이동
    if (user.paymentMethod !== 'none') {
      window.open('/admin/payments', '_blank');
    }
  };

  const handleAddUser = async (userData: UserFormData) => {
    setIsAdding(true);
    // TODO: 실제 회원 추가 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('새 회원 추가:', userData);
    setIsAddModalOpen(false);
    setIsAdding(false);
  };

  const columns = [
    {
      key: 'checkbox',
      label: '',
      render: (user: User) => {
        if (!user || !user.id) return null;
        return (
          <span onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected(user.id)}
              onChange={() => handleSelectOne(user.id)}
            />
          </span>
        );
      }
    },
    {
      key: 'id',
      label: 'ID',
      render: (user: User) => user?.id || ''
    },
    {
      key: 'name',
      label: '회원이름',
      render: (user: User) => (
        <span className="user-management__name">
          {user?.name || ''}
        </span>
      )
    },
    {
      key: 'birthDate',
      label: '생년월일',
      render: (user: User) => user?.birthDate || ''
    },
    {
      key: 'email',
      label: '이메일',
      render: (user: User) => user?.email || ''
    },
    {
      key: 'paymentType',
      label: '결제 유형',
      render: (user: User) => {
        if (!user?.paymentType) return '';
        return (
          <span className={`user-management__payment-type user-management__payment-type--${user.paymentType}`}>
            {getPaymentTypeLabel(user.paymentType)}
          </span>
        );
      }
    },
    {
      key: 'paymentMethod',
      label: '결제 방식',
      render: (user: User) => {
        if (!user?.paymentMethod) return '';
        return (
          <span className={`user-management__payment-method user-management__payment-method--${user.paymentMethod}`}>
            {getPaymentMethodLabel(user.paymentMethod)}
          </span>
        );
      }
    },
    {
      key: 'paymentPeriod',
      label: '결제 기간',
      render: (user: User) => user?.paymentPeriod ? getPaymentPeriodLabel(user.paymentPeriod) : ''
    },
    {
      key: 'role',
      label: '역할',
      render: (user: User) => {
        if (!user?.role) return '';
        return (
          <span className={`user-management__role user-management__role--${user.role}`}>
            {getRoleLabel(user.role)}
          </span>
        );
      }
    }
  ];

  const rightActions = (
    <div className="user-management__actions">
      <button
        className="admin-btn admin-btn--primary"
        onClick={() => setIsAddModalOpen(true)}
      >
        회원 추가
      </button>
      <button
        className="admin-btn admin-btn--outline"
        onClick={handleDeleteClick}
        disabled={!hasSelection}
      >
        삭제 ({selectedCount})
      </button>
    </div>
  );

  const selectedUsers = Array.from(selectedIds);
  const selected = mockUsers.filter(u => selectedUsers.includes(u.id));
  const names = selected.map(u => u.name);
  const hasActivePayment = selected
    .filter(u => u.role !== 'admin')
    .some(u => u.paymentMethod && u.paymentMethod !== 'none');

  return (
    <div className="user-management admin-page">
      <AdminPageLayout
        tabs={paymentTypeTabs}
        activeTab={selectedPaymentType}
        onTabChange={setSelectedPaymentType}
        rightActions={rightActions}
        columns={columns}
        data={filteredUsers}
        keyExtractor={(user) => user?.id || 'unknown'}
        onRowClick={handleUserClick}
        showSelectAll={true}
        selectedItems={selectedIds}
        onSelectAll={handleSelectAll}
        emptyMessage="등록된 회원이 없습니다."
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={hasActivePayment ? undefined : handleDeleteConfirmed}
        title={hasActivePayment ? '환불 필요' : '삭제 확인'}
        message={
          hasActivePayment
            ? `${selectedCount}명의 회원을 삭제하기 전에 환불 처리가 필요합니다.`
            : `${selectedCount}명의 회원을 삭제하시겠습니까?`
        }
        items={names}
        customActions={hasActivePayment ? [{
          label: '결제 관리로 이동',
          onClick: () => window.open('/admin/payments', '_blank'),
          variant: 'secondary'
        }] : undefined}
        cancelLabel={hasActivePayment ? '닫기' : '취소'}
        isLoading={isDeleting}
      />

      <UserAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
        loading={isAdding}
      />
    </div>
  );
};

export default UserManagement;
