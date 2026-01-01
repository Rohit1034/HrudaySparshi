import { db, auth } from '../config/firebase.js'
import { sendOrderConfirmationEmail, sendAdminNotificationEmail, sendOrderStatusUpdateEmail } from '../services/emailService.js'
import { sendOrderConfirmationWhatsApp, sendAdminNotificationWhatsApp } from '../services/whatsappService.js'
import { v4 as uuidv4 } from 'uuid'

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body
    const userId = req.user.uid
    const userEmail = req.user.email

    // Get user details from Firestore
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userData = userDoc.data()
    const orderId = uuidv4()

    // Create order in Firestore
    const order = {
      id: orderId,
      userId,
      customerName: userData.fullName,
      customerEmail: userEmail,
      customerPhone: userData.phoneNumber,
      deliveryAddress: userData.address,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: parseFloat(totalAmount),
      status: 'REQUESTED',
      paymentMode: 'OFFLINE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await db.collection('orders').doc(orderId).set(order)

    // Send notifications (non-blocking - fire and forget)
    // Order is already saved, notifications happen in background
    Promise.all([
      sendOrderConfirmationEmail(userEmail, userData.fullName, orderId, items, totalAmount).catch(err => {
        console.error('Email notification failed (non-blocking):', err)
      }),
      sendOrderConfirmationWhatsApp(userData.phoneNumber, userData.fullName, orderId).catch(err => {
        console.error('WhatsApp notification failed (non-blocking):', err)
      }),
      sendAdminNotificationEmail(orderId, userData.fullName, userData.phoneNumber, userData.address, items, totalAmount).catch(err => {
        console.error('Admin email notification failed (non-blocking):', err)
      }),
      sendAdminNotificationWhatsApp(orderId, userData.fullName, userData.phoneNumber, totalAmount).catch(err => {
        console.error('Admin WhatsApp notification failed (non-blocking):', err)
      })
    ]).catch(() => {
      // Silently ignore all notification errors - order is already placed
    })

    res.status(201).json({
      orderId,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const userId = req.user.uid

    const orderDoc = await db.collection('orders').doc(orderId).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = orderDoc.data()

    // Check if user owns this order
    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json({ id: orderId, ...order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.uid

    const ordersSnapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const orders = []
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequestedOrders = async (req, res) => {
  try {
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'REQUESTED')
      .get()

    const orders = []
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPendingOrders = async (req, res) => {
  try {
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'PENDING')
      .get()

    const orders = []
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCompletedOrders = async (req, res) => {
  try {
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'COMPLETED')
      .get()

    const orders = []
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (!['REQUESTED', 'PENDING', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const orderDoc = await db.collection('orders').doc(orderId).get()
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = orderDoc.data()

    // Update status
    await db.collection('orders').doc(orderId).update({
      status,
      updatedAt: new Date().toISOString()
    })

    // Send notification to user about status change
    if (status !== 'REQUESTED') {
      await Promise.all([
        sendOrderStatusUpdateEmail(order.customerEmail, order.customerName, orderId, status)
      ])
    }

    res.json({
      orderId,
      status,
      message: `Order status updated to ${status}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
