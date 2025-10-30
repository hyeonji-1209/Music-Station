import React, { useEffect, useState } from 'react';

interface NotificationState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Notification: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (notification.isOpen) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, isOpen: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.isOpen]);

  if (!notification.isOpen) return null;

  const handleClose = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className={`notification notification--${notification.type}`}>
      <div className="notification__content">
        <span className="notification__message">{notification.message}</span>
        <button
          className="notification__close"
          onClick={handleClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};
