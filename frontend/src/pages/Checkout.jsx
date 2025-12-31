import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../services/apiService'
import '../styles/checkout.css'

function Checkout() {
  const { cart, getTotal, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const orderData = {
        userId: currentUser.uid,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal(),
        status: 'REQUESTED',
        paymentMode: 'OFFLINE',
        createdAt: new Date().toISOString()
      }

      const response = await createOrder(orderData)
      clearCart()
      navigate(`/orders/${response.orderId}`, {
        state: { orderPlaced: true }
      })
    } catch (err) {
      setError(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="container">
        <div className="error">Please log in to place an order</div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="error">Your cart is empty</div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-section">
            <h2>Order Review</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="checkout-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total Amount:</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Delivery Information</h2>
            <div className="info-display">
              <p><strong>Name:</strong> Will be fetched from user profile</p>
              <p><strong>Phone:</strong> Will be fetched from user profile</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Delivery Address:</strong> Will be fetched from user profile</p>
            </div>
            <p className="note">
              Note: Payment will be collected during delivery
            </p>
          </div>

          <div className="checkout-section">
            <h2>Confirm Order</h2>
            {error && <div className="error">{error}</div>}
            <button
              className="btn btn-primary btn-lg"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
