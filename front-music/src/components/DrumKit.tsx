import React from 'react';
import '../style/components/DrumKit.scss';

interface DrumKitProps {
  activeDrum?: string;
}

const DrumKit: React.FC<DrumKitProps> = ({ activeDrum }) => {
  return (
    <div className="drumkit">
      <div className="drumkit__container">
        <div className="drumkit__drums">
          {/* Hi-Hat */}
          <div className={`drumkit__drum drumkit__drum--hihat ${activeDrum === 'hihat' ? 'drumkit__drum--active' : ''}`}>
            <div className="drumkit__drum-visual drumkit__drum-visual--hihat"></div>
            <span className="drumkit__drum-label">Hi-Hat</span>
          </div>

          {/* Snare */}
          <div className={`drumkit__drum drumkit__drum--snare ${activeDrum === 'snare' ? 'drumkit__drum--active' : ''}`}>
            <div className="drumkit__drum-visual drumkit__drum-visual--snare"></div>
            <span className="drumkit__drum-label">Snare</span>
          </div>

          {/* Kick */}
          <div className={`drumkit__drum drumkit__drum--kick ${activeDrum === 'kick' ? 'drumkit__drum--active' : ''}`}>
            <div className="drumkit__drum-visual drumkit__drum-visual--kick"></div>
            <span className="drumkit__drum-label">Bass Drum</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrumKit;
