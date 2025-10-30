import React, { ReactNode } from 'react';
import '../../style/components/ui/Button.scss';

export interface ButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left',
  loading = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full-width' : ''
        } ${disabled ? 'btn--disabled' : ''} ${loading ? 'btn--loading' : ''} ${className}`}
    >
      {loading ? (
        <span className="btn__spinner"></span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn__icon btn__icon--left">{icon}</span>
          )}
          <span className="btn__content">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="btn__icon btn__icon--right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}

export default Button;

