import React, { useState } from 'react';
import '../styles/Video.css';

function Video() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Your Rutube video ID extracted from the URL
  const rutubeVideoId = '2eb9d49ba0002feb74db25197e0900c6';
  
  // Rutube embed URL
  const rutubeEmbedUrl = `https://rutube.ru/play/embed/${rutubeVideoId}`;

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="video-section" id="video">
      <div className="video-section__wrapper">
        <div className="video-wrapper big">
          <div className="video-container">
            {!isPlaying ? (
              <div className="video-cover" onClick={handlePlayClick}>
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
                <iframe
                  src={rutubeEmbedUrl}
                  frameBorder="0"
                  allow="clipboard-write; autoplay"
                  allowFullScreen
                  title="Litox Company Video"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;