import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/AllProducts.css';

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all categories
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
        const allProductsArray = [];
        
        for (const category of categoriesData) {
          const productsResponse = await fetch(
            `http://api.litox.synaptica.online/api/Products/products?CategoryID=${category.id}&PageSize=100&Page=1`,
            {
              headers: {
                'accept': '*/*',
                'X-Language': 'ka'
              }
            }
          );

          if (productsResponse.ok) {
            const categoryProducts = await productsResponse.json();
            const productsWithCategory = categoryProducts.map(product => ({
              ...product,
              categoryId: category.id,
              categoryName: category.title
            }));
            allProductsArray.push(...productsWithCategory);
          }
        }

        setAllProducts(allProductsArray);
        setFilteredProducts(allProductsArray);
        
        // Check if there's a category parameter in URL
        const categoryParam = searchParams.get('category');
        if (categoryParam && categoryParam !== 'all') {
          setSelectedCategory(categoryParam);
          const filtered = allProductsArray.filter(product => product.categoryId === categoryParam);
          setFilteredProducts(filtered);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [searchParams]);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Update URL parameter
    if (categoryId === 'all') {
      setSearchParams({});
      setFilteredProducts(allProducts);
    } else {
      setSearchParams({ category: categoryId });
      const filtered = allProducts.filter(product => product.categoryId === categoryId);
      setFilteredProducts(filtered);
    }
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  if (loading) {
    return (
      <div className="all-products-container">
        <div className="container">
          <div className="loading">Loading all products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-products-container">
        <div className="container">
          <div className="error">Error loading products: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li><span>Products</span></li>
          </ul>
          <h1>All Products</h1>
        </div>
      </section>

      {/* Products Section */}
      <div className="products-section">
        <div className="container">
          {/* Category Filter */}
          <div className="filter-wrapper">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('all')}
            >
              All Products ({allProducts.length})
            </button>
            {categories.map((category) => {
              const count = allProducts.filter(p => p.categoryId === category.id).length;
              return (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.title} ({count})
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="error">No products available</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <Link 
                  key={product.id || index} 
                  to={`/products/${product.categoryId}/${product.id}`} 
                  className="product-card"
                >
                  <div className="product-image">
                    <img 
                      src={getProductImage(product)} 
                      alt={getProductName(product)}
                      onError={(e) => {
                        e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{getProductName(product)}</h3>
                    <p className="product-category">{product.categoryName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AllProducts;