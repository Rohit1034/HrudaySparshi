import express from 'express'
import * as productController from '../controllers/productController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', productController.getProducts)
router.get('/:productId', productController.getProductById)

// Admin routes
router.post('/', authMiddleware, adminMiddleware, productController.createProduct)
router.put('/:productId', authMiddleware, adminMiddleware, productController.updateProduct)
router.delete('/:productId', authMiddleware, adminMiddleware, productController.deleteProduct)

export default router
