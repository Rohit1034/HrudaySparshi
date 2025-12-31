import React, { useState, useEffect } from 'react'
import { getDashboardStats } from '../../services/apiService'
import AdminNav from '../../components/AdminNav'
import '../../styles/admin.css'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Admin Dashboard</h1>
          <button 
            onClick={loadStats}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#d4845c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders || 0}</p>
            </div>
            <div className="stat-card">
              <h3>New Orders</h3>
              <p className="stat-number">{stats.requestedOrders || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <p className="stat-number">{stats.pendingOrders || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Orders</h3>
              <p className="stat-number">{stats.completedOrders || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">₹{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-number">{stats.totalProducts || 0}</p>
            </div>
          </div>
        ) : (
          <div className="error">Failed to load dashboard stats</div>
        )}

        <div className="welcome-section">
          <h2>Welcome to Admin Dashboard</h2>
          <p>Use the navigation menu to manage orders, products, and homepage content.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
