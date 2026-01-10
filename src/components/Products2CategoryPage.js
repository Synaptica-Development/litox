import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Products2CategoryPage.css';

const arrow = `${process.env.PUBLIC_URL}/right-arrow2.svg`;

function Products2CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch category details
        const categoryResponse = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          headers: {
            'accept': '*/*',
            'X-Language': language
          }
        });

        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category');
        }

        const categoriesData = await categoryResponse.json();
        const currentCategory = categoriesData.find(cat => cat.id === categoryId);
        
        if (!currentCategory) {
          throw new Error('Category not found');
        }

        setCategory(currentCategory);

        // Fetch products for this category
        const productsResponse = await fetch(
          `http://api.litox.synaptica.online/api/Products/products?CategoryID=${categoryId}&PageSize=100&Page=1`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();
        setProducts(productsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId, language]);

  // Translation function
  const translate = (key) => {
    const translations = {
      home: {
        ka: 'მთავარი',
        en: 'Home',
        ru: 'Главная'
      },
      categories: {
        ka: 'კატეგორიები',
        en: 'Categories',
        ru: 'Категории'
      },
      noProducts: {
        ka: 'პროდუქტები არ არის ხელმისაწვდომი',
        en: 'No products available',
        ru: 'Продукты недоступны'
      },
      previous: {
        ka: 'წინა',
        en: 'Previous',
        ru: 'Предыдущая'
      },
      next: {
        ka: 'შემდეგი',
        en: 'Next',
        ru: 'Следующая'
      }
    };
    return translations[key]?.[language] || translations[key]?.['ka'] || key;
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="product-card skeleton">
      <div className="product-image-wrapper">
        <div className="product-image skeleton-img">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="product-info">
          <div className="skeleton-text"></div>
        </div>
      </div>
    </div>
  );

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        className="pagination-btn pagination-arrow"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {translate('previous')}
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="pagination-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="pagination-btn pagination-arrow"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {translate('next')}
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  if (error) {
    return (
      <div className="category-page-container">
        <div className="container">
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Section with Category Banner */}
      {loading ? (
        <section className="category-hero skeleton">
          <div className="skeleton-shimmer"></div>
        </section>
      ) : category ? (
        <section 
          className="category-hero"
          style={{
            backgroundImage: `url(${category.bannerLink})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="category-hero-content">
            <ul className="breadcrumbs">
              <li><Link to="/">{translate('home')}</Link></li>
              <li><Link to="/products2">{translate('categories')}</Link></li>
              <li><span>{category.title}</span></li>
            </ul>
            <h1>{category.title}</h1>
          </div>
        </section>
      ) : null}

      {/* Products Section */}
      <section className="category-products-section">
        <div className="container">
          {loading ? (
            <div className="products-grid">
              {[...Array(12)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">{translate('noProducts')}</div>
          ) : (
            <>
              <div className="products-grid">
                {currentProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${categoryId}/${product.id}`}
                    className="product-card"
                  >
                    <div className="product-image-wrapper">
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
                        <div className="product-arrow">
                          <img src={arrow} alt="" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {renderPagination()}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products2CategoryPage;