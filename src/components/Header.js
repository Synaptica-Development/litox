import React, { useState } from 'react';
import '../styles/Header.css';


const logo = process.env.PUBLIC_URL + '/logoru.svg'

function Header() {
  const [isLargeMenuOpen, setIsLargeMenuOpen] = useState(false);
  const [isSmallMenuOpen, setIsSmallMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header>
        <div className="flex-row">
          <div className="col">
            <div className="left">
              {/* Button for large screens (>1240px) - opens large menu */}
              <div className="open-menu large-menu-trigger" onClick={() => setIsLargeMenuOpen(true)}>
                <div className="burger">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>menu</span>
              </div>

              {/* Button for small screens (<=1240px) - opens small menu */}
              <div className="open-menu small-menu-trigger" onClick={() => setIsSmallMenuOpen(true)}>
                <div className="burger">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>menu</span>
              </div>
              
              <div className={`left-menu large ${isLargeMenuOpen ? 'active' : ''}`}>
                <div className="close-menu" onClick={() => setIsLargeMenuOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <ul className="navbar-mobile__list">
                  <li className="navbar-mobile__item">
                    <a className="navbar-mobile__link" href="#certificates">Certificates and declarations</a>
                  </li>
                  <li className="navbar-mobile__item">
                    <a className="navbar-mobile__link" href="#helpful">Helpful information</a>
                  </li>
                  <li className="navbar-mobile__item">
                    <a className="navbar-mobile__link" href="#reference">Reference objects</a>
                  </li>
                  <li className="navbar-mobile__item">
                    <a className="navbar-mobile__link" href="#news">News</a>
                  </li>
                  <li className="navbar-mobile__item">
                    <a className="navbar-mobile__link" href="#contacts">Contacts</a>
                  </li>
                </ul>
              </div>

              <div className={`left-menu small ${isSmallMenuOpen ? 'active' : ''}`}>
                <div className="close-menu" onClick={() => setIsSmallMenuOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <nav className="top-panel__nav">
                  <ul className="top-panel__list">
                    <li className="top-panel__item">
                      <a className="top-panel__link" href="#tech">Technical Section</a>
                    </li>
                    <li className="top-panel__item">
                      <a className="top-panel__link" href="#marketing">Marketing</a>
                    </li>
                    <li className="top-panel__item">
                      <a className="top-panel__link" href="#dealers">Dealers</a>
                    </li>
                  </ul>
                </nav>
              </div>

              <a href="#contacts" className="contacts">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#aba39e"/>
                </svg>
              </a>
              <a href="tel:88002000166" className="phone">8 800 2000 166</a>
            </div>
          </div>

          <span className="logo">
            <img src={logo} alt="Logo" />
          </span>

          <div className="col">
            <div className="right">
              <ul className="primary-menu">
                <li>
                  <a href="#about">About</a>
                  <ul className="dropdown">
                    <li><a href="#history">History</a></li>
                    <li><a href="#jobs">Jobs</a></li>
                    <li><a href="#testing">Testing center</a></li>
                    <li><a href="#rewards">Rewards</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#cooperation">Cooperation</a>
                </li>
                <li>
                  <a href="#contacts">Contacts</a>
                </li>
                <li>
                  <a href="#products">Products</a>
                  <ul className="dropdown">
                    <li><a href="#plaster">Plaster</a></li>
                    <li><a href="#decorative">Decorative plasters</a></li>
                    <li><a href="#putties">Putties</a></li>
                    <li><a href="#tile">Tile Adhesives</a></li>
                    <li><a href="#assembly">Assembly mixes</a></li>
                    <li><a href="#levelers">Levelers and bulk floors</a></li>
                    <li><a href="#waterproofing">Waterproofing materials</a></li>
                    <li><a href="#repair">Repair mixes</a></li>
                    <li><a href="#paints">Paints</a></li>
                    <li><a href="#primers">Primers</a></li>
                  </ul>
                </li>
              </ul>

              <div className="open-search-popup" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#aba39e" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <ul className="lang">
                <li><a href="#ru">Ru</a></li>
                <li><a href="#en">En</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="search-popup">
          <input type="text" placeholder="Search..." autoFocus />
        </div>
      )}

      {/* Only show overlay on small screens when menu is open */}
      {isSmallMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={() => setIsSmallMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;