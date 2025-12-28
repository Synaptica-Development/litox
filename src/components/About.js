import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';

function About() {
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://api.litox.synaptica.online/api/AboutUs/aboutus', {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [language]);

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
            <li><Link to="/">Home</Link></li>
            <li><span>About</span></li>
          </ul>
          <h1>About Litox</h1>
        </div>
      </section>

      {/* About Content */}
      <div className="about-page-content">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
              Loading...
            </div>
          ) : (
            aboutData.map((item) => (
              <section key={item.id} className="about-section">
                <div className="about-text">
                  <p>{item.text}</p>
                </div>
                {item.imageLink && (
                  <div className="about-image">
                    <img src={item.imageLink} alt="About Litox" />
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default About;