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

// SEO-friendly Link component that works with both React Router and crawlers
const SEOLink = ({ to, children, className, ...props }) => {
  const handleClick = (e) => {
    // Let React Router handle the navigation for better UX
    // The href attribute ensures crawlers can follow the link
  };

  return (
    <Link
      to={to}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language] = useState(() => localStorage.getItem('language') || 'ka');

  // Get the proper URL based on language
  const getLocalizedUrl = useCallback((path) => {
    const baseUrl = 'https://litoxgeorgia.ge';
    if (language === 'ka') {
      return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${language}${path}`;
  }, [language]);

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
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', getLocalizedUrl('/about'));
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', null, 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', null, 'twitter:title', meta.title);
    updateMetaTag('meta[name="twitter:description"]', null, 'twitter:description', meta.description);
    updateMetaTag('meta[name="twitter:image"]', null, 'twitter:image', meta.ogImage);

    // Canonical URL - use the localized URL
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', getLocalizedUrl('/about'));

    // Hreflang tags for multilingual support
    const updateHreflangTag = (lang, url) => {
      const selector = `link[rel="alternate"][hreflang="${lang}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.rel = 'alternate';
        element.hreflang = lang;
        document.head.appendChild(element);
      }
      element.href = url;
    };

    updateHreflangTag('ka', 'https://litoxgeorgia.ge/about');
    updateHreflangTag('en', 'https://litoxgeorgia.ge/en/about');
    updateHreflangTag('ru', 'https://litoxgeorgia.ge/ru/about');
    updateHreflangTag('x-default', 'https://litoxgeorgia.ge/about');

    // Add JSON-LD structured data with BreadcrumbList
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://litoxgeorgia.ge/#organization",
          "name": "Litox Georgia",
          "alternateName": "Free Way LLC",
          "url": "https://litoxgeorgia.ge",
          "logo": {
            "@type": "ImageObject",
            "url": "https://litoxgeorgia.ge/logo.png"
          },
          "description": meta.description,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GE",
            "addressLocality": "Tbilisi"
          }
        },
        {
          "@type": "WebPage",
          "@id": getLocalizedUrl('/about#webpage'),
          "url": getLocalizedUrl('/about'),
          "name": meta.title,
          "description": meta.description,
          "inLanguage": language,
          "isPartOf": {
            "@id": "https://litoxgeorgia.ge/#website"
          },
          "about": {
            "@id": "https://litoxgeorgia.ge/#organization"
          },
          "breadcrumb": {
            "@id": getLocalizedUrl('/about#breadcrumb')
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": getLocalizedUrl('/about#breadcrumb'),
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": TRANSLATIONS.home[language],
              "item": getLocalizedUrl('/')
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": TRANSLATIONS.about[language],
              "item": getLocalizedUrl('/about')
            }
          ]
        }
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
      removeMetaTag('link[rel="alternate"][hreflang="x-default"]');

      // Remove structured data
      const script = document.getElementById('about-structured-data');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [language, getLocalizedUrl]);

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
          <nav aria-label="Breadcrumb">
            <ul className="breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <SEOLink to="/" itemProp="item">
                  <span itemProp="name">{translate('home')}</span>
                </SEOLink>
                <meta itemProp="position" content="1" />
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{translate('about')}</span>
                <meta itemProp="position" content="2" />
              </li>
            </ul>
          </nav>
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
                <section className="about-section" itemScope itemType="https://schema.org/AboutPage">

                  <div
                    className="about-text rich-text-content"
                    itemProp="text"
                    dangerouslySetInnerHTML={{ __html: formatContent(aboutData.aboutLitox) }}
                  />
                  {aboutData.imageUrl1 && (
                    <div className="about-image" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
                      <img
                        src={aboutData.imageUrl1}
                        alt="About Litox - construction materials manufacturing"
                        itemProp="url"
                        loading="lazy"
                        width="800"
                        height="auto"
                        style={{
                          width: '100%',
                          maxWidth: '800px',
                          height: 'auto',
                          borderRadius: '8px',
                          marginTop: '20px'
                        }}
                      />
                      <meta itemProp="description" content="Litox construction materials manufacturing facility" />
                    </div>
                  )}
                </section>
              )}

              {/* About Litox Georgia Section */}
              {aboutData.aboutLitoxGeorgia && (
                <section className="about-section" itemScope itemType="https://schema.org/AboutPage">
                  <h2 itemProp="headline">{translate('aboutLitoxGeorgia')}</h2>
                  <div
                    className="about-text rich-text-content"
                    itemProp="text"
                    dangerouslySetInnerHTML={{ __html: formatContent(aboutData.aboutLitoxGeorgia) }}
                  />
                  {aboutData.imageUrl2 && (
                    <div className="about-image" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
                      <img
                        src={aboutData.imageUrl2}
                        alt="Litox Georgia - Free Way LLC official representative"
                        itemProp="url"
                        loading="lazy"
                        width="800"
                        height="auto"
                        style={{
                          width: '100%',
                          maxWidth: '800px',
                          height: 'auto',
                          borderRadius: '8px',
                          marginTop: '20px'
                        }}
                      />
                      <meta itemProp="description" content="Litox Georgia operations and distribution" />
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