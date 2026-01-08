import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Parallax } from 'react-parallax';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/ProductDetails.css';

function ProductDetails() {
  const { categoryId, productId } = useParams();
  const [activeTab, setActiveTab] = useState('application');
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Fetch product details when language or productId changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product details
        const productResponse = await fetch(
          `http://api.litox.synaptica.online/api/Products/products/details?ProductID=${productId}`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (!productResponse.ok) {
          throw new Error('Failed to fetch product details');
        }

        const productData = await productResponse.json();
        setProduct(productData);

        // Fetch category info
        const categoriesResponse = await fetch(
          'http://api.litox.synaptica.online/api/Category/categories',
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const foundCategory = categoriesData.find(cat => cat.id === categoryId);
          setCategory(foundCategory);
        }

        // Fetch related products from the same category
        const relatedResponse = await fetch(
          `http://api.litox.synaptica.online/api/Products/products?CategoryID=${categoryId}&PageSize=10&Page=1`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out the current product
          const filtered = relatedData.filter(p => p.id !== productId);
          setRelatedProducts(filtered);
        }

      } catch (err) {
        setError(err.message);
        setProduct(null);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId, categoryId, language]);

  // Helper function to get the product image
  const getProductImage = () => {
    if (!product) return '/prod.webp';
    const image = product.iconImageLink || '/prod.webp';
    return image;
  };

  // Translation function
  const translate = (key) => {
    const translations = {
      home: {
        ka: 'მთავარი',
        en: 'Home',
        ru: 'Главная'
      },
      products: {
        ka: 'პროდუქტები',
        en: 'Products',
        ru: 'Продукты'
      },
      loading: {
        ka: 'იტვირთება პროდუქტის დეტალები...',
        en: 'Loading product details...',
        ru: 'Загрузка деталей продукта...'
      },
      error: {
        ka: 'შეცდომა პროდუქტის ჩატვირთვისას',
        en: 'Error loading product',
        ru: 'Ошибка загрузки продукта'
      },
      productNotFound: {
        ka: 'პროდუქტი ვერ მოიძებნა',
        en: 'Product not found',
        ru: 'Продукт не найден'
      },
      specifications: {
        ka: 'სპეციფიკაციები',
        en: 'Specifications',
        ru: 'Спецификации'
      },
      application: {
        ka: 'გამოყენება',
        en: 'Application',
        ru: 'Применение'
      },
      documents: {
        ka: 'დოკუმენტები',
        en: 'Documents',
        ru: 'Документы'
      },
      noSpecifications: {
        ka: 'ამ პროდუქტისთვის სპეციფიკაციები მიუწვდომელია.',
        en: 'No specifications available for this product.',
        ru: 'Спецификации для этого продукта недоступны.'
      },
      seeAlso: {
        ka: 'ასევე იხილეთ',
        en: 'See Also',
        ru: 'Смотрите також'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="product-details-container">
      {/* Skeleton Hero Section */}
      <section 
        className="product-hero skeleton-hero"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 40%, rgba(92, 64, 51) 100%)'
        }}
      >
        <div className="breadcrumbs-wrapper">
          <div className="skeleton-breadcrumbs">
            <div className="skeleton-breadcrumb"></div>
            <div className="skeleton-breadcrumb"></div>
            <div className="skeleton-breadcrumb"></div>
          </div>
        </div>

        <div className="skeleton-product-image"></div>

        <div className="container">
          <div className="skeleton-title"></div>
          <div className="skeleton-description"></div>
        </div>
      </section>

      {/* Skeleton Tabs Section */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-header">
            <div className="skeleton-tabs">
              <div className="skeleton-tab"></div>
              <div className="skeleton-tab"></div>
              <div className="skeleton-tab"></div>
            </div>
          </div>

          {/* Skeleton Tab Content */}
          <div className="tab-content">
            <div className="tab-pane active">
              {[1, 2, 3].map((item) => (
                <div key={item} className="skeleton-content-row">
                  <div className="skeleton-content-text">
                    <div className="skeleton-content-title"></div>
                    <div className="skeleton-content-paragraph"></div>
                    <div className="skeleton-content-paragraph"></div>
                    <div className="skeleton-content-paragraph"></div>
                  </div>
                  <div className="skeleton-content-image"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skeleton Related Products */}
      <div className="category-page-products">
        <div className="category-slider-section">
          <div className="category-products-header">
            <div className="skeleton-title" style={{ width: '200px', height: '36px' }}></div>
          </div>
          <div className="category-products-carousel-container">
            <div style={{ display: 'flex', gap: '20px', padding: '0 100px' }}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} style={{ flex: '0 0 calc(25% - 15px)' }}>
                  <div className="skeleton-related-product">
                    <div className="skeleton-related-image"></div>
                  </div>
                  <div className="skeleton-related-name"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <div className="container">
          <div className="error">{translate('error')}: {error || translate('productNotFound')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Hero Section with Banner Background */}
      <section 
        className="product-hero"
        style={{
          backgroundImage: product.bannerImageLink 
            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${product.bannerImageLink})`
            : 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 40%, rgba(92, 64, 51) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="breadcrumbs-wrapper">
          <ul className="breadcrumbs">
            <li><Link to="/">{translate('home')}</Link></li>
            <li><Link to="/products">{translate('products')}</Link></li>
            {category && <li><Link to={`/category/${categoryId}`}>{category.title}</Link></li>}
            <li><span>{product.title}</span></li>
          </ul>
        </div>

        <img 
          src={getProductImage()} 
          alt={product.title} 
          className="product-small-img"
          onError={(e) => {
            e.target.src = '/prod.webp';
          }}
        />

        <div className="container">
          <h1>{product.title}</h1>
          {product.description && <div className="preview-text">{product.description}</div>}
        </div>

        {/* Features Overlay - Only show if keywords exist from API */}
        {product.keywrods && product.keywrods.length > 0 && (
          <div className="features-overlay">
            <div className="container">
              <div className="flex">
                {product.keywrods.map((keyword, index) => (
                  <React.Fragment key={index}>
                    <div className="col">
                      <span>{keyword}</span>
                    </div>
                    {index < product.keywrods.length - 1 && <div className="razd"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tabs Section */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-header">
            <ul className="tab-list">
              <li className={activeTab === 'application' ? 'active' : ''}>
                <button onClick={() => setActiveTab('application')}>
                  {translate('application')}
                </button>
              </li>
              <li className={activeTab === 'specifications' ? 'active' : ''}>
                <button onClick={() => setActiveTab('specifications')}>
                  {translate('specifications')}
                </button>
              </li>
              <li className={activeTab === 'documents' ? 'active' : ''}>
                <button onClick={() => setActiveTab('documents')}>
                  {translate('documents')}
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Application Tab */}
            {activeTab === 'application' && (
              <div className="tab-pane active">
                {product.applicationTexts && product.applicationTexts.length > 0 ? (
                  product.applicationTexts.map((app, index) => (
                    <div key={index} className={`content-row ${index % 2 === 1 ? 'reverse' : ''}`}>
                      <div className="content-text">
                        <h2>{app.title}</h2>
                        <p>{app.text}</p>
                      </div>
                      {app.image && (
                        isMobile ? (
                          <div className="content-image">
                            <img 
                              src={app.image} 
                              alt={app.title}
                              onError={(e) => {
                                e.target.src = '/prod.webp';
                              }}
                            />
                          </div>
                        ) : (
                          <Parallax
                            bgImage={app.image}
                            strength={100}
                            bgImageStyle={{
                              objectFit: 'cover',
                              objectPosition: index % 2 === 0 ? 'left center' : 'right center',
                            }}
                          >
                            <div className="content-image-parallax" />
                          </Parallax>
                        )
                      )}
                    </div>
                  ))
                ) : (
                  <p>No application information available.</p>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="tab-pane active">
                <div className="specifications-table">
                  {product.params && Object.keys(product.params).length > 0 ? (
                    <table>
                      <tbody>
                        {Object.entries(product.params).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>{translate('noSpecifications')}</p>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="tab-pane active">
                {product.documentLinks && product.documentLinks.length > 0 ? (
                  <div className="documents-list">
                    {product.documentLinks.map((doc, index) => {
                      // Extract filename from URL
                      const filename = doc.link.split('/').pop();
                      // Decode URL encoding and remove extension for display
                      const displayName = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');
                      
                      return (
                        <div key={index} className="document-item">
                          <a href={doc.link} target="_blank" rel="noopener noreferrer">
                            {product.title} - {displayName}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No documents available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="category-page-products">
          <div className="category-slider-section">
            <div className="category-products-header">
              <h2 className="category-products-title">
                {translate('seeAlso')}
              </h2>
            </div>

            <div className="category-products-carousel-container">
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
                  prevEl: '.swiper-button-prev-custom-related',
                  nextEl: '.swiper-button-next-custom-related',
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
                {relatedProducts.map((relatedProduct, index) => (
                  <SwiperSlide key={`${relatedProduct.id}-${index}`}>
                    <div className="category-product-item">
                      <Link to={`/products/${categoryId}/${relatedProduct.id}`} className="category-product-card">
                        <span className="category-product-img-wrapper">
                          <img 
                            src={relatedProduct.iconImageLink || relatedProduct.imageLink || '/prod.webp'} 
                            alt={relatedProduct.title}
                            onError={(e) => {
                              e.target.src = '/prod.webp';
                            }}
                          />
                        </span>
                      </Link>
                      <span className="category-product-name">{relatedProduct.title}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button 
                className="swiper-button-prev-custom-related category-products-nav"
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                className="swiper-button-next-custom-related category-products-nav"
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;