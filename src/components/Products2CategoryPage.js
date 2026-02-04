import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/Products2CategoryPage.css';

const arrow = `${process.env.PUBLIC_URL}/right-arrow2.svg`;
const API_BASE_URL = 'https://api.litox.ge';

function Products2CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
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
        const categoryResponse = await fetch(`${API_BASE_URL}/api/Category/categories`, {
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
          // Redirect to products page if category not found
          navigate('/products2', { replace: true });
          return;
        }

        setCategory(currentCategory);

        // Fetch products for this category
        const productsResponse = await fetch(
          `${API_BASE_URL}/api/Products/products?CategoryID=${categoryId}&PageSize=100&Page=1`,
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
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndProducts();
    } else {
      // Redirect if no categoryId
      navigate('/products2', { replace: true });
    }
  }, [categoryId, language, navigate]);

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
      },
      loadingError: {
        ka: 'შეცდომა დატვირთვისას',
        en: 'Error loading',
        ru: 'Ошибка загрузки'
      },
      viewProduct: {
        ka: 'ნახე პროდუქტი',
        en: 'View product',
        ru: 'Посмотреть продукт'
      },
      page: {
        ka: 'გვერდი',
        en: 'Page',
        ru: 'Страница'
      },
      currentPage: {
        ka: 'მიმდინარე გვერდი',
        en: 'Current page',
        ru: 'Текущая страница'
      },
      goToPage: {
        ka: 'გადადი გვერდზე',
        en: 'Go to page',
        ru: 'Перейти на страницу'
      },
      loading: {
        ka: 'იტვირთება...',
        en: 'Loading...',
        ru: 'Загрузка...'
      },
      backToCategories: {
        ka: 'უკან კატეგორიებზე',
        en: 'Back to categories',
        ru: 'Назад к категориям'
      },
      productsIn: {
        ka: 'პროდუქტები კატეგორიაში',
        en: 'Products in',
        ru: 'Продукты в'
      }
    };
    return translations[key]?.[language] || translations[key]?.['ka'] || key;
  };

  const getProductImage = (product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || `${process.env.PUBLIC_URL}/prod.webp`;
  };

  const getProductName = (product) => {
    return product.title || product.name || 'Product';
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="product-card skeleton" aria-hidden="true">
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
        aria-label={`${translate('previous')} ${translate('page')}`}
        aria-disabled={currentPage === 1}
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
          aria-label={`${translate('goToPage')} 1`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="pagination-dots" aria-hidden="true">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
          aria-label={currentPage === i ? `${translate('currentPage')} ${i}` : `${translate('goToPage')} ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="pagination-dots" aria-hidden="true">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
          aria-label={`${translate('goToPage')} ${totalPages}`}
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
        aria-label={`${translate('next')} ${translate('page')}`}
        aria-disabled={currentPage === totalPages}
      >
        {translate('next')}
      </button>
    );

    return (
      <nav className="pagination" role="navigation" aria-label={translate('page')}>
        {pages}
      </nav>
    );
  };

  if (error) {
    return (
      <div className="category-page-container">
        <div className="container">
          <div className="error-message" role="alert" aria-live="assertive">
            {translate('loadingError')}: {error}
          </div>
          <Link 
            to="/products2" 
            className="back-link"
            aria-label={translate('backToCategories')}
          >
            ← {translate('categories')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Section with Category Banner */}
      {loading ? (
        <section 
          className="category-hero skeleton" 
          aria-hidden="true"
          role="status"
          aria-label={translate('loading')}
        >
          <div className="skeleton-shimmer"></div>
        </section>
      ) : category ? (
        <header 
          className="category-hero"
          style={{
            backgroundImage: `url(${category.bannerLink})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          role="banner"
        >
          <div className="category-hero-content">
            <nav aria-label="Breadcrumb">
              <ul className="breadcrumbs">
                <li>
                  <Link to="/" aria-label={translate('home')}>
                    {translate('home')}
                  </Link>
                </li>
                <li>
                  <Link to="/products2" aria-label={translate('categories')}>
                    {translate('categories')}
                  </Link>
                </li>
                <li>
                  <span aria-current="page">{category.title}</span>
                </li>
              </ul>
            </nav>
            <h1>{category.title}</h1>
          </div>
        </header>
      ) : null}

      {/* Products Section */}
      <main 
        className="category-products-section"
        aria-label={category ? `${translate('productsIn')} ${category.title}` : translate('productsIn')}
      >
        <div className="container">
          {loading ? (
            <div 
              className="products-grid" 
              role="status" 
              aria-live="polite"
              aria-label={translate('loading')}
            >
              {[...Array(12)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products" role="alert">
              {translate('noProducts')}
            </div>
          ) : (
            <>
              <div className="products-grid" role="list">
                {currentProducts.map((product) => (
                  <article key={product.id} role="listitem">
                    <Link
                      to={`/products/${categoryId}/${product.id}`}
                      className="product-card"
                      aria-label={`${translate('viewProduct')}: ${getProductName(product)}`}
                    >
                      <div className="product-image-wrapper">
                        <figure className="product-image">
                          <img
                            src={getProductImage(product)}
                            alt={getProductName(product)}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = `${process.env.PUBLIC_URL}/prod.webp`;
                            }}
                          />
                        </figure>
                        <div className="product-info">
                          <h2 className="product-name">{getProductName(product)}</h2>
                          <div className="product-arrow" aria-hidden="true">
                            <img src={arrow} alt="" role="presentation" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
              
              {renderPagination()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Products2CategoryPage;