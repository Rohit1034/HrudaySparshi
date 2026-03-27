import { db } from '../config/firebase.js'
import { v4 as uuidv4 } from 'uuid'
import { createCache } from '../utils/cache.js'

const PRODUCTS_CACHE_KEY = 'products_all'
const productCache = createCache(5 * 60 * 1000) // 5 minutes

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query

    // Only cache full product list (no category filter)
    if (!category) {
      const cached = productCache.get(PRODUCTS_CACHE_KEY)
      if (cached) {
        return res.json(cached)
      }
    }

    let query = db.collection('products')
    if (category) {
      query = query.where('category', '==', category)
    }

    const productsSnapshot = await query.get()
    const products = []
    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() })
    })

    if (!category) {
      productCache.set(PRODUCTS_CACHE_KEY, products)
    }

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params

    const productDoc = await db.collection('products').doc(productId).get()
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ id: productId, ...productDoc.data() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, image, availability, isFeatured, priceUnit } = req.body

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const productId = uuidv4()
    const product = {
      name,
      category,
      price: parseFloat(price),
      priceUnit: priceUnit || '/KG',
      description: description || '',
      image: image || '',
      availability: availability !== false,
      isFeatured: isFeatured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await db.collection('products').doc(productId).set(product)
    productCache.del(PRODUCTS_CACHE_KEY)

    res.status(201).json({
      id: productId,
      ...product
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const { name, category, price, description, image, availability, isFeatured, priceUnit } = req.body

    const productDoc = await db.collection('products').doc(productId).get()
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (category) updateData.category = category
    if (price) updateData.price = parseFloat(price)
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (availability !== undefined) updateData.availability = availability
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (priceUnit) updateData.priceUnit = priceUnit

    updateData.updatedAt = new Date().toISOString()

    await db.collection('products').doc(productId).update(updateData)
    productCache.del(PRODUCTS_CACHE_KEY)

    res.json({
      id: productId,
      ...productDoc.data(),
      ...updateData
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const productDoc = await db.collection('products').doc(productId).get()
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' })
    }

    await db.collection('products').doc(productId).delete()
    productCache.del(PRODUCTS_CACHE_KEY)

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
