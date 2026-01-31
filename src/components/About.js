import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';
const API_BASE_URL = 'https://api.litox.ge';

// Move static data outside component
const META_DATA = {
  ka: {
    title: 'ჩვენ შესახებ - Litox Georgia | 30+ წლიანი გამოცდილება სამშენებლო მასალებში',
    description: 'Litox - წამყვანი სამშენებლო მასალების მწარმოებელი 30+ წლიანი გამოცდილებით. Free Way LLC - ოფიციალური წარმომადგენელი საქართველოში. ცემენტი, ბათქაში, შპაკლები თბილისში.',
    keywords: 'Litox Georgia, ლითოქსი საქართველო, ჩვენ შესახებ, სამშენებლო მასალები თბილისში, ცემენტი თბილისში, ბათქაში, შპაკლები, Free Way LLC',
    ogImage: process.env.PUBLIC_URL + '/products-bg.jpg'
  },
  en: {
    title: 'About Us - Litox Georgia | 30+ Years in Construction Materials',
    description: 'Litox - Leading construction materials manufacturer with 30+ years of experience. Free Way LLC - official representative in Georgia. Cement, plasters, putties in Tbilisi.',
    keywords: 'Litox Georgia, about us, construction materials Tbilisi, cement Tbilisi, plasters, putties, Free Way LLC',
    ogImage: process.env.PUBLIC_URL + '/products-bg.jpg'
  },
  ru: {
    title: 'О нас - Litox Georgia | 30+ лет опыта в строительных материалах',
    description: 'Litox - ведущий производитель строительных материалов с опытом 30+ лет. Free Way LLC - официальный представитель в Грузии. Цемент, штукатурки, шпатлёвки в Тбилиси.',
    keywords: 'Litox Georgia, о компании, строительные материалы Тбилиси, цемент Тбилиси, штукатурки, шпатлёвки, Free Way LLC',
    ogImage: process.env.PUBLIC_URL + '/products-bg.jpg'
  }
};

const TRANSLATIONS = {
  home: {
    ka: 'მთავარი',
    en: 'Home',
    ru: 'Главная'
  },
  about: {
    ka: 'ჩვენ შესახებ',
    en: 'About',
    ru: 'О нас'
  },
  aboutLitox: {
    ka: 'ლიტოქსის შესახებ',
    en: 'About Litox',
    ru: 'О Litox'
  },
  aboutLitoxGeorgia: {
    ka: 'ლიტოქსი საქართველო',
    en: 'Litox Georgia',
    ru: 'Litox Грузия'
  }
};

