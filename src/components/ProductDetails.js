import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Parallax } from 'react-parallax';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/ProductDetails.css';

const API_BASE_URL = 'https://api.litox.ge';

// Default homepage title for cleanup
const DEFAULT_TITLE = 'Litox Georgia - სამშენებლო მასალები თბილისში | ცემენტი, ბათქაში, წებო, შპაკლები';

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

// Helper function to remove meta tag
const removeMetaTag = (selector) => {
  const element = document.querySelector(selector);
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

// Helper to update HTML lang attribute
const updateHtmlLang = (lang) => {
  document.documentElement.lang = lang;
};

// Helper to generate SEO-friendly title
const generatePageTitle = (productTitle, categoryTitle, language) => {
  const suffixes = {
    ka: 'Litox Georgia - სამშენებლო მასალები თბილისში',
    en: 'Litox Georgia - Construction Materials Tbilisi',
    ru: 'Litox Georgia - Строительные материалы Тбилиси'
  };
  
  const suffix = suffixes[language] || suffixes['ka'];
  
  if (categoryTitle) {
    return `${productTitle} | ${categoryTitle} | ${suffix}`;
  }
  return `${productTitle} | ${suffix}`;
};

// Helper to generate SEO-friendly description
const generateMetaDescription = (product, language) => {
  const templates = {
    ka: `${product.title} - ${product.description || 'ხარისხიანი სამშენებლო მასალა Litox Georgia-სგან'} | უფასო მიწოდება თბილისში`,
    en: `${product.title} - ${product.description || 'High-quality construction material from Litox Georgia'} | Free delivery in Tbilisi`,
    ru: `${product.title} - ${product.description || 'Качественный строительный материал от Litox Georgia'} | Бесплатная доставка по Тбилиси`
  };
  
  const description = templates[language] || templates['en'];
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
};

function ProductDetails() {
  const { categoryId, productId } = useParams();
  const [activeTab, setActiveTab] = useState('application');
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('ka');
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = React.useRef(null);

  // Handle video play button click
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  // Handle video pause/ended
  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

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
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Fetch product details when language or productId changes
  useEffect(() => {
    let isMounted = true;

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const productResponse = await fetch(
          `${API_BASE_URL}/api/Products/products/details?ProductID=${productId}`,
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
        if (isMounted) {
          setProduct(productData);
        }

        const categoriesResponse = await fetch(
          `${API_BASE_URL}/api/Category/categories`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (categoriesResponse.ok && isMounted) {
          const categoriesData = await categoriesResponse.json();
          const foundCategory = categoriesData.find(cat => cat.id === categoryId);
          setCategory(foundCategory);
        }

        const relatedResponse = await fetch(
          `${API_BASE_URL}/api/Products/products?CategoryID=${categoryId}&PageSize=10&Page=1`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (relatedResponse.ok && isMounted) {
          const relatedData = await relatedResponse.json();
          const filtered = relatedData.filter(p => p.id !== productId);
          setRelatedProducts(filtered);
        }

      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setProduct(null);
          setCategory(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchProductDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [productId, categoryId, language]);

  // SEO: Update meta tags when product data is available
  useEffect(() => {
    if (!product) return;

    const pageTitle = generatePageTitle(product.title, category?.title, language);
    const metaDescription = generateMetaDescription(product, language);
    const productImage = product.iconImageLink || product.bannerImageLink || 'https://litox.ge/prod.webp';
    const productUrl = `https://litox.ge/products/${categoryId}/${productId}`;

    const originalLang = document.documentElement.lang;

    document.title = pageTitle;
    updateHtmlLang(language);

    updateMetaTag('meta[name="description"]', null, 'description', metaDescription);
    updateMetaTag('meta[name="keywords"]', null, 'keywords', 
      `${product.title}, Litox Georgia, სამშენებლო მასალები, construction materials, ${category?.title || 'products'}`
    );

    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDescription);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'product');
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', productUrl);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', productImage);
    updateMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', product.title);
    updateMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    updateMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Litox Georgia');
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 
      language === 'ka' ? 'ka_GE' : language === 'ru' ? 'ru_RU' : 'en_US'
    );

    if (category?.title) {
      updateMetaTag('meta[property="product:category"]', 'property', 'product:category', category.title);
    }
    updateMetaTag('meta[property="product:brand"]', 'property', 'product:brand', 'Litox');

    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', productUrl);
    updateMetaTag('meta[name="robots"]', null, 'robots', 'index, follow, max-image-preview:large');

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "description": product.description || `${product.title} from Litox Georgia`,
      "image": productImage,
      "brand": {
        "@type": "Brand",
        "name": "Litox"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Litox Georgia",
        "url": "https://litox.ge"
      },
      "category": category?.title || "Construction Materials",
      "url": productUrl
    };

    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": translate('home'),
        "item": "https://litox.ge"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": translate('products'),
        "item": "https://litox.ge/products"
      }
    ];

    if (category) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": category.title,
        "item": `https://litox.ge/category/${categoryId}`
      });
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": productUrl
      });
    } else {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": productUrl
      });
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };

    let productScript = document.getElementById('product-structured-data');
    if (!productScript) {
      productScript = document.createElement('script');
      productScript.type = 'application/ld+json';
      productScript.id = 'product-structured-data';
      document.head.appendChild(productScript);
    }
    productScript.text = JSON.stringify(productSchema);

    let breadcrumbScript = document.getElementById('breadcrumb-structured-data');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.id = 'breadcrumb-structured-data';
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.text = JSON.stringify(breadcrumbSchema);

    return () => {
      document.title = DEFAULT_TITLE;
      
      if (originalLang) {
        document.documentElement.lang = originalLang;
      }

      removeMetaTag('meta[property="og:title"]');
      removeMetaTag('meta[property="og:description"]');
      removeMetaTag('meta[property="og:type"]');
      removeMetaTag('meta[property="og:url"]');
      removeMetaTag('meta[property="og:image"]');
      removeMetaTag('meta[property="og:image:alt"]');
      removeMetaTag('meta[property="og:image:width"]');
      removeMetaTag('meta[property="og:image:height"]');
      removeMetaTag('meta[property="og:site_name"]');
      removeMetaTag('meta[property="og:locale"]');
      removeMetaTag('meta[property="product:category"]');
      removeMetaTag('meta[property="product:brand"]');
      removeMetaTag('link[rel="canonical"]');

      const productScriptEl = document.getElementById('product-structured-data');
      if (productScriptEl && productScriptEl.parentNode) {
        productScriptEl.parentNode.removeChild(productScriptEl);
      }

      const breadcrumbScriptEl = document.getElementById('breadcrumb-structured-data');
      if (breadcrumbScriptEl && breadcrumbScriptEl.parentNode) {
        breadcrumbScriptEl.parentNode.removeChild(breadcrumbScriptEl);
      }
    };
  }, [product, category, language, categoryId, productId]);

  const getProductImage = () => {
    if (!product) return '/prod.webp';
    const image = product.iconImageLink || '/prod.webp';
    return image;
  };

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
      },
      viewProduct: {
        ka: 'ნახე პროდუქტი',
        en: 'View product',
        ru: 'Посмотреть продукт'
      },
      downloadDocument: {
        ka: 'ჩამოტვირთე დოკუმენტი',
        en: 'Download document',
        ru: 'Скачать документ'
      },
      previousSlide: {
        ka: 'წინა სლაიდი',
        en: 'Previous slide',
        ru: 'Предыдущий слайд'
      },
      nextSlide: {
        ka: 'შემდეგი სლაიდი',
        en: 'Next slide',
        ru: 'Следующий слайд'
      },
      productFeatures: {
        ka: 'პროდუქტის მახასიათებლები',
        en: 'Product features',
        ru: 'Характеристики продукта'
      },
      relatedProducts: {
        ka: 'მსგავსი პროდუქტები',
        en: 'Related products',
        ru: 'Похожие продукты'
      },
      productVideo: {
        ka: 'პროდუქტის ვიდეო',
        en: 'Product Video',
        ru: 'Видео продукта'
      }
    };

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const SkeletonLoader = () => (
    <div className="product-details-container">
      <section 
        className="product-hero skeleton-hero"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 40%, rgba(92, 64, 51) 100%)'
        }}
        aria-label={translate('loading')}
      >
        <div className="breadcrumbs-wrapper">
          <div className="skeleton-breadcrumbs" aria-hidden="true">
            <div className="skeleton-breadcrumb"></div>
            <div className="skeleton-breadcrumb"></div>
            <div className="skeleton-breadcrumb"></div>
          </div>
        </div>

        <div className="skeleton-product-image" aria-hidden="true"></div>

        <div className="container">
          <div className="skeleton-title" aria-hidden="true"></div>
          <div className="skeleton-description" aria-hidden="true"></div>
        </div>
      </section>

      <section className="product-tabs-section" aria-hidden="true">
        <div className="container">
          <div className="tabs-header">
            <div className="skeleton-tabs">
              <div className="skeleton-tab"></div>
              <div className="skeleton-tab"></div>
              <div className="skeleton-tab"></div>
            </div>
          </div>

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

      <div className="category-page-products" aria-hidden="true">
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
          <div className="error" role="alert" aria-live="assertive">
            {translate('error')}: {error || translate('productNotFound')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="product-details-container" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content={product.title} />
      <meta itemProp="description" content={product.description || `${product.title} from Litox Georgia`} />
      {product.iconImageLink && <meta itemProp="image" content={product.iconImageLink} />}
      
      <header 
        className="product-hero"
        style={{
          backgroundImage: product.bannerImageLink 
            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${product.bannerImageLink})`
            : 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 40%, rgba(92, 64, 51) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        role="banner"
      >
        <nav className="breadcrumbs-wrapper" aria-label="Breadcrumb">
          <ul className="product-detail-breadcrumbs">
            <li>
              <Link to="/" aria-label={translate('home')}>
                {translate('home')}
              </Link>
            </li>
            <li>
              <Link to="/products" aria-label={translate('products')}>
                {translate('products')}
              </Link>
            </li>
            {category && (
              <li>
                <Link 
                  to={`/category/${categoryId}`}
                  aria-label={`${translate('products')}: ${category.title}`}
                >
                  {category.title}
                </Link>
              </li>
            )}
            <li>
              <span aria-current="page">{product.title}</span>
            </li>
          </ul>
        </nav>

        <img 
          src={getProductImage()} 
          alt={product.title} 
          className="product-small-img"
          loading="eager"
          itemProp="image"
          onError={(e) => {
            e.target.src = '/prod.webp';
          }}
        />

        <div className="container">
          <h1 itemProp="name">{product.title}</h1>
          {product.description && (
            <div className="preview-text" itemProp="description">
              {product.description}
            </div>
          )}
        </div>

        {product.keywrods && product.keywrods.length > 0 && (
          <section 
            className="features-overlay"
            aria-label={translate('productFeatures')}
          >
            <div className="container">
              <ul className="flex" role="list">
                {product.keywrods.map((keyword, index) => (
                  <React.Fragment key={keyword.id}>
                    <li className="col">
                      {keyword.imageLink && (
                        <img 
                          src={keyword.imageLink} 
                          alt=""
                          role="presentation"
                          aria-hidden="true"
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            marginRight: '8px',
                            verticalAlign: 'middle'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <span>{keyword.name}</span>
                    </li>
                    {index < product.keywrods.length - 1 && (
                      <li className="razd" aria-hidden="true"></li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </section>
        )}
      </header>

      <section className="product-tabs-section">
        <div className="container">
          <nav className="tabs-header" aria-label="Product information tabs">
            <ul className="tab-list" role="tablist">
              <li role="presentation" className={activeTab === 'application' ? 'active' : ''}>
                <button 
                  onClick={() => setActiveTab('application')}
                  role="tab"
                  aria-selected={activeTab === 'application'}
                  aria-controls="application-panel"
                  id="application-tab"
                >
                  {translate('application')}
                </button>
              </li>
              <li role="presentation" className={activeTab === 'specifications' ? 'active' : ''}>
                <button 
                  onClick={() => setActiveTab('specifications')}
                  role="tab"
                  aria-selected={activeTab === 'specifications'}
                  aria-controls="specifications-panel"
                  id="specifications-tab"
                >
                  {translate('specifications')}
                </button>
              </li>
              <li role="presentation" className={activeTab === 'documents' ? 'active' : ''}>
                <button 
                  onClick={() => setActiveTab('documents')}
                  role="tab"
                  aria-selected={activeTab === 'documents'}
                  aria-controls="documents-panel"
                  id="documents-tab"
                >
                  {translate('documents')}
                </button>
              </li>
            </ul>
          </nav>

          <div className="tab-content">
            {/* Application Tab */}
            {activeTab === 'application' && (
              <div 
                className="tab-pane active"
                role="tabpanel"
                id="application-panel"
                aria-labelledby="application-tab"
              >
                {product.applicationTexts && product.applicationTexts.length > 0 ? (
                  product.applicationTexts.map((app, index) => (
                    <article key={index} className={`content-row ${index % 2 === 1 ? 'reverse' : ''}`}>
                      <div className="content-text">
                        <h2>{app.title}</h2>
                        <div 
                          className="formatted-content"
                          dangerouslySetInnerHTML={{ __html: app.text }}
                        />
                      </div>
                      {app.image && (
                        isMobile ? (
                          <figure className="content-image">
                            <img 
                              src={app.image} 
                              alt={app.title}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = '/prod.webp';
                              }}
                            />
                          </figure>
                        ) : (
                          <Parallax
                            bgImage={app.image}
                            strength={100}
                            bgImageStyle={{
                              objectFit: 'cover',
                              objectPosition: index % 2 === 0 ? 'left center' : 'right center',
                            }}
                            role="img"
                            aria-label={app.title}
                          >
                            <div className="content-image-parallax" />
                          </Parallax>
                        )
                      )}
                    </article>
                  ))
                ) : (
                  <p>No application information available.</p>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div 
                className="tab-pane active"
                role="tabpanel"
                id="specifications-panel"
                aria-labelledby="specifications-tab"
              >
                <div className="specifications-table">
                  {product.params && Object.keys(product.params).length > 0 ? (
                    <table role="table" aria-label={translate('specifications')}>
                      <tbody>
                        {Object.entries(product.params).map(([key, value]) => (
                          <tr key={key}>
                            <th scope="row">{key}</th>
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
              <div 
                className="tab-pane active"
                role="tabpanel"
                id="documents-panel"
                aria-labelledby="documents-tab"
              >
                {product.documentLinks && product.documentLinks.length > 0 ? (
                  <ul className="documents-list" role="list">
                    {product.documentLinks.map((doc, index) => {
                      const filename = doc.link.split('/').pop();
                      const displayName = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');
                      
                      return (
                        <li key={index} className="document-item">
                          <a 
                            href={doc.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={`${translate('downloadDocument')}: ${product.title} - ${displayName}`}
                          >
                            {product.title} - {displayName}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No documents available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Video Section - Above "See Also" */}
      {product.videoLink && (
        <section className="product-video-section" aria-label={translate('productVideo')}>
          <div className="container">
            <div className="video-wrapper">
              <div className="video-container">
                <video 
                  ref={videoRef}
                  preload="metadata"
                  poster={product.bannerImageLink || product.iconImageLink}
                  aria-label={`${translate('productVideo')}: ${product.title}`}
                  onPause={handleVideoPause}
                  onEnded={handleVideoPause}
                  controls
                >
                  <source src={product.videoLink} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play Button Overlay */}
                <div 
                  className={`video-play-overlay ${isVideoPlaying ? 'hidden' : ''}`}
                  onClick={handlePlayClick}
                  role="button"
                  tabIndex={0}
                  aria-label="Play video"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePlayClick();
                    }
                  }}
                >
                  <div className="play-button-circle">
                    <div className="play-triangle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <aside className="category-page-products" aria-labelledby="related-products-heading">
          <section className="category-slider-section">
            <div className="category-products-header">
              <h3 id="related-products-heading" className="category-products-title">
                {translate('seeAlso')}
              </h3>
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
                aria-label={translate('relatedProducts')}
              >
                {relatedProducts.map((relatedProduct, index) => (
                  <SwiperSlide key={`${relatedProduct.id}-${index}`}>
                    <article className="category-product-item">
                      <Link 
                        to={`/products/${categoryId}/${relatedProduct.id}`} 
                        className="category-product-card"
                        aria-label={`${translate('viewProduct')}: ${relatedProduct.title}`}
                      >
                        <figure className="category-product-img-wrapper">
                          <img 
                            src={relatedProduct.iconImageLink || relatedProduct.imageLink || '/prod.webp'} 
                            alt={relatedProduct.title}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/prod.webp';
                            }}
                          />
                        </figure>
                      </Link>
                      <h3 
                        className="category-product-name" 
                        style={{ 
                          maxWidth: '270px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.4em',
                          maxHeight: '2.8em'
                        }}
                      >
                        {relatedProduct.title}
                      </h3>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button 
                className="swiper-button-prev-custom-related category-products-nav"
                aria-label={translate('previousSlide')}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                className="swiper-button-next-custom-related category-products-nav"
                aria-label={translate('nextSlide')}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </section>
        </aside>
      )}
    </article>
  );
}

export default ProductDetails;