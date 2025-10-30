import React from 'react';

export type KeyType = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

interface KeySelectorProps {
  selectedKey: KeyType;
  onKeyChange: (key: KeyType) => void;
}

const KeySelector: React.FC<KeySelectorProps> = ({ selectedKey, onKeyChange }) => {
  return (
    <div className="home__key-selector">
      <label className="home__label">
        조성:
        <select
          className="home__select"
          value={selectedKey}
          onChange={(e) => onKeyChange(e.target.value as KeyType)}
        >
          <option value="C">C (도)</option>
          <option value="D">D (레)</option>
          <option value="E">E (미)</option>
          <option value="F">F (파)</option>
          <option value="G">G (솔)</option>
          <option value="A">A (라)</option>
          <option value="B">B (시)</option>
        </select>
      </label>
    </div>
  );
};

export default KeySelector;
