import { createContext, useState, useContext, useEffect, useRef } from 'react'
import { db } from '../config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  const syncIntervalRef = useRef(null)
  const cartRef = useRef(cart) // Keep track of latest cart

  // Update cartRef whenever cart changes
  useEffect(() => {
    cartRef.current = cart
  }, [cart])

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (currentUser) {
      loadCartFromFirestore()
      // Start 30-second sync interval
      startPeriodicSync()
    } else {
      setCart([])
      setLoading(false)
      // Stop sync when user logs out
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [currentUser])

  const loadCartFromFirestore = async () => {
    try {
      const cartRef = doc(db, 'carts', currentUser.uid)
      const cartSnap = await getDoc(cartRef)
      
      if (cartSnap.exists()) {
        setCart(cartSnap.data().items || [])
      } else {
        setCart([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCart([])
    } finally {
      setLoading(false)
    }
  }

  // Save cart to Firestore
  const saveCartToFirestore = async (updatedCart) => {
    if (!currentUser) return
    
    try {
      const cartRef = doc(db, 'carts', currentUser.uid)
      await setDoc(cartRef, {
        items: updatedCart,
        updatedAt: new Date(),
        userId: currentUser.uid
      })
      console.log('✅ Cart saved to Firestore')
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  // Sync cart every 30 seconds
  const startPeriodicSync = () => {
    syncIntervalRef.current = setInterval(() => {
      if (currentUser && cartRef.current.length > 0) {
        console.log('🔄 Syncing cart (30s interval)...', cartRef.current.length, 'items')
        saveCartToFirestore(cartRef.current)
      }
    }, 30000) // 30 seconds
  }

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      let newCart
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }]
      }
      
      // Immediate save to Firestore
      if (currentUser) {
        saveCartToFirestore(newCart)
      }
      
      return newCart
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId)
      
      // Immediate save to Firestore
      if (currentUser) {
        saveCartToFirestore(newCart)
      }
      
      return newCart
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
      
      // Immediate save to Firestore
      if (currentUser) {
        saveCartToFirestore(newCart)
      }
      
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    
    // Immediate clear in Firestore
    if (currentUser) {
      saveCartToFirestore([])
      console.log('🗑️ Cart cleared')
    }
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    loading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
