import React, { useState, useEffect } from 'react'
import { getHomepageContent, getProducts } from '../services/apiService'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import Carousel from '../components/Carousel'
import '../styles/home.css'

function Home() {
  const [homepageContent, setHomepageContent] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])

  // Load homepage content and featured products independently so
  // neither blocks the other from appearing.
  useEffect(() => {
    getHomepageContent()
      .then(setHomepageContent)
      .catch(() => setHomepageContent({}))
  }, [])

  useEffect(() => {
    getProducts()
      .then(products => {
        const featured = products.filter(p => p.isFeatured === true)
        setFeaturedProducts(featured)
      })
      .catch(() => {
        // Featured products are non-critical; silently ignore errors here
      })
  }, [])

  return (
    <div className="home">
      <HeroSection content={homepageContent} />
      <Carousel products={featuredProducts} />
      
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
