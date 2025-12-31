import { db } from '../config/firebase.js'

export const getDashboardStats = async (req, res) => {
  try {
    // Get all orders
    const ordersSnapshot = await db.collection('orders').get()
    const orders = []
    ordersSnapshot.forEach(doc => {
      orders.push(doc.data())
    })

    // Get all products
    const productsSnapshot = await db.collection('products').get()
    const productCount = productsSnapshot.size

    // Calculate stats
    const stats = {
      totalOrders: orders.length,
      requestedOrders: orders.filter(o => o.status === 'REQUESTED').length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      totalProducts: productCount
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
