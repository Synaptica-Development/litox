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
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get('category') || 'all';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });
  const [loadingBackground, setLoadingBackground] = useState(false);
  const isLoadingRest = useRef(false);
  const abortControllerRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;
  const INITIAL_CATEGORIES_TO_LOAD = 3;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => product.categoryId === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [allProducts, selectedCategory]);

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
        setLoading(false);

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
      home: { ka: 'მთავარი', en: 'Home', ru: 'Главная' },
      products: { ka: 'პროდუქტები', en: 'Products', ru: 'Продукты' },
      allProducts: { ka: 'ყველა პროდუქტი', en: 'All Products', ru: 'Все продукты' },
      loading: { ka: 'იტვირთება ყველა პროდუქტი...', en: 'Loading all products...', ru: 'Загрузка всех продуктов...' },
      error: { ka: 'შეცდომა პროდუქტების ჩატვირთვისას', en: 'Error loading products', ru: 'Ошибка загрузки продуктов' },
      noProducts: { ka: 'პროდუქტები არ არის ხელმისაწვდომი', en: 'No products available', ru: 'Продукты недоступны' },
      previous: { ka: 'წინა', en: 'Previous', ru: 'Предыдущая' },
      next: { ka: 'შემდეგი', en: 'Next', ru: 'Следующая' }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || `${process.env.PUBLIC_URL}/prod.webp`;
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  const getPageTitle = () => {
    if (selectedCategory === 'all') {
      return translate('allProducts');
    }
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.title : translate('allProducts');
  };

  const SkeletonCard = () => (
    <div className="all-products-page-card all-products-page-skeleton">
      <div className="all-products-page-image all-products-page-skeleton-image">
        <div className="all-products-page-skeleton-shimmer"></div>
      </div>
      <div className="all-products-page-info">
        <div className="all-products-page-skeleton-text all-products-page-skeleton-title"></div>
        <div className="all-products-page-skeleton-text all-products-page-skeleton-category"></div>
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
      <button key="prev" className="all-products-page-pagination-btn all-products-page-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        {translate('previous')}
      </button>
    );

    if (startPage > 1) {
      pages.push(<button key={1} className="all-products-page-pagination-btn" onClick={() => handlePageChange(1)}>1</button>);
      if (startPage > 2) {
        pages.push(<span key="dots1" className="all-products-page-pagination-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={`all-products-page-pagination-btn ${currentPage === i ? 'active' : ''}`} onClick={() => handlePageChange(i)}>{i}</button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="all-products-page-pagination-dots">...</span>);
      }
      pages.push(<button key={totalPages} className="all-products-page-pagination-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>);
    }

    pages.push(
      <button key="next" className="all-products-page-pagination-btn all-products-page-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        {translate('next')}
      </button>
    );

    return <div className="all-products-page-pagination">{pages}</div>;
  };

  if (error) {
    return (
      <div className="all-products-page-container">
        <div className="container">
          <div className="all-products-page-error">{translate('error')}: {error}</div>
          <Link to="/">← {translate('home')}</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="products-hero2" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="container2">
          <ul className="breadcrumbs">
            <li><Link to="/">{translate('home')}</Link></li>
            <li><span>{translate('products')}</span></li>
          </ul>
          <h1>{getPageTitle()}</h1>
        </div>
      </section>

      <div className="all-products-page-section">
        <div className="container">
          {loading ? (
            <div className="all-products-page-filter-wrapper">
              {[...Array(4)].map((_, i) => <div key={i} className="all-products-page-filter-btn skeleton all-products-page-skeleton-filter"></div>)}
            </div>
          ) : (
            <div className="all-products-page-filter-wrapper">
              <button className={`all-products-page-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryFilter('all')}>
                {translate('allProducts')} ({allProducts.length}) {loadingBackground && ' ⟳'}
              </button>
              {categories.map((category) => {
                const count = allProducts.filter(p => p.categoryId === category.id).length;
                return (
                  <button key={category.id} className={`all-products-page-filter-btn ${selectedCategory === category.id ? 'active' : ''}`} onClick={() => handleCategoryFilter(category.id)}>
                    {category.title} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="all-products-page-grid">
              {[...Array(16)].map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="all-products-page-error">{translate('noProducts')}</div>
          ) : (
            <>
              <div className="all-products-page-grid">
                {currentProducts.map((product, index) => (
                  <Link key={product.id || index} to={`/products/${product.categoryId}/${product.id}`} className="all-products-page-card">
                    <div className="all-products-page-image">
                      <img src={getProductImage(product)} alt={getProductName(product)} loading="lazy" onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/prod.webp`; }} />
                    </div>
                    <div className="all-products-page-info">
                      <h3 className="all-products-page-name">{getProductName(product)}</h3>
                      <p className="all-products-page-category">{product.categoryName}</p>
                      <img src={arrow} alt="" className="all-products-page-arrow" />
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