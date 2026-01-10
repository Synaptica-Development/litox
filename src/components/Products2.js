import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products2.css';

const desktopBackground = `${process.env.PUBLIC_URL}/products-bg2.jpg`;
const mobileBackground = `${process.env.PUBLIC_URL}/mobile-background.jpg`;
const arrow = `${process.env.PUBLIC_URL}/right-arrow2.svg`;

function Products2() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  // Translation function
  const translate = (key) => {
    const translations = {
      title: {
        ka: 'პროდუქტების კატეგორიები',
        en: 'Product Categories',
        ru: 'Категории продуктов'
      },
      subtitle: {
        ka: 'აირჩიეთ კატეგორია',
        en: 'Choose a category',
        ru: 'Выберите категорию'
      },
      loading: {
        ka: 'იტვირთება...',
        en: 'Loading...',
        ru: 'Загрузка...'
      },
      error: {
        ka: 'შეცდომა კატეგორიების ჩატვირთვისას',
        en: 'Error loading categories',
        ru: 'Ошибка загрузки категорий'
      }
    };
    return translations[key]?.[language] || translations[key]?.['ka'] || key;
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="category-card skeleton">
      <div className="category-image-wrapper">
        <div className="category-banner skeleton-img">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="category-info">
          <div className="skeleton-text"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="products2-page">
      {/* Hero Section */}
      <section className="products2-hero">
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileBackground} />
          <img src={desktopBackground} alt="Products Background" />
        </picture>
        <div className="products2-hero-content">
          <h1>{translate('title')}</h1>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          {loading ? (
            <div className="categories-grid">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="error-message">{translate('error')}: {error}</div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
               <Link
  key={category.id}
  to={`/products2/category/${category.id}`}
  className="category-card"
>
                  <div className="category-image-wrapper">
                    <div className="category-banner">
                      <img
                        src={category.bannerLink}
                        alt={category.title}
                        onError={(e) => {
                          e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                        }}
                      />
                    </div>
                    <div className="category-info">
                      <h3 className="category-title">{category.title}</h3>
                      <p className="category-subtitle">{translate('subtitle')}</p>
                      <div className="category-arrow">
                        <img src={arrow} alt="" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products2;