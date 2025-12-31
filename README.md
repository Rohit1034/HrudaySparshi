# Hruday Sparshi - Production E-commerce Application

A professional, production-ready e-commerce web application for a homemade food & snacks business. Built with modern technologies and designed for scalability, reliability, and professional operation.

## 🎯 Project Overview

**Hruday Sparshi** is an online ordering platform for homemade meals, snacks, sweets, laddus, and festive items with free home delivery. The application features:

- ✅ Modern responsive UI with food-business branding
- ✅ User authentication and authorization
- ✅ Shopping cart and checkout (offline payment)
- ✅ Real-time order management
- ✅ Admin dashboard for business operations
- ✅ Email & WhatsApp notifications
- ✅ Homepage content management (CMS)
- ✅ Product catalog with categories
- ✅ Order tracking and history

## 📋 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Styling**: CSS3 with professional design system
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Deployment**: Vercel (no Docker)

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js 4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK
- **Email**: Nodemailer
- **WhatsApp**: WhatsApp Business Cloud API
- **Container**: Docker
- **Deployment**: Azure

### Database & Services
- **Firebase Firestore**: Document database
- **Firebase Authentication**: Email/password auth
- **Firebase Admin SDK**: Backend integration
- **Nodemailer**: Email service
- **WhatsApp Business API**: WhatsApp notifications

## 📁 Project Structure

```
hruday-sparshi/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/               # Admin pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminSettings.jsx
│   │   ├── contexts/                 # Context API
│   │   │   ├── AuthContext.jsx      # Authentication
│   │   │   └── CartContext.jsx      # Shopping cart
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── apiService.js        # API calls
│   │   │   └── firebase.js          # Firebase config
│   │   ├── config/                  # Configuration
│   │   ├── styles/                  # CSS files
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .gitignore
│
├── backend/                           # Express.js API
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js          # Firebase initialization
│   │   ├── controllers/             # Business logic
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   ├── homepageController.js
│   │   │   └── adminController.js
│   │   ├── routes/                  # API routes
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── homepage.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── auth.js              # Authentication middleware
│   │   ├── services/                # External services
│   │   │   ├── emailService.js      # Email notifications
│   │   │   └── whatsappService.js   # WhatsApp notifications
│   │   └── index.js                 # Server entry point
│   ├── Dockerfile                   # Docker configuration
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── docker-compose.yml               # Docker Compose configuration
├── README.md                        # This file
└── .gitignore

```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or later
- **npm** or **yarn**
- **Git**
- **Firebase Project** (free tier supported)
- **Docker & Docker Compose** (for backend containerization)
- **Email Service** (Gmail with app password recommended)
- **WhatsApp Business Account** (optional, for WhatsApp notifications)
- **Azure Account** (for backend deployment)
- **Vercel Account** (for frontend deployment)

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (select "Hruday Sparshi" or your business name)
3. Enable Firestore Database (free tier)
4. Enable Authentication → Email/Password
5. Create a service account:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Step 2: Email Configuration

1. Use Gmail (or any email service with SMTP)
2. If using Gmail:
   - Enable 2-factor authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Copy the 16-character app password

### Step 3: WhatsApp Configuration (Optional)

1. Create a WhatsApp Business Account
2. Get Business Account ID, Phone Number ID, and API Token
3. Store these credentials securely

### Step 4: Local Development Setup

#### Clone and Navigate

```bash
git clone <repository-url>
cd hruday-sparshi
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Firebase credentials
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# etc.

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

#### Backend Setup

```bash
cd ../backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Firebase and email credentials
# FIREBASE_PROJECT_ID=...
# FIREBASE_PRIVATE_KEY=...
# EMAIL_USER=...
# EMAIL_PASSWORD=...
# etc.

# Option 1: Direct Node.js (development)
npm run dev

# Option 2: Docker (production-like)
docker-compose up --build
```

Backend runs at `http://localhost:3000`

## 🛠️ Configuration Guide

### Frontend Configuration (.env)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
VITE_API_URL=http://localhost:3000
```

### Backend Configuration (.env)

```env
PORT=3000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Hruday Sparshi
EMAIL_FROM_ADDRESS=noreply@example.com

# Admin Contact
ADMIN_EMAIL=admin@example.com
ADMIN_PHONE=+91XXXXX XXXXX

