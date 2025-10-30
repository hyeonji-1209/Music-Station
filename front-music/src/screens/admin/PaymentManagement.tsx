import React, { useState } from 'react';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import Checkbox from '../../components/ui/Checkbox';
import { useTableSelection } from '../../hooks/useTableSelection';
import {
  getPaymentTypeLabel,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  formatAmount
} from '../../utils/labels';
import { mockPayments, Payment } from '../../constants/mockData';

const statusTabs = [
  { id: 'all', label: '전체' },
  { id: 'completed', label: '완료' },
  { id: 'pending', label: '대기' },
  { id: 'failed', label: '실패' },
  { id: 'refunded', label: '환불' }
].map(tab => ({
  ...tab,
  content: null,
}));

const PaymentManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredPayments = selectedStatus === 'all'
    ? mockPayments
    : mockPayments.filter(payment => payment.status === selectedStatus);

  const {
    selectedIds,
    selectedCount,
    hasSelection,
    isSelected,
    handleSelectAll,
    handleSelectOne,
    clearSelection,
  } = useTableSelection<Payment>(filteredPayments);

  const handleRefund = () => {
    if (hasSelection) {
      console.log('환불할 결제:', Array.from(selectedIds));
      alert(`${selectedCount}건의 결제를 환불 처리합니다.`);
      clearSelection();
    }
  };

  const columns = [
    {
      key: 'checkbox',
      label: '',
      width: '50px',
      align: 'center' as const,
      render: (payment: Payment) => (
        <span onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected(payment.id)}
            onChange={() => handleSelectOne(payment.id)}
          />
        </span>
      ),
    },
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      align: 'center' as const,
    },
    {
      key: 'userName',
      label: '회원명',
      width: '120px',
    },
    {
      key: 'userEmail',
      label: '이메일',
      width: '200px',
    },
    {
      key: 'paymentType',
      label: '결제 유형',
      width: '100px',
      align: 'center' as const,
      render: (payment: Payment) => (
        <span className={`payment-management__payment-type payment-management__payment-type--${payment.paymentType}`}>
          {getPaymentTypeLabel(payment.paymentType)}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: '결제 방식',
      width: '100px',
      align: 'center' as const,
      render: (payment: Payment) => (
        <span className={`payment-management__payment-method payment-management__payment-method--${payment.paymentMethod}`}>
          {getPaymentMethodLabel(payment.paymentMethod)}
        </span>
      ),
    },
    {
      key: 'amount',
      label: '금액',
      width: '120px',
      align: 'right' as const,
      render: (payment: Payment) => formatAmount(payment.amount),
    },
    {
      key: 'status',
      label: '상태',
      width: '80px',
      align: 'center' as const,
      render: (payment: Payment) => (
        <span className={`payment-management__status payment-management__status--${payment.status}`}>
          {getPaymentStatusLabel(payment.status)}
        </span>
      ),
    },
    {
      key: 'paymentDate',
      label: '결제일',
      width: '120px',
      align: 'center' as const,
    },
    {
      key: 'expiryDate',
      label: '만료일',
      width: '120px',
      align: 'center' as const,
    },
    {
      key: 'transactionId',
      label: '거래ID',
      width: '150px',
    },
  ];

  const rightActions = (
    <div className="payment-management__actions">
      <button
        className="admin-btn admin-btn--danger"
        onClick={handleRefund}
        disabled={!hasSelection}
      >
        환불 처리
      </button>
    </div>
  );

  return (
    <div className="payment-management admin-page">
      <AdminPageLayout
        tabs={statusTabs}
        activeTab={selectedStatus}
        onTabChange={setSelectedStatus}
        rightActions={rightActions}
        columns={columns}
        data={filteredPayments}
        keyExtractor={(payment) => payment?.id || 'unknown'}
        showSelectAll={true}
        selectedItems={selectedIds}
        onSelectAll={handleSelectAll}
        emptyMessage="결제 내역이 없습니다."
      />
    </div>
  );
};

export default PaymentManagement;
