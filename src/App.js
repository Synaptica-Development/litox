import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './components/Landing';
import Category from './components/Category';
import Products from './components/Products';
import Video from './components/Video';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';

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
          
          {/* Category routes */}
          <Route 
            path="/products/plasters" 
            element={
              <CategoryPage 
                categoryName="Plasters"
                backgroundImage="/upload/iblock/plasters-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/decorative-plasters" 
            element={
              <CategoryPage 
                categoryName="Decorative Plasters"
                backgroundImage="/upload/iblock/deco-plasters-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/putties" 
            element={
              <CategoryPage 
                categoryName="Putties"
                backgroundImage="/upload/iblock/putties-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/tile-adhesives" 
            element={
              <CategoryPage 
                categoryName="Tile Adhesives"
                backgroundImage="/upload/iblock/d64/foto_plitochnyy_kley.webp"
              />
            } 
          />
          
          <Route 
            path="/products/mounting-compounds" 
            element={
              <CategoryPage 
                categoryName="Mounting Compounds"
                backgroundImage="/upload/iblock/mounting-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/leveling-floors" 
            element={
              <CategoryPage 
                categoryName="Leveling & Poured Floors"
                backgroundImage="/upload/iblock/leveling-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/waterproofing" 
            element={
              <CategoryPage 
                categoryName="Waterproofing Materials"
                backgroundImage="/upload/iblock/waterproofing-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/repair-compounds" 
            element={
              <CategoryPage 
                categoryName="Repair Compounds"
                backgroundImage="/upload/iblock/repair-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/paints" 
            element={
              <CategoryPage 
                categoryName="Paints"
                backgroundImage="/upload/iblock/paints-bg.webp"
              />
            } 
          />
          
          <Route 
            path="/products/primers" 
            element={
              <CategoryPage 
                categoryName="Primers"
                backgroundImage="/upload/iblock/primers-bg.webp"
              />
            } 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;