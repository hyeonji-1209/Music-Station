import React from 'react';
import Button from './Button';
import '../../style/components/ui/DeleteModal.scss';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemCount?: number;
  itemName?: string;
  isLoading?: boolean;
  items?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  hideConfirm?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '삭제 확인',
  message,
  itemCount = 1,
  itemName = '항목',
  isLoading = false,
  items,
  confirmLabel = '삭제',
  cancelLabel = '취소',
  secondaryActionLabel,
  onSecondaryAction,
  hideConfirm = false
}) => {
  if (!isOpen) return null;

  const defaultMessage = itemCount > 1
    ? `${itemCount}개의 ${itemName}을(를) 삭제하시겠습니까?`
    : `${itemName}을(를) 삭제하시겠습니까?`;

  const displayMessage = message || defaultMessage;

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
          <div className="delete-modal__icon">⚠️</div>
          <p className="delete-modal__message">{displayMessage}</p>
          {items && items.length > 0 && (
            <ul className="delete-modal__list">
              {items.map((it, idx) => (
                <li key={idx} className="delete-modal__list-item">- {it}</li>
              ))}
            </ul>
          )}
          <p className="delete-modal__warning">
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="delete-modal__actions">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="secondary"
              onClick={onSecondaryAction}
              disabled={isLoading}
            >
              {secondaryActionLabel}
            </Button>
          )}
          {!hideConfirm && (
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