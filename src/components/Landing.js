import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Landing.css';

const API_BASE_URL = 'https://api.litox.ge';

// SEO Meta Data for Homepage
const META_DATA = {
  ka: {
    title: 'Litox Georgia - სამშენებლო მასალები თბილისში | ცემენტი, ბათქაში, წებო, შპაკლები',
    description: 'Litox Georgia - წამყვანი სამშენებლო მასალების მომწოდებელი საქართველოში. ხარისხიანი ცემენტი, ბათქაში, წებო, შპაკლები და სხვა სამშენებლო პროდუქტები. უფასო მიწოდება თბილისში.',
    keywords: 'Litox Georgia, ლითოქსი საქართველო, სამშენებლო მასალები თბილისში, ცემენტი თბილისში, ბათქაში, წებო, შპაკლები, სამშენებლო პროდუქტები, Free Way LLC',
    ogImage: process.env.PUBLIC_URL + '/og-image.jpg'
  },
  en: {
    title: 'Litox Georgia - Construction Materials in Tbilisi | Cement, Plaster, Glue, Putty',
    description: 'Litox Georgia - Leading construction materials supplier in Georgia. High-quality cement, plasters, adhesives, putties and other building products. Free delivery in Tbilisi.',
    keywords: 'Litox Georgia, construction materials Tbilisi, cement Tbilisi, plaster, adhesive, putty, building products, Free Way LLC',
    ogImage: process.env.PUBLIC_URL + '/og-image.jpg'
  },
  ru: {
    title: 'Litox Georgia - Строительные материалы в Тбилиси | Цемент, Штукатурка, Клей, Шпатлёвка',
    description: 'Litox Georgia - ведущий поставщик строительных материалов в Грузии. Качественный цемент, штукатурки, клей, шпатлёвки и другие стройматериалы. Бесплатная доставка по Тбилиси.',
    keywords: 'Litox Georgia, строительные материалы Тбилиси, цемент Тбилиси, штукатурка, клей, шпатлёвка, стройматериалы, Free Way LLC',
    ogImage: process.env.PUBLIC_URL + '/og-image.jpg'
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

// Helper to update HTML lang attribute
const updateHtmlLang = (lang) => {
  document.documentElement.lang = lang;
};

function Landing() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('ka');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  // SEO: Update meta tags for homepage
  useEffect(() => {
    const meta = META_DATA[language] || META_DATA['ka'];

    // Update page title
    document.title = meta.title;

    // Update HTML lang attribute
    updateHtmlLang(language);

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', null, 'description', meta.description);
    updateMetaTag('meta[name="keywords"]', null, 'keywords', meta.keywords);
    
    // Open Graph tags for social sharing
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', 'https://litox.ge');
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', language === 'ka' ? 'ka_GE' : language === 'ru' ? 'ru_RU' : 'en_US');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Litox Georgia');
    
    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', null, 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', null, 'twitter:title', meta.title);
    updateMetaTag('meta[name="twitter:description"]', null, 'twitter:description', meta.description);
    updateMetaTag('meta[name="twitter:image"]', null, 'twitter:image', meta.ogImage);
    
    // Canonical URL
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'https://litox.ge');

    // Hreflang tags for multilingual SEO
    const baseUrl = 'https://litox.ge';
    const languages = [
      { lang: 'ka', url: `${baseUrl}` },
      { lang: 'en', url: `${baseUrl}/en` },
      { lang: 'ru', url: `${baseUrl}/ru` },
      { lang: 'x-default', url: `${baseUrl}` }
    ];

    languages.forEach(({ lang, url }) => {
      let link = document.querySelector(`link[hreflang="${lang}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = url;
        document.head.appendChild(link);
      } else {
        link.href = url;
      }
    });

    // Robots meta
    updateMetaTag('meta[name="robots"]', null, 'robots', 'index, follow, max-image-preview:large');
    
    // Add JSON-LD structured data for Organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Litox Georgia",
      "alternateName": "Free Way LLC",
      "url": "https://litox.ge",
      "logo": "https://litox.ge/logo.png",
      "description": meta.description,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GE",
        "addressLocality": "Tbilisi",
        "addressRegion": "Tbilisi"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": ["Georgian", "English", "Russian"]
      },
      "sameAs": [
       "https://www.facebook.com/LitoxGeorgia",
       'https://www.instagram.com/litox_georgia/',
       'https://www.tiktok.com/@litox_georgia'
      ]
    };

    // Add JSON-LD for WebSite with search action
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Litox Georgia",
      "url": "https://litox.ge",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://litox.ge/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Create or update structured data script tags
    let orgScript = document.getElementById('organization-structured-data');
    if (!orgScript) {
      orgScript = document.createElement('script');
      orgScript.type = 'application/ld+json';
      orgScript.id = 'organization-structured-data';
      document.head.appendChild(orgScript);
    }
    orgScript.text = JSON.stringify(organizationSchema);

    let websiteScript = document.getElementById('website-structured-data');
    if (!websiteScript) {
      websiteScript = document.createElement('script');
      websiteScript.type = 'application/ld+json';
      websiteScript.id = 'website-structured-data';
      document.head.appendChild(websiteScript);
    }
    websiteScript.text = JSON.stringify(websiteSchema);

    // No cleanup needed for homepage since this is the default state
  }, [language]);

  // Fetch banners when language changes
  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Banners/banners`, {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }

        const data = await response.json();
        
        if (isMounted) {
          if (data && data.length > 0) {
            setBanners(data);
          } else {
            setBanners([]);
          }
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
        if (isMounted) {
          setBanners([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const images = banners.map(banner => banner.imageLink).filter(url => url);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    if (index === currentSlide || images.length === 0) return;
    setCurrentSlide(index);
  };

  // Handle product link click
  const handleProductClick = (e, productID) => {
    e.preventDefault();
    navigate(`/product/${productID}`);
  };

  // Translation function for button text and aria labels
  const translate = (key) => {
    const translations = {
      moreDetailed: {
        ka: 'დეტალურად',
        en: 'More Detailed',
        ru: 'Подробнее'
      },
      viewProduct: {
        ka: 'პროდუქტის ნახვა',
        en: 'View Product',
        ru: 'Посмотреть продукт'
      },
      loading: {
        ka: 'იტვირთება...',
        en: 'Loading banners...',
        ru: 'Загрузка...'
      },
      noBanners: {
        ka: 'ბანერები არ არის',
        en: 'No banners available',
        ru: 'Баннеры недоступны'
      },
      mainCarousel: {
        ka: 'Litox Georgia - ძირითადი სლაიდერი',
        en: 'Litox Georgia - Main Carousel',
        ru: 'Litox Georgia - Основной слайдер'
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
      slideOf: {
        ka: 'სლაიდი {current} {total}-დან',
        en: 'Slide {current} of {total}',
        ru: 'Слайд {current} из {total}'
      },
      goToSlide: {
        ka: 'გადადით სლაიდზე {number}',
        en: 'Go to slide {number}',
        ru: 'Перейти к слайду {number}'
      },
      carouselNavigation: {
        ka: 'სლაიდერის ნავიგაცია',
        en: 'Carousel navigation',
        ru: 'Навигация по слайдеру'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  if (loading) {
    return (
      <main role="main" aria-labelledby="main-carousel-heading" aria-busy="true">
        <section className="intro-slider" aria-label={translate('mainCarousel')}>
          <div className="carousel-container">
            <h1 id="main-carousel-heading" className="visually-hidden">{translate('mainCarousel')}</h1>
            <div className="landing-skeleton-container" aria-live="polite" aria-label={translate('loading')}>
              <div className="landing-skeleton-image" aria-hidden="true"></div>
              
              <div className="landing-skeleton-text-wrapper">
                <div className="landing-skeleton-text" aria-hidden="true"></div>
                <div className="landing-skeleton-button" aria-hidden="true"></div>
              </div>

              <div className="landing-skeleton-controls">
                <div className="landing-skeleton-arrow" aria-hidden="true"></div>
                <div className="landing-skeleton-dots" aria-hidden="true">
                  <div className="landing-skeleton-dot" aria-hidden="true"></div>
                  <div className="landing-skeleton-dot" aria-hidden="true"></div>
                  <div className="landing-skeleton-dot" aria-hidden="true"></div>
                </div>
                <div className="landing-skeleton-arrow" aria-hidden="true"></div>
              </div>
            </div>
            <span className="visually-hidden" role="status">{translate('loading')}</span>
          </div>
        </section>
      </main>
    );
  }

  if (images.length === 0) {
    return (
      <main role="main" aria-labelledby="main-carousel-heading">
        <section className="intro-slider" aria-label={translate('mainCarousel')}>
          <div className="carousel-container">
            <h1 id="main-carousel-heading" className="visually-hidden">{translate('mainCarousel')}</h1>
            <div className="error" role="alert" aria-live="assertive">{translate('noBanners')}</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main role="main" aria-labelledby="main-carousel-heading">
      <section 
        className="intro-slider" 
        aria-roledescription="carousel" 
        aria-label={translate('mainCarousel')}
      >
        <div className="carousel-container">
          <h1 id="main-carousel-heading" className="visually-hidden">{translate('mainCarousel')}</h1>
          
          <div className="carousel-wrapper">
            <div 
              className="carousel-track" 
              role="group"
              aria-roledescription="slide container"
              aria-live="polite"
              aria-atomic="false"
            >
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="carousel-slide"
                  style={{
                    opacity: index === currentSlide ? 1 : 0,
                    zIndex: index === currentSlide ? 2 : 0,
                    visibility: index === currentSlide ? 'visible' : 'hidden'
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-hidden={index !== currentSlide}
                  aria-label={translate('slideOf')
                    .replace('{current}', index + 1)
                    .replace('{total}', images.length)}
                >
                  <div className="image-wrapper">
                    <img 
                      src={img} 
                      alt={banners[index]?.text || 
                        (language === 'ka' ? `Litox Georgia - სამშენებლო მასალები ${index + 1}` :
                         language === 'ru' ? `Litox Georgia - строительные материалы ${index + 1}` :
                         `Litox Georgia - construction materials ${index + 1}`)}
                      className="carousel-image"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      width="1200"
                      height="600"
                      fetchpriority={index === 0 ? 'high' : 'auto'}
                      key={`${index}-${currentSlide}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="intro-slide-text" aria-live="polite" aria-atomic="true">
              {banners[currentSlide]?.text && (
                <p className="banner-text">{banners[currentSlide].text}</p>
              )}
              {/* Only show button if banner has productID - Using React Router Link for SPA navigation with SEO-friendly href */}
              {banners[currentSlide]?.productID && (
                <Link 
                  to={`/product/${banners[currentSlide].productID}`}
                  className="default-btn"
                  aria-label={`${translate('viewProduct')}: ${banners[currentSlide]?.text || translate('moreDetailed')}`}
                  title={`${translate('viewProduct')}: ${banners[currentSlide]?.text || ''}`}
                >
                  {translate('moreDetailed')}
                </Link>
              )}
            </div>
          </div>

          <nav 
            className="carousel-controls" 
            aria-label={translate('carouselNavigation')}
          >
            <button 
              className="arrow-btn prev-btn" 
              onClick={prevSlide}
              aria-label={translate('previousSlide')}
              aria-controls="main-carousel-heading"
              disabled={images.length <= 1}
              type="button"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                aria-hidden="true"
                focusable="false"
              >
                <title>{translate('previousSlide')}</title>
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div 
              className="numbered-dots" 
              role="tablist"
              aria-label={translate('carouselNavigation')}
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`number-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={translate('goToSlide').replace('{number}', index + 1)}
                  role="tab"
                  aria-selected={currentSlide === index}
                  aria-controls="main-carousel-heading"
                  tabIndex={currentSlide === index ? 0 : -1}
                  type="button"
                >
                  {index + 1}
                  <span className="visually-hidden">
                    {translate('slideOf')
                      .replace('{current}', index + 1)
                      .replace('{total}', images.length)}
                  </span>
                </button>
              ))}
            </div>

            <button 
              className="arrow-btn next-btn" 
              onClick={nextSlide}
              aria-label={translate('nextSlide')}
              aria-controls="main-carousel-heading"
              disabled={images.length <= 1}
              type="button"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                aria-hidden="true"
                focusable="false"
              >
                <title>{translate('nextSlide')}</title>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </nav>
        </div>
      </section>
    </main>
  );
}

export default Landing;