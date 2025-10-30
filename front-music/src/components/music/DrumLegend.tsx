import React from 'react';

const DrumLegend: React.FC = () => {
  return (
    <div className="home__drum-legend">
      <h3>드럼 악보 기호</h3>
      <div className="home__drum-legend-items">
        <div className="home__drum-legend-item">
          <span className="home__drum-legend-symbol">C (X)</span>
          <span className="home__drum-legend-label">Bass Drum</span>
        </div>
        <div className="home__drum-legend-item">
          <span className="home__drum-legend-symbol">E (○)</span>
          <span className="home__drum-legend-label">Snare</span>
        </div>
        <div className="home__drum-legend-item">
          <span className="home__drum-legend-symbol">G (X)</span>
          <span className="home__drum-legend-label">Hi-Hat</span>
        </div>
      </div>
    </div>
  );
};

export default DrumLegend;
