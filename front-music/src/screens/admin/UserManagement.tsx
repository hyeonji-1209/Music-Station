import React, { useState } from 'react';
import { Tabs, Table, Button } from '../../components/index';
import Checkbox from '../../components/ui/Checkbox';
import DeleteModal from '../../components/ui/DeleteModal';
import UserAddModal, { UserFormData } from '../../components/ui/UserAddModal';
import '../../style/screens/admin/UserManagement.scss';

interface User {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  paymentType: 'basic' | 'premium' | 'enterprise';
  paymentMethod: 'card' | 'bank_transfer' | 'virtual_account' | 'none';
  paymentPeriod: '1month' | '3months' | '6months' | '1year';
  role: 'user' | 'admin';
  joinDate: string;
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: '김철수',
    birthDate: '1990-05-15',
    email: 'kim@example.com',
    paymentType: 'premium',
    paymentMethod: 'card',
    paymentPeriod: '3months',
    role: 'user',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: '이영희',
    birthDate: '1985-12-03',
    email: 'lee@example.com',
    paymentType: 'basic',
    paymentMethod: 'bank_transfer',
    paymentPeriod: '1month',
    role: 'user',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    name: '박민수',
    birthDate: '1992-08-22',
    email: 'park@example.com',
    paymentType: 'enterprise',
    paymentMethod: 'virtual_account',
    paymentPeriod: '1year',
    role: 'admin',
    joinDate: '2023-12-01',
    lastLogin: '2024-01-20'
  },
  {
    id: '4',
    name: '정수진',
    birthDate: '1988-03-10',
    email: 'jung@example.com',
    paymentType: 'premium',
    paymentMethod: 'card',
    paymentPeriod: '6months',
    role: 'user',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-18'
  }
];

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

const getPaymentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    basic: '베이직',
    premium: '프리미엄',
    enterprise: '엔터프라이즈'
  };
  return labels[type] || type;
};

const getPaymentPeriodLabel = (period: string) => {
  const labels: Record<string, string> = {
    '1month': '1개월',
    '3months': '3개월',
    '6months': '6개월',
    '1year': '1년'
  };
  return labels[period] || period;
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    user: '일반회원',
    admin: '관리자'
  };
  return labels[role] || role;
};

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    card: '카드결제',
    bank_transfer: '계좌이체',
    virtual_account: '가상계좌',
    none: '미결제'
  };
  return labels[method] || method;
};

const UserManagement: React.FC = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const filteredUsers = selectedPaymentType === 'all'
    ? mockUsers
    : selectedPaymentType === 'paid'
      ? mockUsers.filter(user => user.paymentMethod !== 'none')
      : mockUsers.filter(user => user.paymentType === selectedPaymentType);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(filteredUsers.filter(user => user?.id).map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedUsers.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    // TODO: 실제 삭제 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 삭제된 사용자들을 목록에서 제거
    setSelectedUsers([]);
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
              checked={selectedUsers.includes(user.id)}
              onChange={() => handleSelectUser(user.id)}
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
    <div className="user-management__actions admin-actions">
      <button
        className="admin-btn admin-btn--primary"
        onClick={() => setIsAddModalOpen(true)}
      >
        회원 추가
      </button>
      <button
        className="admin-btn admin-btn--outline"
        onClick={handleDeleteClick}
        disabled={selectedUsers.length === 0}
      >
        삭제 ({selectedUsers.length})
      </button>
    </div>
  );

  return (
    <div className="user-management">
      <div className="user-management__tabs">
        <Tabs
          items={paymentTypeTabs}
          activeTab={selectedPaymentType}
          onChange={setSelectedPaymentType}
          rightActions={rightActions}
        />
      </div>

      <div className="user-management__table">
        <Table
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user?.id || 'unknown'}
          onRowClick={handleUserClick}
          onSelectAll={handleSelectAll}
          isAllSelected={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
          showSelectAll={true}
          emptyMessage="등록된 회원이 없습니다."
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        itemCount={selectedUsers.length}
        itemName="회원"
        {...(function () {
          const selected = mockUsers.filter(u => selectedUsers.includes(u.id));
          const names = selected.map(u => u.name);
          // 관리자(role==='admin')는 결제 대상에서 제외
          const hasActivePayment = selected
            .filter(u => u.role !== 'admin')
            .some(u => u.paymentMethod && u.paymentMethod !== 'none');
          if (hasActivePayment) {
            return {
              title: '환불 필요',
              message: `${selectedUsers.length}명의 회원을 삭제하기 전에 환불 처리가 필요합니다.`,
              items: names,
              hideConfirm: true,
              secondaryActionLabel: '결제 관리로 이동',
              onSecondaryAction: () => window.open('/admin/payments', '_blank'),
              cancelLabel: '닫기',
            };
          }
          return {
            title: '삭제 확인',
            message: `${selectedUsers.length}명의 회원을 삭제하시겠습니까?`,
            items: names,
            confirmLabel: '삭제',
            cancelLabel: '취소',
          };
        })()}
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
