import React, { useState } from 'react'
import '../styles/admin.css'

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(product || {
    name: '',
    category: 'meals',
    description: '',
    price: '',
    image: '',
    availability: true
  })
  const [imagePreview, setImagePreview] = useState(product?.image || null)
  const [uploading, setUploading] = useState(false)

  const categories = ['meals', 'snacks', 'sweets', 'laddus', 'festival']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 2MB before compression)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB')
      return
    }

    try {
      setUploading(true)
      // Read and compress image
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          // Compress image using Canvas
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Resize if image is too large (max 1200px width)
          if (width > 1200) {
            height = (height * 1200) / width
            width = 1200
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to WebP or JPEG with compression
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7) // 70% quality
          
          setFormData(prev => ({
            ...prev,
            image: compressedImage
          }))
          setImagePreview(compressedImage)
          setUploading(false)
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    } catch (err) {
      alert('Error uploading image: ' + err.message)
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
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
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price (₹) *</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="availability">
            <input
              id="availability"
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available
          </label>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>

      <div className="form-group full-width">
        <label htmlFor="image">Product Image</label>
        <div className="image-upload-container">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setImagePreview(null)
                  setFormData(prev => ({ ...prev, image: '' }))
                }}
              >
                Remove
              </button>
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="image-input"
          />
          {!imagePreview && (
            <label htmlFor="image" className="image-upload-label">
              {uploading ? 'Uploading...' : 'Click to upload or drag image here'}
            </label>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ProductForm
