import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contacts.css';

const loc = process.env.PUBLIC_URL + '/loc.svg';

function Contacts() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });

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

  // Translation function
  const translate = (key) => {
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
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <div className="contact-page">
      <div className="container">
        <ul className="breadcrumbs">
          <li><Link to="/">{translate('main')}</Link></li>
          <li><span>{translate('contacts')}</span></li>
        </ul>
        <h1>{translate('contacts')}</h1>
      </div>

      <div className="contacts__company-info">
        <div className="container">
          <h2 className="contact-heading">{translate('address')}</h2>
          
          <div className="contact-layout">
            {/* Left side - Contact Info */}
            <div className="contact-info-box">
              <div className="info-item">
                <div className="info-label">{translate('location')}</div>
                <div className="info-content">
                  <img src={loc} alt="location" width="20" />
                  <address>{translate('address')}</address>
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">{translate('phone')}</div>
                <div className="info-content">
                  <span className="icon">📞</span>
                  <div className="phone-list">
                    <a href="tel:+995598347784">+995 598 34 77 84</a>
                  </div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">{translate('email')}</div>
                <div className="info-content">
                  <span className="icon">✉️</span>
                  <div className="email-list">
                    <a href="mailto:info@litox.ge">info@litox.ge</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Google Maps */}
            <div className="contact-map-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.234567!2d44.7833!3d41.7189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQzJzA4LjAiTiA0NMKwNDYnNTkuOSJF!5e0!3m2!1sen!2sge!4v1234567890&markers=color:red%7C41.7189,44.7833"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;