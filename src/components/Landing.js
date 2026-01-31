import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', 'https://litoxgeorgia.ge');
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', language === 'ka' ? 'ka_GE' : language === 'ru' ? 'ru_RU' : 'en_US');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Litox Georgia');
    
    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', null, 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', null, 'twitter:title', meta.title);
    updateMetaTag('meta[name="twitter:description"]', null, 'twitter:description', meta.description);
    updateMetaTag('meta[name="twitter:image"]', null, 'twitter:image', meta.ogImage);
    
    // Canonical URL
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'https://litoxgeorgia.ge');

    // Hreflang tags for multilingual SEO
    updateMetaTag('link[rel="alternate"][hreflang="ka"]', 'rel', 'alternate', 'https://litoxgeorgia.ge');
    document.querySelector('link[rel="alternate"][hreflang="ka"]')?.setAttribute('hreflang', 'ka');
    
    updateMetaTag('link[rel="alternate"][hreflang="en"]', 'rel', 'alternate', 'https://litoxgeorgia.ge/en');
    document.querySelector('link[rel="alternate"][hreflang="en"]')?.setAttribute('hreflang', 'en');
    
    updateMetaTag('link[rel="alternate"][hreflang="ru"]', 'rel', 'alternate', 'https://litoxgeorgia.ge/ru');
    document.querySelector('link[rel="alternate"][hreflang="ru"]')?.setAttribute('hreflang', 'ru');

    updateMetaTag('link[rel="alternate"][hreflang="x-default"]', 'rel', 'alternate', 'https://litoxgeorgia.ge');
    document.querySelector('link[rel="alternate"][hreflang="x-default"]')?.setAttribute('hreflang', 'x-default');

    // Robots meta
    updateMetaTag('meta[name="robots"]', null, 'robots', 'index, follow, max-image-preview:large');
    
    // Add JSON-LD structured data for Organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Litox Georgia",
      "alternateName": "Free Way LLC",
      "url": "https://litoxgeorgia.ge",
      "logo": "https://litoxgeorgia.ge/logo.png",
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
        // Add social media links here when available
        // "https://www.facebook.com/litoxgeorgia",
        // "https://www.instagram.com/litoxgeorgia"
      ]
    };

    // Add JSON-LD for WebSite with search action
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Litox Georgia",
      "url": "https://litoxgeorgia.ge",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://litoxgeorgia.ge/search?q={search_term_string}",
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

  // Navigate based on whether banner has productID
  const handleMoreDetails = (e) => {
    e.preventDefault();
    const currentBanner = banners[currentSlide];
    
    if (currentBanner?.productID) {
      // Navigate directly to product details using just productID
      navigate(`/product/${currentBanner.productID}`);
    } else {
      // If no productID, go to general products page
      navigate('/products');
    }
  };

  // Translation function for button text
  const translate = (key) => {
    const translations = {
      moreDetailed: {
        ka: 'დეტალურად',
        en: 'MORE DETAILED',
        ru: 'ПОДРОБНЕЕ'
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
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  if (loading) {
    return (
      <div className="intro-slider">
        <div className="carousel-container">
          <div className="landing-skeleton-container">
            <div className="landing-skeleton-image"></div>
            
            <div className="landing-skeleton-text-wrapper">
              <div className="landing-skeleton-text"></div>
              <div className="landing-skeleton-button"></div>
            </div>

            <div className="landing-skeleton-controls">
              <div className="landing-skeleton-arrow"></div>
              <div className="landing-skeleton-dots">
                <div className="landing-skeleton-dot"></div>
                <div className="landing-skeleton-dot"></div>
                <div className="landing-skeleton-dot"></div>
              </div>
              <div className="landing-skeleton-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="intro-slider">
        <div className="carousel-container">
          <div className="error">{translate('noBanners')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="intro-slider">
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-track">
            {images.map((img, index) => (
              <div 
                key={index} 
                className="carousel-slide"
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  zIndex: index === currentSlide ? 2 : 0,
                  visibility: index === currentSlide ? 'visible' : 'hidden'
                }}
              >
                <div className="image-wrapper">
                  <img 
                    src={img} 
                    alt={banners[index]?.text || `Litox Georgia - სამშენებლო მასალები ${index + 1}`}
                    className="carousel-image"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    key={`${index}-${currentSlide}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="intro-slide-text">
            {banners[currentSlide]?.text && (
              <p className="banner-text">{banners[currentSlide].text}</p>
            )}
            {/* Only show button if banner has productID */}
            {banners[currentSlide]?.productID && (
              <a href="#" className="default-btn" onClick={handleMoreDetails}>
                {translate('moreDetailed')}
              </a>
            )}
          </div>
        </div>

        <div className="carousel-controls">
          <button 
            className="arrow-btn prev-btn" 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="numbered-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`number-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button 
            className="arrow-btn next-btn" 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;