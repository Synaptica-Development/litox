import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';
const API_BASE_URL = 'https://api.litox.ge';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('ka');

  useEffect(() => {
    window.scrollTo(0, 0);
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
          console.log('=== ABOUT DATA DEBUG ===');
          console.log('aboutLitox RAW:', data.aboutLitox);
          console.log('aboutLitoxGeorgia RAW:', data.aboutLitoxGeorgia);
          
          // Check if content contains HTML tags
          const hasHTMLTags = (text) => text && /<[^>]+>/.test(text);
          
          console.log('aboutLitox has HTML?', hasHTMLTags(data.aboutLitox));
          console.log('aboutLitoxGeorgia has HTML?', hasHTMLTags(data.aboutLitoxGeorgia));
          console.log('======================');
          
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

  // Smart content formatter - handles both HTML and plain text
  const formatContent = (text) => {
    if (!text) return '';
    
    // Check if text already contains HTML tags
    const hasHTMLTags = /<[^>]+>/.test(text);
    
    if (hasHTMLTags) {
      // Already has HTML formatting, return as is
      return text;
    } else {
      // Plain text - convert line breaks to paragraphs
      return text
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line.trim()}</p>`)
        .join('');
    }
  };

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
                    className="about-text rich-text-content"
                    dangerouslySetInnerHTML={{ __html: formatContent(aboutData.aboutLitox) }}
                  />
                  {aboutData.imageUrl1 && (
                    <div className="about-image">
                      <img 
                        src={aboutData.imageUrl1} 
                        alt="About Litox" 
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