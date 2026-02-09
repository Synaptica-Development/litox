import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const img1 = `${process.env.PUBLIC_URL}/icon1.svg`;
const img2 = `${process.env.PUBLIC_URL}/icon2.svg`;
const img3 = `${process.env.PUBLIC_URL}/icon3.svg`;
const fb_link = 'https://www.facebook.com/LitoxGeorgia';
const insta_link = 'https://www.instagram.com/litox_georgia/';
const tiktok_link = 'https://www.tiktok.com/@litox_georgia';

function Footer() {
  const [language, setLanguage] = useState('ka');

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  // Translation function
  const translate = (key) => {
    const translations = {
      whereToBuy: {
        ka: 'სად შევიძინოთ',
        en: 'Where to Buy',
        ru: 'Где купить'
      },
      callUs: {
        ka: 'დაგვირეკეთ',
        en: 'Call Us',
        ru: 'Позвоните нам'
      },
      mail: {
        ka: 'მოგვწერეთ',
        en: 'Mail',
        ru: 'Почта'
      },
      downloadCatalog: {
        ka: 'ჩამოტვირთეთ ელექტრონული კატალოგი',
        en: 'Download Electronic Catalog',
        ru: 'Скачать электронный каталог'
      },
      privacyPolicy: {
        ka: 'კონფიდენციალურობის პოლიტიკა',
        en: 'Privacy Policy',
        ru: 'Политика конфиденциальности'
      },
      copyright: {
        ka: '© საავტორო უფლებები 2025 Litox',
        en: '© Copyright 2025 Litox',
        ru: '© Авторские права 2025 Litox'
      },
      contactInfo: {
        ka: 'საკონტაქტო ინფორმაცია',
        en: 'Contact Information',
        ru: 'Контактная информация'
      },
      followUs: {
        ka: 'გამოგვყევით',
        en: 'Follow Us',
        ru: 'Подпишитесь на нас'
      },
      socialMedia: {
        ka: 'სოციალური მედია',
        en: 'Social Media',
        ru: 'Социальные сети'
      },
      visitFacebook: {
        ka: 'ეწვიეთ ჩვენს Facebook გვერდს',
        en: 'Visit our Facebook page',
        ru: 'Посетите нашу страницу в Facebook'
      },
      visitInstagram: {
        ka: 'ეწვიეთ ჩვენს Instagram გვერდს',
        en: 'Visit our Instagram page',
        ru: 'Посетите нашу страницу в Instagram'
      },
      visitTikTok: {
        ka: 'ეწვიეთ ჩვენს TikTok გვერდს',
        en: 'Visit our TikTok page',
        ru: 'Посетите нашу страницу в TikTok'
      },
      callPhone: {
        ka: 'დარეკეთ ნომერზე',
        en: 'Call phone number',
        ru: 'Позвонить по номеру'
      },
      sendEmail: {
        ka: 'გაგზავნეთ ელფოსტა',
        en: 'Send email to',
        ru: 'Отправить письмо на'
      },
      footerNavigation: {
        ka: 'ქვედა ნავიგაცია',
        en: 'Footer navigation',
        ru: 'Нижняя навигация'
      },
      quickLinks: {
        ka: 'სწრაფი ბმულები',
        en: 'Quick Links',
        ru: 'Быстрые ссылки'
      },
      legalInfo: {
        ka: 'იურიდიული ინფორმაცია',
        en: 'Legal Information',
        ru: 'Юридическая информация'
      },
      openInNewWindow: {
        ka: 'გაიხსნება ახალ ფანჯარაში',
        en: 'Opens in new window',
        ru: 'Откроется в новом окне'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <footer role="contentinfo" aria-label={translate('footerNavigation')}>
      <div className="container">
        {/* Contact Information Section */}
        <section className="footer-top" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="visually-hidden">
            {translate('contactInfo')}
          </h2>

          <div className="phone">
            <a
              href="tel:+995598347784"
              aria-label={`${translate('callPhone')} +995 598 34 77 84`}
              title={translate('callUs')}
            >
              598 34 77 84
            </a>
          </div>

          <nav
            className="flex-footer-cards"
            aria-label={translate('quickLinks')}
            role="navigation"
          >
            <Link
              to="/contacts"
              aria-label={translate('whereToBuy')}
              title={translate('whereToBuy')}
            >
              <span className="img-wrapper" aria-hidden="true">
                <img
                  src={img1}
                  alt=""
                  height="37"
                  width="37"
                  loading="lazy"
                />
              </span>
              <span>{translate('whereToBuy')}</span>
            </Link>

            <a
              href="tel:+995598347784"
              aria-label={`${translate('callUs')} - ${translate('callPhone')} +995 598 34 77 84`}
              title={translate('callUs')}
            >
              <span className="img-wrapper" aria-hidden="true">
                <img
                  src={img2}
                  alt=""
                  height="33"
                  width="33"
                  loading="lazy"
                />
              </span>
              <span>{translate('callUs')}</span>
            </a>

            <a
              href="mailto:info@litox.ge"
              aria-label={`${translate('sendEmail')} info@litox.ge`}
              title={`${translate('mail')} - info@litox.ge`}
            >
              <span className="img-wrapper" aria-hidden="true">
                <img
                  src={img3}
                  alt=""
                  width="62"
                  height="40"
                  className="bad-vector"
                  loading="lazy"
                />
              </span>
              <span>{translate('mail')}</span>
            </a>
          </nav>
        </section>

        {/* Social Media Section */}
        <section aria-labelledby="social-heading">
          <h2 id="social-heading" className="visually-hidden">
            {translate('socialMedia')}
          </h2>

          <ul
            className="footer-socials"
            role="list"
            aria-label={translate('followUs')}
          >
            <li role="listitem">
              <a
                className="social social_fb"
                href={fb_link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${translate('visitFacebook')} (${translate('openInNewWindow')})`}
                title="Facebook - Litox Georgia"
              >
                <FaFacebookF size={24} aria-hidden="true" />
                <span className="visually-hidden">Facebook</span>
              </a>
            </li>
            <li role="listitem">
              <a
                className="social social_ig"
                href={insta_link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${translate('visitInstagram')} (${translate('openInNewWindow')})`}
                title="Instagram - Litox Georgia"
              >
                <FaInstagram size={24} aria-hidden="true" />
                <span className="visually-hidden">Instagram</span>
              </a>
            </li>
            <li role="listitem">
              <a
                className="social social_tiktok"
                href={tiktok_link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${translate('visitTikTok')} (${translate('openInNewWindow')})`}
                title="TikTok - Litox Georgia"
              >
                <FaTiktok size={24} aria-hidden="true" />
                <span className="visually-hidden">TikTok</span>
              </a>
            </li>
          </ul>
        </section>

        {/* Legal and Additional Links Section */}
        <section className="footer-bottom" aria-labelledby="legal-heading">
          <h2 id="legal-heading" className="visually-hidden">
            {translate('legalInfo')}
          </h2>

          <div>
            <a
              href="/catalog.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${translate('downloadCatalog')} (PDF, ${translate('openInNewWindow')})`}
              title={translate('downloadCatalog')}
              type="application/pdf"
            >
              {translate('downloadCatalog')}
            </a>
            &nbsp;&nbsp;&nbsp;
            <a
              href="mailto:info@litox.ge"
              className="mail"
              aria-label={`${translate('sendEmail')} info@litox.ge`}
              title={`${translate('mail')} - info@litox.ge`}
            >
              info@litox.ge
            </a>
          </div>

          <div>
            <nav aria-label={translate('legalInfo')}>
              <Link
                to="/privacy"
                aria-label={translate('privacyPolicy')}
                title={translate('privacyPolicy')}
              >
                {translate('privacyPolicy')}
              </Link>
            </nav>
            <p>
              <small>{translate('copyright')}</small>
            </p>
          </div>
        </section>

        {/* Structured Data for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Litox Georgia",
            "alternateName": "Free Way LLC",
            "url": "https://litoxgeorgia.ge",
            "logo": "https://litoxgeorgia.ge/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+995-598-347-784",
              "contactType": "Customer Service",
              "email": "info@litox.ge",
              "availableLanguage": ["Georgian", "English", "Russian"]
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "GE",
              "addressLocality": "Tbilisi"
            },
            "sameAs": [
              fb_link,
              insta_link,
              tiktok_link
            ]
          })}
        </script>
      </div>
    </footer>
  );
}

export default Footer;