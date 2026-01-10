import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Firebase Admin
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: 'key-id',
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: 'client-id',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

async function markUkadichModakAsFeatured() {
  try {
    console.log('Finding Ukadiche Modak product...')

    // Find product by name
    const snapshot = await db.collection('products')
      .where('name', '==', 'Ukadiche Modak')
      .limit(1)
      .get()

    if (snapshot.empty) {
      console.log('❌ Ukadiche Modak product not found. Make sure the product is already created in Firestore.')
      process.exit(1)
    }

    const product = snapshot.docs[0]
    
    // Mark as featured
    await db.collection('products').doc(product.id).update({
      isFeatured: true
    })

    console.log('✓ Ukadiche Modak marked as featured!')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

markUkadichModakAsFeatured()
