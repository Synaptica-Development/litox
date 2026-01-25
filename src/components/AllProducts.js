import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/AllProducts.css';

const background = `${process.env.PUBLIC_URL}/products-bg.jpg`;
const arrow = `${process.env.PUBLIC_URL}/right-arrow2.svg`;
const API_BASE_URL = 'https://api.litox.ge';

function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });
  const [loadingBackground, setLoadingBackground] = useState(false);
  const isLoadingRest = useRef(false);
  const abortControllerRef = useRef(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;
  const INITIAL_CATEGORIES_TO_LOAD = 3;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch data when language changes
  useEffect(() => {
    const fetchInitialData = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      isLoadingRest.current = false;

      try {
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/Category/categories`, {
          headers: {
            'accept': '*/*',
            'X-Language': language
          },
          signal: abortControllerRef.current.signal
        });

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const initialCategories = categoriesData.slice(0, INITIAL_CATEGORIES_TO_LOAD);
        
        const productPromises = initialCategories.map(category =>
          fetch(
            `${API_BASE_URL}/api/Products/products?CategoryID=${category.id}&PageSize=100&Page=1`,
            {
              headers: {
                'accept': '*/*',
                'X-Language': language
              },
              signal: abortControllerRef.current.signal
            }
          )
          .then(res => res.ok ? res.json() : [])
          .then(categoryProducts => ({
            categoryId: category.id,
            categoryName: category.title,
            products: categoryProducts.map(product => ({
              ...product,
              categoryId: category.id,
              categoryName: category.title
            }))
          }))
          .catch(err => {
            if (err.name !== 'AbortError') {
              console.error(`Error loading category ${category.id}:`, err);
            }
            return { categoryId: category.id, categoryName: category.title, products: [] };
          })
        );

        const results = await Promise.all(productPromises);
        const allProductsArray = results.flatMap(result => result.products);

        setAllProducts(allProductsArray);
        
        // Check for category parameter in URL
        const categoryParam = searchParams.get('category');
        if (categoryParam && categoryParam !== 'all') {
          setSelectedCategory(categoryParam);
          const filtered = allProductsArray.filter(product => product.categoryId === categoryParam);
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(allProductsArray);
        }

        setLoading(false);

        // Load remaining categories in background
        if (categoriesData.length > INITIAL_CATEGORIES_TO_LOAD) {
          loadRemainingCategories(categoriesData, allProductsArray);
        }
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        console.error('Error fetching initial data:', err);
        setError(err.message);
        setCategories([]);
        setAllProducts([]);
        setFilteredProducts([]);
        setLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const loadRemainingCategories = async (categoriesData, initialProducts) => {
    if (isLoadingRest.current) return;
    isLoadingRest.current = true;
    setLoadingBackground(true);

    try {
      const remainingCategories = categoriesData.slice(INITIAL_CATEGORIES_TO_LOAD);
      const BATCH_SIZE = 3;
      const allProductsArray = [...initialProducts];
      
      for (let i = 0; i < remainingCategories.length; i += BATCH_SIZE) {
        const batch = remainingCategories.slice(i, i + BATCH_SIZE);
        
        const batchPromises = batch.map(category =>
          fetch(
            `${API_BASE_URL}/api/Products/products?CategoryID=${category.id}&PageSize=100&Page=1`,
            {
              headers: {
                'accept': '*/*',
                'X-Language': language
              }
            }
          )
          .then(res => res.ok ? res.json() : [])
          .then(categoryProducts => ({
            categoryId: category.id,
            categoryName: category.title,
            products: categoryProducts.map(product => ({
              ...product,
              categoryId: category.id,
              categoryName: category.title
            }))
          }))
          .catch(err => {
            console.error(`Error loading category ${category.id}:`, err);
            return { categoryId: category.id, categoryName: category.title, products: [] };
          })
        );

        const batchResults = await Promise.all(batchPromises);
        const batchProducts = batchResults.flatMap(result => result.products);
        
        allProductsArray.push(...batchProducts);
        
        setAllProducts([...allProductsArray]);
        
        // Update filtered products if showing all
        setFilteredProducts(prevFiltered => {
          if (selectedCategory === 'all') {
            return [...allProductsArray];
          }
          return prevFiltered;
        });
        
        // Small delay between batches to prevent overwhelming the server
        if (i + BATCH_SIZE < remainingCategories.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    } catch (err) {
      console.error('Error loading remaining categories:', err);
    } finally {
      setLoadingBackground(false);
      isLoadingRest.current = false;
    }
  };

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
    return imageUrl || `${process.env.PUBLIC_URL}/prod.webp`;
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  const SkeletonCard = () => (
    <div className="all-products-card all-products-skeleton">
      <div className="all-products-image all-products-skeleton-image">
        <div className="all-products-skeleton-shimmer"></div>
      </div>
      <div className="all-products-info">
        <div className="all-products-skeleton-text all-products-skeleton-title"></div>
        <div className="all-products-skeleton-text all-products-skeleton-category"></div>
      </div>
    </div>
  );

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
        aria-label={translate('previous')}
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
          aria-label="Page 1"
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
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
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
          aria-label={`Page ${totalPages}`}
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
        aria-label={translate('next')}
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
          <Link to="/" className="back-link">
            ← {translate('home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <div className="products-section">
        <div className="container">
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
                aria-label={translate('allProducts')}
              >
                {translate('allProducts')} ({allProducts.length})
                {loadingBackground && ' ⟳'}
              </button>
              {categories.map((category) => {
                const count = allProducts.filter(p => p.categoryId === category.id).length;
                return (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(category.id)}
                    aria-label={`${category.title} category`}
                  >
                    {category.title} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>
          )}

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
                    className="all-products-card"
                  >
                    <div className="all-products-image">
                      <img 
                        src={getProductImage(product)} 
                        alt={getProductName(product)}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `${process.env.PUBLIC_URL}/prod.webp`;
                        }}
                      />
                    </div>
                    <div className="all-products-info">
                      <h3 className="all-products-name">{getProductName(product)}</h3>
                      <p className="all-products-category">{product.categoryName}</p>
                      <img 
                        src={arrow} 
                        alt="" 
                        className="all-products-arrow"
                      />
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