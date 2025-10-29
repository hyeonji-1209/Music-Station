import React from 'react';
import '../../style/components/layout/Side.scss';

const Side: React.FC = () => {
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
      </div>
    </aside>
  );
};

export default Side;
