import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getProductsPaginated } from '../services/apiService'
import { Link } from 'react-router-dom'
import '../styles/products.css'

const PAGE_SIZE = 8
const SKELETON_COUNT = PAGE_SIZE

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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastDocId, setLastDocId] = useState(null)
  const [error, setError] = useState(null)
  const [loadMoreError, setLoadMoreError] = useState(false)

  const fetchingRef = useRef(false)
  const sentinelRef = useRef(null)

  const categories = [
    { id: 'all', name: 'All Products', icon: '🍽️' },
    { id: 'snacks', name: 'Snacks', icon: '🥒' },
    { id: 'sweets', name: 'Sweets', icon: '🍪' },
    { id: 'laddus', name: 'Laddus', icon: '🟠' },
    { id: 'festival', name: 'Festival Specials', icon: '🎉' }
  ]

  // Load the first page for the given category
  const loadInitial = useCallback(async (category) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    setProducts([])
    setLastDocId(null)
    setHasMore(true)
    setLoadMoreError(false)
    try {
      const data = await getProductsPaginated({
        limit: PAGE_SIZE,
        category: category !== 'all' ? category : null
      })
      setProducts(data.products)
      setLastDocId(data.lastDocId)
      setHasMore(data.hasMore)
    } catch (err) {
      setError(err.message || 'Failed to load products. Please try again.')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  // Load the next page (triggered by infinite scroll)
  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return
    fetchingRef.current = true
    setLoadingMore(true)
    setLoadMoreError(false)
    try {
      const data = await getProductsPaginated({
        limit: PAGE_SIZE,
        lastDocId,
        category: selectedCategory !== 'all' ? selectedCategory : null
      })
      setProducts(prev => [...prev, ...data.products])
      setLastDocId(data.lastDocId)
      setHasMore(data.hasMore)
    } catch (err) {
      // Keep existing products visible and let the user retry
      setLoadMoreError(true)
    } finally {
      setLoadingMore(false)
      fetchingRef.current = false
    }
  }, [hasMore, lastDocId, selectedCategory])

  // Reload whenever the selected category changes
  useEffect(() => {
    loadInitial(selectedCategory)
  }, [selectedCategory, loadInitial])

  // Intersection Observer – fires loadMore when sentinel enters the viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, loadMore])

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
            <button className="btn btn-primary" onClick={() => loadInitial(selectedCategory)}>Try Again</button>
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
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              {loadingMore && Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductSkeleton key={`more-${i}`} />
              ))}
            </div>

            {/* Sentinel element watched by the Intersection Observer */}
            <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

            {loadMoreError && (
              <div className="load-more-error">
                <p>Failed to load more products.</p>
                <button className="btn btn-primary" onClick={loadMore}>Retry</button>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <p className="end-of-list">You've seen all products 🎉</p>
            )}

            {products.length === 0 && !loadingMore && !loading && (
              <div className="no-products">
                <p>No products found in this category.</p>
                <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                  View All Products
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default Products

