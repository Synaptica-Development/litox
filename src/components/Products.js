import React from 'react'
import '../styles/Products.css'

const prod1 = process.env.PUBLIC_URL + '/prod.webp'
const prod2 = process.env.PUBLIC_URL + '/prod.webp'
const prod3 = process.env.PUBLIC_URL + '/prod.webp'
const prod4 = process.env.PUBLIC_URL + '/prod.webp'
const prod5 = process.env.PUBLIC_URL + '/prod.webp'
const prod6 = process.env.PUBLIC_URL + '/prod.webp'
const prod7 = process.env.PUBLIC_URL + '/prod.webp'
const prod8 = process.env.PUBLIC_URL + '/prod.webp'

const products = [
  { image: prod1, name: 'Product 1' },
  { image: prod2, name: 'Product 2' },
  { image: prod3, name: 'Product 3' },
  { image: prod4, name: 'Product 4' },
  { image: prod5, name: 'Product 5' },
  { image: prod6, name: 'Product 6' },
  { image: prod7, name: 'Product 7' },
  { image: prod8, name: 'Product 8' }
]

function Products() {
  return (
    <div className="home-cards-grid">
      <div className="flex-grid">
        {products.map((product, index) => (
          <div key={index} className="item">
            <a href="#" className="card">
              <span className="img-wrapper">
                <img src={product.image} alt={product.name} />
              </span>
              <span className="name">{product.name}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products