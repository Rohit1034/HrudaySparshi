import { db } from '../config/firebase.js'

export const getHomepageContent = async (req, res) => {
  try {
    const contentDoc = await db.collection('homepageContent').doc('main').get()

    if (!contentDoc.exists) {
      // Return default content
      return res.json({
        businessName: 'Hruday Sparshi',
        tagline: 'Authentic Homemade Food & Snacks',
        heroTitle: 'Welcome to Hruday Sparshi',
        heroSubtitle: 'Fresh homemade meals delivered to your door',
        aboutText: '',
        contactEmail: 'contact@example.com',
        contactPhone: '+91 XXXXX XXXXX',
        contactAddress: 'Your Address Here'
      })
    }

    res.json(contentDoc.data())
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

    res.json({
      message: 'Homepage content updated successfully',
      ...content
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
