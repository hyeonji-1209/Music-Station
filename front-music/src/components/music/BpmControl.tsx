import React from 'react';

interface BpmControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

const BpmControl: React.FC<BpmControlProps> = ({ bpm, onBpmChange }) => {
  return (
    <div className="home__bpm-selector">
      <label className="home__label">
        BPM: {bpm}
        <div className="home__bpm-control">
          <input
            type="range"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="home__bpm-slider"
          />
          <input
            type="number"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="home__bpm-input"
          />
        </div>
      </label>
    </div>
  );
};

export default BpmControl;
