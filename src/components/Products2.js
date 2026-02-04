import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products2.css';

const desktopBackground = `${process.env.PUBLIC_URL}/products-bg2.jpg`;
const mobileBackground = `${process.env.PUBLIC_URL}/mobile-background.jpg`;
const arrow = `${process.env.PUBLIC_URL}/right-arrow2.svg`;
const API_BASE_URL = 'https://api.litox.ge';

// SEO Meta Data
const SEO_META_DATA = {
  ka: {
    title: 'პროდუქტების კატეგორიები - Litox Georgia | სამშენებლო მასალები თბილისში',
    description: 'აირჩიეთ კატეგორია: ბათქაში, ცემენტი, წებოები, შპაკლები, თვითსწორებადი იატაკი, საჰიდროიზოლაციო მასალები. Litox Georgia - Free Way LLC ოფიციალური წარმომადგენელი.',
    keywords: 'პროდუქტების კატეგორიები, ბათქაში, ცემენტი თბილისში, წებო ცემენტი, შპაკლები, თვითსწორებადი იატაკი, საჰიდროიზოლაციო მასალები, სამშენებლო მასალები, Litox Georgia'
  },
  en: {
    title: 'Product Categories - Litox Georgia | Construction Materials in Tbilisi',
    description: 'Choose a category: plasters, cement, adhesives, putties, levelers, waterproofing materials. Litox Georgia - Free Way LLC official representative.',
    keywords: 'product categories, plasters, cement Tbilisi, tile adhesives, putties, levelers, waterproofing materials, construction materials, Litox Georgia'
  },
  ru: {
    title: 'Категории продуктов - Litox Georgia | Строительные материалы в Тбилиси',
    description: 'Выберите категорию: штукатурки, цемент, клеи, шпатлёвки, ровницели, гидроизоляционные материалы. Litox Georgia - Free Way LLC официальный представитель.',
    keywords: 'категории продуктов, штукатурки, цемент Тбилиси, плиточные клеи, шпатлёвки, ровницели, гидроизоляционные материалы, строительные материалы, Litox Georgia'
  }
};

// Helper function to update or create meta tag
const updateMetaTag = (selector, attribute, attributeValue, content) => {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    if (attribute) {
      element.setAttribute(attribute, attributeValue);
    } else {
      element.name = attributeValue;
    }
    document.head.appendChild(element);
  }
  if (selector.startsWith('link')) {
    element.href = content;
  } else {
    element.content = content;
  }
};

function Products2() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });

  // SEO: Update meta tags - WITH CLEANUP
  useEffect(() => {
    const meta = SEO_META_DATA[language] || SEO_META_DATA['ka'];

    // Update page title
    document.title = meta.title;

    // Update meta tags
    updateMetaTag('meta[name="description"]', null, 'description', meta.description);
    updateMetaTag('meta[name="keywords"]', null, 'keywords', meta.keywords);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'https://litoxgeorgia.ge/products2');

    // Cleanup function - restore original title when leaving page
    return () => {
      document.title = 'Litox Georgia - სამშენებლო მასალები თბილისში | ცემენტი, ბათქაში, წებო, შპაკლები';
    };
  }, [language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/Category/categories`, {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Translation function - memoized
  const translate = useCallback((key) => {
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
      },
      viewCategory: {
        ka: 'ნახე კატეგორია',
        en: 'View category',
        ru: 'Посмотреть категорию'
      },
      productsBackground: {
        ka: 'სამშენებლო მასალები',
        en: 'Construction materials',
        ru: 'Строительные материалы'
      },
      loadingCategories: {
        ka: 'იტვირთება კატეგორიები',
        en: 'Loading categories',
        ru: 'Загрузка категорий'
      }
    };
    return translations[key]?.[language] || translations[key]?.['ka'] || key;
  }, [language]);

  // Skeleton loader - memoized
  const SkeletonCard = useMemo(() => () => (
    <div className="category-card skeleton" aria-hidden="true">
      <div className="category-image-wrapper">
        <div className="category-banner skeleton-img">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="category-info">
          <div className="skeleton-text"></div>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="products2-page">
      {/* Hero Section */}
      <header className="products2-hero" role="banner">
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileBackground} />
          <img 
            src={desktopBackground} 
            alt={`Litox Georgia ${translate('productsBackground')}`}
            loading="eager" 
          />
        </picture>
        <div className="products2-hero-content">
          <h1>{translate('title')}</h1>
        </div>
      </header>

      {/* Categories Section */}
      <main className="categories-section">
        <div className="container">
          {loading ? (
            <div 
              className="categories-grid" 
              role="status" 
              aria-live="polite" 
              aria-label={translate('loadingCategories')}
            >
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            <div 
              className="error-message" 
              role="alert" 
              aria-live="assertive"
            >
              {translate('error')}: {error}
            </div>
          ) : (
            <nav aria-label={translate('title')}>
              <ul className="categories-grid" role="list">
                {categories.map((category) => (
                  <li key={category.id} role="listitem">
                    <Link
                      to={`/products2/category/${category.id}`}
                      className="category-card"
                      aria-label={`${translate('viewCategory')}: ${category.title}`}
                    >
                      <article className="category-image-wrapper">
                        <figure className="category-banner">
                          <img
                            src={category.bannerLink}
                            alt={category.title}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                            }}
                          />
                        </figure>
                        <div className="category-info">
                          <h2 className="category-title">{category.title}</h2>
                          <p className="category-subtitle">{translate('subtitle')}</p>
                          <div className="category-arrow" aria-hidden="true">
                            <img src={arrow} alt="" role="presentation" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}

export default Products2;