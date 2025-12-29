import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/AllProducts.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Scroll to top when component mounts or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Fetch data when language changes
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all categories
        const categoriesResponse = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          headers: {
            'accept': '*/*',
            'X-Language': language
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
                'X-Language': language
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
        setCategories([]);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [searchParams, language]);

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
      allProducts: {
        ka: 'ყველა პროდუქტი',
        en: 'All Products',
        ru: 'Все продукты'
      },
      loading: {
        ka: 'იტვირთება ყველა პროდუქტი...',
        en: 'Loading all products...',
        ru: 'Загрузка всех продуктов...'
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
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    
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

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="product-card skeleton">
      <div className="product-image skeleton-image">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="product-info">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-category"></div>
      </div>
    </div>
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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
      <div className="all-products-container">
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
        className="products-hero2"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container2">
          <ul className="breadcrumbs">
            <li><Link to="/">{translate('home')}</Link></li>
            <li><span>{translate('products')}</span></li>
          </ul>
          <h1>{translate('allProducts')}</h1>
        </div>
      </section>

      {/* Products Section */}
      <div className="products-section">
        <div className="container">
          {/* Category Filter */}
          {loading ? (
            <div className="filter-wrapper">
              <div className="filter-btn skeleton skeleton-filter"></div>
              <div className="filter-btn skeleton skeleton-filter"></div>
              <div className="filter-btn skeleton skeleton-filter"></div>
              <div className="filter-btn skeleton skeleton-filter"></div>
            </div>
          ) : (
            <div className="filter-wrapper">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('all')}
              >
                {translate('allProducts')} ({allProducts.length})
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
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {[...Array(12)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="error">{translate('noProducts')}</div>
          ) : (
            <>
              <div className="products-grid">
                {currentProducts.map((product, index) => (
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
              
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AllProducts;