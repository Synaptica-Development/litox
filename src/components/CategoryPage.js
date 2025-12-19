import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoryPage.css';

// Sample product data - you can replace this with your actual data or fetch from API
const tileAdhesivesProducts = [
  {
    id: 1,
    name: 'NK 21 Tile Adhesive (C1 TE)',
    image: '/upload/resize_cache/iblock/5f3/uzjkx40o5x32p8asbnwy1sfzaspf4wx7/480_360_1/342.webp',
    link: '/products/tile-adhesives/nk-21'
  },
  {
    id: 2,
    name: 'NK PRO WHITE Tile Adhesive (C2 TE S1)',
    image: '/upload/resize_cache/iblock/db6/jnyhq57px2rpulww5aairta9rpuqrgwv/480_360_1/2345.webp',
    link: '/products/tile-adhesives/nk-pro-white'
  },
  {
    id: 3,
    name: 'NK PRO Tile Adhesive (C2 TE S1)',
    image: '/upload/resize_cache/iblock/68a/pdp9rc1tj9g16iuqav0vqit67kpd1slp/480_360_1/435.webp',
    link: '/products/tile-adhesives/nk-pro'
  },
  {
    id: 4,
    name: 'Nova FIX Reinforced Tile Adhesive (C2 TE)',
    image: '/upload/resize_cache/iblock/b87/u2a1jis8jezqj6wps9qwemv131831jr4/480_360_1/342.webp',
    link: '/products/tile-adhesives/nova-fix'
  },
  {
    id: 5,
    name: 'TITAN flex Tile Adhesive (C1 TE)',
    image: '/upload/resize_cache/iblock/951/viediolm2zl9lugvg023hgv3bu4l8fbi/480_360_1/4365.webp',
    link: '/products/tile-adhesives/titan-flex'
  },
  {
    id: 6,
    name: 'Salut Tile Adhesive (C0)',
    image: '/upload/resize_cache/iblock/32d/bq2p9oapek4a8ml0zzwp2g52q65ovu22/480_360_1/324.webp',
    link: '/products/tile-adhesives/salut'
  },
  {
    id: 7,
    name: 'Prestige Tile Adhesive (C0T)',
    image: '/upload/resize_cache/iblock/620/bokvcrr68p7hrzyqbxqzwwrr8e0kp5v3/480_360_1/4356.webp',
    link: '/products/tile-adhesives/prestige'
  },
  {
    id: 8,
    name: 'Multi Fix Tile Adhesive (C1)',
    image: '/upload/resize_cache/iblock/744/awnjtma8jxpwugyfqu5lwgfbkoczvrmj/480_360_1/568.webp',
    link: '/products/tile-adhesives/multi-fix'
  },
  {
    id: 9,
    name: 'Triumph Tile Adhesive (C1 T)',
    image: '/upload/resize_cache/iblock/03c/faq0qaf22hifu3dis00850m8dleib0pg/480_360_1/243543.webp',
    link: '/products/tile-adhesives/triumph'
  },
  {
    id: 10,
    name: 'Kvadr Tile Adhesive (C1 T)',
    image: '/upload/resize_cache/iblock/d81/a6ygq0xds8551juzmfolnezp9w3ajnsz/480_360_1/325345.webp',
    link: '/products/tile-adhesives/kvadr'
  },
  {
    id: 11,
    name: 'Super FIX Tile Adhesive-Gel (C1 TE)',
    image: '/upload/resize_cache/iblock/b71/rg9nxo7icv0tqsm5vv7xrgef4609jhoe/480_360_1/4444444444.webp',
    link: '/products/tile-adhesives/super-fix'
  },
  {
    id: 12,
    name: 'White FIX White Cement Adhesive (C1)',
    image: '/upload/resize_cache/iblock/489/rprmw2gazln9f0oj5rervlvujaxeg0mf/480_360_1/346.webp',
    link: '/products/tile-adhesives/white-fix'
  }
];

function CategoryPage({ 
  categoryName = 'Tile Adhesives', 
  backgroundImage = '/upload/iblock/d64/tsxocb9e0hfni9buftdeipbmxo1qo6nu/foto_plitochnyy_kley.webp',
  products = tileAdhesivesProducts 
}) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Hero Section with Background */}
      <section 
        className="products-list-wrapper category-section-heading" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><span>{categoryName}</span></li>
          </ul>
          <h1>{categoryName}</h1>
        </div>
      </section>

      {/* Products Grid Section */}
      <div className="products-section category-rev">
        <div className="container">
          <div className="products-flex-list">
            {products.map((product) => (
              <div key={product.id} className="item">
                <Link to={product.link} className="video-wrapper">
                  <div className="video-cover">
                    <div className="img-imit"></div>
                    <img 
                      className="catalog-two__img" 
                      src={product.image} 
                      alt={product.name}
                    />
                    <div className="name">
                      {product.name}
                    </div>
                    <div className="divider"></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;