import React, { useState, useEffect } from 'react'
import { getHomepageContent, getProducts } from '../services/apiService'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import FeaturedProducts from '../components/FeaturedProducts'
import '../styles/home.css'

function Home() {
  const [homepageContent, setHomepageContent] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        const [content, products] = await Promise.all([
          getHomepageContent(),
          getProducts()
        ])
        setHomepageContent(content)
        // Get featured products
        const featured = products.filter(p => p.featured).slice(0, 6)
        setFeaturedProducts(featured)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="home">
      <HeroSection content={homepageContent} />
      
      <section className="highlights">
        <div className="container">
          <h2>Why Choose HomeMade Delights?</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="icon">👩‍🍳</div>
              <h3>Homemade Quality</h3>
              <p>Made fresh every day with traditional recipes and authentic flavors</p>
            </div>
            <div className="highlight-card">
              <div className="icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>Complimentary home delivery within our service area</p>
            </div>
            <div className="highlight-card">
              <div className="icon">💰</div>
              <h3>Cash on Delivery</h3>
              <p>Pay when you receive. No advance payment required</p>
            </div>
            <div className="highlight-card">
              <div className="icon">✨</div>
              <h3>Traditional Taste</h3>
              <p>Authentic homemade recipes passed down through generations</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} />

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience Authentic Homemade Food?</h2>
          <p>Browse our full range of meals, snacks, and sweets made with love</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
