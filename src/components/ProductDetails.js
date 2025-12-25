import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/ProductDetails.css';

function ProductDetails() {
  const { categoryId, productId } = useParams();
  const [activeTab, setActiveTab] = useState('specifications');
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('ka');

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await fetch(
          `http://api.litox.synaptica.online/api/Products/products/details?ProductID=${productId}`,
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (!productResponse.ok) {
          throw new Error('Failed to fetch product details');
        }

        const productData = await productResponse.json();
        setProduct(productData);

        // Fetch category info
        const categoriesResponse = await fetch(
          'http://api.litox.synaptica.online/api/Category/categories',
          {
            headers: {
              'accept': '*/*',
              'X-Language': language
            }
          }
        );

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const foundCategory = categoriesData.find(cat => cat.id === categoryId);
          setCategory(foundCategory);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId, categoryId, language]);

  if (loading) {
    return (
      <div className="product-details-container">
        <div className="container">
          <div className="loading">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <div className="container">
          <div className="error">Error loading product: {error || 'Product not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Hero Section */}
      <section className="product-hero">
        <img 
          src={product.iconImageLink || '/prod.webp'} 
          alt={product.title} 
          className="product-small-img"
          onError={(e) => {
            e.target.src = '/prod.webp';
          }}
        />
        <div className="container">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {category && <li><Link to={`/products?category=${categoryId}`}>{category.title}</Link></li>}
            <li><span>{product.title}</span></li>
          </ul>
          <h1>{product.title}</h1>
          {product.description && <div className="preview-text">{product.description}</div>}
          <button className="request-btn">REQUEST PRICING</button>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-header">
            <ul className="tab-list">
              <li className={activeTab === 'specifications' ? 'active' : ''}>
                <button onClick={() => setActiveTab('specifications')}>Specifications</button>
              </li>
            </ul>
            <button className="calculator-btn">CALCULATOR</button>
            <Link to="/where-to-buy" className="where-buy-btn">WHERE TO BUY</Link>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="tab-pane active">
                <div className="specifications-table">
                  {product.params && Object.keys(product.params).length > 0 ? (
                    <table>
                      <tbody>
                        {Object.entries(product.params).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No specifications available for this product.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;