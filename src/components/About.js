import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';
const API_BASE_URL = 'https://api.litox.ge';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/AboutUs/aboutus`, {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('About data:', data);
          setAboutData(data);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        setAboutData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [language]);

  const translate = (key) => {
    const translations = {
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

    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

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
          {loading ? (
            <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
              Loading...
            </div>
          ) : aboutData ? (
            <div className="about-content-wrapper">
              {/* About Litox Section */}
              {aboutData.aboutLitox && (
                <section className="about-section">
                  <h2>{translate('aboutLitox')}</h2>
                  <div 
                    className="about-text"
                    dangerouslySetInnerHTML={{ __html: aboutData.aboutLitox }}
                  />
                </section>
              )}

              {/* About Litox Georgia Section */}
              {aboutData.aboutLitoxGeorgia && (
                <section className="about-section">
                  <h2>{translate('aboutLitoxGeorgia')}</h2>
                  <div 
                    className="about-text"
                    dangerouslySetInnerHTML={{ __html: aboutData.aboutLitoxGeorgia }}
                  />
                </section>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
              No content available
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default About;