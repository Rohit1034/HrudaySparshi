import React, { useState } from 'react'
import '../styles/contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Implementation for contact form submission
    alert('Thank you for reaching out! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <p className="subtitle">We'd love to hear from you. Get in touch with us!</p>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <h3>📍 Address</h3>
              <p>AL-5/2/9, सुयोग सोसायटी, सेक्टर 5</p>
              <p>ऐरोली, नवी मुुंबई - 400708</p>
            </div>

            <div className="info-card">
              <h3>📞 Phone</h3>
              <p>+91 9082774647 / 8369427793</p>
              <p>Available during business hours</p>
            </div>

            <div className="info-card">
              <h3>💬 WhatsApp</h3>
              <p>+91 9082774647 / 8369427793</p>
              <p>Quick responses via WhatsApp</p>
            </div>

            <div className="info-card">
              <h3>✉️ Email</h3>
              <p>rohit.patil1034@gmail.com</p>
              <p>We'll respond within 24 hours</p>
            </div>

            <div className="info-card">
              <h3>🕐 Hours</h3>
              <p>Monday - Sunday</p>
              <p>8:00 AM - 9:00 PM</p>
            </div>
          </div>

          <div className="contact-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
