import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products.css';

const arrow = `${process.env.PUBLIC_URL}/next.png`;
const API_BASE_URL = 'http://api.litox.ge';

function Products() {
  const [highlightedProducts, setHighlightedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const sliderRef = useRef(null);
  const PAGE_SIZE = 10;

  // Get language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSlidesPerView(1);
      } else if (width < 1024) {
        setSlidesPerView(2);
      } else if (width < 1200) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch highlighted products with pagination
  const fetchProducts = async (page, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Products/products?ProductFilter=HighLight&PageSize=${PAGE_SIZE}&Page=${page}`,
        {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch highlighted products');
      }

      const products = await response.json();
      
      if (isInitial) {
        setHighlightedProducts(products);
      } else {
        setHighlightedProducts(prev => [...prev, ...products]);
      }

      if (products.length < PAGE_SIZE) {
        setHasMore(false);
      }

      console.log(`Loaded ${products.length} products for page ${page}`);

    } catch (err) {
      console.error('Error fetching highlighted products:', err);
      setError(err.message);
      if (isInitial) {
        setHighlightedProducts([]);
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [language]);

  // Check if we need to load more products
  useEffect(() => {
    const totalSlides = highlightedProducts.length;
    const maxIndex = Math.max(0, totalSlides - slidesPerView);
    
    if (currentIndex >= maxIndex - 2 && hasMore && !loadingMore && highlightedProducts.length > 0) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage, false);
    }
  }, [currentIndex, highlightedProducts.length, slidesPerView]);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, highlightedProducts.length - slidesPerView);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < highlightedProducts.length - slidesPerView;

  const translate = (key) => {
    const translations = {
      products: {
        ka: 'პროდუქტები',
        en: 'Products',
        ru: 'Продукты'
      },
      loading: {
        ka: 'იტვირთება პროდუქტები...',
        en: 'Loading products...',
        ru: 'Загрузка продуктов...'
      },
      error: {
        ka: 'შეცდომა პროდუქტების ჩატვირთვისას',
        en: 'Error loading products',
        ru: 'Ошибка загрузки продуктов'
      },
      noProducts: {
        ka: 'პროდუქტები არ არის ხელმისაწვდომი',
        en: 'No products available',
        ru: 'Продукты недоступны'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || `${process.env.PUBLIC_URL}/prod.webp`;
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  // Skeleton component with unique class names
  const SkeletonProductCard = () => (
    <div className="products-home-skeleton-card">
      <div className="products-home-skeleton-image"></div>
      <div className="products-home-skeleton-name"></div>
      <div className="products-home-skeleton-category"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="home-page-products">
        <div className="category-slider-section">
          <div className="home-products-header">
            <div className="products-home-skeleton-title"></div>
          </div>
          <div className="home-products-carousel-container">
            <div className="custom-slider">
              <div className="custom-slider-track" style={{ display: 'flex' }}>
                {[...Array(4)].map((_, index) => (
                  <div 
                    key={`skeleton-${index}`} 
                    className="custom-slide" 
                    style={{ width: '25%', flexShrink: 0 }}
                  >
                    <SkeletonProductCard />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page-products">
        <div className="home-products-error">{translate('error')}: {error}</div>
      </div>
    );
  }

  if (highlightedProducts.length === 0) {
    return (
      <div className="home-page-products">
        <div className="home-products-error">{translate('noProducts')}</div>
      </div>
    );
  }

  const slideWidth = 100 / slidesPerView;
  const translateX = -(currentIndex * slideWidth);

  return (
    <div className="home-page-products">
      <div className="category-slider-section">
        <div className="home-products-header">
          <h2 className="home-products-title">
            {translate('products')}
          </h2>
        </div>

        <div className="home-products-carousel-container">
          <div className="custom-slider" ref={sliderRef}>
            <div 
              className="custom-slider-track"
              style={{
                transform: `translateX(${translateX}%)`,
                transition: 'transform 0.5s ease'
              }}
            >
              {highlightedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="custom-slide"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div className="home-product-item">
                    <Link to={`/products/${product.categoryId}/${product.id}`} className="home-product-card">
                      <span className="home-product-img-wrapper">
                        <img 
                          src={getProductImage(product)} 
                          alt={getProductName(product)}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `${process.env.PUBLIC_URL}/prod.webp`;
                          }}
                        />
                        <span 
                          className="product-arrow-circle"
                          style={{
                            position: 'absolute',
                            right: '17px',
                            top: '17px',
                            width: '37px',
                            height: '37px',
                            backgroundColor: '#ef6f2e',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            zIndex: 3
                          }}
                        >
                          <img 
                            src={arrow} 
                            alt=""
                            className='arrow-img' 
                            style={{
                              height: '19px',
                              filter: 'brightness(0) invert(1)'
                            }}
                          />
                        </span>
                      </span>
                      <span className="home-product-name">{getProductName(product)}</span>
                      <span className="home-product-category">{product.categoryTitle || ''}</span>
                    </Link>
                  </div>
                </div>
              ))}
              
              {loadingMore && (
                <div className="custom-slide" style={{ width: `${slideWidth}%` }}>
                  <SkeletonProductCard />
                </div>
              )}
            </div>
          </div>

          {/* Custom Navigation Buttons */}
          <button 
            onClick={handlePrev}
            className={`swiper-button-prev-custom swiper-button-prev-custom-0 home-products-nav ${!canGoPrev ? 'swiper-button-disabled' : ''}`}
            aria-label="Previous"
            type="button"
            disabled={!canGoPrev}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className={`swiper-button-next-custom swiper-button-next-custom-0 home-products-nav home-products-nav-next ${!canGoNext ? 'swiper-button-disabled' : ''}`}
            aria-label="Next"
            type="button"
            disabled={!canGoNext}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;