// Default homepage title - fallback when leaving this page
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

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language] = useState(() => localStorage.getItem('language') || 'ka');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO: Update meta tags - WITH PROPER CLEANUP
  useEffect(() => {
    const meta = META_DATA[language] || META_DATA['ka'];

    // Save original values to restore on cleanup
    const originalTitle = document.title;
    const originalLang = document.documentElement.lang;
    const originalDescription = document.querySelector('meta[name="description"]')?.content;
    const originalKeywords = document.querySelector('meta[name="keywords"]')?.content;

    // Update page title
    document.title = meta.title;

    // Update HTML lang attribute
    updateHtmlLang(language);

    // Update meta tags
    updateMetaTag('meta[name="description"]', null, 'description', meta.description);
    updateMetaTag('meta[name="keywords"]', null, 'keywords', meta.keywords);
    
    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', 'https://litoxgeorgia.ge/about');
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
    
    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', null, 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', null, 'twitter:title', meta.title);
    updateMetaTag('meta[name="twitter:description"]', null, 'twitter:description', meta.description);
    updateMetaTag('meta[name="twitter:image"]', null, 'twitter:image', meta.ogImage);
    
    // Canonical URL
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'https://litoxgeorgia.ge/about');

    // Hreflang tags for multilingual support
    updateMetaTag('link[rel="alternate"][hreflang="ka"]', 'rel', 'alternate', 'https://litoxgeorgia.ge/about');
    document.querySelector('link[rel="alternate"][hreflang="ka"]')?.setAttribute('hreflang', 'ka');
    
    updateMetaTag('link[rel="alternate"][hreflang="en"]', 'rel', 'alternate', 'https://litoxgeorgia.ge/en/about');
    document.querySelector('link[rel="alternate"][hreflang="en"]')?.setAttribute('hreflang', 'en');
    
    updateMetaTag('link[rel="alternate"][hreflang="ru"]', 'rel', 'alternate', 'https://litoxgeorgia.ge/ru/about');
    document.querySelector('link[rel="alternate"][hreflang="ru"]')?.setAttribute('hreflang', 'ru');

    // Add JSON-LD structured data
    const structuredData = {
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
        "addressLocality": "Tbilisi"
      },
      "sameAs": [
        // Add social media links if available
      ]
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.id = 'about-structured-data';
    scriptTag.text = JSON.stringify(structuredData);
    document.head.appendChild(scriptTag);

    // Cleanup function - restore everything when leaving page
    return () => {
      // Restore title - use default homepage title
      document.title = DEFAULT_TITLE;
      
      // Restore lang attribute
      if (originalLang) {
        document.documentElement.lang = originalLang;
      }

      // Restore or remove description and keywords
      if (originalDescription) {
        updateMetaTag('meta[name="description"]', null, 'description', originalDescription);
      }
      if (originalKeywords) {
        updateMetaTag('meta[name="keywords"]', null, 'keywords', originalKeywords);
      }

      // Remove page-specific Open Graph tags
      removeMetaTag('meta[property="og:title"]');
      removeMetaTag('meta[property="og:description"]');
      removeMetaTag('meta[property="og:type"]');
      removeMetaTag('meta[property="og:url"]');
      removeMetaTag('meta[property="og:image"]');

      // Remove Twitter Card tags
      removeMetaTag('meta[name="twitter:card"]');
      removeMetaTag('meta[name="twitter:title"]');
      removeMetaTag('meta[name="twitter:description"]');
      removeMetaTag('meta[name="twitter:image"]');

      // Remove canonical link
      removeMetaTag('link[rel="canonical"]');

      // Remove hreflang tags
      removeMetaTag('link[rel="alternate"][hreflang="ka"]');
      removeMetaTag('link[rel="alternate"][hreflang="en"]');
      removeMetaTag('link[rel="alternate"][hreflang="ru"]');

      // Remove structured data
      const script = document.getElementById('about-structured-data');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [language]);

  // Fetch about data with cleanup
  useEffect(() => {
    let isMounted = true;

    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/AboutUs/aboutus`, {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (response.ok && isMounted) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        if (isMounted) {
          setAboutData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAboutData();

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Memoized content formatter
  const formatContent = useCallback((text) => {
    if (!text) return '';
    
    const hasHTMLTags = /<[^>]+>/.test(text);
    
    if (hasHTMLTags) {
      return text;
    }
    
    return text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => `<p>${line.trim()}</p>`)
      .join('');
  }, []);

  // Memoized translate function
  const translate = useCallback((key) => {
    return TRANSLATIONS[key]?.[language] || TRANSLATIONS[key]?.['en'] || key;
  }, [language]);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
      Loading...
    </div>
  ), []);

  // Memoized no content component
  const noContentComponent = useMemo(() => (
    <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
      No content available
    </div>
  ), []);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="about-page-hero"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <ul className="breadcrumbs">
            <li><Link to="/">{translate('home')}</Link></li>
            <li><span>{translate('about')}</span></li>
          </ul>
          <h1>{translate('aboutLitox')}</h1>
        </div>
      </section>

      {/* About Content */}
      <div className="about-page-content">
        <div className="container">
          {loading ? loadingComponent : aboutData ? (
            <div className="about-content-wrapper">
              {/* About Litox Section */}
              {aboutData.aboutLitox && (
                <section className="about-section">
                  <h2>{translate('aboutLitox')}</h2>
                  <div 
                    className="about-text rich-text-content"
                    dangerouslySetInnerHTML={{ __html: formatContent(aboutData.aboutLitox) }}
                  />
                  {aboutData.imageUrl1 && (
                    <div className="about-image">
                      <img 
                        src={aboutData.imageUrl1} 
                        alt="About Litox" 
                        loading="lazy"
                        style={{ 
                          width: '100%', 
                          maxWidth: '800px',
                          height: 'auto',
                          borderRadius: '8px',
                          marginTop: '20px'
                        }} 
                      />
                    </div>
                  )}
                </section>
              )}

              {/* About Litox Georgia Section */}
              {aboutData.aboutLitoxGeorgia && (
                <section className="about-section">
                  <h2>{translate('aboutLitoxGeorgia')}</h2>
                  <div 
                    className="about-text rich-text-content"
                    dangerouslySetInnerHTML={{ __html: formatContent(aboutData.aboutLitoxGeorgia) }}
                  />
                  {aboutData.imageUrl2 && (
                    <div className="about-image">
                      <img 
                        src={aboutData.imageUrl2} 
                        alt="Litox Georgia" 
                        loading="lazy"
                        style={{ 
                          width: '100%', 
                          maxWidth: '800px',
                          height: 'auto',
                          borderRadius: '8px',
                          marginTop: '20px'
                        }} 
                      />
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : noContentComponent}
        </div>
      </div>
    </>
  );
}

export default About;