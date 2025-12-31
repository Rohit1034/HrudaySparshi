import admin from 'firebase-admin'

let serviceAccount

// Load Firebase credentials
try {
  let privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').trim()
  
  // The .env file has literal text '\n' (backslash followed by n)
  // We need to convert these to actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n')
  
  const projectId = (process.env.FIREBASE_PROJECT_ID || '').trim()
  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').trim()
  
  console.log('Attempting Firebase init with project:', projectId)
  
  serviceAccount = {
    type: 'service_account',
    project_id: projectId,
    private_key_id: 'key-id',
    private_key: privateKey,
    client_email: clientEmail,
    client_id: 'client-id',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/'
  }
  
  // Validate the service account
  if (!serviceAccount.project_id) {
    throw new Error('FIREBASE_PROJECT_ID not set in .env')
  }
  if (!serviceAccount.client_email) {
    throw new Error('FIREBASE_CLIENT_EMAIL not set in .env')
  }
  if (!serviceAccount.private_key || serviceAccount.private_key.length < 100) {
    throw new Error('FIREBASE_PRIVATE_KEY not set or invalid in .env')
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message)
  console.error('Please check your .env file contains valid Firebase credentials')
  throw error
}

export const db = admin.firestore()
export const auth = admin.auth()
export default admin
