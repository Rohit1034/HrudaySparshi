// Load environment variables FIRST
import './config/env.js'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import homepageRoutes from './routes/homepage.js'
import adminRoutes from './routes/admin.js'

const app = express()
// Use PORT environment variable (Azure sets PORT=8080), fallback to 3000 for local dev
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
// Increase payload size limit for image uploads
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/homepage', homepageRoutes)
app.use('/admin', adminRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🍲 Hruday Sparshi Backend Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
