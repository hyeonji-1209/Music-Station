/**
 * 공통 레이블 변환 유틸리티
 */

// 결제 유형 레이블
export const getPaymentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    basic: '베이직',
    premium: '프리미엄',
    enterprise: '엔터프라이즈'
  };
  return labels[type] || type;
};

// 결제 방식 레이블
export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    card: '카드결제',
    bank_transfer: '계좌이체',
    virtual_account: '가상계좌',
    none: '미결제'
  };
  return labels[method] || method;
};

// 결제 기간 레이블
export const getPaymentPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    '1month': '1개월',
    '3months': '3개월',
    '6months': '6개월',
    '1year': '1년'
  };
  return labels[period] || period;
};

// 결제 상태 레이블
export const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    completed: '완료',
    pending: '대기',
    failed: '실패',
    refunded: '환불'
  };
  return labels[status] || status;
};

// 역할 레이블
export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    user: '일반회원',
    admin: '관리자'
  };
  return labels[role] || role;
};

// 악기 레이블
export const getInstrumentLabel = (instrument: string): string => {
  const labels: Record<string, string> = {
    all: '전체',
    piano: '피아노',
    drum: '드럼',
    bass: '베이스',
    guitar: '기타',
    vocal: '보컬'
  };
  return labels[instrument] || instrument;
};

// 금액 포맷팅
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};
