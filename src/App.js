import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router basename="/litox">
      <div className="App">
        <Header />
        <Routes>
          {/* Home route */}
          <Route path="/" element={<HomePage />} />
          {/* All products route */}
          <Route path="/products" element={<AllProducts />} />
          {/* Dynamic product details route */}
          <Route path="/products/:categoryId/:productId" element={<ProductDetails />} />
          {/* Dynamic category route */}
          <Route path="/products/:categoryId" element={<CategoryPage />} />

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