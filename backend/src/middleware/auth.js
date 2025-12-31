import { auth, db } from '../config/firebase.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decodedToken = await auth.verifyIdToken(token)
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    }

    // Get user role from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (userDoc.exists) {
      req.user.role = userDoc.data().role || 'customer'
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
}

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
