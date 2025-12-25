import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/CategoryPage.css';

function CategoryPage() {
  const { categoryId } = useParams(); // Get category ID from URL
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch category details and products
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        console.log('Category ID from URL:', categoryId); // Debug
        
        // Fetch category details
        const categoryResponse = await fetch('http://api.litox.synaptica.online/api/Category/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Language': 'en',
          },
        });

        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category details');
        }

        const categories = await categoryResponse.json();
        const currentCategory = categories.find(cat => cat.id === categoryId);
        
        console.log('Current Category:', currentCategory); // Debug
        
        if (currentCategory) {
          setCategory(currentCategory);
        }

        // Fetch products for this category
        const productsUrl = `http://api.litox.synaptica.online/api/Products/products?CategoryID=${categoryId}&PageSize=100&Page=1`;
        console.log('Fetching products from:', productsUrl); // Debug
        
        const productsResponse = await fetch(productsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Language': 'en',
          },
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();
        console.log('Products API Response:', productsData);
        console.log('Number of products:', productsData.length || productsData.items?.length || 0);

        let fetchedProducts = [];
        if (productsData && productsData.length > 0) {
          fetchedProducts = productsData;
        } else if (productsData && productsData.items) {
          fetchedProducts = productsData.items;
        }
        
        // Filter products by categoryID to be safe
        const filteredProducts = fetchedProducts.filter(product => 
          product.categoryID === categoryId || product.categoryId === categoryId
        );
        
        console.log('Filtered products count:', filteredProducts.length);
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  // Get product image URL
  const getProductImage = (product) => {
    const imageUrl = product.imageLink || product.image || product.imageUrl || product.ImageLink || product.Image || product.ImageUrl;
    
    if (!imageUrl) {
      return process.env.PUBLIC_URL + '/prod.webp'; // Fallback
    }
    
    // If already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise prepend API base URL
    return `http://api.litox.synaptica.online${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  // Get product name
  const getProductName = (product) => {
    return product.name || product.title || product.Name || product.Title || 'Product';
  };

  // Get product link
  const getProductLink = (product) => {
    const slug = product.slug || product.id || product.Id;
    return `/products/${categoryId}/${slug}`;
  };

  // Get category name
  const categoryName = category?.title || category?.name || 'Products';

  // Get background image (you might want to add this to category API response)
  const backgroundImage = category?.backgroundImage || category?.bannerImage || 
                         process.env.PUBLIC_URL + '/upload/iblock/d64/tsxocb9e0hfni9buftdeipbmxo1qo6nu/foto_plitochnyy_kley.webp';

  if (loading) {
    return (
      <div className="products-section category-rev">
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-section category-rev">
        <div className="container">
          <div className="error">Error loading products: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Background */}
      <section 
        className="products-list-wrapper category-section-heading" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#products">Products</Link></li>
            <li><span>{categoryName}</span></li>
          </ul>
          <h1>{categoryName}</h1>
        </div>
      </section>

      {/* Products Grid Section */}
      <div className="products-section category-rev">
        <div className="container">
          {products.length === 0 ? (
            <div className="error">No products available in this category</div>
          ) : (
            <div className="products-flex-list">
              {products.map((product, index) => (
                <div key={product.id || index} className="item">
                  <Link to={getProductLink(product)} className="video-wrapper">
                    <div className="video-cover">
                      <div className="img-imit"></div>
                      <img 
                        className="catalog-two__img" 
                        src={getProductImage(product)} 
                        alt={getProductName(product)}
                        onError={(e) => {
                          e.target.src = process.env.PUBLIC_URL + '/prod.webp';
                        }}
                      />
                      <div className="name">
                        {getProductName(product)}
                      </div>
                      <div className="divider"></div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;