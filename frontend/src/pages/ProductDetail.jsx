import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/apiService'
import { useCart } from '../contexts/CartContext'
import '../styles/product-detail.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/products')}>
          ← Back to Products
        </button>

        <div className="detail-grid">
          <div className="detail-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="placeholder">No Image Available</div>
            )}
          </div>

          <div className="detail-content">
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            
            <div className="description">
              <p>{product.description}</p>
            </div>

            {product.ingredients && (
              <div className="ingredients">
                <h3>Ingredients</h3>
                <p>{product.ingredients}</p>
              </div>
            )}

            {product.allergens && (
              <div className="allergens">
                <h3>Allergens</h3>
                <p>{product.allergens}</p>
              </div>
            )}

            <div className="price-section">
              <span className="price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice}</span>
              )}
            </div>

            {product.availability !== false && (
              <div className="cart-section">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                {addedToCart && <div className="success-message">Added to cart!</div>}
              </div>
            )}

            {product.availability === false && (
              <div className="out-of-stock">
                <p>Currently out of stock</p>
              </div>
            )}

            {product.note && (
              <div className="note">
                <p><strong>Note:</strong> {product.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
