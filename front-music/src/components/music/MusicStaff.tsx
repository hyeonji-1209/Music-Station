import React from 'react';

interface MusicStaffProps {
  loadingMessage?: string;
}

const MusicStaff: React.FC<MusicStaffProps> = ({ loadingMessage = '악보를 로딩 중...' }) => {
  return (
    <div className="musical-staff">
      <div id="osmd-container">
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          {loadingMessage}
        </p>
      </div>
    </div>
  );
};

export default MusicStaff;
