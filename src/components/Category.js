import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Category.css';

const API_BASE_URL = 'https://api.litox.ge';

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
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
      <div className="home-catalog-list">
        <div className="flex-row">
          <div className="loading">{translate('loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-catalog-list">
        <div className="flex-row">
          <div className="error">{translate('error')}: {error}</div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="home-catalog-list">
        <div className="flex-row">
          <div className="error">{translate('noCategories')}</div>
        </div>
      </div>
    );
  }

  // Render mobile swiper with 2x2 grid
  if (isMobile) {
    const groupedCategories = groupCategories(categories);
    
    return (
      <div className="home-catalog-list">
        <div className="category-swiper-container">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: '.category-button-prev',
              nextEl: '.category-button-next',
            }}
            pagination={{
              clickable: true,
              el: '.category-swiper-pagination'
            }}
            speed={500}
          >
            {groupedCategories.map((group, groupIndex) => (
              <SwiperSlide key={groupIndex}>
                <div className="category-grid-2x2">
                  {group.map((category, index) => (
                    <Link 
                      key={category.id || index}
                      to={`/category/${category.id}`}
                      className="catalog-card"
                    >
                      <div className="icon">
                        <img 
                          src={getCategoryIcon(category)} 
                          alt={getCategoryName(category)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="catalog-name">{getCategoryName(category)}</div>
                    </Link>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="category-button-prev category-nav" aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="category-button-next category-nav" aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Pagination dots */}
          <div className="category-swiper-pagination"></div>
        </div>
      </div>
    );
  }

  // Render desktop grid
  return (
    <div className="home-catalog-list">
      <div className="flex-row">
        {categories.map((category, index) => (
          <Link 
            to={`/category/${category.id}`}
            key={category.id || index} 
            className="catalog-card"
          >
            <div className="icon">
              <img 
                src={getCategoryIcon(category)} 
                alt={getCategoryName(category)}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="catalog-name">{getCategoryName(category)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Category;