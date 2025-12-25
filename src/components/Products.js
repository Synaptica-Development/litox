import React, { useState, useEffect } from 'react';
import '../styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories first
        const categoriesResponse = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          headers: {
            'accept': '*/*',
            'X-Language': 'ka'
          }
        });

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch products for each category
        const allProducts = [];
        
        for (const category of categoriesData) {
          const productsResponse = await fetch(
            `http://api.litox.synaptica.online/api/Products/products?CategoryID=${category.id}&PageSize=16&Page=1`,
            {
              headers: {
                'accept': '*/*',
                'X-Language': 'ka'
              }
            }
          );

          if (productsResponse.ok) {
            const categoryProducts = await productsResponse.json();
            // Add category info to each product
            const productsWithCategory = categoryProducts.map(product => ({
              ...product,
              categoryId: category.id,
              categoryTitle: category.title
            }));
            allProducts.push(...productsWithCategory);
          }
        }

        setProducts(allProducts);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : 'Category';
  };

  // Get product image URL
  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  };

  // Get product name
  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="home-cards-grid">
        <div className="flex-grid">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="home-cards-grid">
        <div className="flex-grid">
          <div className="error">Error loading products: {error}</div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="home-cards-grid">
        <div className="flex-grid">
          <div className="error">No products available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-cards-grid">
      <div className="flex-grid">
        {products.map((product, index) => (
          <div key={product.id || index} className="item">
            <a href="#" className="card">
              <span className="img-wrapper">
                <img 
                  src={getProductImage(product)} 
                  alt={getProductName(product)}
                  onError={(e) => {
                    e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                  }}
                />
              </span>
              <span className="name">{getProductName(product)}</span>
              <span className="category">{product.categoryTitle || getCategoryName(product.categoryId)}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;