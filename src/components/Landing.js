import React, { useState, useEffect } from 'react';
import '../styles/Landing.css';

const lit1 = process.env.PUBLIC_URL + '/lit1.webp';
const lit2 = process.env.PUBLIC_URL + '/lit2.jpg';
const lit3 = process.env.PUBLIC_URL + '/lit3.webp';
const lit4 = process.env.PUBLIC_URL + '/lit4.webp';
const lit5 = process.env.PUBLIC_URL + '/lit5.webp';
const lit6 = process.env.PUBLIC_URL + '/lit6.webp';
const lit7 = process.env.PUBLIC_URL + '/lit7.webp';
const lit8 = process.env.PUBLIC_URL + '/lit8.webp';
const lit9 = process.env.PUBLIC_URL + '/lit9.webp';
const lit10 = process.env.PUBLIC_URL + '/lit10.jpg';

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = [lit1, lit2, lit3, lit4, lit5, lit6, lit7, lit8, lit9, lit10];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

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