import React, { useState, useEffect } from 'react';
import '../styles/Landing.css';

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://api.litox.synaptica.online/api/Banners/banners', {
          headers: {
            'accept': '*/*',
            'X-Language': 'ka'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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

  if (loading) {
    return (
      <div className="intro-slider">
        <div className="carousel-container">
          <div className="loading">Loading banners...</div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="intro-slider">
        <div className="carousel-container">
          <div className="error">No banners available</div>
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
                    alt={`Slide ${index + 1}`}
                    className="carousel-image"
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
            <a href="#" className="default-btn">MORE DETAILED</a>
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