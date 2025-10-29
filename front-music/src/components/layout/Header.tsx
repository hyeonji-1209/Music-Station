import React from 'react';
import '../../style/components/layout/Header.scss';

interface HeaderProps {
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">Music Station</h1>
        <div className="header__right">
          <nav className="header__nav">
            <a href="/" className="header__nav-item">Home</a>
            <a href="/search" className="header__nav-item">Search</a>
            <a href="/library" className="header__nav-item">Library</a>
          </nav>
          <button className="header__profile" onClick={onProfileClick} aria-label="Profile">
            <span className="header__profile-icon">👤</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;