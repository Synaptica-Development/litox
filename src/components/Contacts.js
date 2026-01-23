import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contacts.css';

const loc = process.env.PUBLIC_URL + '/loc.svg';

function Contacts() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page">
      <div className="container">
        <ul className="breadcrumbs">
          <li><Link to="/">Main</Link></li>
          <li><span>Contacts</span></li>
        </ul>
        <h1>Contacts</h1>
      </div>

      <div className="contacts__company-info">
        <div className="container">
          <h2 className="contact-heading">LLC CHERKESSKSTROM</h2>
          
          <div className="contact-layout">
            {/* Left side - Contact Info */}
            <div className="contact-info-box">
              <div className="info-item">
                <div className="info-label">LOCATION</div>
                <div className="info-content">
                  <img src={loc} alt="location" width="20" />
                  <address>Russia, Karachay-Cherkess Republic, Cherkessk, Pyatigorsk highway 7 "B"</address>
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">PHONE</div>
                <div className="info-content">
                  <span className="icon">📞</span>
                  <div className="phone-list">
                    <a href="tel:+995598347784">+995 598 34 77 84</a>
                  </div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">EMAIL</div>
                <div className="info-content">
                  <span className="icon">✉️</span>
                  <div className="email-list">
                    <a href="mailto:info@litox.ge">info@litox.ge</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Google Maps */}
            <div className="contact-map-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2873.85!2d42.072!3d44.2227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDEzJzIxLjciTiA0MsKwMDQnMTkuMiJF!5e0!3m2!1sen!2s!4v1234567890&markers=color:red%7C44.2227,42.072"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;