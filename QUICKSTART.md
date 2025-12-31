# Quick Start Guide

Get Hruday Sparshi running in 5 minutes!

## TL;DR Quick Setup

### 1. Prerequisites

```bash
# Verify you have:
node --version      # v20 or later
npm --version       # v10 or later
git --version       # any version
```

### 2. Frontend (React + Vite)

```bash
cd frontend

npm install
cp .env.example .env
# Edit .env with Firebase credentials

npm run dev
# Open http://localhost:5173
```

### 3. Backend (Express.js)

```bash
cd backend

npm install
cp .env.example .env
# Edit .env with Firebase and email credentials

npm run dev
# Open http://localhost:3000
```

### 4. Test Application

1. **Sign Up**: http://localhost:5173/signup
   - Email: test@example.com
   - Password: Test123!
   - Name: Test User
   - Phone: 9876543210
   - Address: Any test address

2. **View Products**: http://localhost:5173/products

3. **Add to Cart & Checkout**:
   - Add items
   - Go to Cart
   - Click "Proceed to Checkout"
   - Place order

4. **Admin Panel**: http://localhost:5173/admin/dashboard
   - Use admin account (created in Firebase)
   - View orders, manage products

## What You'll Get

✅ **Complete React Frontend** (Vite)
- Home, Products, Cart, Checkout
- User authentication
- Order history
- Admin dashboard

✅ **Node.js Express Backend**
- REST APIs
- Firebase integration
- Email notifications
- Offline payment flow

✅ **Production Ready**
- Security features
- Error handling
- Database schema
- Docker support

✅ **Deployment Ready**
- Vercel frontend config
- Azure backend config
- Environment setup
- Documentation

## Folder Structure After Setup

```
hruday-sparshi/
├── frontend/          # React app (run on :5173)
├── backend/           # Express API (run on :3000)
├── README.md          # Main documentation
├── FIREBASE_SETUP.md  # Firebase configuration
└── DEPLOYMENT.md      # Deployment instructions
```

## Important Files to Edit

1. **Firebase Credentials**:
   - `frontend/.env` - React Firebase config
   - `backend/.env` - Admin SDK credentials

2. **Email Configuration** (`backend/.env`):
   - `EMAIL_USER` - Gmail address
   - `EMAIL_PASSWORD` - Gmail app password

3. **Admin Settings** (`backend/.env`):
   - `ADMIN_EMAIL` - Your email
   - `ADMIN_PHONE` - Your phone

## First Deploy

### Frontend to Vercel (Free)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Deploy (automatic on push)
4. Add environment variables

### Backend to Azure ($10-15/month)
1. Create Azure account
2. Build Docker image
3. Push to Azure Container Registry
4. Deploy to Azure Container Instances
5. Set environment variables

See `DEPLOYMENT.md` for detailed instructions.

## Verify Everything Works

- [ ] Frontend loads at localhost:5173
- [ ] Backend API responds at localhost:3000
- [ ] Can create user account
- [ ] Can add products to cart
- [ ] Can place orders
- [ ] Admin can login
- [ ] Email notifications work
- [ ] Orders appear in admin panel

## Need Help?

1. **Firebase Issues**: Check FIREBASE_SETUP.md
2. **Deployment**: Check DEPLOYMENT.md
3. **General**: Check README.md
4. **Code**: All components have comments

## Next Steps

1. ✅ Get it running locally
2. ✅ Customize business info
3. ✅ Add your products
4. ✅ Test all features
5. ✅ Deploy to production
6. ✅ Start taking orders!

---

**Time to first order: ~1 hour** ⏱️

Have questions? Check the detailed documentation files!
