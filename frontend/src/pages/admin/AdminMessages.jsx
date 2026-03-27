import React, { useState, useEffect } from 'react'
import AdminNav from '../../components/AdminNav'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../config/firebase'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore'
import '../../styles/admin.css'

function AdminMessages() {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const loadMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const msgs = snapshot.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          timestamp: data.createdAt?.toDate?.() || data.createdAt
        }
      })
      setMessages(msgs)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadMessages()
    }
  }, [currentUser])

  const handleMarkAsRead = async (messageId) => {
    try {
      await updateDoc(doc(db, 'contactMessages', messageId), { read: true })
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      ))
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'contactMessages', messageId))
        setMessages(messages.filter(msg => msg.id !== messageId))
      } catch (err) {
        console.error('Error deleting message:', err)
      }
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Customer Messages</h1>
          <button 
            onClick={loadMessages}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#d4845c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="error" style={{ padding: '15px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No customer messages yet.
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message-card ${msg.read ? 'read' : 'unread'}`}
                style={{
                  backgroundColor: msg.read ? '#f9f9f9' : '#fff9e6',
                  border: msg.read ? '1px solid #ddd' : '2px solid #ffc107',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }} onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h3 style={{ margin: '0', color: '#2d5016' }}>
                        {msg.name}
                      </h3>
                      {!msg.read && <span style={{ backgroundColor: '#ffc107', color: '#333', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>NEW</span>}
                    </div>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      <strong>Subject:</strong> {msg.subject}
                    </p>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      <strong>From:</strong> {msg.email} | {msg.phone}
                    </p>
                    <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
                      {formatDate(msg.timestamp)}
                    </p>
                    
                    {expandedId === msg.id && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                        <p style={{ margin: '0', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555' }}>
                          {msg.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✓ Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMessages
