import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/CategoryPage.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';

function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ka';
    setLanguage(savedLanguage);
  }, []);

  // Scroll to top when component mounts or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Fetch category and products when categoryId or language changes
  useEffect(() => {
    const fetchCategoryData = async () => {
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

        // Fetch all products for this category
        let allProducts = [];
        let currentApiPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const productsResponse = await fetch(
            `http://api.litox.synaptica.online/api/Products/products?CategoryID=${categoryId}&PageSize=8&Page=${currentApiPage}`,
            {
              headers: {
                'accept': '*/*',
                'X-Language': language
              }
            }
          );

          if (productsResponse.ok) {
            const pageProducts = await productsResponse.json();
            
            if (pageProducts.length > 0) {
              const productsWithCategory = pageProducts.map(product => ({
                ...product,
                categoryId: categoryId,
                categoryName: currentCategory.title
              }));
              
              allProducts = [...allProducts, ...productsWithCategory];
              
              if (pageProducts.length < 8) {
                hasMorePages = false;
              } else {
                currentApiPage++;
              }
            } else {
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
          }
        }

        setProducts(allProducts);
      } catch (err) {
        setError(err.message);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
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
      products: {
        ka: 'პროდუქტები',
        en: 'Products',
        ru: 'Продукты'
      },
      loading: {
        ka: 'იტვირთება პროდუქტები...',
        en: 'Loading products...',
        ru: 'Загрузка продуктов...'
      },
      error: {
        ka: 'შეცდომა პროდუქტების ჩატვირთვისას',
        en: 'Error loading products',
        ru: 'Ошибка загрузки продуктов'
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
      },
      productsCount: {
        ka: 'პროდუქტი',
        en: 'Products',
        ru: 'Продуктов'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

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

    // Previous button
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

    // First page
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

    // Page numbers
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

    // Last page
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

    // Next button
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

  if (loading) {
    return (
      <div className="category-page-container">
        <div className="container">
          <div className="loading">{translate('loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page-container">
        <div className="container">
          <div className="error">{translate('error')}: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        className="category-hero"
        style={{
          backgroundImage: `url(${category?.bannerLink || background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <ul className="breadcrumbs">
          <li><Link to="/">{translate('home')}</Link></li>
          <li><Link to="/products">{translate('products')}</Link></li>
          <li><span>{category?.title}</span></li>
        </ul>
        <div className="container2">
          <h1>{category?.title}</h1>
          <p className="products-count">{products.length} {translate('productsCount')}</p>
        </div>
      </section>

      {/* Products Section */}
      <div className="category-products-section">
        <div className="container">
          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="error">{translate('noProducts')}</div>
          ) : (
            <>
              <div className="category-products-grid">
                {currentProducts.map((product, index) => (
                  <Link 
                    key={product.id || index} 
                    to={`/products/${product.categoryId}/${product.id}`} 
                    className="category-product-card"
                  >
                    <div className="category-product-image">
                      <img 
                        src={getProductImage(product)} 
                        alt={getProductName(product)}
                        onError={(e) => {
                          e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                        }}
                      />
                    </div>
                    <div className="category-product-info">
                      <h3 className="category-product-name">{getProductName(product)}</h3>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryPage;