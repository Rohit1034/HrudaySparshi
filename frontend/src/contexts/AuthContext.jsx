import { createContext, useState, useContext, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const signUp = async (email, password, fullName, phoneNumber, address) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Set displayName in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: fullName
      })
      
      // Store user info in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        fullName,
        phoneNumber,
        address,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      return userCredential.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Fetch and update displayName from Firestore if not set
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      if (userDoc.exists() && userDoc.data().fullName && !userCredential.user.displayName) {
        await updateProfile(userCredential.user, {
          displayName: userDoc.data().fullName
        })
      }
      
      return userCredential.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Check if user is admin
  const isAdmin = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      return userDoc.data()?.role === 'admin'
    } catch {
      return false
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
    error,
    signUp,
    login,
    logout,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
