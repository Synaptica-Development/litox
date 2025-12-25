import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const logo = process.env.PUBLIC_URL + '/logoru.svg';

function Header() {
  const [isLargeMenuOpen, setIsLargeMenuOpen] = useState(false);
  const [isSmallMenuOpen, setIsSmallMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState('ka');
  const [categories, setCategories] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, [language]);

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setIsSmallMenuOpen(false);
    setIsLargeMenuOpen(false);
    navigate(`/products?category=${categoryId}`);
  };

  // Toggle submenu
  const toggleSubmenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <>
      <header>
        <div className="flex-row">
          <div className="col">
            <div className="left">
              {/* Large screen menu trigger */}
              <div className="open-menu large-menu-trigger" onClick={() => setIsLargeMenuOpen(true)}>
                <div className="burger">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>menu</span>
              </div>

              {/* Small screen menu trigger */}
              <div className="open-menu small-menu-trigger" onClick={() => setIsSmallMenuOpen(true)}>
                <div className="burger">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>menu</span>
              </div>

              {/* Large screen menu */}
              <div className={`left-menu large ${isLargeMenuOpen ? 'active' : ''}`}>
                <div className="close-menu" onClick={() => setIsLargeMenuOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <ul className="navbar-mobile__list">
                  <li className="navbar-mobile__item">
                    <Link className="navbar-mobile__link" to="/" onClick={() => setIsLargeMenuOpen(false)}>Home</Link>
                  </li>
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

              {/* Small screen mobile menu */}
              <div className={`left-menu small ${isSmallMenuOpen ? 'active' : ''}`}>
                <div className="close-menu" onClick={() => setIsSmallMenuOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                <nav className="mobile-nav">
                  <ul className="mobile-nav__list">
                    {/* Home */}
                    <li className="mobile-nav__item">
                      <Link 
                        className="mobile-nav__link" 
                        to="/" 
                        onClick={() => setIsSmallMenuOpen(false)}
                      >
                        HOME
                      </Link>
                    </li>

                    {/* About with submenu */}
                    <li className="mobile-nav__item">
                      <div className="mobile-nav__link-wrapper">
                        <a className="mobile-nav__link" href="#about">ABOUT</a>
                        <button 
                          className="submenu-toggle"
                          onClick={() => toggleSubmenu('about')}
                        >
                          {expandedMenu === 'about' ? '−' : '+'}
                        </button>
                      </div>
                      <ul className={`mobile-submenu ${expandedMenu === 'about' ? 'active' : ''}`}>
                        <li><a href="#history">History</a></li>
                        <li><a href="#jobs">Jobs</a></li>
                        <li><a href="#testing">Testing center</a></li>
                        <li><a href="#rewards">Rewards</a></li>
                      </ul>
                    </li>

                    {/* Cooperation */}
                    <li className="mobile-nav__item">
                      <a className="mobile-nav__link" href="#cooperation">COOPERATION</a>
                    </li>

                    {/* Contacts */}
                    <li className="mobile-nav__item">
                      <a className="mobile-nav__link" href="#contacts">CONTACTS</a>
                    </li>

                    {/* Products with categories */}
                    <li className="mobile-nav__item">
                      <div className="mobile-nav__link-wrapper">
                        <Link className="mobile-nav__link" to="/products">PRODUCTS</Link>
                        <button 
                          className="submenu-toggle"
                          onClick={() => toggleSubmenu('products')}
                        >
                          {expandedMenu === 'products' ? '−' : '+'}
                        </button>
                      </div>
                      <ul className={`mobile-submenu ${expandedMenu === 'products' ? 'active' : ''}`}>
                        {categories.map((category) => (
                          <li key={category.id}>
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(category.id);
                              }}
                            >
                              {category.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Language switcher */}
                    <li className="mobile-nav__item mobile-lang">
                      <a 
                        href="#" 
                        className={`mobile-nav__link ${language === 'ka' ? 'active-lang' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange('ka');
                        }}
                      >
                        ქარ
                      </a>
                      <span className="lang-divider">|</span>
                      <a 
                        href="#" 
                        className={`mobile-nav__link ${language === 'en' ? 'active-lang' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange('en');
                        }}
                      >
                        EN
                      </a>
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

          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
          </Link>

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
                  <Link to="/products">Products</Link>
                  <ul className="dropdown">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryClick(category.id);
                          }}
                        >
                          {category.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>

              {/* Hide search on mobile */}
              <div className="open-search-popup desktop-only" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#aba39e" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <ul className="lang desktop-only">
                <li>
                  <a 
                    href="#" 
                    className={language === 'ka' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('ka');
                    }}
                  >
                    ქარ
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={language === 'en' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('en');
                    }}
                  >
                    En
                  </a>
                </li>
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

      {/* Overlay for mobile menu */}
      {(isSmallMenuOpen || isLargeMenuOpen) && (
        <div 
          className="menu-overlay" 
          onClick={() => {
            setIsSmallMenuOpen(false);
            setIsLargeMenuOpen(false);
          }}
        />
      )}
    </>
  );
}

export default Header;