import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Category.css';

const API_BASE_URL = 'https://api.litox.ge';

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('ka');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Fetch categories when language changes
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Category/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Language': language,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  const getCategoryIcon = (category) => {
    const iconUrl = category.imageLink || category.icon || category.iconUrl || category.image;
    return iconUrl || null;
  };

  const getCategoryName = (category) => {
    return category.name || category.title || 'Category';
  };

  // Translation function
  const translate = (key) => {
    const translations = {
      loading: {
        ka: 'იტვირთება კატეგორიები...',
        en: 'Loading categories...',
        ru: 'Загрузка категорий...'
      },
      error: {
        ka: 'შეცდომა კატეგორიების ჩატვირთვისას',
        en: 'Error loading categories',
        ru: 'Ошибка загрузки категорий'
      },
      noCategories: {
        ka: 'კატეგორიები არ არის ხელმისაწვდომი',
        en: 'No categories available',
        ru: 'Категории недоступны'
      },
      categories: {
        ka: 'კატეგორიები',
        en: 'Categories',
        ru: 'Категории'
      },
      productCategories: {
        ka: 'პროდუქტების კატეგორიები',
        en: 'Product Categories',
        ru: 'Категории продуктов'
      },
      viewProducts: {
        ka: 'პროდუქტების ნახვა',
        en: 'View products',
        ru: 'Посмотреть продукты'
      },
      viewCategory: {
        ka: 'კატეგორიის ნახვა',
        en: 'View category',
        ru: 'Посмотреть категорию'
      },
      previousCategories: {
        ka: 'წინა კატეგორიები',
        en: 'Previous categories',
        ru: 'Предыдущие категории'
      },
      nextCategories: {
        ka: 'შემდეგი კატეგორიები',
        en: 'Next categories',
        ru: 'Следующие категории'
      },
      categoryNavigation: {
        ka: 'კატეგორიების ნავიგაცია',
        en: 'Category navigation',
        ru: 'Навигация по категориям'
      },
      slideNavigation: {
        ka: 'სლაიდების ნავიგაცია',
        en: 'Slide navigation',
        ru: 'Навигация по слайдам'
      },
      slide: {
        ka: 'სლაიდი',
        en: 'Slide',
        ru: 'Слайд'
      },
      of: {
        ka: '-დან',
        en: 'of',
        ru: 'из'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  // Group categories into chunks of 4 for mobile
  const groupCategories = (cats) => {
    const grouped = [];
    for (let i = 0; i < cats.length; i += 4) {
      grouped.push(cats.slice(i, i + 4));
    }
    return grouped;
  };

  if (loading) {
    return (
      <section 
        className="home-catalog-list" 
        aria-labelledby="categories-heading"
        aria-busy="true"
      >
        <h2 id="categories-heading" className="visually-hidden">
          {translate('productCategories')}
        </h2>
        <div className="flex-row">
          <div className="loading" role="status" aria-live="polite">
            {translate('loading')}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        className="home-catalog-list" 
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading" className="visually-hidden">
          {translate('productCategories')}
        </h2>
        <div className="flex-row">
          <div className="error" role="alert" aria-live="assertive">
            {translate('error')}: {error}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section 
        className="home-catalog-list" 
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading" className="visually-hidden">
          {translate('productCategories')}
        </h2>
        <div className="flex-row">
          <div className="error" role="status" aria-live="polite">
            {translate('noCategories')}
          </div>
        </div>
      </section>
    );
  }

  // Render mobile swiper with 2x2 grid
  if (isMobile) {
    const groupedCategories = groupCategories(categories);
    
    return (
      <section 
        className="home-catalog-list" 
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading" className="visually-hidden">
          {translate('productCategories')}
        </h2>
        
        <div 
          className="category-swiper-container"
          role="region"
          aria-roledescription="carousel"
          aria-label={translate('categoryNavigation')}
        >
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: '.category-button-prev',
              nextEl: '.category-button-next',
            }}
            pagination={{
              clickable: true,
              el: '.category-swiper-pagination',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            speed={500}
            a11y={{
              enabled: true,
              prevSlideMessage: translate('previousCategories'),
              nextSlideMessage: translate('nextCategories'),
              firstSlideMessage: `${translate('slide')} 1`,
              lastSlideMessage: `${translate('slide')} ${groupedCategories.length}`,
              paginationBulletMessage: `${translate('slide')} {{index}}`,
            }}
            role="list"
          >
            {groupedCategories.map((group, groupIndex) => (
              <SwiperSlide 
                key={groupIndex}
                role="listitem"
                aria-roledescription="slide"
                aria-label={`${translate('slide')} ${groupIndex + 1} ${translate('of')} ${groupedCategories.length}`}
              >
                <div 
                  className="category-grid-2x2"
                  role="list"
                  aria-label={`${translate('categories')} ${groupIndex * 4 + 1}-${Math.min((groupIndex + 1) * 4, categories.length)}`}
                >
                  {group.map((category, index) => {
                    const categoryName = getCategoryName(category);
                    return (
                      <Link 
                        key={category.id || index}
                        to={`/category/${category.id}`}
                        className="catalog-card"
                        aria-label={`${translate('viewCategory')}: ${categoryName}`}
                        title={`${categoryName} - ${translate('viewProducts')}`}
                        role="listitem"
                      >
                        <div className="icon" aria-hidden="true">
                          {getCategoryIcon(category) && (
                            <img 
                              src={getCategoryIcon(category)} 
                              alt=""
                              width="80"
                              height="80"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <span className="catalog-name">{categoryName}</span>
                      </Link>
                    );
                  })}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button 
            className="category-button-prev category-nav" 
            aria-label={translate('previousCategories')}
            type="button"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <title>{translate('previousCategories')}</title>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            className="category-button-next category-nav" 
            aria-label={translate('nextCategories')}
            type="button"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <title>{translate('nextCategories')}</title>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Pagination dots */}
          <div 
            className="category-swiper-pagination"
            role="tablist"
            aria-label={translate('slideNavigation')}
          ></div>
        </div>

        {/* JSON-LD Structured Data for ItemList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": translate('productCategories'),
            "numberOfItems": categories.length,
            "itemListElement": categories.map((category, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": getCategoryName(category),
              "url": `https://litox.ge/category/${category.id}`,
              "image": getCategoryIcon(category) || undefined
            }))
          })}
        </script>
      </section>
    );
  }

  // Render desktop grid
  return (
    <section 
      className="home-catalog-list" 
      aria-labelledby="categories-heading"
    >
      <h2 id="categories-heading" className="visually-hidden">
        {translate('productCategories')}
      </h2>
      
      <nav 
        className="flex-row" 
        aria-label={translate('categoryNavigation')}
        role="navigation"
      >
        <ul role="list" style={{ display: 'contents' }}>
          {categories.map((category, index) => {
            const categoryName = getCategoryName(category);
            return (
              <li key={category.id || index} role="listitem" style={{ display: 'contents' }}>
                <Link 
                  to={`/category/${category.id}`}
                  className="catalog-card"
                  aria-label={`${translate('viewCategory')}: ${categoryName}`}
                  title={`${categoryName} - ${translate('viewProducts')}`}
                >
                  <div className="icon" aria-hidden="true">
                    {getCategoryIcon(category) && (
                      <img 
                        src={getCategoryIcon(category)} 
                        alt=""
                        width="80"
                        height="80"
                        loading={index < 4 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <span className="catalog-name">{categoryName}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* JSON-LD Structured Data for ItemList */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": translate('productCategories'),
          "numberOfItems": categories.length,
          "itemListElement": categories.map((category, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": getCategoryName(category),
            "url": `https://litox.ge/category/${category.id}`,
            "image": getCategoryIcon(category) || undefined
          }))
        })}
      </script>
    </section>
  );
}

export default Category;