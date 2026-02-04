import React, { useState, useEffect, useRef } from 'react';
import '../styles/Video.css';

const API_BASE_URL = 'https://api.litox.ge';

function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('ka');
  const videoRef = useRef(null);

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/Hero/hero`, {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (response.ok) {
          const data = await response.json();
          setVideoUrl(data.videoLink);
          setThumbnailUrl(data.thumbnailLink);
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [language]);

  // Translation function
  const translate = (key) => {
    const translations = {
      aboutLitox: {
        ka: 'Litox-ის შესახებ',
        en: 'About Litox',
        ru: 'О Litox'
      },
      playVideo: {
        ka: 'ვიდეოს დაკვრა',
        en: 'Play video',
        ru: 'Воспроизвести видео'
      },
      loadingVideo: {
        ka: 'იტვირთება ვიდეო...',
        en: 'Loading video...',
        ru: 'Загрузка видео...'
      },
      videoNotSupported: {
        ka: 'თქვენი ბრაუზერი არ უჭერს მხარს ვიდეო ტეგს.',
        en: 'Your browser does not support the video tag.',
        ru: 'Ваш браузер не поддерживает тег video.'
      },
      companyVideo: {
        ka: 'კომპანიის შესახებ ვიდეო',
        en: 'Company video',
        ru: 'Видео о компании'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayClick();
    }
  };

  if (loading) {
    return (
      <section className="video-section" id="video" aria-labelledby="video-heading">
        <div className="video-section__wrapper">
          <div 
            style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}
            role="status"
            aria-live="polite"
          >
            {translate('loadingVideo')}
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no video is available
  if (!videoUrl) {
    return null;
  }

  return (
    <section 
      className="video-section" 
      id="video" 
      aria-labelledby="video-heading"
      role="region"
    >
      <h2 id="video-heading" className="visually-hidden">
        {translate('companyVideo')}
      </h2>
      
      <div className="video-section__wrapper">
        <article className="video-wrapper big">
          <div className="video-container">
            {!isPlaying ? (
              <div 
                className="video-cover" 
                onClick={handlePlayClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`${translate('playVideo')}: ${translate('aboutLitox')}`}
                style={{
                  backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none',
                  backgroundColor: thumbnailUrl ? 'transparent' : '#000',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="video-cover__overlay">
                  <button 
                    className="play-button" 
                    aria-label={translate('playVideo')}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayClick();
                    }}
                  >
                    <svg 
                      width="80" 
                      height="80" 
                      viewBox="0 0 80 80" 
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.9)"/>
                      <path d="M32 25L55 40L32 55V25Z" fill="#393330"/>
                    </svg>
                  </button>
                </div>
                <span className="name" aria-hidden="true">{translate('aboutLitox')}</span>
              </div>
            ) : (
              <div className="video-player">
                <video 
                  ref={videoRef}
                  controls 
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                  aria-label={translate('aboutLitox')}
                  title={translate('aboutLitox')}
                >
                  <source src={videoUrl} type="video/mp4" />
                  <track kind="captions" />
                  {translate('videoNotSupported')}
                </video>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default Video;