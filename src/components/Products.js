import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Products.css';

function Products() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

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
          // Fetch 8 products per API page
          let allProducts = [];
          let currentPage = 1;
          let hasMorePages = true;

          while (hasMorePages) {
            const productsResponse = await fetch(
              `http://api.litox.synaptica.online/api/Products/products?CategoryID=${category.id}&PageSize=8&Page=${currentPage}`,
              {
                headers: {
                  'accept': '*/*',
                  'X-Language': language
                }
              }
            );

            if (productsResponse.ok) {
              const pageProducts = await productsResponse.json();
              
              if (pageProducts.length > 0) {
                const productsWithCategory = pageProducts.map(product => ({
                  ...product,
                  categoryId: category.id,
                  categoryTitle: category.title
                }));
                
                allProducts = [...allProducts, ...productsWithCategory];
                
                // If we got less than 8 products, we've reached the last page
                if (pageProducts.length < 8) {
                  hasMorePages = false;
                } else {
                  currentPage++;
                }
              } else {
                hasMorePages = false;
              }
            } else {
              hasMorePages = false;
            }
          }

          // Only add categories that have products
          if (allProducts.length > 0) {
            categoriesWithProductsData.push({
              category: category,
              products: allProducts
            });
          }
        }

        // Limit to first 4 categories with products
        setCategoriesWithProducts(categoriesWithProductsData.slice(0, 4));
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
        <div className="home-products-loading">{translate('loading')}</div>
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

  if (categoriesWithProducts.length === 0) {
    return (
      <div className="home-page-products">
        <div className="home-products-error">{translate('noProducts')}</div>
      </div>
    );
  }

  return (
    <div className="home-page-products">
      {categoriesWithProducts.map((categoryData, categoryIndex) => (
        <div key={`category-section-${categoryData.category.id}`} className="category-slider-section">
          <div className="home-products-header">
            <h2 className="home-products-title">
              {categoryData.category.title}
            </h2>
          </div>
          
          <div className="home-products-carousel-container">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              slidesPerGroup={4}
              speed={500}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                prevEl: `.swiper-button-prev-custom-${categoryIndex}`,
                nextEl: `.swiper-button-next-custom-${categoryIndex}`,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  spaceBetween: 15
                },
                768: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 20
                },
                1024: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                  spaceBetween: 20
                },
                1200: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                  spaceBetween: 20
                }
              }}
            >
              {categoryData.products.map((product, index) => (
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
              className={`swiper-button-prev-custom swiper-button-prev-custom-${categoryIndex} home-products-nav`}
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              className={`swiper-button-next-custom swiper-button-next-custom-${categoryIndex} home-products-nav home-products-nav-next`}
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;