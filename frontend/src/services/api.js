import axios from 'axios'
import { auth } from '../config/firebase'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Retry interceptor: retry up to 2 times on network errors or 5xx responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    if (!config) return Promise.reject(error)

    config._retryCount = config._retryCount || 0
    const isNetworkError = !error.response
    const isServerError = error.response && error.response.status >= 500
    const maxRetries = 2

    if ((isNetworkError || isServerError) && config._retryCount < maxRetries) {
      config._retryCount += 1
      const delay = config._retryCount * 1500
      await new Promise((resolve) => setTimeout(resolve, delay))
      return api(config)
    }

    return Promise.reject(error)
  }
)

export default api
