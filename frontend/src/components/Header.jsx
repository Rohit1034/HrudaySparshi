"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { ShoppingCart, LogOut, LogIn, Menu } from "lucide-react"
import logo from "../assets/hrudaySparshiLogo.png"
import "../styles/header.css"

function Header() {
  const { currentUser, logout, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isAdminUser, setIsAdminUser] = React.useState(false)
  const headerRef = React.useRef(null)

  React.useEffect(() => {
    if (currentUser) {
      isAdmin(currentUser.uid).then(setIsAdminUser)
    }
  }, [currentUser, isAdmin])

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [menuOpen])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate("/")
  }

  const handleNavClick = () => {
    setMenuOpen(false)
  }

  return (
    <header className="header" ref={headerRef}>
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src={logo || "/placeholder.svg"} alt="Hruday Sparshi" className="logo-image" />
          <span className="logo-text">हृदयस्पर्शी</span>
        </Link>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={handleNavClick}>
            Home
          </Link>
          <Link to="/products" className="nav-link" onClick={handleNavClick}>
            Products
          </Link>
          <Link to="/about" className="nav-link" onClick={handleNavClick}>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={handleNavClick}>
            Contact
          </Link>

          <div className="nav-mobile-auth">
            {currentUser && isAdminUser && (
              <Link to="/admin/dashboard" className="nav-link admin-link-mobile" onClick={handleNavClick}>
                Admin Panel
              </Link>
            )}

            {currentUser ? (
              <>
                <div className="nav-user-info">
                  <span className="nav-user-name">
                    {currentUser.displayName || currentUser.email?.split("@")[0] || "User"}
                  </span>
                </div>
                <button className="btn btn-small nav-logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="nav-auth-links">
                <Link to="/login" className="btn btn-small" onClick={handleNavClick}>
                  <LogIn size={18} />
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-small" onClick={handleNavClick}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="header-actions">
          {currentUser && isAdminUser && (
            <Link to="/admin/dashboard" className="nav-link admin-link desktop-only">
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
            <div className="user-menu desktop-only">
              <span className="user-name">{currentUser.displayName || currentUser.email?.split("@")[0] || "User"}</span>
              <button className="btn btn-small" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <div className="auth-links desktop-only">
                <Link to="/login" className="btn btn-small">
                  <LogIn size={18} />
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-small">
                  Sign Up
                </Link>
              </div>
              <Link to="/login" className="mobile-login-btn">
                Login
              </Link>
            </>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
