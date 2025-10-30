import React, { useState } from 'react';
import { Table, Tabs, Button } from '../../components/index';
import Checkbox from '../../components/ui/Checkbox';
import '../../style/screens/admin/PaymentManagement.scss';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  paymentType: 'basic' | 'premium' | 'enterprise';
  paymentMethod: 'card' | 'bank_transfer' | 'virtual_account';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentDate: string;
  expiryDate: string;
  transactionId: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    userId: '1',
    userName: '김철수',
    userEmail: 'kim@example.com',
    paymentType: 'premium',
    paymentMethod: 'card',
    amount: 15000,
    status: 'completed',
    paymentDate: '2024-01-15',
    expiryDate: '2024-04-15',
    transactionId: 'TXN_001_20240115'
  },
  {
    id: '2',
    userId: '2',
    userName: '이영희',
    userEmail: 'lee@example.com',
    paymentType: 'basic',
    paymentMethod: 'bank_transfer',
    amount: 5000,
    status: 'completed',
    paymentDate: '2024-01-10',
    expiryDate: '2024-02-10',
    transactionId: 'TXN_002_20240110'
  },
  {
    id: '3',
    userId: '3',
    userName: '박민수',
    userEmail: 'park@example.com',
    paymentType: 'enterprise',
    paymentMethod: 'virtual_account',
    amount: 50000,
    status: 'completed',
    paymentDate: '2024-01-05',
    expiryDate: '2025-01-05',
    transactionId: 'TXN_003_20240105'
  },
  {
    id: '4',
    userId: '4',
    userName: '정수진',
    userEmail: 'jung@example.com',
    paymentType: 'premium',
    paymentMethod: 'card',
    amount: 15000,
    status: 'pending',
    paymentDate: '2024-01-20',
    expiryDate: '2024-07-20',
    transactionId: 'TXN_004_20240120'
  },
  {
    id: '5',
    userId: '5',
    userName: '최동현',
    userEmail: 'choi@example.com',
    paymentType: 'basic',
    paymentMethod: 'card',
    amount: 5000,
    status: 'failed',
    paymentDate: '2024-01-18',
    expiryDate: '2024-02-18',
    transactionId: 'TXN_005_20240118'
  }
];

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

const getPaymentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    basic: '베이직',
    premium: '프리미엄',
    enterprise: '엔터프라이즈'
  };
  return labels[type] || type;
};

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    card: '카드결제',
    bank_transfer: '계좌이체',
    virtual_account: '가상계좌'
  };
  return labels[method] || method;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    completed: '완료',
    pending: '대기',
    failed: '실패',
    refunded: '환불'
  };
  return labels[status] || status;
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

const PaymentManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const filteredPayments = selectedStatus === 'all'
    ? mockPayments
    : mockPayments.filter(payment => payment.status === selectedStatus);

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPayments(filteredPayments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleRefund = () => {
    if (selectedPayments.length > 0) {
      // 환불 로직
      console.log('환불할 결제:', selectedPayments);
      alert(`${selectedPayments.length}건의 결제를 환불 처리합니다.`);
      setSelectedPayments([]);
    }
  };

  // 내보내기 기능은 제거되었습니다

  const columns = [
    {
      key: 'checkbox',
      label: '',
      width: '50px',
      align: 'center' as const,
      render: (payment: Payment) => (
        <span onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedPayments.includes(payment.id)}
            onChange={() => handleSelectPayment(payment.id)}
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
          {getStatusLabel(payment.status)}
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
    <div className="payment-management__actions admin-actions">
      <button
        className="admin-btn admin-btn--danger"
        onClick={handleRefund}
        disabled={selectedPayments.length === 0}
      >
        환불 처리
      </button>
    </div>
  );

  return (
    <div className="payment-management">
      <div className="payment-management__tabs">
        <Tabs
          items={statusTabs}
          activeTab={selectedStatus}
          onChange={setSelectedStatus}
          rightActions={rightActions}
        />
      </div>

      <div className="payment-management__table">
        <Table
          columns={columns}
          data={filteredPayments}
          keyExtractor={(payment) => payment?.id || 'unknown'}
          onSelectAll={handleSelectAll}
          isAllSelected={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
          showSelectAll={true}
          emptyMessage="결제 내역이 없습니다."
        />
      </div>
    </div>
  );
};

export default PaymentManagement;
