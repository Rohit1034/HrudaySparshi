import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/components.css'

function FeaturedProducts({ products }) {
  return (
    <section className="featured-products">
      <div className="container">
        <h2>Featured Products</h2>
        <p className="section-subtitle">Our best sellers and customer favorites</p>

        <div className="products-grid">
          {products.slice(0, 6).map(product => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="featured-product-card"
            >
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
