import { db } from '../config/firebase.js'
import { createCache } from '../utils/cache.js'

const HOMEPAGE_CACHE_KEY = 'homepage_main'
const homepageCache = createCache(10 * 60 * 1000) // 10 minutes

const DEFAULT_CONTENT = {
  businessName: 'Hruday Sparshi',
  tagline: 'Authentic Homemade Food & Snacks',
  heroTitle: 'Welcome to Hruday Sparshi',
  heroSubtitle: 'Fresh homemade meals delivered to your door',
  aboutText: '',
  contactEmail: 'contact@example.com',
  contactPhone: '+91 XXXXX XXXXX',
  contactAddress: 'Your Address Here'
}

export const getHomepageContent = async (req, res) => {
  try {
    const cached = homepageCache.get(HOMEPAGE_CACHE_KEY)
    if (cached) {
      return res.json(cached)
    }

    const contentDoc = await db.collection('homepageContent').doc('main').get()

    if (!contentDoc.exists) {
      homepageCache.set(HOMEPAGE_CACHE_KEY, DEFAULT_CONTENT)
      return res.json(DEFAULT_CONTENT)
    }

    const content = contentDoc.data()
    homepageCache.set(HOMEPAGE_CACHE_KEY, content)
    res.json(content)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateHomepageContent = async (req, res) => {
  try {
    const {
      businessName,
      tagline,
      heroTitle,
      heroSubtitle,
      aboutText,
      contactEmail,
      contactPhone,
      contactAddress
    } = req.body

    const content = {
      businessName: businessName || 'Hruday Sparshi',
      tagline: tagline || 'Authentic Homemade Food & Snacks',
      heroTitle: heroTitle || 'Welcome to Hruday Sparshi',
      heroSubtitle: heroSubtitle || 'Fresh homemade meals delivered to your door',
      aboutText: aboutText || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      contactAddress: contactAddress || '',
      updatedAt: new Date().toISOString()
    }

    await db.collection('homepageContent').doc('main').set(content, { merge: true })

    // Invalidate cache so next GET fetches fresh data
    homepageCache.del(HOMEPAGE_CACHE_KEY)

    res.json({
      message: 'Homepage content updated successfully',
      ...content
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
