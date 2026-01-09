import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/components.css'
import heroImage from '../assets/Ukadiche-modak.jpg'

function HeroSection({ content }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{content?.heroTitle || 'Authentic Homemade Delights'}</h1>
          <p>{content?.heroSubtitle || 'Fresh, traditional recipes made with love. Delivered to your doorstep.'}</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <img src={heroImage} alt="Ukadiche Modak" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
