import { db } from '../config/firebase.js'
import { v4 as uuidv4 } from 'uuid'

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query
    let query = db.collection('products')

    if (category) {
      query = query.where('category', '==', category)
    }

    const productsSnapshot = await query.get()
    const products = []

    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() })
    })

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
    const { name, category, price, description, image, availability } = req.body

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const productId = uuidv4()
    const product = {
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      image: image || '',
      availability: availability !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await db.collection('products').doc(productId).set(product)

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
    const { name, category, price, description, image, availability } = req.body

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

    updateData.updatedAt = new Date().toISOString()

    await db.collection('products').doc(productId).update(updateData)

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

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
