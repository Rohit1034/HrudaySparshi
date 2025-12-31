import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { ShoppingCart, LogOut, LogIn, Menu } from 'lucide-react'
import logo from '../assets/hrudaySparshiLogo.png'
import '../styles/header.css'

function Header() {
  const { currentUser, logout, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isAdminUser, setIsAdminUser] = React.useState(false)

  React.useEffect(() => {
    if (currentUser) {
      isAdmin(currentUser.uid).then(setIsAdminUser)
    }
  }, [currentUser, isAdmin])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

return (
    <header className="header">
        <div className="container header-content">
            <Link to="/" className="logo">
                <img src={logo} alt="Hruday Sparshi" className="logo-image" />
                <span className="logo-text">हृदयस्पर्शी</span>
            </Link>

            <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
            </nav>

            <div className="header-actions">
                {currentUser && isAdminUser && (
                    <Link to="/admin/dashboard" className="nav-link admin-link">
                        Admin Panel
                    </Link>
                )}

                {currentUser && !isAdminUser && (
                    <Link to="/cart" className="cart-link">
                        <ShoppingCart size={24} />
                        {getItemCount() > 0 && <span className="cart-count">{getItemCount()}</span>}
                    </Link>
                )}

                {currentUser ? (
                    <div className="user-menu">
                        <span className="user-name">{currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}</span>
                        <button className="btn btn-small" onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="btn btn-small">
                            <LogIn size={18} />
                            Login
                        </Link>
                        <Link to="/signup" className="btn btn-primary btn-small">
                            Sign Up
                        </Link>
                    </div>
                )}

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <Menu size={24} />
                </button>
            </div>
        </div>
    </header>
)
}

export default Header
