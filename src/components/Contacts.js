import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contacts.css';

const loc = process.env.PUBLIC_URL + '/loc.svg';

// SEO Meta Data
const SEO_META_DATA = {
  ka: {
    title: 'კონტაქტი - Litox Georgia | ქინძმარაულის ქ. 17, თბილისი',
    description: 'დაგვიკავშირდით Litox Georgia - Free Way LLC. მისამართი: ქინძმარაულის ქ. 17, თბილისი 0137. ტელეფონი: +995 598 34 77 84. ელ-ფოსტა: info@litox.ge. სამშენებლო მასალები თბილისში.',
    keywords: 'კონტაქტი, Litox Georgia, თბილისი, ქინძმარაულის ქ. 17, სამშენებლო მასალები, Free Way LLC, ტელეფონი, ელ-ფოსტა'
  },
  en: {
    title: 'Contacts - Litox Georgia | 17 Kindzmarauli St, Tbilisi',
    description: 'Contact Litox Georgia - Free Way LLC. Address: 17 Kindzmarauli St, Tbilisi 0137. Phone: +995 598 34 77 84. Email: info@litox.ge. Construction materials in Tbilisi.',
    keywords: 'contacts, Litox Georgia, Tbilisi, 17 Kindzmarauli St, construction materials, Free Way LLC, phone, email'
  },
  ru: {
    title: 'Контакты - Litox Georgia | ул. Киндзмараули 17, Тбилиси',
    description: 'Свяжитесь с Litox Georgia - Free Way LLC. Адрес: ул. Киндзмараули 17, Тбилиси 0137. Телефон: +995 598 34 77 84. Email: info@litox.ge. Строительные материалы в Тбилиси.',
    keywords: 'контакты, Litox Georgia, Тбилиси, ул. Киндзмараули 17, строительные материалы, Free Way LLC, телефон, email'
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

function Contacts() {
  const [language, setLanguage] = useState(() => {
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
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', 'https://litoxgeorgia.ge/contacts');

    // Cleanup function - restore original title when leaving page
    return () => {
      document.title = 'Litox Georgia - სამშენებლო მასალები თბილისში | ცემენტი, ბათქაში, წებო, შპაკლები';
    };
  }, [language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem('language') || 'ka');
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check on mount and when component updates
    const currentLang = localStorage.getItem('language') || 'ka';
    if (currentLang !== language) {
      setLanguage(currentLang);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [language]);

  // Translation function - memoized
  const translate = useCallback((key) => {
    const translations = {
      main: {
        ka: 'მთავარი',
        en: 'Main',
        ru: 'Главная'
      },
      contacts: {
        ka: 'კონტაქტი',
        en: 'Contacts',
        ru: 'Контакты'
      },
      companyName: {
        ka: 'შპს ჩერქესქსტრომი',
        en: 'LLC CHERKESSKSTROM',
        ru: 'ООО ЧЕРКЕССКСТРОМ'
      },
      location: {
        ka: 'მისამართი',
        en: 'LOCATION',
        ru: 'АДРЕС'
      },
      address: {
        ka: 'ქინძმარაულის ქ. 17, თბილისი 0137',
        en: '17 Kindzmarauli St, Tbilisi 0137',
        ru: 'ул. Киндзмараули 17, Тбилиси 0137'
      },
      phone: {
        ka: 'ტელეფონი',
        en: 'PHONE',
        ru: 'ТЕЛЕФОН'
      },
      email: {
        ka: 'ელ-ფოსტა',
        en: 'EMAIL',
        ru: 'ЭЛЕКТРОННАЯ ПОЧТА'
      },
      callUs: {
        ka: 'დაგვირეკეთ ნომერზე',
        en: 'Call us at',
        ru: 'Позвоните нам по номеру'
      },
      emailUs: {
        ka: 'მოგვწერეთ მეილზე',
        en: 'Email us at',
        ru: 'Напишите нам на'
      },
      viewOnMap: {
        ka: 'ნახეთ რუკაზე',
        en: 'View on map',
        ru: 'Посмотреть на карте'
      },
      companyLocation: {
        ka: 'კომპანიის მდებარეობა',
        en: 'Company location',
        ru: 'Местоположение компании'
      },
      contactInformation: {
        ka: 'საკონტაქტო ინფორმაცია',
        en: 'Contact information',
        ru: 'Контактная информация'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  }, [language]);

  return (
    <div className="contact-page">
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ul className="breadcrumbs">
            <li>
              <Link to="/" aria-label={translate('main')}>
                {translate('main')}
              </Link>
            </li>
            <li>
              <span aria-current="page">{translate('contacts')}</span>
            </li>
          </ul>
        </nav>
        <h1>{translate('contacts')}</h1>
      </div>

      <main className="contacts__company-info">
        <div className="container">
          <h2 className="contact-heading">{translate('address')}</h2>

          <div className="contact-layout">
            {/* Left side - Contact Info */}
            <section
              className="contact-info-box"
              aria-label={translate('contactInformation')}
            >
              <article className="info-item">
                <h3 className="info-label">{translate('location')}</h3>
                <div className="info-content">
                  <img
                    src={loc}
                    alt=""
                    width="20"
                    aria-hidden="true"
                    role="presentation"
                  />
                  <address>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=41.7189,44.7833"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${translate('viewOnMap')}: ${translate('address')}`}
                    >
                      {translate('address')}
                    </a>
                  </address>
                </div>
              </article>

              <article className="info-item">
                <h3 className="info-label">{translate('phone')}</h3>
                <div className="info-content">
                  <span className="icon" aria-hidden="true" role="presentation">📞</span>
                  <div className="phone-list">
                    <a
                      href="tel:+995598347784"
                      aria-label={`${translate('callUs')} +995 598 34 77 84`}
                    >
                      +995 598 34 77 84
                    </a>
                  </div>
                </div>
              </article>

              <article className="info-item">
                <h3 className="info-label">{translate('email')}</h3>
                <div className="info-content">
                  <span className="icon" aria-hidden="true" role="presentation">✉️</span>
                  <div className="email-list">
                    <a
                      href="mailto:info@litox.ge"
                      aria-label={`${translate('emailUs')} info@litox.ge`}
                    >
                      info@litox.ge
                    </a>
                  </div>
                </div>
              </article>
            </section>

            {/* Right side - Google Maps */}
            <section
              className="contact-map-box"
              aria-label={translate('companyLocation')}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2380.1234567890123!2d44.78123456789012!3d41.71890123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440a1234567890%3A0xabcdef1234567890!2s17%20Kindzmarauli%20St%2C%20Tbilisi%201037%2C%20Georgia!5e0!3m2!1sen!2sge!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={translate('companyLocation')}
                aria-label={`${translate('companyLocation')}: ${translate('address')}`}
              ></iframe>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contacts;