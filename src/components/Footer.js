import React from 'react';
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
            <a href="/where-to-buy">
              <span className="img-wrapper">
                <img src={img1} alt="Where to buy" height="37" />
              </span>
              <span>Where to Buy</span>
            </a>
            <a href="/support">
              <span className="img-wrapper">
                <img src={img2} alt="Support" height="33" />
              </span>
              <span>Tech Support</span>
            </a>
            <a href="/partnership">
              <span className="img-wrapper">
                <img src={img3} alt="Partnership" width="62" height="40" className="bad-vector" />
              </span>
              <span>Partnership</span>
            </a>
          </div>
        </div>

        <div className="footer-middle">
          <div className="col">
            <div className="heading parent">
              <a href="/about">About Company</a>
            </div>
            <ul>
              <li><a href="/about/jobs">Careers</a></li>
              <li><a href="/about/testing">Testing Center</a></li>
              <li><a href="/about/awards">Awards</a></li>
              <li><a href="/contacts">Contacts</a></li>
            </ul>
          </div>

          <div className="col prod_pk">
            <div className="heading parent">
              <a href="/products">Products</a>
            </div>
            <ul>
              <li><a href="/products/plasters">Plasters</a></li>
              <li><a href="/products/decorative-plasters">Decorative Plasters</a></li>
              <li><a href="/products/putties">Putties</a></li>
              <li><a href="/products/tile-adhesives">Tile Adhesives</a></li>
              <li><a href="/products/mounting-compounds">Mounting Compounds</a></li>
              <li><a href="/products/leveling-floors">Leveling & Poured Floors</a></li>
            </ul>
          </div>

          <div className="col prod_pk">
            <div className="heading parent">
              <a href="/products">Products</a>
            </div>
            <ul>
              <li><a href="/products/waterproofing">Waterproofing Materials</a></li>
              <li><a href="/products/repair-compounds">Repair Compounds</a></li>
              <li><a href="/products/paints">Paints</a></li>
              <li><a href="/products/primers">Primers</a></li>
            </ul>
          </div>

          <div className="col prod_mob">
            <div className="heading parent">
              <a href="/products">Products</a>
            </div>
            <ul>
              <li><a href="/products/plasters">Plasters</a></li>
              <li><a href="/products/decorative-plasters">Decorative Plasters</a></li>
              <li><a href="/products/putties">Putties</a></li>
              <li><a href="/products/tile-adhesives">Tile Adhesives</a></li>
              <li><a href="/products/mounting-compounds">Mounting Compounds</a></li>
              <li><a href="/products/leveling-floors">Leveling & Poured Floors</a></li>
              <li><a href="/products/waterproofing">Waterproofing Materials</a></li>
              <li><a href="/products/repair-compounds">Repair Compounds</a></li>
              <li><a href="/products/paints">Paints</a></li>
              <li><a href="/products/primers">Primers</a></li>
            </ul>
          </div>

          <div className="col">
            <div className="heading"><a href="/where-to-buy">Where to Buy</a></div>
            <div className="heading"><a href="/support">Tech Support</a></div>
            <div className="heading"><a href="/contacts">Contacts</a></div>
            <div className="heading"><a href="/references">Reference Projects</a></div>
            <div className="heading"><a href="/news">News</a></div>
            <div className="heading"><a href="/certificates">Certificates & Declarations</a></div>
            <div className="heading"><a href="/articles">Articles</a></div>
          </div>
        </div>

        <ul className="footer-socials">
          <a className="social social_od" href="https://dzen.ru/litox" target="_blank" rel="noopener noreferrer" aria-label="Dzen"></a>
          <a className="social social_vk" href="https://vk.com/litox_vk" target="_blank" rel="noopener noreferrer" aria-label="VK"></a>
          <a className="social social_tw" href="https://t.me/s/litox_official" target="_blank" rel="noopener noreferrer" aria-label="Telegram"></a>
          <a className="social social_yt" href="https://www.youtube.com/channel/UCXr_9n-S2rjwXZO-IFwhTaw" target="_blank" rel="noopener noreferrer" aria-label="YouTube"></a>
        </ul>

        <div className="footer-bottom">
          <div>
            <a href="/catalog.pdf" target="_blank" rel="noopener noreferrer">Download Electronic Catalog</a>
            &nbsp;&nbsp;&nbsp;
            <a href="/contest-rules.pdf" target="_blank" rel="noopener noreferrer">Contest Rules</a>
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