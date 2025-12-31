import api from './api'

// Products API
export const getProducts = async (category = null) => {
  const params = category ? { category } : {}
  const response = await api.get('/products', { params })
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

// Orders API
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

export const getUserOrders = async () => {
  const response = await api.get('/orders/user/my-orders')
  return response.data
}

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

// Admin Orders API
export const getRequestedOrders = async () => {
  const response = await api.get('/admin/orders/requested')
  return response.data
}

export const getPendingOrders = async () => {
  const response = await api.get('/admin/orders/pending')
  return response.data
}

export const getCompletedOrders = async () => {
  const response = await api.get('/admin/orders/completed')
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status })
  return response.data
}

// Homepage Content API
export const getHomepageContent = async () => {
  const response = await api.get('/homepage')
  return response.data
}

export const updateHomepageContent = async (content) => {
  const response = await api.put('/admin/homepage', content)
  return response.data
}

// Admin Products API
export const createProduct = async (productData) => {
  const response = await api.post('/admin/products', productData)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/admin/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`)
  return response.data
}

// Admin Dashboard API
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats')
  return response.data
}
