import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../styles/carousel.css'

function Carousel({ products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(3)

  // Responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setItemsToShow(1)
      } else if (window.innerWidth < 768) {
        setItemsToShow(2)
      } else {
        setItemsToShow(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!products || products.length === 0) {
    return (
      <section className="carousel-section">
        <div className="container">
          <h2>Bestsellers</h2>
          <p className="section-subtitle">No featured products yet</p>
        </div>
      </section>
    )
  }

  const maxIndex = Math.max(0, products.length - itemsToShow)

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1))
  }

  return (
    <section className="carousel-section">
      <div className="container">
        <h2>Bestsellers</h2>
        <p className="section-subtitle">Our best sellers and customer favorites</p>

        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-prev" onClick={handlePrev}>
            <ChevronLeft size={24} />
          </button>

          <div className="carousel-container">
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / itemsToShow)}%))`
              }}
            >
              {products.map(product => (
                <div key={product.id} className="carousel-slide">
                  <Link
                    to={`/products/${product.id}`}
                    className="featured-product-card"
                  >
                    <div className="product-image">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          loading="lazy"
                        />
                      ) : (
                        <div className="placeholder">No Image</div>
                      )}
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p className="category">{product.category}</p>
                      <p className="price">₹{product.price}<span className="price-unit">{product.priceUnit || '/KG'}</span></p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn carousel-next" onClick={handleNext}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-indicators">
          {Array.from({ length: Math.ceil(products.length / itemsToShow) }).map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx * itemsToShow > maxIndex ? maxIndex : idx * itemsToShow)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Carousel
