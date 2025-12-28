import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const img1 = `${process.env.PUBLIC_URL}/icon1.svg`;
const img2 = `${process.env.PUBLIC_URL}/icon2.svg`;
const img3 = `${process.env.PUBLIC_URL}/icon3.svg`;

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="phone">
            <a href="tel:+78002000166">8 800 2000 166</a>
          </div>
          <div className="flex-footer-cards">
            <a href="/contacts">
              <span className="img-wrapper">
                <img src={img1} alt="Where to buy" height="37" />
              </span>
              <span>Where to Buy</span>
            </a>
            <a href="/contacts">
              <span className="img-wrapper">
                <img src={img2} alt="Call us" height="33" />
              </span>
              <span>Call Us</span>
            </a>
            <a href="/contacts">
              <span className="img-wrapper">
                <img src={img3} alt="Address" width="62" height="40" className="bad-vector" />
              </span>
              <span>Address</span>
            </a>
          </div>
        </div>

        <div className="footer-middle">
          <div className="col">
            <div className="heading parent">
              <a href="/about">About Company</a>
            </div>
            <ul>
              <li><a href="/about">About Company</a></li>
              <li><a href="/about/litox">About Litox</a></li>
              <li><a href="/about/georgia">About Litox Georgia</a></li>
            </ul>
          </div>

          <div className="col prod_pk">
            <div className="heading parent">
              <a href="/products">Products</a>
            </div>
            <ul>
              <li><a href="/products?category=plasters">Plasters</a></li>
              <li><a href="/products?category=putties">Putties</a></li>
              <li><a href="/products?category=tile-adhesives">Tile Adhesives</a></li>
              <li><a href="/products?category=mounting-compounds">Mounting Compounds</a></li>
              <li><a href="/products?category=leveling-floors">Levelers and Self-Leveling Floors</a></li>
            </ul>
          </div>

          <div className="col prod_pk">
            <div className="heading parent">
              <a href="/products">Products</a>
            </div>
            <ul>
              <li><a href="/products?category=waterproofing">Waterproofing Materials</a></li>
              <li><a href="/products?category=repair-compounds">Repair Compounds</a></li>
              <li><a href="/products?category=paints">Paints</a></li>
              <li><a href="/products?category=primers">Primers</a></li>
            </ul>
          </div>

          <div className="col prod_mob">
            <div className="heading parent">
              <a href="/products">Products</a>
            </div>
            <ul>
              <li><a href="/products?category=plasters">Plasters</a></li>
              <li><a href="/products?category=putties">Putties</a></li>
              <li><a href="/products?category=tile-adhesives">Tile Adhesives</a></li>
              <li><a href="/products?category=mounting-compounds">Mounting Compounds</a></li>
              <li><a href="/products?category=leveling-floors">Levelers and Self-Leveling Floors</a></li>
              <li><a href="/products?category=waterproofing">Waterproofing Materials</a></li>
              <li><a href="/products?category=repair-compounds">Repair Compounds</a></li>
              <li><a href="/products?category=paints">Paints</a></li>
              <li><a href="/products?category=primers">Primers</a></li>
            </ul>
          </div>

          <div className="col">
            <div className="heading"><a href="/contacts">Where to Buy</a></div>
            <div className="heading"><a href="/contacts">Call Us</a></div>
            <div className="heading"><a href="/contacts">Address</a></div>
          </div>
        </div>

        <ul className="footer-socials">
          <a className="social social_fb" href="https://facebook.com/litox" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF size={24} />
          </a>
          <a className="social social_ig" href="https://instagram.com/litox" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={24} />
          </a>
          <a className="social social_yt" href="https://www.youtube.com/channel/UCXr_9n-S2rjwXZO-IFwhTaw" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube size={24} />
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