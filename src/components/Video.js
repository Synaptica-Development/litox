import React, { useState, useEffect, useRef } from 'react';
import '../styles/Video.css';

const videoBackground = process.env.PUBLIC_URL + '/video-thumb.webp';
const API_BASE_URL = 'https://api.litox.ge';

function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
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
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [language]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="video-section" id="video">
        <div className="video-section__wrapper">
          <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
            Loading video...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-section" id="video">
      <div className="video-section__wrapper">
        <div className="video-wrapper big">
          <div className="video-container">
            {!isPlaying ? (
              <div 
                className="video-cover" 
                onClick={handlePlayClick}
                style={{
                  backgroundImage: `url(${videoBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="video-cover__overlay">
                  <button className="play-button" aria-label="Play video">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.9)"/>
                      <path d="M32 25L55 40L32 55V25Z" fill="#393330"/>
                    </svg>
                  </button>
                </div>
                <span className="name">About Litox</span>
              </div>
            ) : (
              <div className="video-player">
                <video 
                  ref={videoRef}
                  controls 
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;