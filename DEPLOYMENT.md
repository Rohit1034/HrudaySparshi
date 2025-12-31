# Deployment Guide for Hruday Sparshi

Complete step-by-step guide to deploy the Hruday Sparshi e-commerce application to production.

## Table of Contents

1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Azure)](#backend-deployment-azure)
3. [Domain & SSL Setup](#domain--ssl-setup)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Frontend Deployment (Vercel)

Vercel is the easiest platform for deploying React/Next.js applications with automatic CI/CD.

### Prerequisites

- GitHub account with repository
- Vercel account (free tier)
- Frontend repository pushed to GitHub

### Step 1: Push Code to GitHub

```bash
cd frontend
git add .
git commit -m "Initial commit: Hruday Sparshi frontend"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=hrudaysparshi-edca0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hrudaysparshi-edca0
VITE_FIREBASE_STORAGE_BUCKET=hrudaysparshi-edca0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://hruday-sparshi-api.azurewebsites.net
```

### Step 4: Configure Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your site is live at `https://<project-name>.vercel.app`

### Custom Domain (Optional)

1. In Project Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., hrudaysparshi.com)
4. Follow DNS configuration instructions
5. Add DNS records from your domain provider

---

## Backend Deployment (Azure App Service) ✅ COMPLETED

Your backend is deployed on **Azure App Service** for Node.js 20.

### Deployment Status

✅ **Resource Group**: `hruday-sparshi-rg` (eastus)
✅ **App Service Plan**: `hruday-sparshi-plan` (B1)
✅ **Web App**: `hruday-sparshi-api`
✅ **Backend URL**: `https://hruday-sparshi-api.azurewebsites.net`

### Step 1: Configure Environment Variables ✅

Environment variables are already configured with:

```bash
az webapp config appsettings set \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api \
  --settings \
    PORT=3000 \
    NODE_ENV=production \
    FIREBASE_PROJECT_ID="hrudaysparshi-edca0" \
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." \
    FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@hrudaysparshi-edca0.iam.gserviceaccount.com" \
    EMAIL_USER="rohit.patil1034@gmail.com" \
    EMAIL_PASSWORD="sqrp ytoq nwrh svkt" \
    ADMIN_EMAIL="rohit.patil1034@gmail.com" \
    FRONTEND_URL="https://hruday-sparshi.vercel.app/"
```

### Step 2: Deploy Backend Code

```bash
# Navigate to backend directory
cd backend

# Ensure git is initialized
git status

# Add all files
git add .

# Commit changes
git commit -m "Backend deployment to Azure App Service"

# Deploy to Azure App Service
az webapp up `
  --resource-group hruday-sparshi-rg `
  --name hruday-sparshi-api `
  --sku B1
```

### Step 3: Verify Deployment

Check if backend is running:

```bash
# Test health endpoint
curl https://hruday-sparshi-api.azurewebsites.net/health

# Should return: {"status":"OK","timestamp":"2025-12-31T..."}
```

### Step 4: Access Your Backend

**Backend URL**: `https://hruday-sparshi-api.azurewebsites.net`

Use this URL in your frontend `.env`:
```
VITE_API_URL=https://hruday-sparshi-api.azurewebsites.net
```

---

## Domain & SSL Setup

### Using Cloudflare (Recommended)

1. Register domain with any registrar
2. Go to [Cloudflare](https://www.cloudflare.com/)
3. Sign up and add site
4. Update nameservers at domain registrar
5. Create DNS records:
   - **Frontend**: `CNAME` → Vercel domain
   - **Backend**: `CNAME` → Azure backend URL
6. Enable SSL/TLS (free with Cloudflare)

### Using Azure Front Door

1. Create Azure Front Door resource
2. Add frontend and backend origins
3. Configure routing rules
4. Point domain DNS to Azure Front Door

---

## Post-Deployment Configuration

### 1. Update Firebase Credentials

In Firebase Console → Project Settings:

1. Go to "Authorized domains"
2. Add your Vercel domain (auto-added)
3. Add your custom domain if using one

### 2. Update CORS Settings

Your backend CORS is already configured for:
- `https://hruday-sparshi.vercel.app` (Vercel frontend)
- Custom domains when added

If you add a custom domain, update `frontend/src/index.js` CORS configuration.

### 3. Update Frontend API URL

If backend URL changes, update in Vercel:

1. Go to **Vercel Project Settings** → **Environment Variables**
2. Update `VITE_API_URL=https://hruday-sparshi-api.azurewebsites.net`
3. Redeploy: `vercel deploy --prod`

### 4. Post-Deployment Verification

**Backend Health Check:**
```bash
curl https://hruday-sparshi-api.azurewebsites.net/health
# Expected: {"status":"OK","timestamp":"2025-..."}
```

**Frontend URLs:**
- Development: http://localhost:5175
- Production: https://hruday-sparshi.vercel.app (when deployed)

**End-to-End Test Checklist:**
- [ ] User registration works
- [ ] displayName shows in header
- [ ] User login works
- [ ] Product browsing works
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Order placed successfully
- [ ] Email notification sent
- [ ] Admin dashboard accessible
- [ ] Admin can update order status
- [ ] All images load correctly

### 5. Set Up Monitoring

#### Azure Monitoring

```bash
# Enable Application Insights
az monitor app-insights component create \
  --app hruday-sparshi-insights \
  --location southeastasia \
  --resource-group hruday-sparshi-rg \
  --application-type web
```

#### Vercel Analytics

- Automatic in Vercel Dashboard
- Monitor builds, deployments, performance

---

## Monitoring & Maintenance

### Daily Tasks

- [ ] Check error logs in Azure
- [ ] Verify email/WhatsApp notifications sending
- [ ] Review new orders in admin dashboard

### Weekly Tasks

- [ ] Check Firebase usage and costs
- [ ] Review error reports
- [ ] Update products/inventory

### Monthly Tasks

- [ ] Analyze user behavior
- [ ] Review business metrics
- [ ] Update homepage content
- [ ] Backup Firestore (automatic in Firebase)

### Scaling Recommendations

If you exceed free tier:

**Frontend** (Vercel):
- Move to Pro plan ($20/month)
- Include serverless functions if needed

**Backend** (Azure):
- Upgrade from B1 to S1 App Service
- Or use App Service Plan B2/B3 for more traffic

**Database** (Firebase):
- Free tier: 1GB storage, 50k reads/day
- Paid plan: Scale as needed

### Emergency Contacts

- **Azure Support**: Azure Portal → Help + Support
- **Firebase Support**: Firebase Console → Help
- **Vercel Support**: Vercel Dashboard → Help
- **Email Provider Support**: Gmail support for SMTP issues

---

## Troubleshooting Deployment

### Vercel Build Fails

```bash
# Check logs in Vercel dashboard
# Deployments → Failed deployment → View logs

# Common solutions:
# 1. Verify VITE_API_URL env var is set correctly
# 2. Check that all imports are ES6 (no require())
# 3. Ensure .env file is in frontend root, not committed
```

### Backend Not Responding (Azure)

```bash
# Check if app is running
az webapp show \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api

# View live logs
az webapp log tail \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api

# Common issues:
# - Missing environment variables in App Service Configuration
# - Firebase credentials format invalid
# - Port must be 8080 (Azure assigns PORT env var)
```

### Firebase Connection Issues

```bash
# Test Firestore connection from backend
# Add temporary endpoint: GET /test-firebase
# Returns Firestore status

# Solutions:
# - Verify Firebase service account key is valid
# - Check Firestore security rules allow reads/writes
# - Ensure database is in correct region (US)
```

### Email Not Sending

```bash
# Test Gmail credentials
# Check Azure App Service logs for SMTP errors

# Solutions:
# - Verify Gmail app password (not regular password)
# - Check email addresses in env vars
# - Ensure 2-factor authentication is enabled on Gmail
# - Check that "Less secure apps" is allowed
```

### 413 Payload Too Large Error

```bash
# Already fixed in backend: express.json({ limit: '10mb' })
# If image upload still fails:
# 1. Ensure frontend compression is working
# 2. Check file size before upload: console.log(imageFile.size)
# 3. May need to compress further (resize to 800px instead of 1200px)
```

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Free | Free (100GB bandwidth) |
| Azure App Service | B1 | ~$11-15 |
| Firebase Firestore | Free tier | Free (1GB + 50k reads) |
| Gmail SMTP | Free | Free |
| Domain | - | ~$12/year |
| **Total** | **Low traffic** | **~$15-25/month** |

For detailed pricing: https://azure.microsoft.com/en-us/pricing/

**Cost Optimization:**
- Free tier covers most startup traffic
- Scale up only if you exceed quotas
- Vercel Pro ($20/month) for advanced features
- Azure S1 plan (~$50/month) for higher traffic
- Firebase paid plan scales with usage

---

## Rollback Procedure

If deployment causes issues:

**Vercel**: Click "Deployments" → Select previous version → Click "Promote to Production"

**Azure App Service**:
```bash
# View deployment history
az webapp deployment slot list \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api

# Stop the app
az webapp stop \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api

# Fix issue, then redeploy
git push azure main

# Start the app
az webapp start \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api
```

**Check Logs:**
```bash
az webapp log tail \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api
```

---

For additional help, refer to:
- [Vercel Docs](https://vercel.com/docs)
- [Azure Docs](https://docs.microsoft.com/azure)
- [Firebase Docs](https://firebase.google.com/docs)