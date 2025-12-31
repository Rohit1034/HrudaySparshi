import express from 'express'
import * as homepageController from '../controllers/homepageController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Public route
router.get('/', homepageController.getHomepageContent)

// Admin route
router.put('/', authMiddleware, adminMiddleware, homepageController.updateHomepageContent)

export default router
