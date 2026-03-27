import express from 'express'
import { saveContactMessage, getContactMessages, markAsRead, deleteContactMessage } from '../controllers/contactController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Public route - save contact message
router.post('/', saveContactMessage)

// Admin routes - get, update, delete messages (require auth)
router.get('/', authMiddleware, getContactMessages)
router.patch('/:messageId/read', authMiddleware, markAsRead)
router.delete('/:messageId', authMiddleware, deleteContactMessage)

export default router