# WhatsApp (Optional)
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_API_TOKEN=your_token
WHATSAPP_API_URL=https://graph.instagram.com/v18.0

# CORS
FRONTEND_URL=http://localhost:5173
```

## 📱 Features & Usage

### 1. User Features

#### Registration & Login
- Email/password authentication
- Profile includes full address (required for delivery)
- Phone number collection

#### Product Browsing
- Browse products by category (Meals, Snacks, Sweets, Laddus, Festival)
- View detailed product information
- Search functionality
- Category filtering

#### Cart & Checkout
- Add/remove items from cart
- Update quantities
- View cart total
- Offline payment (Cash on Delivery)
- No online payment processing

#### Order Management
- Place orders from cart
- Track order status
- View order history
- Receive email & WhatsApp notifications

### 2. Admin Features

#### Dashboard
- View key statistics
- Total orders, revenue, products
- Quick access to all management features

#### Order Management
- View requested orders (new orders)
- Accept orders (change status to PENDING)
- Mark orders as delivered (COMPLETED status)
- View complete customer and delivery information

#### Product Management
- Add new products
- Edit product details
- Delete products
- Manage product availability
- Set prices and descriptions

#### Homepage Management
- Edit business name and tagline
- Customize hero section
- Update contact information
- Manage homepage content from admin panel

### 3. Notification System

#### Email Notifications
- Order confirmation email
- Order status update emails
- Admin notification on new orders
- Professional HTML templates

#### WhatsApp Notifications (Optional)
- Order confirmation message
- Status update messages
- Admin alerts on new orders
- Configurable via WhatsApp Business API

## 🏗️ Database Schema

### Firestore Collections

#### users
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  fullName: "User Name",
  phoneNumber: "+919876543210",
  address: "Full delivery address",
  role: "customer" | "admin",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### products
```javascript
{
  name: "Product Name",
  category: "meals" | "snacks" | "sweets" | "laddus" | "festival",
  price: 249.99,
  description: "Product description",
  image: "image_url",
  availability: true,
  featured: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### orders
```javascript
{
  id: "order_id",
  userId: "user_id",
  customerName: "Customer Name",
  customerEmail: "customer@example.com",
  customerPhone: "+919876543210",
  deliveryAddress: "Full address",
  items: [
    {
      productId: "product_id",
      name: "Product Name",
      quantity: 2,
      price: 249.99
    }
  ],
  totalAmount: 499.98,
  status: "REQUESTED" | "PENDING" | "COMPLETED",
  paymentMode: "OFFLINE",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### homepageContent
```javascript
{
  businessName: "Hruday Sparshi",
  tagline: "Authentic Homemade Food",
  heroTitle: "Welcome to Hruday Sparshi",
  heroSubtitle: "Fresh homemade meals delivered to your door",
  aboutText: "Our story...",
  contactEmail: "contact@example.com",
  contactPhone: "+91XXXXX XXXXX",
  contactAddress: "Your address",
  updatedAt: timestamp
}
```

## 🔐 Security Features

- Firebase Authentication for secure user management
- JWT token verification on backend
- Admin role-based access control
- Input validation on all endpoints
- CORS protection
- Helmet.js for HTTP security headers
- Environment variables for sensitive data
- No sensitive data in version control (.gitignore)

## 🚀 Deployment Guide

### Frontend: Vercel Deployment

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import project from GitHub
4. Set environment variables:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_API_URL=https://your-backend-url.com
   ```
5. Deploy
6. Get deployment URL (e.g., https://hruday-sparshi.vercel.app)

### Backend: Azure Deployment

#### Option 1: Azure Container Instances

1. Build Docker image:
   ```bash
   docker build -t hruday-sparshi-backend:1.0 backend/
   ```

2. Push to Azure Container Registry:
   ```bash
   az acr login --name <registry-name>
   docker tag hruday-sparshi-backend:1.0 <registry-name>.azurecr.io/hruday-sparshi-backend:1.0
   docker push <registry-name>.azurecr.io/hruday-sparshi-backend:1.0
   ```

3. Deploy container:
   ```bash
   az container create \
     --resource-group <group-name> \
     --name hruday-sparshi-backend \
     --image <registry-name>.azurecr.io/hruday-sparshi-backend:1.0 \
     --ports 3000 \
     --environment-variables PORT=3000 NODE_ENV=production \
     --registry-login-server <registry-name>.azurecr.io \
     --registry-username <username> \
     --registry-password <password>
   ```

#### Option 2: Azure App Service

1. Create App Service Plan:
   ```bash
   az appservice plan create \
     --name hruday-sparshi-plan \
     --resource-group <group> \
     --sku B1 \
     --is-linux
   ```

2. Create Web App:
   ```bash
   az webapp create \
     --resource-group <group> \
     --plan hruday-sparshi-plan \
     --name hruday-sparshi-api \
     --runtime "node|20"
   ```

3. Deploy code:
   ```bash
   az webapp up --name hruday-sparshi-api
   ```

4. Configure environment variables in Azure Portal

#### Environment Variables in Azure

```
FIREBASE_PROJECT_ID: your_project_id
FIREBASE_PRIVATE_KEY: (copy from service account JSON)
FIREBASE_CLIENT_EMAIL: firebase-adminsdk@...
EMAIL_USER: your_email
EMAIL_PASSWORD: your_password
ADMIN_EMAIL: admin@example.com
FRONTEND_URL: https://hruday-sparshi.vercel.app
```

## 📊 API Documentation

### Public Endpoints

```
GET /products                 - Get all products (with optional category filter)
GET /products/:productId      - Get single product
GET /homepage                 - Get homepage content
```

### Authenticated Endpoints (User)

```
POST /orders                  - Create new order
GET /orders/user/my-orders    - Get user's orders
GET /orders/:orderId          - Get order details
```

### Admin Endpoints (Requires Admin Role)

```
GET /admin/dashboard/stats    - Get dashboard statistics

Orders:
GET /admin/orders/requested   - Get all requested orders
GET /admin/orders/pending     - Get all pending orders
GET /admin/orders/completed   - Get all completed orders
PATCH /admin/orders/:orderId/status - Update order status

Products:
POST /admin/products          - Create product
PUT /admin/products/:productId - Update product
DELETE /admin/products/:productId - Delete product

Homepage:
PUT /admin/homepage           - Update homepage content
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration with valid data
- [ ] User login with email/password
- [ ] Browse products by category
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Proceed to checkout
- [ ] Place order successfully
- [ ] Verify order confirmation email
- [ ] Check admin dashboard order appears
- [ ] Accept order in admin panel
- [ ] Verify user receives status update email
- [ ] Mark order as completed
- [ ] Verify delivery notification sent
- [ ] Admin can add/edit/delete products
- [ ] Admin can update homepage content
- [ ] Responsive design on mobile

## 🐛 Troubleshooting

### Firebase Connection Issues

**Error**: `Failed to initialize Firebase`
- Verify Firebase credentials in `.env`
- Ensure `FIREBASE_PRIVATE_KEY` has proper line breaks: `\n`
- Check project ID matches Firebase console

### Email Not Sending

**Error**: `Email sending error`
- Verify Gmail app password (not regular password)
- Enable "Less secure app access" if using Gmail
- Check email credentials in `.env`
- Verify `EMAIL_FROM_ADDRESS` is set

### CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS`
- Verify `FRONTEND_URL` in backend `.env`
- Ensure backend CORS is configured correctly
- Check browser console for actual error

### Docker Build Issues

**Error**: `Docker build fails`
- Use absolute paths for Docker volumes
- Ensure `Dockerfile` is in correct location
- Try `docker system prune` to clean up

## 📈 Performance Optimization

- Lazy loading of routes
- Image optimization
- CSS modules for performance
- Firestore indexing for queries
- Caching strategies with service workers (can be added)
- Database query optimization

## 🔄 Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
      - name: Deploy backend to Azure
        run: |
          # Azure deployment commands
```

## 📝 License

This project is proprietary software for Hruday Sparshi. All rights reserved.

## 👥 Support

For issues, feature requests, or support:
- Email: admin@example.com
- Phone: +91 XXXXX XXXXX

## 📞 Contact

**Hruday Sparshi**
- Email: contact@example.com
- Phone: +91 XXXXX XXXXX
- Address: Your business address

---

**Built with ❤️ for food lovers**
