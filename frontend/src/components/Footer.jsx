import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-brand">Hruday Sparshi</h3>
              <p className="footer-tagline">Authentic homemade meals, snacks, and sweets made with tradition and care.</p>
              <div className="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Instagram">📷</a>
                <a href="#" title="WhatsApp">💬</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Our Services</h4>
              <ul>
                <li>✓ Free Delivery</li>
                <li>✓ Homemade Quality</li>
                <li>✓ Fresh Daily</li>
                <li>✓ Traditional Recipes</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Us</h4>
              <p><strong>Email:</strong> rohit.patil1034t@gmail.com</p>
              <p><strong>Phone:</strong> +91 9082774647</p>
              <p><strong>WhatsApp:</strong> +91 9082774647</p>
              <p><strong>Hours:</strong> 10 AM - 8 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Hruday Sparshi. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms & Conditions</Link>
              <Link to="#">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer



