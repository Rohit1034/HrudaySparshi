import React from 'react'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart } from 'lucide-react'
import '../styles/cart.css'

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <ShoppingCart size={64} />
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious items to get started!</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-grid">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price} each</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <input type="number" value={item.quantity} readOnly />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-subtotal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <p className="payment-note">Payment will be collected during delivery</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
