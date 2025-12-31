import express from 'express'
import * as orderController from '../controllers/orderController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Protected routes - require authentication
router.post('/', authMiddleware, orderController.createOrder)
router.get('/user/my-orders', authMiddleware, orderController.getUserOrders)
router.get('/:orderId', authMiddleware, orderController.getOrder)

// Admin routes
router.get('/admin/requested', authMiddleware, adminMiddleware, orderController.getRequestedOrders)
router.get('/admin/pending', authMiddleware, adminMiddleware, orderController.getPendingOrders)
router.get('/admin/completed', authMiddleware, adminMiddleware, orderController.getCompletedOrders)
router.patch('/:orderId/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus)

export default router
