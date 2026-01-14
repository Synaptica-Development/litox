import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const img1 = `${process.env.PUBLIC_URL}/icon1.svg`;
const img2 = `${process.env.PUBLIC_URL}/icon2.svg`;
const img3 = `${process.env.PUBLIC_URL}/icon3.svg`;

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="phone">
            <a href="tel:+995598347784">598 34 77 84 </a>
          </div>
          <div className="flex-footer-cards">
           <Link to="/contacts">
  <span className="img-wrapper">
    <img src={img1} alt="Where to buy" height="37" />
  </span>
  <span>Where to Buy</span>
</Link>
           <a href="tel:+995598347784">
  <span className="img-wrapper">
    <img src={img2} alt="Call us" height="33" />
  </span>
  <span>Call Us</span>
</a>

            <a href="/contacts">
              <span className="img-wrapper">
                <img src={img3} alt="Address" width="62" height="40" className="bad-vector" />
              </span>
              <span>Mail</span>
            </a>
          </div>
        </div>

        <ul className="footer-socials">
          <a className="social social_fb" href="https://facebook.com/litox" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF size={24} />
          </a>
          <a className="social social_ig" href="https://instagram.com/litox" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={24} />
          </a>
          <a className="social social_tiktok" href="https://tiktok.com/@litox" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok size={24} />
          </a>
        </ul>

        <div className="footer-bottom">
          <div>
            <a href="/catalog.pdf" target="_blank" rel="noopener noreferrer">Download Electronic Catalog</a>
            &nbsp;&nbsp;&nbsp;
            <a href="mailto:info@litox.pro" className="mail">info@litox.pro</a>
          </div>
          <div>
            <p>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <br />
              © Copyright 2025 Litox
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;