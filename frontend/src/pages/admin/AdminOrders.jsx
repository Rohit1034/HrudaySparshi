import React, { useState, useEffect } from 'react'
import {
  getRequestedOrders,
  getPendingOrders,
  getCompletedOrders,
  updateOrderStatus
} from '../../services/apiService'
import AdminNav from '../../components/AdminNav'
import '../../styles/admin.css'

function AdminOrders() {
  const [tab, setTab] = useState('requested')
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAllOrders()
  }, [])

  const loadAllOrders = async () => {
    try {
      setLoading(true)
      const [requested, pending, completed] = await Promise.all([
        getRequestedOrders(),
        getPendingOrders(),
        getCompletedOrders()
      ])
      setAllOrders([...requested, ...pending, ...completed])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get orders for current tab
  const displayOrders = allOrders.filter(o => {
    if (tab === 'requested') return o.status === 'REQUESTED'
    if (tab === 'pending') return o.status === 'PENDING'
    if (tab === 'completed') return o.status === 'COMPLETED'
    return false
  })

  // Get counts for all tabs (always accurate regardless of current tab)
  const counts = {
    requested: allOrders.filter(o => o.status === 'REQUESTED').length,
    pending: allOrders.filter(o => o.status === 'PENDING').length,
    completed: allOrders.filter(o => o.status === 'COMPLETED').length
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      loadAllOrders()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <h1>Manage Orders</h1>

        <div className="admin-tabs">
          <button
            className={`tab ${tab === 'requested' ? 'active' : ''}`}
            onClick={() => setTab('requested')}
          >
            Requested ({counts.requested})
          </button>
          <button
            className={`tab ${tab === 'pending' ? 'active' : ''}`}
            onClick={() => setTab('pending')}
          >
            Pending ({counts.pending})
          </button>
          <button
            className={`tab ${tab === 'completed' ? 'active' : ''}`}
            onClick={() => setTab('completed')}
          >
            Completed ({counts.completed})
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : displayOrders.length === 0 ? (
          <div className="no-data">No orders in this category</div>
        ) : (
          <div className="orders-list">
            {displayOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id.substring(0, 8)}</h3>
                  <span className="date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="order-body">
                  <div className="customer-info">
                    <h4>Customer</h4>
                    <p><strong>Name:</strong> {order.customerName}</p>
                    <p><strong>Phone:</strong> {order.customerPhone}</p>
                    <p><strong>Email:</strong> {order.customerEmail}</p>
                    <p><strong>Address:</strong> {order.deliveryAddress}</p>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="order-actions">
                  {order.status === 'REQUESTED' && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusChange(order.id, 'PENDING')}
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'PENDING' && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="completed-badge">✓ Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
