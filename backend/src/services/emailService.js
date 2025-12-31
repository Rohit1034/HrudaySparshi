import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export const sendOrderConfirmationEmail = async (userEmail, userName, orderId, orderItems, totalAmount) => {
  try {
    const itemsList = orderItems.map(item => `<li>${item.name} × ${item.quantity} = ₹${(item.quantity * item.price).toFixed(2)}</li>`).join('')

    const htmlContent = `
      <h2>Order Confirmation</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for your order! Your order has been received and we'll confirm it shortly.</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Items Ordered:</h3>
      <ul>${itemsList}</ul>
      
      <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
      <p><strong>Payment Mode:</strong> Cash on Delivery</p>
      
      <p>We will deliver your order soon. You'll receive a notification when we accept and confirm your order.</p>
      
      <p>Thank you for choosing Hruday Sparshi!</p>
      <p>Best regards,<br>Hruday Sparshi Team</p>
    `

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: userEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: htmlContent
    })

    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

export const sendOrderStatusUpdateEmail = async (userEmail, userName, orderId, status) => {
  try {
    const statusMessages = {
      'PENDING': 'Your order has been confirmed and is being prepared for delivery.',
      'COMPLETED': 'Your order has been delivered. We hope you enjoyed our products!'
    }

    const htmlContent = `
      <h2>Order Status Update</h2>
      <p>Dear ${userName},</p>
      <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
      
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>New Status:</strong> ${status}</p>
      <p><strong>Updated at:</strong> ${new Date().toLocaleString()}</p>
      
      <p>Thank you for choosing Hruday Sparshi!</p>
      <p>Best regards,<br>Hruday Sparshi Team</p>
    `

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: userEmail,
      subject: `Order Update - ${orderId}`,
      html: htmlContent
    })

    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

export const sendAdminNotificationEmail = async (orderId, customerName, customerPhone, deliveryAddress, items, totalAmount) => {
  try {
    const itemsList = items.map(item => `<li>${item.name} × ${item.quantity} = ₹${(item.quantity * item.price).toFixed(2)}</li>`).join('')

    const htmlContent = `
      <h2>New Order Received</h2>
      
      <h3>Customer Details:</h3>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <p><strong>Address:</strong> ${deliveryAddress}</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Items:</h3>
      <ul>${itemsList}</ul>
      
      <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
      <p><strong>Payment Mode:</strong> Cash on Delivery</p>
      
      <p><a href="http://localhost:3000/admin/orders">View in Admin Panel</a></p>
    `

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order - ${orderId}`,
      html: htmlContent
    })

    return { success: true, message: 'Admin notification sent' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}
