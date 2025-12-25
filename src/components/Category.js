import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Category.css';

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Language': 'ka',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (category) => {
    const iconUrl = category.imageLink || category.icon || category.iconUrl || category.image;
    return iconUrl || null;
  };

  const getCategoryName = (category) => {
    return category.name || category.title || 'Category';
  };

  if (loading) {
    return (
      <div className="home-catalog-list">
        <div className="flex-row">
          <div className="loading">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-catalog-list">
        <div className="flex-row">
          <div className="error">Error loading categories: {error}</div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="home-catalog-list">
        <div className="flex-row">
          <div className="error">No categories available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-catalog-list">
      <div className="flex-row">
        {categories.map((category, index) => (
          <Link 
            to={`/products?category=${category.id}`}
            key={category.id || index} 
            className="catalog-card"
          >
            <div className="icon">
              <img 
                src={getCategoryIcon(category)} 
                alt={getCategoryName(category)}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="catalog-name">{getCategoryName(category)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Category;