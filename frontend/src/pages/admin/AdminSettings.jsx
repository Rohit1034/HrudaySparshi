import React, { useState, useEffect } from 'react'
import { getHomepageContent, updateHomepageContent } from '../../services/apiService'
import AdminNav from '../../components/AdminNav'
import '../../styles/admin.css'

function AdminSettings() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      const data = await getHomepageContent()
      setContent(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setContent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateHomepageContent(content)
      alert('Homepage content updated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <h1>Homepage Settings</h1>

        {error && <div className="error">{error}</div>}

        {content && (
          <div className="settings-form">
            <div className="form-section">
              <h2>Homepage Content</h2>

              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  id="businessName"
                  type="text"
                  name="businessName"
                  value={content.businessName || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tagline">Business Tagline</label>
                <input
                  id="tagline"
                  type="text"
                  name="tagline"
                  value={content.tagline || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="heroTitle">Hero Title</label>
                <input
                  id="heroTitle"
                  type="text"
                  name="heroTitle"
                  value={content.heroTitle || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="heroSubtitle">Hero Subtitle</label>
                <textarea
                  id="heroSubtitle"
                  name="heroSubtitle"
                  value={content.heroSubtitle || ''}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="aboutText">About Us Text</label>
                <textarea
                  id="aboutText"
                  name="aboutText"
                  value={content.aboutText || ''}
                  onChange={handleChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  name="contactEmail"
                  value={content.contactEmail || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Contact Phone</label>
                <input
                  id="contactPhone"
                  type="tel"
                  name="contactPhone"
                  value={content.contactPhone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactAddress">Contact Address</label>
                <textarea
                  id="contactAddress"
                  name="contactAddress"
                  value={content.contactAddress || ''}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSettings
