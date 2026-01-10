import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Firebase Admin using environment variables
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
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'hrudaysparshi-edca0.appspot.com'
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

const assetsPath = path.join(__dirname, '../../frontend/src/assets')

async function uploadImagesToFirebase() {
  try {
    console.log('Starting image upload to Firebase Storage...')

    // Get all image files from assets folder
    const files = fs.readdirSync(assetsPath).filter(file => 
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    )

    console.log(`Found ${files.length} images to upload`)

    // Upload each image and collect URLs
    const uploadedUrls = {}

    for (const file of files) {
      const filePath = path.join(assetsPath, file)
      const fileName = file.toLowerCase()

      try {
        console.log(`Uploading ${file}...`)

        // Upload to Firebase Storage
        await bucket.upload(filePath, {
          destination: `products/${fileName}`,
          metadata: {
            cacheControl: 'public, max-age=31536000', // Cache for 1 year
          }
        })

        // Get download URL
        const file_obj = bucket.file(`products/${fileName}`)
        const [url] = await file_obj.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        })

        uploadedUrls[fileName] = url
        console.log(`✓ ${file} uploaded`)
      } catch (error) {
        console.error(`✗ Error uploading ${file}:`, error.message)
      }
    }

    // Now update Firestore products with image URLs
    console.log('\nUpdating products with Firebase Storage URLs...')

    const productsSnapshot = await db.collection('products').get()
    const updates = []

    for (const doc of productsSnapshot.docs) {
      const product = doc.data()
      const imageName = product.image?.split('/').pop()?.toLowerCase()

      if (imageName && uploadedUrls[imageName]) {
        updates.push(
          db.collection('products').doc(doc.id).update({
            image: uploadedUrls[imageName]
          })
        )
        console.log(`✓ Updated ${product.name} with Firebase Storage URL`)
      }
    }

    await Promise.all(updates)

    console.log('\n✓ All images uploaded and products updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error during upload:', error)
    process.exit(1)
  }
}

uploadImagesToFirebase()
