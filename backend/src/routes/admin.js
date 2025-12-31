import express from 'express'
import * as adminController from '../controllers/adminController.js'
import * as orderController from '../controllers/orderController.js'
import * as productController from '../controllers/productController.js'
import * as homepageController from '../controllers/homepageController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware)

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats)

// Orders
router.get('/orders/requested', orderController.getRequestedOrders)
router.get('/orders/pending', orderController.getPendingOrders)
router.get('/orders/completed', orderController.getCompletedOrders)
router.patch('/orders/:orderId/status', orderController.updateOrderStatus)

// Products
router.post('/products', productController.createProduct)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct)

// Homepage
router.put('/homepage', homepageController.updateHomepageContent)

export default router
