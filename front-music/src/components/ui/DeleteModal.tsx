import React, { ReactNode } from 'react';
import Button from './Button';

type DeleteModalAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
};

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;

  // Content
  title?: string;
  message: string;
  icon?: ReactNode;
  items?: string[];
  warning?: string;

  // Actions
  confirmLabel?: string;
  cancelLabel?: string;
  customActions?: DeleteModalAction[];

  // State
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '삭제 확인',
  message,
  icon = '⚠️',
  items,
  warning = '이 작업은 되돌릴 수 없습니다.',
  confirmLabel = '삭제',
  cancelLabel = '취소',
  customActions,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal__header">
          <h3 className="delete-modal__title">{title}</h3>
          <button
            className="delete-modal__close"
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="delete-modal__content">
          {icon && <div className="delete-modal__icon">{icon}</div>}
          <p className="delete-modal__message">{message}</p>
          {items && items.length > 0 && (
            <ul className="delete-modal__list">
              {items.map((item, idx) => (
                <li key={idx} className="delete-modal__list-item">- {item}</li>
              ))}
            </ul>
          )}
          {warning && <p className="delete-modal__warning">{warning}</p>}
        </div>

        <div className="delete-modal__actions">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          {customActions?.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'secondary'}
              onClick={action.onClick}
              disabled={isLoading}
            >
              {action.label}
            </Button>
          ))}

          {onConfirm && (
            <Button
              variant="danger"
              onClick={onConfirm}
              loading={isLoading}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
