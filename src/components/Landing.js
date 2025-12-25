import React, { useState, useEffect } from 'react';
import '../styles/Landing.css';

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Get images array from banners
  const images = banners.map(banner => banner.imageLink).filter(url => url);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide, images.length]);

  const nextSlide = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSlide = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="intro-slider">
        <div className="carousel-container">
          <div className="loading">Loading banners...</div>
        </div>
      </div>
    );
  }

  // Show error or empty state
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
        <div className="item">
          {/* Images with fade transition */}
          {images.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`Slide ${index + 1}`}
              className="carousel-image"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: currentSlide === index ? 1 : 0,
                zIndex: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
              }}
            />
          ))}

          {/* Content overlay */}
          <div className="container intro-slide-text">
            <div className="subtitle"></div>
            <a href="#" className="default-btn">MORE DETAILED</a>
          </div>
        </div>

        {/* Controls container - aligned with numbered dots */}
        <div className="carousel-controls">
          {/* Left Arrow */}
          <button 
            className="arrow-btn prev-btn" 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Numbered Dots */}
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

          {/* Right Arrow */}
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