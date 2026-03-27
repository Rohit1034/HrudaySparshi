import { db } from '../config/firebase.js'

// Save contact message to Firestore
export const saveContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Save to Firestore
    const docRef = await db.collection('contactMessages').add({
      name,
      email,
      phone,
      subject,
      message,
      read: false,
      createdAt: new Date()
    })

    res.status(201).json({
      success: true,
      message: 'Message received! We will get back to you soon.',
      docId: docRef.id
    })
  } catch (error) {
    console.error('Error saving contact message:', error)
    res.status(500).json({ error: 'Failed to save message. Please try again.' })
  }
}

// Get all contact messages (admin only)
export const getContactMessages = async (req, res) => {
  try {
    const messagesSnapshot = await db.collection('contactMessages')
      .orderBy('createdAt', 'desc')
      .get()

    const messages = []
    messagesSnapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        ...data,
        timestamp: data.createdAt?.toDate?.() || data.createdAt
      })
    })

    res.status(200).json({ messages })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params

    if (!messageId) {
      return res.status(400).json({ error: 'Message ID required' })
    }

    await db.collection('contactMessages').doc(messageId).update({ read: true })

    res.status(200).json({ success: true, message: 'Message marked as read' })
  } catch (error) {
    console.error('Error marking message as read:', error)
    res.status(500).json({ error: 'Failed to update message' })
  }
}

// Delete contact message
export const deleteContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params

    if (!messageId) {
      return res.status(400).json({ error: 'Message ID required' })
    }

    await db.collection('contactMessages').doc(messageId).delete()

    res.status(200).json({ success: true, message: 'Message deleted' })
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ error: 'Failed to delete message' })
  }
}
