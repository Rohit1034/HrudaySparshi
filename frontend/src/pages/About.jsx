import React from 'react'
import '../styles/about.css'

function About() {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About Us</h1>

        <div className="about-hero">
          <h2>Our Story</h2>
          <p>
            Welcome to Hruday Sparshi - Your trusted source for authentic homemade food and snacks.
            We believe in bringing traditional flavors and homemade quality to every meal.
          </p>
        </div>

        <div className="about-sections">
          <div className="about-section">
            <h3>Who We Are</h3>
            <p>
              We are a family-run business dedicated to preparing delicious, fresh, and authentic
              homemade meals using traditional recipes passed down through generations. Every item
              is made with care and the finest ingredients to ensure quality and taste.
            </p>
          </div>

          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              Our mission is to make authentic homemade food accessible to everyone in our community.
              We're committed to maintaining traditional flavors while meeting modern expectations
              for quality, hygiene, and convenience.
            </p>
          </div>

          <div className="about-section">
            <h3>Our Values</h3>
            <ul>
              <li><strong>Quality:</strong> We use only the finest ingredients and traditional cooking methods</li>
              <li><strong>Authenticity:</strong> Our recipes are traditional and time-tested</li>
              <li><strong>Freshness:</strong> Everything is made fresh and delivered quickly</li>
              <li><strong>Trust:</strong> We value the trust our customers place in us</li>
              <li><strong>Community:</strong> We're proud to serve our local community</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>What Makes Us Different</h3>
            <ul>
              <li>🏠 Genuinely homemade - not commercial kitchen</li>
              <li>🍲 Traditional recipes with authentic taste</li>
              <li>🚚 Free delivery within our service area</li>
              <li>👨‍🍳 Personal touch in every dish</li>
              <li>⏰ Fresh preparation for every order</li>
              <li>🤝 Direct relationship with our customers</li>
            </ul>
          </div>
        </div>

        <div className="about-cta">
          <h2>Experience the Difference</h2>
          <p>Order from us today and taste authentic homemade quality</p>
        </div>
      </div>
    </div>
  )
}

export default About
