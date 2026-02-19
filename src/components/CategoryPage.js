import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/CategoryPage.css';

const background = process.env.PUBLIC_URL + '/products-bg.jpg';
const API_BASE_URL = 'https://api.litox.ge';

// SEO Meta Data Templates
const SEO_META_TEMPLATES = {
  ka: {
    title: '{category} - Litox Georgia | სამშენებლო მასალები თბილისში',
    description: '{category} - მაღალი ხარისხის პროდუქცია Litox Georgia-სგან. Free Way LLC - ოფიციალური წარმომადგენელი საქართველოში. სამშენებლო მასალები თბილისში.',
    keywords: '{category}, სამშენებლო მასალები თბილისში, ცემენტი, ბათქაში, შპაკლები, წებოები, Litox Georgia, Free Way LLC'
  },
  en: {
    title: '{category} - Litox Georgia | Construction Materials in Tbilisi',
    description: '{category} - High-quality products from Litox Georgia. Free Way LLC - official representative in Georgia. Construction materials in Tbilisi.',
    keywords: '{category}, construction materials Tbilisi, cement, plasters, putties, adhesives, Litox Georgia, Free Way LLC'
  },
  ru: {
    title: '{category} - Litox Georgia | Строительные материалы в Тбилиси',
    description: '{category} - Высококачественная продукция от Litox Georgia. Free Way LLC - официальный представитель в Грузии. Строительные материалы в Тбилиси.',
    keywords: '{category}, строительные материалы Тбилиси, цемент, штукатурки, шпатлёвки, клеи, Litox Georgia, Free Way LLC'
  }
};

// Helper function to update or create meta tag
const updateMetaTag = (selector, attribute, attributeValue, content) => {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    if (attribute) {
      element.setAttribute(attribute, attributeValue);
    } else {
      element.name = attributeValue;
    }
    document.head.appendChild(element);
  }
  if (selector.startsWith('link')) {
    element.href = content;
  } else {
    element.content = content;
  }
};

function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useState(() => localStorage.getItem('language') || 'ka');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  // SEO: Update meta tags when category changes - WITH CLEANUP
  useEffect(() => {
    if (!category) return;

    const templates = SEO_META_TEMPLATES[language] || SEO_META_TEMPLATES['ka'];
    const categoryName = category.title || '';

    const meta = {
      title: templates.title.replace('{category}', categoryName),
      description: templates.description.replace('{category}', categoryName),
      keywords: templates.keywords.replace('{category}', categoryName)
    };

    // Update page title
    document.title = meta.title;

    // Update meta tags
    updateMetaTag('meta[name="description"]', null, 'description', meta.description);
    updateMetaTag('meta[name="keywords"]', null, 'keywords', meta.keywords);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    
    // Update canonical URL
    const canonicalUrl = `https://litox.ge/products2/category/${categoryId}`;
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', canonicalUrl);

    // Cleanup function - restore original title when leaving page
    return () => {
      document.title = 'Litox Georgia - სამშენებლო მასალები თბილისში | ცემენტი, ბათქაში, წებო, შპაკლები';
    };
  }, [category, categoryId, language]);

  // Scroll to top when component mounts or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Fetch category and products when categoryId or language changes
  useEffect(() => {
    let isMounted = true;

    const fetchCategoryData = async () => {
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
          throw new Error('Category not found');
        }
        
        if (isMounted) {
          setCategory(currentCategory);
        }

        // Fetch all products for this category
        let allProducts = [];
        let currentApiPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const productsResponse = await fetch(
            `${API_BASE_URL}/api/Products/products?CategoryID=${categoryId}&PageSize=8&Page=${currentApiPage}`,
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

        if (isMounted) {
          setProducts(allProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setCategory(null);
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }

    return () => {
      isMounted = false;
    };
  }, [categoryId, language]);

  // Translation function - memoized
  const translate = useCallback((key) => {
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
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  }, [language]);

  const getProductImage = useCallback((product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || process.env.PUBLIC_URL + '/prod.webp';
  }, []);

  const getProductName = useCallback((product) => {
    return product.title || product.name || 'Product';
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const renderPagination = useCallback(() => {
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
        aria-label={`${translate('previous')} ${translate('page')}`}
        aria-disabled={currentPage === 1}
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

    // Page numbers
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

    // Last page
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

    // Next button
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
  }, [totalPages, currentPage, handlePageChange, translate]);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="category-page-container">
      <div className="container">
        <div className="loading" role="status" aria-live="polite">
          {translate('loading')}
        </div>
      </div>
    </div>
  ), [translate]);

  if (loading) {
    return loadingComponent;
  }

  if (error) {
    return (
      <div className="category-page-container">
        <div className="container">
          <div className="error" role="alert" aria-live="assertive">
            {translate('error')}: {error}
          </div>
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
        aria-label={`${category?.title} ${translate('products')}`}
      >
        <nav aria-label="Breadcrumb">
          <ul className="breadcrumbs">
            <li>
              <Link to="/" aria-label={translate('home')}>
                {translate('home')}
              </Link>
            </li>
            <li>
              <Link to="/products" aria-label={translate('products')}>
                {translate('products')}
              </Link>
            </li>
            <li>
              <span aria-current="page">{category?.title}</span>
            </li>
          </ul>
        </nav>
        <div className="container2">
          <h1>{category?.title}</h1>
          <p className="products-count" aria-label={`${products.length} ${translate('productsCount')}`}>
            {products.length} {translate('productsCount')}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <main className="category-products-section">
        <div className="container">
          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="error" role="alert">
              {translate('noProducts')}
            </div>
          ) : (
            <>
              <div className="category-products-grid" role="list">
                {currentProducts.map((product, index) => (
                  <article 
                    key={product.id || index}
                    role="listitem"
                  >
                    <Link 
                      to={`/products/${product.categoryId}/${product.id}`} 
                      className="category-product-card"
                      aria-label={`${translate('viewProduct')}: ${getProductName(product)}`}
                    >
                      <div className="category-product-image">
                        <img 
                          src={getProductImage(product)} 
                          alt={getProductName(product)}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                          }}
                        />
                      </div>
                      <div className="category-product-info">
                        <h3 className="category-product-name">{getProductName(product)}</h3>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default CategoryPage;