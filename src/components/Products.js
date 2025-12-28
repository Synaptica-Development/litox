import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Products.css';

function Products() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const swiperRef = useRef(null);

  // Get language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  // Fetch ALL products grouped by category
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesResponse = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        const categoriesWithProductsData = [];

        for (const category of categoriesData) {
          const productsResponse = await fetch(
            `http://api.litox.synaptica.online/api/Products/products?CategoryID=${category.id}&PageSize=100&Page=1`,
            {
              headers: {
                'accept': '*/*',
                'X-Language': language
              }
            }
          );

          if (productsResponse.ok) {
            const categoryProducts = await productsResponse.json();
            
            const productsWithCategory = categoryProducts.map(product => ({
              ...product,
              categoryId: category.id,
              categoryTitle: category.title
            }));

            // Only add categories that have products
            if (productsWithCategory.length > 0) {
              categoriesWithProductsData.push({
                category: category,
                products: productsWithCategory
              });
            }
          }
        }

        setCategoriesWithProducts(categoriesWithProductsData);
        console.log('Categories with products:', categoriesWithProductsData.map(c => `${c.category.title}: ${c.products.length} products`));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setCategoriesWithProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [language]);

  // When category changes, reset swiper
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0, 0);
    }
  }, [currentCategoryIndex]);

  const handleNextClick = () => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    if (swiper.isEnd) {
      // At the end of current category, move to next category
      if (currentCategoryIndex < categoriesWithProducts.length - 1) {
        setCurrentCategoryIndex(prev => prev + 1);
      }
    } else {
      // Normal slide
      swiper.slideNext();
    }
  };

  const handlePrevClick = () => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    if (swiper.isBeginning) {
      // At the beginning of current category, move to previous category
      if (currentCategoryIndex > 0) {
        setCurrentCategoryIndex(prev => prev - 1);
      }
    } else {
      // Normal slide
      swiper.slidePrev();
    }
  };

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
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  if (loading) {
    return (
      <div className="home-page-products">
        <div className="home-products-header">
          <h2 className="home-products-title">{translate('products')}</h2>
        </div>
        <div className="home-products-loading">{translate('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page-products">
        <div className="home-products-header">
          <h2 className="home-products-title">{translate('products')}</h2>
        </div>
        <div className="home-products-error">{translate('error')}: {error}</div>
      </div>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return (
      <div className="home-page-products">
        <div className="home-products-header">
          <h2 className="home-products-title">{translate('products')}</h2>
        </div>
        <div className="home-products-error">{translate('noProducts')}</div>
      </div>
    );
  }

  const currentCategory = categoriesWithProducts[currentCategoryIndex];

  return (
    <div className="home-page-products">
      <div className="home-products-header">
        <h2 className="home-products-title">
          {currentCategory.category.title}
        </h2>
      </div>
      
      <div className="home-products-carousel-container">
        <Swiper
          key={`category-${currentCategoryIndex}`}
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={4}
          speed={500}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 15
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 20
            }
          }}
        >
          {currentCategory.products.map((product, index) => (
            <SwiperSlide key={`${product.id}-${index}`}>
              <div className="home-product-item">
                <Link to={`/products/${product.categoryId}/${product.id}`} className="home-product-card">
                  <span className="home-product-img-wrapper">
                    <img 
                      src={getProductImage(product)} 
                      alt={getProductName(product)}
                      onError={(e) => {
                        e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                      }}
                    />
                  </span>
                  <span className="home-product-name">{getProductName(product)}</span>
                  <span className="home-product-category">{product.categoryTitle}</span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button 
          className="swiper-button-prev-custom home-products-nav" 
          aria-label="Previous"
          onClick={handlePrevClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button 
          className="swiper-button-next-custom home-products-nav home-products-nav-next" 
          aria-label="Next"
          onClick={handleNextClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Products;