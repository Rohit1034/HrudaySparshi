import { db, auth } from '../config/firebase'
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore'

// Products API - Direct Firestore
export const getProducts = async (category = null) => {
  const productsRef = collection(db, 'products')
  const q = category
    ? query(productsRef, where('category', '==', category))
    : productsRef
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getProductById = async (id) => {
  const snapshot = await getDoc(doc(db, 'products', id))
  if (!snapshot.exists()) throw new Error('Product not found')
  return { id: snapshot.id, ...snapshot.data() }
}

// Orders API - Direct Firestore
export const createOrder = async (orderData) => {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  // Fetch user profile from Firestore
  const userSnapshot = await getDoc(doc(db, 'users', user.uid))
  const userData = userSnapshot.exists() ? userSnapshot.data() : {}

  const order = {
    userId: user.uid,
    customerName: userData.fullName || user.displayName || '',
    customerEmail: user.email,
    customerPhone: userData.phoneNumber || '',
    deliveryAddress: userData.address || '',
    items: orderData.items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: parseFloat(orderData.totalAmount),
    status: 'REQUESTED',
    paymentMode: 'OFFLINE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const docRef = await addDoc(collection(db, 'orders'), order)
  return { orderId: docRef.id, message: 'Order created successfully' }
}

export const getUserOrders = async () => {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  const q = query(
    collection(db, 'orders'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getOrderById = async (id) => {
  const snapshot = await getDoc(doc(db, 'orders', id))
  if (!snapshot.exists()) throw new Error('Order not found')
  return { id: snapshot.id, ...snapshot.data() }
}

// Admin Orders API - Direct Firestore
export const getRequestedOrders = async () => {
  const q = query(collection(db, 'orders'), where('status', '==', 'REQUESTED'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getPendingOrders = async () => {
  const q = query(collection(db, 'orders'), where('status', '==', 'PENDING'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getCompletedOrders = async () => {
  const q = query(collection(db, 'orders'), where('status', '==', 'COMPLETED'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const updateOrderStatus = async (orderId, status) => {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: new Date().toISOString()
  })
  return { orderId, status, message: `Order status updated to ${status}` }
}

// Homepage Content API - Direct Firestore
export const getHomepageContent = async () => {
  const snapshot = await getDoc(doc(db, 'homepageContent', 'main'))
  if (!snapshot.exists()) {
    return {
      businessName: 'Hruday Sparshi',
      tagline: 'Authentic Homemade Food & Snacks',
      heroTitle: 'Welcome to Hruday Sparshi',
      heroSubtitle: 'Fresh homemade meals delivered to your door',
      aboutText: '',
      contactEmail: 'contact@example.com',
      contactPhone: '+91 XXXXX XXXXX',
      contactAddress: 'Your Address Here'
    }
  }
  return snapshot.data()
}

export const updateHomepageContent = async (content) => {
  const updatedContent = { ...content, updatedAt: new Date().toISOString() }
  await setDoc(doc(db, 'homepageContent', 'main'), updatedContent, { merge: true })
  return { message: 'Homepage content updated successfully', ...updatedContent }
}

// Admin Products API - Direct Firestore
export const createProduct = async (productData) => {
  const { name, category, price, description, image, availability, isFeatured, priceUnit } = productData

  if (!name || !category || !price) throw new Error('Missing required fields: name, category, price')

  const product = {
    name,
    category,
    price: parseFloat(price),
    priceUnit: priceUnit || '/KG',
    description: description || '',
    image: image || '',
    availability: availability !== false,
    isFeatured: isFeatured || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const docRef = await addDoc(collection(db, 'products'), product)
  return { id: docRef.id, ...product }
}

export const updateProduct = async (id, productData) => {
  const updateData = { ...productData, updatedAt: new Date().toISOString() }
  await updateDoc(doc(db, 'products', id), updateData)
  return { id, ...updateData }
}

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id))
  return { message: 'Product deleted successfully' }
}

// Admin Dashboard API - Direct Firestore
export const getDashboardStats = async () => {
  const [ordersSnapshot, productsSnapshot] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'products'))
  ])

  const orders = ordersSnapshot.docs.map(d => d.data())

  return {
    totalOrders: orders.length,
    requestedOrders: orders.filter(o => o.status === 'REQUESTED').length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    totalProducts: productsSnapshot.size
  }
}
