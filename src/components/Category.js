import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Category.css';

const categories = [
  { 
    icon: '/plaster.svg', 
    name: 'Plaster',
    link: '/products/plasters'
  },
  { 
    icon: '/decoplaster.svg', 
    name: 'Decorative plasters',
    link: '/products/decorative-plasters'
  },
  { 
    icon: '/putties.svg', 
    name: 'Putties',
    link: '/products/putties'
  },
  { 
    icon: '/tile.svg', 
    name: 'Tile Adhesives',
    link: '/products/tile-adhesives'
  },
  { 
    icon: '/assembly.svg', 
    name: 'Assembly mixes',
    link: '/products/mounting-compounds'
  },
  { 
    icon: '/leveler.svg', 
    name: 'Levelers and bulk floors',
    link: '/products/leveling-floors'
  },
  { 
    icon: '/waterproof.svg', 
    name: 'Waterproofing materials',
    link: '/products/waterproofing'
  },
  { 
    icon: '/repair.svg', 
    name: 'Repair mixes',
    link: '/products/repair-compounds'
  },
  { 
    icon: '/paints.svg', 
    name: 'Paints',
    link: '/products/paints'
  },
  { 
    icon: '/primers.svg', 
    name: 'Primers',
    link: '/products/primers'
  }
];

function Category() {
  return (
    <div className="home-catalog-list">
      <div className="flex-row">
        {categories.map((category, index) => (
          <Link 
            to={category.link} 
            key={index} 
            className="catalog-card"
          >
            <div className="icon">
              <img src={category.icon} alt={category.name} />
            </div>
            <div className="catalog-name">{category.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Category;