import { MusicInstrument } from '../screens/admin/MusicManagement';

// User Management Mock Data
export interface User {
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

export const mockUsers: User[] = [
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

// Payment Management Mock Data
export interface Payment {
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

export const mockPayments: Payment[] = [
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

// Music Management Mock Data
export interface MusicItem {
  id: number;
  instrument: MusicInstrument;
  artist: string;
  title: string;
  musicXmlUrl: string;
}

export const mockMusicData: Record<MusicInstrument, MusicItem[]> = {
  all: [
    { id: 1, instrument: 'piano', artist: '바하', title: '평균율 클라비어곡집', musicXmlUrl: '/musicxml/twinkle.xml' },
    { id: 2, instrument: 'drum', artist: '드럼 마스터', title: '기본 드럼 리듬', musicXmlUrl: '/musicxml/drum.xml' },
    { id: 3, instrument: 'piano', artist: '모차르트', title: '피아노 소나타', musicXmlUrl: '/musicxml/twinkle.xml' },
    { id: 4, instrument: 'guitar', artist: '기타리스트', title: '기타 연주곡', musicXmlUrl: '/musicxml/twinkle.xml' },
  ],
  piano: [
    { id: 1, instrument: 'piano', artist: '바하', title: '평균율 클라비어곡집', musicXmlUrl: '/musicxml/twinkle.xml' },
    { id: 3, instrument: 'piano', artist: '모차르트', title: '피아노 소나타', musicXmlUrl: '/musicxml/twinkle.xml' },
  ],
  drum: [
    { id: 2, instrument: 'drum', artist: '드럼 마스터', title: '기본 드럼 리듬', musicXmlUrl: '/musicxml/drum.xml' },
  ],
  bass: [],
  guitar: [
    { id: 4, instrument: 'guitar', artist: '기타리스트', title: '기타 연주곡', musicXmlUrl: '/musicxml/twinkle.xml' },
  ],
  vocal: [],
};
