import React from 'react';
import '../../style/components/layout/Side.scss';

export type InstrumentType = 'piano' | 'drum' | 'bass' | 'guitar' | 'vocal';

interface SideProps {
  selectedInstrument?: InstrumentType;
  onSelectInstrument?: (instrument: InstrumentType) => void;
}

const instruments = [
  { id: 'piano' as InstrumentType, label: '피아노' },
  { id: 'drum' as InstrumentType, label: '드럼' },
  { id: 'bass' as InstrumentType, label: '베이스' },
  { id: 'guitar' as InstrumentType, label: '기타' },
  { id: 'vocal' as InstrumentType, label: '보컬' },
];

const Side: React.FC<SideProps> = ({ selectedInstrument = 'piano', onSelectInstrument }) => {
  return (
    <aside className="side">
      <div className="side__container">
        <div className="side__section">
          <h2 className="side__title">Menu</h2>
          <ul className="side__menu">
            <li className="side__menu-item">
              <a href="/" className="side__menu-link">Home</a>
            </li>
            <li className="side__menu-item">
              <a href="/admin" className="side__menu-link">관리자 페이지</a>
            </li>
            <li className="side__menu-item">
              <a href="/search" className="side__menu-link">Search</a>
            </li>
            <li className="side__menu-item">
              <a href="/playlists" className="side__menu-link">Playlists</a>
            </li>
            <li className="side__menu-item">
              <a href="/library" className="side__menu-link">Library</a>
            </li>
          </ul>
        </div>

        <div className="side__section side__section--instruments">
          <h2 className="side__title">악기 선택</h2>
          <ul className="side__instruments">
            {instruments.map((instrument) => (
              <li
                key={instrument.id}
                className={`side__instrument ${
                  selectedInstrument === instrument.id ? 'side__instrument--active' : ''
                }`}
                onClick={() => onSelectInstrument?.(instrument.id)}
              >
                <span className="side__instrument-label">{instrument.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Side;
