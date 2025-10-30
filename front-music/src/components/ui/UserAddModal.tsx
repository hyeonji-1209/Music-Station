import React, { useState } from 'react';
import Button from './Button';

export interface UserFormData {
  name: string;
  birthDate: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  paymentType: 'basic' | 'premium' | 'enterprise';
  paymentMethod: 'card' | 'bank_transfer' | 'virtual_account' | 'none';
  paymentPeriod: '1month' | '3months' | '6months' | '1year';
}

interface UserAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: UserFormData) => void;
  loading?: boolean;
}

const UserAddModal: React.FC<UserAddModalProps> = ({
  isOpen,
  onClose,
  onAddUser,
  loading = false,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    birthDate: '',
    email: '',
    password: '',
    role: 'user',
    paymentType: 'basic',
    paymentMethod: 'none',
    paymentPeriod: '1month',
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddUser(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      birthDate: '',
      email: '',
      password: '',
      role: 'user',
      paymentType: 'basic',
      paymentMethod: 'none',
      paymentPeriod: '1month',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="user-add-modal-overlay">
      <div className="user-add-modal">
        <div className="user-add-modal__header">
          <h2>회원 추가</h2>
          <button
            className="user-add-modal__close"
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-add-modal__form">
          <div className="user-add-modal__field">
            <label htmlFor="name">이름 *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'error' : ''}
              disabled={loading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="birthDate">생년월일 *</label>
            <input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className={errors.birthDate ? 'error' : ''}
              disabled={loading}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="email">이메일 *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="password">비밀번호 *</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="role">역할 *</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as 'user' | 'admin')}
              disabled={loading}
            >
              <option value="user">일반회원</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="paymentType">결제 유형 *</label>
            <select
              id="paymentType"
              value={formData.paymentType}
              onChange={(e) => handleInputChange('paymentType', e.target.value as 'basic' | 'premium' | 'enterprise')}
              disabled={loading}
            >
              <option value="basic">베이직</option>
              <option value="premium">프리미엄</option>
              <option value="enterprise">엔터프라이즈</option>
            </select>
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="paymentMethod">결제 방식 *</label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'card' | 'bank_transfer' | 'virtual_account' | 'none')}
              disabled={loading}
            >
              <option value="none">미결제</option>
              <option value="card">카드결제</option>
              <option value="bank_transfer">계좌이체</option>
              <option value="virtual_account">가상계좌</option>
            </select>
          </div>

          <div className="user-add-modal__field">
            <label htmlFor="paymentPeriod">결제 기간 *</label>
            <select
              id="paymentPeriod"
              value={formData.paymentPeriod}
              onChange={(e) => handleInputChange('paymentPeriod', e.target.value as '1month' | '3months' | '6months' | '1year')}
              disabled={loading}
            >
              <option value="1month">1개월</option>
              <option value="3months">3개월</option>
              <option value="6months">6개월</option>
              <option value="1year">1년</option>
            </select>
          </div>

          <div className="user-add-modal__actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              추가
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAddModal;
