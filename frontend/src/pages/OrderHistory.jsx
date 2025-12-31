import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserOrders } from '../services/apiService'
import { Link } from 'react-router-dom'
import '../styles/order-history.css'

function OrderHistory() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const data = await getUserOrders()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      loadOrders()
    }
  }, [currentUser])

  const getStatusColor = (status) => {
    const colors = {
      'REQUESTED': '#ff9800',
      'PENDING': '#2196f3',
      'COMPLETED': '#4caf50'
    }
    return colors[status] || '#999'
  }

  if (loading) return <div className="loading">Loading orders...</div>

  return (
    <div className="order-history-page">
      <div className="container">
        <h1>My Orders</h1>

        {error ? (
          <div className="error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <div>Order ID</div>
              <div>Date</div>
              <div>Items</div>
              <div>Total</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {orders.map(order => (
              <div key={order.id} className="table-row">
                <div>{order.id.substring(0, 8)}</div>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                <div>{order.items.length} items</div>
                <div>₹{order.totalAmount.toFixed(2)}</div>
                <div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <Link to={`/orders/${order.id}`} className="link">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
