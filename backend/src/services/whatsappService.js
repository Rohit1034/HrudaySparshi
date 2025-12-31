import axios from 'axios'

/**
 * Send WhatsApp message using WhatsApp Business Cloud API
 * Requires: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_API_URL
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.warn('WhatsApp configuration not set. Skipping WhatsApp notification.')
      return { success: false, message: 'WhatsApp not configured' }
    }

    const url = `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber.replace(/\D/g, ''),
        type: 'text',
        text: {
          preview_url: true,
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return { success: true, messageId: response.data.messages[0].id }
  } catch (error) {
    console.error('WhatsApp API error:', error.response?.data || error.message)
    return { success: false, error: error.message }
  }
}

export const sendOrderConfirmationWhatsApp = async (phoneNumber, customerName, orderId) => {
  const message = `🎉 Order Confirmed!\n\nHi ${customerName},\n\nThank you for ordering from Hruday Sparshi! Your order #${orderId} has been received.\n\nWe'll notify you soon with delivery details.\n\n🏠 Homemade Quality | Free Delivery\n\nThank you!`

  return sendWhatsAppMessage(phoneNumber, message)
}

export const sendOrderStatusWhatsApp = async (phoneNumber, customerName, orderId, status) => {
  const statusMessages = {
    'PENDING': 'Your order has been confirmed and is being prepared! 📦',
    'COMPLETED': 'Your order has been delivered! 🎉 We hope you enjoyed it!'
  }

  const message = `📢 Order Update\n\nHi ${customerName},\n\n${statusMessages[status] || 'Your order status has been updated.'}\n\nOrder ID: #${orderId}\nStatus: ${status}\nTime: ${new Date().toLocaleString()}\n\nThank you for choosing Hruday Sparshi!`

  return sendWhatsAppMessage(phoneNumber, message)
}

export const sendAdminNotificationWhatsApp = async (orderId, customerName, customerPhone, totalAmount) => {
  const message = `📩 New Order Alert!\n\nNew order received:\nOrder ID: #${orderId}\nCustomer: ${customerName}\nPhone: ${customerPhone}\nAmount: ₹${totalAmount.toFixed(2)}\n\nPlease check your admin panel for details.`

  return sendWhatsAppMessage(process.env.ADMIN_PHONE, message)
}
