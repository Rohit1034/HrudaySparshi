import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/admin.css'

function AdminNav() {
  return (
    <nav className="admin-nav">
      <div className="admin-logo">
        <h3>Admin Panel</h3>
      </div>
      <ul className="admin-menu">
        <li>
          <Link to="/admin/dashboard" className="admin-menu-item">
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="admin-menu-item">
            📦 Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="admin-menu-item">
            🍲 Products
          </Link>
        </li>
        <li>
          <Link to="/admin/messages" className="admin-menu-item">
            💬 Messages
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="admin-menu-item">
            ⚙️ Settings
          </Link>
        </li>
        <li>
          <Link to="/" className="admin-menu-item">
            ← Back to Store
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default AdminNav
