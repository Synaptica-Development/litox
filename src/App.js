import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './components/Landing';
import Category from './components/Category';
import Products from './components/Products';
import Video from './components/Video';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';
import AllProducts from './components/AllProducts';
import ProductDetails from './components/ProductDetails';
import Contacts from './components/Contacts';
import About from './components/About';
import Products2 from './components/Products2';
import Products2CategoryPage from './components/Products2CategoryPage';

// Home page component
function HomePage() {
  return (
    <>
      <Landing />
      <Category />
      <Products />
      <Video />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Home route */}
          <Route path="/" element={<HomePage />} />
          {/* All products route */}
          <Route path="/products" element={<AllProducts />} />
          {/* Category page route */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          {/* Products2 route */}
          <Route path="/products2" element={<Products2 />} />
          {/* Products2 Category page route */}
          <Route path="/products2/category/:categoryId" element={<Products2CategoryPage />} />
          {/* Product details with just productId */}
          <Route path="/product/:productId" element={<ProductDetails />} />
          {/* Dynamic product details route with categoryId */}
          <Route path="/products/:categoryId/:productId" element={<ProductDetails />} />
          {/* Contacts route */}
          <Route path="/contacts" element={<Contacts />} />
          {/* About route */}
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;