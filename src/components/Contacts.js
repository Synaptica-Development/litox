import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contacts.css';

const loc = process.env.PUBLIC_URL + '/loc.svg';

function Contacts() {
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
          <div className="contact-loc">
            <img src={loc} alt="location" width="22" />
            <span>
              <address>Russia, Karachay-Cherkess Republic, Cherkessk, Pyatigorsk highway 7 "B"</address>
            </span>
          </div>
        </div>

        <div className="flex-contact-cards-wrapper">
          <div className="container">
            <div className="flex-contact-cards">
              <div className="item">
                <div className="card">
                  <div className="name">THE RECEPTION</div>
                  <div className="links">
                    <a href="tel:+78782213541" className="phone">+7 (8782) 21-35-41</a>
                    <a href="mailto:litox@litox.pro" className="email">litox@litox.pro</a>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="card">
                  <div className="name">SALES DEPARTMENT</div>
                  <div className="links">
                    <a href="tel:+78782210077" className="phone">+7 (8782) 21-00-77</a>
                    <a href="mailto:sbit@litox.pro" className="email">sbit@litox.pro</a>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="card">
                  <div className="name">PURCHASE DEPARTMENT</div>
                  <div className="links">
                    <a href="tel:+78782215524" className="phone">+7 (8782) 21-55-24</a>
                    <a href="mailto:snab@litox.pro" className="email">snab@litox.pro</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;