import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderById } from '../services/apiService'
import '../styles/order-detail.css'

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(id)
        setOrder(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id])

  const getStatusColor = (status) => {
    const colors = {
      'REQUESTED': '#ff9800',
      'PENDING': '#2196f3',
      'COMPLETED': '#4caf50'
    }
    return colors[status] || '#999'
  }

  if (loading) return <div className="loading">Loading order...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!order) return <div className="error">Order not found</div>

  return (
    <div className="order-detail-page">
      <div className="container">
        <h1>Order Details</h1>

        <div className="order-detail-grid">
          <div className="detail-section">
            <h2>Order Information</h2>
            <div className="info-row">
              <span>Order ID:</span>
              <span className="value">{order.id}</span>
            </div>
            <div className="info-row">
              <span>Date:</span>
              <span className="value">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span>Status:</span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>
            <div className="info-row">
              <span>Payment Mode:</span>
              <span className="value">Cash on Delivery</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Delivery Address</h2>
            <p>Delivery address will be displayed here</p>
          </div>

          <div className="detail-section full-width">
            <h2>Ordered Items</h2>
            <div className="items-table">
              <div className="table-header">
                <div>Product</div>
                <div>Quantity</div>
                <div>Price</div>
                <div>Subtotal</div>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="table-row">
                  <div>{item.name}</div>
                  <div>{item.quantity}</div>
                  <div>₹{item.price}</div>
                  <div>₹{(item.quantity * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section full-width">
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery:</span>
                <span className="free">Free</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {order.status === 'REQUESTED' && (
          <div className="status-note">
            <p>Your order has been received. We'll confirm it shortly and notify you via email and WhatsApp.</p>
          </div>
        )}
        {order.status === 'PENDING' && (
          <div className="status-note">
            <p>Your order has been confirmed and will be delivered soon. Watch for updates!</p>
          </div>
        )}
        {order.status === 'COMPLETED' && (
          <div className="status-note success">
            <p>Thank you! Your order has been delivered. We hope you enjoyed our products!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
