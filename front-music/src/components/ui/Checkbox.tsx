import React from 'react';
import '../../style/components/ui/Checkbox.scss';

export interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

function Checkbox({
  id,
  name,
  checked,
  defaultChecked,
  disabled = false,
  label,
  onChange,
  className = '',
  size = 'medium',
}: CheckboxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(event.target.checked, event);
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label className={`checkbox-wrapper ${className} checkbox-wrapper--${size}`}>
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        className="checkbox-wrapper__input"
      />
      <span className="checkbox-wrapper__checkmark" />
      {label && (
        <span className="checkbox-wrapper__label">{label}</span>
      )}
    </label>
  );
}

export default Checkbox;

