import React, { useState, useEffect } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../services/apiService'
import AdminNav from '../../components/AdminNav'
import ProductForm from '../../components/ProductForm'
import '../../styles/admin.css'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }
      loadProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        loadProducts()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Manage Products</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingProduct(null)
              setShowForm(!showForm)
            }}
          >
            {showForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        )}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-data">No products yet</div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <div>Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {products.map(product => (
              <div key={product.id} className="table-row">
                <div>{product.name}</div>
                <div>{product.category}</div>
                <div>₹{product.price}</div>
                <div>
                  {product.availability !== false ? (
                    <span className="badge badge-success">Available</span>
                  ) : (
                    <span className="badge badge-danger">Out of Stock</span>
                  )}
                </div>
                <div className="actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
