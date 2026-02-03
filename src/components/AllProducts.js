import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/AllProducts.css';

const background = `${process.env.PUBLIC_URL}/products-bg.jpg`;
const arrow = `${process.env.PUBLIC_URL}/right-arrow2.svg`;
const API_BASE_URL = 'https://api.litox.ge';

// SEO Meta Data
const SEO_META_DATA = {
  ka: {
    allProducts: {
      title: 'ყველა პროდუქტი - Litox Georgia | სამშენებლო მასალები თბილისში',
      description: 'Litox Georgia - სრული კატალოგი: ცემენტი, ბათქაში, შპაკლები, წებოები, თვითსწორებადი იატაკი, საჰიდროიზოლაციო მასალები თბილისში. Free Way LLC - ოფიციალური წარმომადგენელი.',
      keywords: 'სამშენებლო მასალები თბილისში, ცემენტი თბილისში, ბათქაში, წებო ცემენტი, შპაკლები, თვითსწორებადი იატაკი, Litox Georgia'
    },
    category: {
      title: '{category} - Litox Georgia | სამშენებლო მასალები თბილისში',
      description: '{category} - მაღალი ხარისხის პროდუქცია Litox Georgia-სგან. Free Way LLC - ოფიციალური წარმომადგენელი საქართველოში.',
      keywords: '{category}, სამშენებლო მასალები, Litox Georgia, თბილისი'
    }
  },
  en: {
    allProducts: {
      title: 'All Products - Litox Georgia | Construction Materials in Tbilisi',
      description: 'Litox Georgia - Full catalog: cement, plasters, putties, adhesives, levelers, waterproofing materials in Tbilisi. Free Way LLC - official representative.',
      keywords: 'construction materials Tbilisi, cement Tbilisi, plasters, tile adhesives, putties, levelers, Litox Georgia'
    },
    category: {
      title: '{category} - Litox Georgia | Construction Materials in Tbilisi',
      description: '{category} - High-quality products from Litox Georgia. Free Way LLC - official representative in Georgia.',
      keywords: '{category}, construction materials, Litox Georgia, Tbilisi'
    }
  },
  ru: {
    allProducts: {
      title: 'Все продукты - Litox Georgia | Строительные материалы в Тбилиси',
      description: 'Litox Georgia - Полный каталог: цемент, штукатурки, шпатлёвки, клеи, ровницели, гидроизоляционные материалы в Тбилиси. Free Way LLC - официальный представитель.',
      keywords: 'строительные материалы Тбилиси, цемент Тбилиси, штукатурки, плиточные клеи, шпатлёвки, ровницели, Litox Georgia'
    },
    category: {
      title: '{category} - Litox Georgia | Строительные материалы в Тбилиси',
      description: '{category} - Высококачественная продукция от Litox Georgia. Free Way LLC - официальный представитель в Грузии.',
      keywords: '{category}, строительные материалы, Litox Georgia, Тбилиси'
    }
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
  const [language] = useState(() => {
    return localStorage.getItem('language') || 'ka';
  });
  const [loadingBackground, setLoadingBackground] = useState(false);
  const isLoadingRest = useRef(false);
  const abortControllerRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;
  const INITIAL_CATEGORIES_TO_LOAD = 3;

  // SEO: Update meta tags - WITH CLEANUP
  useEffect(() => {
    const seoData = SEO_META_DATA[language] || SEO_META_DATA['ka'];
    let meta;

    if (selectedCategory === 'all') {
      meta = seoData.allProducts;
    } else {
      const category = categories.find(cat => cat.id === selectedCategory);
      const categoryName = category ? category.title : '';
      
      meta = {
        title: seoData.category.title.replace('{category}', categoryName),
        description: seoData.category.description.replace('{category}', categoryName),
        keywords: seoData.category.keywords.replace('{category}', categoryName)
      };
    }

    // Update page title
    document.title = meta.title;

    // Update meta tags
    updateMetaTag('meta[name="description"]', null, 'description', meta.description);
    updateMetaTag('meta[name="keywords"]', null, 'keywords', meta.keywords);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    
    // Update canonical URL
    const canonicalUrl = selectedCategory === 'all' 
      ? 'https://litoxgeorgia.ge/products' 
      : `https://litoxgeorgia.ge/products?category=${selectedCategory}`;
    updateMetaTag('link[rel="canonical"]', 'rel', 'canonical', canonicalUrl);

    // Cleanup function - restore original title when leaving page
    return () => {
      document.title = 'Litox Georgia - სამშენებლო მასალები თბილისში | ცემენტი, ბათქაში, წებო, შპაკლები';
    };
  }, [selectedCategory, categories, language]);

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

  const translate = useCallback((key) => {
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
  }, [language]);

  const handleCategoryFilter = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  }, [setSearchParams]);

  const getProductImage = useCallback((product) => {
    const imageUrl = product.iconImageLink || product.imageLink || product.image;
    return imageUrl || `${process.env.PUBLIC_URL}/prod.webp`;
  }, []);

  const getProductName = useCallback((product) => {
    return product.title || product.name || 'Product';
  }, []);

  const getPageTitle = useCallback(() => {
    if (selectedCategory === 'all') {
      return translate('allProducts');
    }
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.title : translate('allProducts');
  }, [selectedCategory, categories, translate]);

  const SkeletonCard = useMemo(() => () => (
    <div className="all-products-page-card all-products-page-skeleton">
      <div className="all-products-page-image all-products-page-skeleton-image">
        <div className="all-products-page-skeleton-shimmer"></div>
      </div>
      <div className="all-products-page-info">
        <div className="all-products-page-skeleton-text all-products-page-skeleton-title"></div>
        <div className="all-products-page-skeleton-text all-products-page-skeleton-category"></div>
      </div>
    </div>
  ), []);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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

    pages.push(
      <button 
        key="prev" 
        className="all-products-page-pagination-btn all-products-page-pagination-arrow" 
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
          className="all-products-page-pagination-btn" 
          onClick={() => handlePageChange(1)}
          aria-label="Go to page 1"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="all-products-page-pagination-dots" aria-hidden="true">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          className={`all-products-page-pagination-btn ${currentPage === i ? 'active' : ''}`} 
          onClick={() => handlePageChange(i)}
          aria-label={`Go to page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="all-products-page-pagination-dots" aria-hidden="true">...</span>);
      }
      pages.push(
        <button 
          key={totalPages} 
          className="all-products-page-pagination-btn" 
          onClick={() => handlePageChange(totalPages)}
          aria-label={`Go to page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button 
        key="next" 
        className="all-products-page-pagination-btn all-products-page-pagination-arrow" 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        aria-label={translate('next')}
      >
        {translate('next')}
      </button>
    );

    return <div className="all-products-page-pagination">{pages}</div>;
  }, [totalPages, currentPage, handlePageChange, translate]);

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
              <button 
                className={`all-products-page-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`} 
                onClick={() => handleCategoryFilter('all')}
                aria-label={`Filter all products (${allProducts.length})`}
              >
                {translate('allProducts')} ({allProducts.length}) {loadingBackground && ' ⟳'}
              </button>
              {categories.map((category) => {
                const count = allProducts.filter(p => p.categoryId === category.id).length;
                return (
                  <button 
                    key={category.id} 
                    className={`all-products-page-filter-btn ${selectedCategory === category.id ? 'active' : ''}`} 
                    onClick={() => handleCategoryFilter(category.id)}
                    aria-label={`Filter ${category.title} products${count > 0 ? ` (${count})` : ''}`}
                  >
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
                {currentProducts.map((product, index) => {
                  const productName = getProductName(product);
                  const categoryName = product.categoryName || '';
                  return (
                    <Link 
                      key={product.id || index} 
                      to={`/products/${product.categoryId}/${product.id}`} 
                      className="all-products-page-card"
                      aria-label={`View ${productName}${categoryName ? ` in ${categoryName}` : ''} details`}
                    >
                      <div className="all-products-page-image">
                        <img 
                          src={getProductImage(product)} 
                          alt={`${productName}${categoryName ? ` - ${categoryName}` : ''}`} 
                          loading="lazy" 
                          onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/prod.webp`; }} 
                        />
                      </div>
                      <div className="all-products-page-info">
                        <h3 className="all-products-page-name">{productName}</h3>
                        {categoryName && (
                          <p className="all-products-page-category">{categoryName}</p>
                        )}
                        <img src={arrow} alt="" className="all-products-page-arrow" aria-hidden="true" />
                      </div>
                    </Link>
                  );
                })}
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