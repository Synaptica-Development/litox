import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const search = process.env.PUBLIC_URL + '/search.svg';
const logo = process.env.PUBLIC_URL + '/logoru.svg';
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

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setIsSmallMenuOpen(false);
    setIsLargeMenuOpen(false);
    navigate(`/products?category=${categoryId}`);
  };

  // Handle search result click
  const handleSearchResultClick = (product) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    // Navigate to product page - adjust this based on your routing structure
    if (product.categoryId) {
      navigate(`/products/${product.categoryId}/${product.id}`);
    } else {
      // If categoryId is not available, just navigate with product id
      navigate(`/product/${product.id}`);
    }
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

  return (
    <>
      <header>
        <div className="flex-row">
          <div className="col">
            <div className="left">
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

                    {/* Products with categories - ✅ FIXED: Using Link */}
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
                            {/* ✅ FIXED: Replaced <a href="#"> with Link */}
                            <Link 
                              to={`/products?category=${category.id}`}
                              onClick={() => {
                                setIsSmallMenuOpen(false);
                                setExpandedMenu(null);
                              }}
                            >
                              {category.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
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

                    {/* Search in mobile menu */}
                    <li className="mobile-nav__item mobile-search-item">
                      <button 
                        className="mobile-nav__link mobile-search-btn"
                        onClick={() => {
                          setIsSmallMenuOpen(false);
                          setIsSearchOpen(true);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        {translate('search')}
                      </button>
                    </li>

                    {/* Language switcher - ✅ FIXED: Using styled <a> instead of href="#" */}
                    <li className="mobile-nav__item mobile-lang">
                      <a 
                        className={`mobile-nav__link ${language === 'ka' ? 'active-lang' : ''}`}
                        style={{ 
                          color: language === 'ka' ? '#ff6b00' : '#aba39e',
                          fontWeight: language === 'ka' ? 'bold' : 'normal',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLanguageChange('ka');
                        }}
                      >
                        {language === 'ka' && '✓ '}GE
                      </a>
                      <span className="lang-divider">|</span>
                      <a 
                        className={`mobile-nav__link ${language === 'en' ? 'active-lang' : ''}`}
                        style={{ 
                          color: language === 'en' ? '#ff6b00' : '#aba39e',
                          fontWeight: language === 'en' ? 'bold' : 'normal',
                          cursor: 'pointer'
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
                        className={`mobile-nav__link ${language === 'ru' ? 'active-lang' : ''}`}
                        style={{ 
                          color: language === 'ru' ? '#ff6b00' : '#aba39e',
                          fontWeight: language === 'ru' ? 'bold' : 'normal',
                          cursor: 'pointer'
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
              <a href="tel:995598347784" className="phone">598 34 77 84</a>
            </div>
          </div>

          <Link to="/" className="logo">
            <img src={logo} alt="Litox Georgia Logo" />
          </Link>

          <div className="col">
            <div className="right">
              <ul className="primary-menu">
                <li>
                  <Link to="/about">{translate('about')}</Link>
                </li>
                <li>
                  <Link to="/products2">{translate('products')}</Link>
                  <ul className="dropdown">
                    {categories.map((category) => (
                      <li key={category.id}>
                        {/* ✅ FIXED: Replaced <a href="#"> with Link */}
                        <Link to={`/products?category=${category.id}`}>
                          {category.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <Link to="/contacts">{translate('contacts')}</Link>
                </li>
              </ul>

              {/* Desktop search button */}
              <button 
                className="open-search-popup desktop-only"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aba39e" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>

              {/* Desktop language switcher - ✅ FIXED: Using styled <a> instead of href="#" */}
              <ul className="lang desktop-only">
                <li>
                  <a 
                    className={language === 'ka' ? 'active' : ''}
                    style={{ 
                      color: language === 'ka' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'ka' ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('ka');
                    }}
                  >
                    {language === 'ka' && '✓ '}GE
                  </a>
                </li>
                <li>
                  <a 
                    className={language === 'en' ? 'active' : ''}
                    style={{ 
                      color: language === 'en' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'en' ? 'bold' : 'normal',
                      cursor: 'pointer'
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
                    className={language === 'ru' ? 'active' : ''}
                    style={{ 
                      color: language === 'ru' ? '#ff6b00' : '#aba39e',
                      fontWeight: language === 'ru' ? 'bold' : 'normal',
                      cursor: 'pointer'
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

      {/* Search Popup */}
      {isSearchOpen && (
        <div className="search-popup">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aba39e" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                type="text" 
                placeholder={translate('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus 
              />
              <button 
                className="search-close"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#aba39e" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Search Results */}
            {searchQuery.trim().length >= 2 && (
              <div className="search-results">
                {isSearching ? (
                  <div className="search-loading">{translate('searching')}</div>
                ) : searchResults.length > 0 ? (
                  <div className="search-results-list">
                    {searchResults.map((product) => {
                      // ✅ FIXED: Using Link instead of clickable div
                      const productUrl = product.categoryId 
                        ? `/products/${product.categoryId}/${product.id}`
                        : `/product/${product.id}`;
                      
                      return (
                        <Link
                          key={product.id}
                          to={productUrl}
                          className="search-result-item"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                        >
                          <div className="search-result-image">
                            <img 
                              src={getProductImage(product)} 
                              alt={getProductName(product)}
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
                ) : (
                  <div className="search-no-results">{translate('noResults')}</div>
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
        />
      )}
    </>
  );
}

export default Header;