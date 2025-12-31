# Firebase Firestore Setup Guide

This guide helps you set up Firebase Firestore and configure collections for Hruday Sparshi.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: "Hruday Sparshi"
4. Accept default analytics settings
5. Click "Create project"

## 2. Set Up Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (closest to your service area)
5. Click "Create"

## 3. Update Firestore Security Rules

In Firestore Console, go to "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
    
    // Homepage content - public read, admin write
    match /homepageContent/{document=**} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 4. Set Up Authentication

1. Go to "Authentication" → "Sign-in method"
2. Enable "Email/Password"
3. Click "Save"

## 5. Create Initial Admin User

Use Firebase Admin SDK or Cloud Console:

### Using Firebase Console:

1. Go to "Authentication" tab
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"

### Update User Role:

1. Go to "Firestore Database"
2. Click "Create document" under `users` collection
3. Set Document ID as admin's UID
4. Add fields:
   ```
   uid: admin_uid
   email: admin@example.com
   fullName: Admin Name
   phoneNumber: +919876543210
   address: Your Business Address
   role: admin
   createdAt: timestamp
   updatedAt: timestamp
   ```

## 6. Get Firebase Credentials

### For Frontend:

1. Go to Project Settings (gear icon)
2. Click "Your apps" section
3. If no app exists, click "Add app" → "Web"
4. Name it "Hruday Sparshi Web"
5. Copy the config object:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```
6. Add to frontend `.env` file

### For Backend:

1. Go to Project Settings
2. Click "Service Accounts" tab
3. Click "Generate new private key"
4. A JSON file will download - keep it secure
5. Extract values:
   - `project_id`
   - `private_key` (preserve newlines as `\n`)
   - `client_email`
6. Add to backend `.env` file

## 7. Create Initial Collections

Collections are created automatically when you first write documents. Here's sample data to add:

### Sample Products

```javascript
// Collection: products
// Documents:

{
  name: "Paneer Tikka Masala",
  category: "meals",
  price: 299.99,
  description: "Rich paneer tikka cooked in creamy tomato sauce",
  image: "url_to_image",
  availability: true,
  featured: true,
  createdAt: timestamp,
  updatedAt: timestamp
}

{
  name: "Gulab Jamun",
  category: "sweets",
  price: 149.99,
  description: "Soft milk solids dipped in sugar syrup",
  image: "url_to_image",
  availability: true,
  featured: true,
  createdAt: timestamp,
  updatedAt: timestamp
}

{
  name: "Moong Laddu",
  category: "laddus",
  price: 199.99,
  description: "Traditional moong laddus with ghee",
  image: "url_to_image",
  availability: true,
  featured: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Sample Homepage Content

```javascript
// Collection: homepageContent
// Document ID: main

{
  businessName: "Hruday Sparshi",
  tagline: "Authentic Homemade Food & Snacks",
  heroTitle: "Welcome to Hruday Sparshi",
  heroSubtitle: "Fresh homemade meals delivered to your door",
  aboutText: "We bring authentic homemade food tradition to your table...",
  contactEmail: "contact@example.com",
  contactPhone: "+91 XXXXX XXXXX",
  contactAddress: "Your business address",
  updatedAt: timestamp
}
```

## 8. Set Up Firestore Indexes (if needed)

Firebase will suggest index creation as you query. Accept suggestions in the console.

Common indexes needed:
- `orders`: `status` + `createdAt` (for sorting orders by status and date)
- `products`: `category` + `featured` (for filtering)

## 9. Enable Backup

1. Go to "Firestore Database" → "Backups"
2. Click "Create backup"
3. Set retention policy
4. Click "Create"

## Firestore Collection Hierarchy

```
Firestore Database
├── users/
│   └── {userId}/
│       └── {user document with role, address, etc.}
│
├── products/
│   └── {productId}/
│       └── {product details}
│
├── orders/
│   └── {orderId}/
│       └── {order with items, status, customer info}
│
└── homepageContent/
    └── main
        └── {homepage config}
```

## Tips

- Use compound queries for better performance
- Set appropriate limits on document reads
- Monitor Firestore usage in Firebase Console
- Regular backups are automatically created
- Free tier includes 1GB storage

## Troubleshooting

**Issue**: "Permission denied" errors
- Check Firestore Security Rules
- Verify user authentication status
- Ensure proper document path

**Issue**: Slow queries
- Create appropriate indexes
- Avoid fetching all documents
- Use pagination for large result sets

**Issue**: High costs
- Monitor document reads/writes in Console
- Implement proper query limits
- Use batching for multiple writes

---

For more help: [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
