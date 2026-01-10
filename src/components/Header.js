import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const logo = process.env.PUBLIC_URL + '/logoru.svg';

function Header() {
  const [isLargeMenuOpen, setIsLargeMenuOpen] = useState(false);
  const [isSmallMenuOpen, setIsSmallMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });
  const [categories, setCategories] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  // Set default language to Georgian if not already set
useEffect(() => {
  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'ka');
  }
}, []);

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
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  // Handle category click - goes to AllProducts with filter
  const handleCategoryClick = (categoryId) => {
    setIsSmallMenuOpen(false);
    setIsLargeMenuOpen(false);
    navigate(`/products?category=${categoryId}`);
  };

  // Toggle submenu
  const toggleSubmenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  // Get menu text based on language
  const getMenuText = () => {
    switch(language) {
      case 'ka': return 'მენიუ';
      case 'en': return 'menu';
      case 'ru': return 'меню';
      default: return 'menu';
    }
  };

  // Translation function for menu items
  const translate = (key) => {
    const translations = {
      home: {
        ka: 'მთავარი',
        en: 'HOME',
        ru: 'ГЛАВНАЯ'
      },
      about: {
        ka: 'ჩვენს შესახებ',
        en: 'ABOUT',
        ru: 'О НАС'
      },
      cooperation: {
        ka: 'თანამშრომლობა',
        en: 'COOPERATION',
        ru: 'СОТРУДНИЧЕСТВО'
      },
      contacts: {
        ka: 'კონტაქტი',
        en: 'CONTACTS',
        ru: 'КОНТАКТЫ'
      },
      products: {
        ka: 'პროდუქტები',
        en: 'PRODUCTS',
        ru: 'ПРОДУКТЫ'
      },
      certificates: {
        ka: 'სერტიფიკატები და დეკლარაციები',
        en: 'CERTIFICATES AND DECLARATIONS',
        ru: 'СЕРТИФИКАТЫ И ДЕКЛАРАЦИИ'
      },
      helpful: {
        ka: 'სასარგებლო ინფორმაცია',
        en: 'HELPFUL INFORMATION',
        ru: 'ПОЛЕЗНАЯ ИНФОРМАЦИЯ'
      },
      reference: {
        ka: 'საცნობარო ობიექტები',
        en: 'REFERENCE OBJECTS',
        ru: 'СПРАВОЧНЫЕ ОБЪЕКТЫ'
      },
      news: {
        ka: 'სიახლეები',
        en: 'NEWS',
        ru: 'НОВОСТИ'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

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
                <span>{getMenuText()}</span>
              </div>

              {/* Small screen menu trigger */}
              <div className="open-menu small-menu-trigger" onClick={() => setIsSmallMenuOpen(true)}>
                <div className="burger">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>{getMenuText()}</span>
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
                        {translate('home')}
                      </Link>
                    </li>

                    {/* About */}
                    <li className="mobile-nav__item">
                      <Link 
                        className="mobile-nav__link" 
                        to="/about" 
                        onClick={() => setIsSmallMenuOpen(false)}
                      >
                        {translate('about')}
                      </Link>
                    </li>

                    {/* Contacts */}
                    <li className="mobile-nav__item">
                      <Link 
                        className="mobile-nav__link" 
                        to="/contacts"
                        onClick={() => setIsSmallMenuOpen(false)}
                      >
                        {translate('contacts')}
                      </Link>
                    </li>

                    {/* Products with categories */}
                    <li className="mobile-nav__item">
                      <div className="mobile-nav__link-wrapper">
                        <Link 
                          className="mobile-nav__link" 
                          to="/products2"
                          onClick={() => setIsSmallMenuOpen(false)}
                        >
                          {translate('products')}
                        </Link>
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

                    {/* Language switcher - THREE LANGUAGES */}
                    <li className="mobile-nav__item mobile-lang">
                      <a 
                        href="#" 
                        className={`mobile-nav__link ${language === 'ka' ? 'active-lang' : ''}`}
                        style={{ 
                          color: language === 'ka' ? '#ff6b00' : '#aba39e',
                          fontWeight: language === 'ka' ? 'bold' : 'normal'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange('ka');
                        }}
                      >
                        {language === 'ka' && '✓ '}ge
                      </a>
                      <span className="lang-divider">|</span>
                      <a 
                        href="#" 
                        className={`mobile-nav__link ${language === 'en' ? 'active-lang' : ''}`}
                        style={{ 
                          color: language === 'en' ? '#ff6b00' : '#aba39e',
                          fontWeight: language === 'en' ? 'bold' : 'normal'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange('en');
                        }}
                      >
                        {language === 'en' && '✓ '}EN
                      </a>
                      <span className="lang-divider">|</span>
                      <a 
                        href="#" 
                        className={`mobile-nav__link ${language === 'ru' ? 'active-lang' : ''}`}
                        style={{ 
                          color: language === 'ru' ? '#ff6b00' : '#aba39e',
                          fontWeight: language === 'ru' ? 'bold' : 'normal'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange('ru');
                        }}
                      >
                        {language === 'ru' && '✓ '}РУ
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <Link to="/contacts" className="contacts">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#aba39e"/>
                </svg>
              </Link>
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
                  <Link to="/about">{translate('about')}</Link>
                </li>
                <li>
                  <Link to="/contacts">{translate('contacts')}</Link>
                </li>
                <li>
                  <Link to="/products2">{translate('products')}</Link>
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

              {/* Desktop language switcher - THREE LANGUAGES */}
              <ul className="lang desktop-only">
                <li>
                  <a 
                    href="#" 
                    className={language === 'ka' ? 'active' : ''}
                    style={{ 
                      color: language === 'ka' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'ka' ? 'bold' : 'normal'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('ka');
                    }}
                  >
                    {language === 'ka' && '✓ '}ge
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={language === 'en' ? 'active' : ''}
                    style={{ 
                      color: language === 'en' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'en' ? 'bold' : 'normal'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('en');
                    }}
                  >
                    {language === 'en' && '✓ '}EN
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={language === 'ru' ? 'active' : ''}
                    style={{ 
                      color: language === 'ru' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'ru' ? 'bold' : 'normal'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('ru');
                    }}
                  >
                    {language === 'ru' && '✓ '}RU
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