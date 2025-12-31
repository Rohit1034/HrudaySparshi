import React, { useState, useEffect } from 'react'
import { getProducts } from '../services/apiService'
import { Link } from 'react-router-dom'
import '../styles/products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { id: 'all', name: 'All Products', icon: '🍽️' },
    { id: 'meals', name: 'Meals', icon: '🍲' },
    { id: 'snacks', name: 'Snacks', icon: '🥒' },
    { id: 'sweets', name: 'Sweets', icon: '🍪' },
    { id: 'laddus', name: 'Laddus', icon: '🟠' },
    { id: 'festival', name: 'Festival Specials', icon: '🎉' }
  ]

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, products])

  return (
    <div className="products-page">
      <section className="products-header">
        <div className="container">
          <h1>Our Products</h1>
          <p className="subtitle">Explore our delicious selection of homemade meals, snacks, and sweets</p>
        </div>
      </section>

      <div className="container">
        <section className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <section className="products-section">
            <div className="products-grid">
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="placeholder">🍲</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <div className="product-footer">
                      <span className="price">₹{product.price}</span>
                      <span className="category-badge">{product.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="no-products">
            <p>No products found in this category.</p>
            <Link to="/products" className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
