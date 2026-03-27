import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getProducts } from '../services/apiService'
import { Link } from 'react-router-dom'
import '../styles/products.css'

const SKELETON_COUNT = 8

function ProductSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-image skeleton-box" />
      <div className="product-info">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
        <div className="product-footer">
          <div className="skeleton-line skeleton-line--price" />
          <div className="skeleton-line skeleton-line--badge" />
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image && !imgError ? (
          <>
            {!imgLoaded && <div className="skeleton-box product-image-placeholder" aria-hidden="true" />}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              style={imgLoaded ? {} : { opacity: 0, position: 'absolute' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="placeholder">🍲</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="product-footer">
          <span className="price">₹{product.price}<span className="price-unit">{product.priceUnit || '/KG'}</span></span>
          <span className="category-badge">{product.category}</span>
        </div>
      </div>
    </Link>
  )
}

function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchingRef = useRef(false)

  const categories = [
    { id: 'all', name: 'All Products', icon: '🍽️' },
    { id: 'snacks', name: 'Snacks', icon: '🥒' },
    { id: 'sweets', name: 'Sweets', icon: '🍪' },
    { id: 'laddus', name: 'Laddus', icon: '🟠' },
    { id: 'festival', name: 'Festival Specials', icon: '🎉' }
  ]

  const loadProducts = useCallback(async () => {
    // Prevent concurrent fetches (e.g. rapid retry button clicks)
    if (fetchingRef.current) return
    fetchingRef.current = true
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError(err.message || 'Failed to load products. Please try again.')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

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

        {error ? (
          <div className="error-state">
            <p>⚠️ {error}</p>
            <button className="btn btn-primary" onClick={loadProducts}>Try Again</button>
          </div>
        ) : loading ? (
          <section className="products-section">
            <div className="products-grid">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </section>
        ) : (
          <section className="products-section">
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {filteredProducts.length === 0 && !loading && !error && (
          <div className="no-products">
            <p>No products found in this category.</p>
            <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
