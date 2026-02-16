import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const search = process.env.PUBLIC_URL + '/search.svg';
const logo = process.env.PUBLIC_URL + '/logo.svg';
const API_BASE_URL = 'https://api.litox.ge';

function Header() {
  const [isLargeMenuOpen, setIsLargeMenuOpen] = useState(false);
  const [isSmallMenuOpen, setIsSmallMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });
  const [categories, setCategories] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
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
        const response = await fetch(`${API_BASE_URL}/api/Category/categories`, {
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

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Search function with debouncing
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Products/products?SearchText=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Search results:', data);
          setSearchResults(data);
        }
      } catch (err) {
        console.error('Error searching products:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, language]);

  // Handle language change
  const handleLanguageChange = (lang) => {
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  // Toggle submenu
  const toggleSubmenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  // Get menu text based on language
  const getMenuText = () => {
    switch(language) {
      case 'ka': return 'მენიუ';
      case 'en': return 'Menu';
      case 'ru': return 'Меню';
      default: return 'Menu';
    }
  };

  // Translation function for menu items
  const translate = (key) => {
    const translations = {
      home: {
        ka: 'მთავარი',
        en: 'Home',
        ru: 'Главная'
      },
      about: {
        ka: 'ჩვენ შესახებ',
        en: 'About',
        ru: 'О нас'
      },
      cooperation: {
        ka: 'თანამშრომლობა',
        en: 'Cooperation',
        ru: 'Сотрудничество'
      },
      contacts: {
        ka: 'კონტაქტი',
        en: 'Contacts',
        ru: 'Контакты'
      },
      products: {
        ka: 'პროდუქტები',
        en: 'Products',
        ru: 'Продукты'
      },
      search: {
        ka: 'ძებნა',
        en: 'Search',
        ru: 'Поиск'
      },
      searchPlaceholder: {
        ka: 'მოძებნეთ პროდუქტები...',
        en: 'Search products...',
        ru: 'Поиск продуктов...'
      },
      noResults: {
        ka: 'შედეგები არ მოიძებნა',
        en: 'No results found',
        ru: 'Результаты не найдены'
      },
      searching: {
        ka: 'ძებნა...',
        en: 'Searching...',
        ru: 'Поиск...'
      },
      openMenu: {
        ka: 'მენიუს გახსნა',
        en: 'Open menu',
        ru: 'Открыть меню'
      },
      closeMenu: {
        ka: 'მენიუს დახურვა',
        en: 'Close menu',
        ru: 'Закрыть меню'
      },
      openSearch: {
        ka: 'ძებნის გახსნა',
        en: 'Open search',
        ru: 'Открыть поиск'
      },
      closeSearch: {
        ka: 'ძებნის დახურვა',
        en: 'Close search',
        ru: 'Закрыть поиск'
      },
      mainNavigation: {
        ka: 'მთავარი ნავიგაცია',
        en: 'Main navigation',
        ru: 'Основная навигация'
      },
      mobileNavigation: {
        ka: 'მობილური ნავიგაცია',
        en: 'Mobile navigation',
        ru: 'Мобильная навигация'
      },
      languageSelector: {
        ka: 'ენის არჩევა',
        en: 'Language selector',
        ru: 'Выбор языка'
      },
      changeLanguage: {
        ka: 'ენის შეცვლა',
        en: 'Change language to',
        ru: 'Изменить язык на'
      },
      currentLanguage: {
        ka: 'მიმდინარე ენა',
        en: 'Current language',
        ru: 'Текущий язык'
      },
      submenuToggle: {
        ka: 'ქვემენიუს გახსნა/დახურვა',
        en: 'Toggle submenu',
        ru: 'Открыть/закрыть подменю'
      },
      viewLocation: {
        ka: 'მდებარეობის ნახვა',
        en: 'View location',
        ru: 'Посмотреть местоположение'
      },
      callPhone: {
        ka: 'დარეკვა ნომერზე',
        en: 'Call phone number',
        ru: 'Позвонить по номеру'
      },
      litoxLogo: {
        ka: 'Litox Georgia - მთავარ გვერდზე დაბრუნება',
        en: 'Litox Georgia - Return to homepage',
        ru: 'Litox Georgia - Вернуться на главную'
      },
      searchResults: {
        ka: 'ძებნის შედეგები',
        en: 'Search results',
        ru: 'Результаты поиска'
      },
      resultsCount: {
        ka: '{count} შედეგი ნაპოვნია',
        en: '{count} results found',
        ru: 'Найдено {count} результатов'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  // Handle keyboard navigation for menu
  const handleMenuKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSmallMenuOpen(false);
      setIsLargeMenuOpen(false);
    }
  };

  // Handle keyboard navigation for search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <>
      <header role="banner">
        <div className="flex-row">
          <div className="col">
            <div className="left">
              {/* Small screen menu trigger */}
              <button 
                className="open-menu small-menu-trigger" 
                onClick={() => setIsSmallMenuOpen(true)}
                aria-label={translate('openMenu')}
                aria-expanded={isSmallMenuOpen}
                aria-controls="mobile-navigation"
                type="button"
              >
                <div className="burger" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>{getMenuText()}</span>
              </button>

              {/* Small screen mobile menu */}
              <aside 
                id="mobile-navigation"
                className={`left-menu small ${isSmallMenuOpen ? 'active' : ''}`}
                aria-label={translate('mobileNavigation')}
                role="dialog"
                aria-modal="true"
                onKeyDown={handleMenuKeyDown}
              >
                <button 
                  className="close-menu" 
                  onClick={() => setIsSmallMenuOpen(false)}
                  aria-label={translate('closeMenu')}
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <title>{translate('closeMenu')}</title>
                    <path d="M18 6L6 18M6 6L18 18" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                <nav className="mobile-nav" aria-label={translate('mobileNavigation')}>
                  <ul className="mobile-nav__list" role="list">
                    {/* Home */}
                    <li className="mobile-nav__item" role="listitem">
                      <Link 
                        className="mobile-nav__link" 
                        to="/" 
                        onClick={() => setIsSmallMenuOpen(false)}
                        aria-label={translate('home')}
                      >
                        {translate('home')}
                      </Link>
                    </li>

                    {/* About */}
                    <li className="mobile-nav__item" role="listitem">
                      <Link 
                        className="mobile-nav__link" 
                        to="/about" 
                        onClick={() => setIsSmallMenuOpen(false)}
                        aria-label={translate('about')}
                      >
                        {translate('about')}
                      </Link>
                    </li>

                    {/* Products with categories */}
                    <li className="mobile-nav__item" role="listitem">
                      <div className="mobile-nav__link-wrapper">
                        <Link 
                          className="mobile-nav__link" 
                          to="/products2"
                          onClick={() => setIsSmallMenuOpen(false)}
                          aria-label={translate('products')}
                        >
                          {translate('products')}
                        </Link>
                        <button 
                          className="submenu-toggle"
                          onClick={() => toggleSubmenu('products')}
                          aria-label={translate('submenuToggle')}
                          aria-expanded={expandedMenu === 'products'}
                          aria-controls="products-submenu"
                          type="button"
                        >
                          <span aria-hidden="true">{expandedMenu === 'products' ? '−' : '+'}</span>
                        </button>
                      </div>
                      <ul 
                        id="products-submenu"
                        className={`mobile-submenu ${expandedMenu === 'products' ? 'active' : ''}`}
                        role="list"
                        aria-label={`${translate('products')} ${translate('submenuToggle')}`}
                      >
                        {categories.map((category) => (
                          <li key={category.id} role="listitem">
                            <Link 
                              to={`/products?category=${category.id}`}
                              onClick={() => {
                                setIsSmallMenuOpen(false);
                                setExpandedMenu(null);
                              }}
                              aria-label={`${translate('products')}: ${category.title}`}
                            >
                              {category.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Contacts */}
                    <li className="mobile-nav__item" role="listitem">
                      <Link 
                        className="mobile-nav__link" 
                        to="/contacts"
                        onClick={() => setIsSmallMenuOpen(false)}
                        aria-label={translate('contacts')}
                      >
                        {translate('contacts')}
                      </Link>
                    </li>

                    {/* Search in mobile menu */}
                    <li className="mobile-nav__item mobile-search-item" role="listitem">
                      <button 
                        className="mobile-nav__link mobile-search-btn"
                        onClick={() => {
                          setIsSmallMenuOpen(false);
                          setIsSearchOpen(true);
                        }}
                        aria-label={translate('openSearch')}
                        type="button"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                          <title>{translate('search')}</title>
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        {translate('search')}
                      </button>
                    </li>

                    {/* Language switcher */}
                    <li className="mobile-nav__item mobile-lang" role="listitem">
                      <div role="group" aria-label={translate('languageSelector')}>
                        <button 
                          className={`mobile-nav__link ${language === 'ka' ? 'active-lang' : ''}`}
                          style={{ 
                            color: language === 'ka' ? '#ff6b00' : '#aba39e',
                            fontWeight: language === 'ka' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0
                          }}
                          onClick={() => handleLanguageChange('ka')}
                          aria-label={`${translate('changeLanguage')} ${language === 'ka' ? `(${translate('currentLanguage')})` : ''} Georgian`}
                          aria-current={language === 'ka' ? 'true' : undefined}
                          type="button"
                        >
                          {language === 'ka' && <span aria-hidden="true">✓ </span>}GE
                        </button>
                        <span className="lang-divider" aria-hidden="true">|</span>
                        <button 
                          className={`mobile-nav__link ${language === 'en' ? 'active-lang' : ''}`}
                          style={{ 
                            color: language === 'en' ? '#ff6b00' : '#aba39e',
                            fontWeight: language === 'en' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0
                          }}
                          onClick={() => handleLanguageChange('en')}
                          aria-label={`${translate('changeLanguage')} ${language === 'en' ? `(${translate('currentLanguage')})` : ''} English`}
                          aria-current={language === 'en' ? 'true' : undefined}
                          type="button"
                        >
                          {language === 'en' && <span aria-hidden="true">✓ </span>}EN
                        </button>
                        <span className="lang-divider" aria-hidden="true">|</span>
                        <button 
                          className={`mobile-nav__link ${language === 'ru' ? 'active-lang' : ''}`}
                          style={{ 
                            color: language === 'ru' ? '#ff6b00' : '#aba39e',
                            fontWeight: language === 'ru' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0
                          }}
                          onClick={() => handleLanguageChange('ru')}
                          aria-label={`${translate('changeLanguage')} ${language === 'ru' ? `(${translate('currentLanguage')})` : ''} Russian`}
                          aria-current={language === 'ru' ? 'true' : undefined}
                          type="button"
                        >
                          {language === 'ru' && <span aria-hidden="true">✓ </span>}РУ
                        </button>
                      </div>
                    </li>
                  </ul>
                </nav>
              </aside>

              <Link 
                to="/contacts" 
                className="contacts"
                aria-label={translate('viewLocation')}
                title={translate('contacts')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <title>{translate('viewLocation')}</title>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#aba39e"/>
                </svg>
              </Link>
              <a 
                href="tel:+995598347784" 
                className="phone"
                aria-label={`${translate('callPhone')} +995 598 34 77 84`}
                title={translate('callPhone')}
              >
                598 34 77 84
              </a>
            </div>
          </div>

          <Link 
            to="/" 
            className="logo"
            aria-label={translate('litoxLogo')}
            title="Litox Georgia"
          >
            <img 
              src={logo} 
              alt="Litox Georgia - Construction Materials Logo" 
              width="120"
              height="40"
            />
          </Link>

          <div className="col">
            <div className="right">
              <nav className="primary-menu" aria-label={translate('mainNavigation')}>
                <ul role="list">
                  <li role="listitem">
                    <Link 
                      to="/about"
                      aria-label={translate('about')}
                    >
                      {translate('about')}
                    </Link>
                  </li>
                  <li role="listitem">
                    <Link 
                      to="/products2"
                      aria-label={translate('products')}
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {translate('products')}
                    </Link>
                    <ul className="dropdown" role="list" aria-label={`${translate('products')} categories`}>
                      {categories.map((category) => (
                        <li key={category.id} role="listitem">
                          <Link 
                            to={`/products?category=${category.id}`}
                            aria-label={`${translate('products')}: ${category.title}`}
                          >
                            {category.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li role="listitem">
                    <Link 
                      to="/contacts"
                      aria-label={translate('contacts')}
                    >
                      {translate('contacts')}
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Desktop search button */}
              <button 
                className="open-search-popup desktop-only"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={translate('openSearch')}
                aria-expanded={isSearchOpen}
                aria-controls="search-dialog"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aba39e" strokeWidth="2" aria-hidden="true" focusable="false">
                  <title>{translate('search')}</title>
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>

              {/* Desktop language switcher */}
              <ul className="lang desktop-only" role="list" aria-label={translate('languageSelector')}>
                <li role="listitem">
                  <button 
                    className={language === 'ka' ? 'active' : ''}
                    style={{ 
                      color: language === 'ka' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'ka' ? 'bold' : 'normal',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0
                    }}
                    onClick={() => handleLanguageChange('ka')}
                    aria-label={`${translate('changeLanguage')} ${language === 'ka' ? `(${translate('currentLanguage')})` : ''} Georgian`}
                    aria-current={language === 'ka' ? 'true' : undefined}
                    type="button"
                  >
                    {language === 'ka' && <span aria-hidden="true">✓ </span>}GE
                  </button>
                </li>
                <li role="listitem">
                  <button 
                    className={language === 'en' ? 'active' : ''}
                    style={{ 
                      color: language === 'en' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'en' ? 'bold' : 'normal',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0
                    }}
                    onClick={() => handleLanguageChange('en')}
                    aria-label={`${translate('changeLanguage')} ${language === 'en' ? `(${translate('currentLanguage')})` : ''} English`}
                    aria-current={language === 'en' ? 'true' : undefined}
                    type="button"
                  >
                    {language === 'en' && <span aria-hidden="true">✓ </span>}EN
                  </button>
                </li>
                <li role="listitem">
                  <button 
                    className={language === 'ru' ? 'active' : ''}
                    style={{ 
                      color: language === 'ru' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'ru' ? 'bold' : 'normal',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0
                    }}
                    onClick={() => handleLanguageChange('ru')}
                    aria-label={`${translate('changeLanguage')} ${language === 'ru' ? `(${translate('currentLanguage')})` : ''} Russian`}
                    aria-current={language === 'ru' ? 'true' : undefined}
                    type="button"
                  >
                    {language === 'ru' && <span aria-hidden="true">✓ </span>}RU
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Search Popup */}
      {isSearchOpen && (
        <div 
          id="search-dialog"
          className="search-popup" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="search-label"
          onKeyDown={handleSearchKeyDown}
        >
          <div className="search-container">
            <div className="search-input-wrapper">
              <label htmlFor="site-search" id="search-label" className="visually-hidden">
                {translate('search')}
              </label>
              <svg 
                className="search-icon" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#aba39e" 
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                id="site-search"
                ref={searchInputRef}
                type="search" 
                placeholder={translate('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-activedescendant={searchResults.length > 0 ? `search-result-0` : undefined}
                role="searchbox"
              />
              <button 
                className="search-close"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                aria-label={translate('closeSearch')}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <title>{translate('closeSearch')}</title>
                  <path d="M18 6L6 18M6 6L18 18" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Search Results */}
            {searchQuery.trim().length >= 2 && (
              <div 
                id="search-results"
                className="search-results"
                role="region"
                aria-live="polite"
                aria-atomic="true"
                aria-label={translate('searchResults')}
              >
                {isSearching ? (
                  <div className="search-loading" role="status" aria-live="polite">
                    {translate('searching')}
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="visually-hidden" role="status" aria-live="polite">
                      {translate('resultsCount').replace('{count}', searchResults.length)}
                    </div>
                    <div className="search-results-list" role="listbox" aria-label={translate('searchResults')}>
                      {searchResults.map((product, index) => {
                        const productUrl = product.categoryId 
                          ? `/products/${product.categoryId}/${product.id}`
                          : `/product/${product.id}`;
                        
                        return (
                          <Link
                            key={product.id}
                            id={`search-result-${index}`}
                            to={productUrl}
                            className="search-result-item"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                            role="option"
                            aria-label={`${getProductName(product)}${product.categoryTitle ? ` - ${product.categoryTitle}` : ''}`}
                          >
                            <div className="search-result-image">
                              <img 
                                src={getProductImage(product)} 
                                alt={getProductName(product)}
                                width="60"
                                height="60"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                                }}
                              />
                            </div>
                            <div className="search-result-info">
                              <div className="search-result-name">{getProductName(product)}</div>
                              {product.categoryTitle && (
                                <div className="search-result-category">{product.categoryTitle}</div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="search-no-results" role="status" aria-live="polite">
                    {translate('noResults')}
                  </div>
                )}
              </div>
            )}
          </div>
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
          aria-hidden="true"
        />
      )}

      {/* Overlay for search */}
      {isSearchOpen && (
        <div 
          className="search-overlay"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;