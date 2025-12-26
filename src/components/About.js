import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="about-hero"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li><span>About</span></li>
          </ul>
          <h1>About Litox</h1>
        </div>
      </section>

      {/* About Content */}
      <div className="about-content">
        <div className="container">
          <section className="about-section">
            <h2>About Litox</h2>
            <p>
              TM Litox is a trusted name in professional construction materials with over 25 years of industry experience. Operating from a large industrial complex in the North Caucasus Federal District, we specialize in producing high-quality gypsum binders, dry construction mixes, and expanded clay gravel. Our state-of-the-art facilities produce over 200,000 tons annually, supported by our own raw material deposits and modern European equipment. We're committed to honesty, reliability, and delivering construction solutions that professionals depend on.
            </p>
          </section>

          <section className="about-section">
            <h2>About Litox Georgia</h2>
            <p>
              Litox Georgia brings decades of Russian manufacturing expertise to the Georgian market, offering premium construction and finishing materials. Established in 2020 and based in Tbilisi, we provide a comprehensive range of products including plasters, tile adhesives, putties, waterproofing solutions, and repair materials. Our mission is to supply Georgian builders and contractors with reliable, GOST-certified materials backed by technical support and expertise. We value our customers' success and strive to be their trusted partner in every project.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default About;