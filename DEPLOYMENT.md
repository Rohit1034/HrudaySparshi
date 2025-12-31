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

In Vercel Project Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY = your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = your_project_id
VITE_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = sender_id
VITE_FIREBASE_APP_ID = app_id
VITE_API_URL = https://your-backend-api.azurewebsites.net
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

## Backend Deployment (Azure)

Deploy the Node.js backend to Azure Container Instances or App Service.

### Option 1: Azure Container Instances (Recommended)

#### Prerequisites

- Azure Account with active subscription
- Azure CLI installed
- Docker installed locally
- Backend code ready

#### Step 1: Create Azure Resources

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name hruday-sparshi-rg \
  --location southeastasia

# Create Container Registry
az acr create \
  --resource-group hruday-sparshi-rg \
  --name hrudaysparshi \
  --sku Basic

# Get registry credentials
az acr credential show \
  --name hrudaysparshi \
  --query username -o tsv
```

#### Step 2: Build and Push Docker Image

```bash
cd backend

# Build image
docker build -t hruday-sparshi-backend:1.0 .

# Tag for Azure
docker tag hruday-sparshi-backend:1.0 hrudaysparshi.azurecr.io/hruday-sparshi-backend:1.0

# Login to registry
az acr login --name hrudaysparshi

# Push image
docker push hrudaysparshi.azurecr.io/hruday-sparshi-backend:1.0
```

#### Step 3: Deploy Container

```bash
az container create \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api \
  --image hrudaysparshi.azurecr.io/hruday-sparshi-backend:1.0 \
  --cpu 1 \
  --memory 1 \
  --ports 3000 \
  --registry-login-server hrudaysparshi.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --environment-variables \
    PORT=3000 \
    NODE_ENV=production \
    FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID" \
    FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY" \
    FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL" \
    EMAIL_USER="$EMAIL_USER" \
    EMAIL_PASSWORD="$EMAIL_PASSWORD" \
    EMAIL_FROM_NAME="Hruday Sparshi" \
    EMAIL_FROM_ADDRESS="noreply@example.com" \
    ADMIN_EMAIL="$ADMIN_EMAIL" \
    ADMIN_PHONE="$ADMIN_PHONE" \
    FRONTEND_URL="https://your-vercel-domain.com"
```

#### Step 4: Get Container URL

```bash
az container show \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api \
  --query ipAddress.fqdn \
  -o tsv
```

Your backend API is at: `http://container-fqdn:3000`

#### Step 5: Set Up Custom Domain

Use Azure Application Gateway or Cloudflare to add a custom domain pointing to your container.

---

### Option 2: Azure App Service

#### Step 1: Create App Service Plan

```bash
az appservice plan create \
  --name hruday-sparshi-plan \
  --resource-group hruday-sparshi-rg \
  --sku B1 \
  --is-linux
```

#### Step 2: Create Web App

```bash
az webapp create \
  --resource-group hruday-sparshi-rg \
  --plan hruday-sparshi-plan \
  --name hruday-sparshi-api \
  --runtime "node|20-lts"
```

#### Step 3: Configure App Settings

```bash
az webapp config appsettings set \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api \
  --settings \
    PORT=3000 \
    NODE_ENV=production \
    FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID" \
    FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY" \
    FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL" \
    EMAIL_USER="$EMAIL_USER" \
    EMAIL_PASSWORD="$EMAIL_PASSWORD" \
    ADMIN_EMAIL="$ADMIN_EMAIL" \
    FRONTEND_URL="https://your-vercel-domain.com"
```

#### Step 4: Deploy Code

```bash
cd backend

# Initialize git (if not already)
git init
git add .
git commit -m "Backend deployment"

# Deploy to App Service
az webapp up \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api \
  --sku B1
```

#### Step 5: Access Your Backend

URL: `https://hruday-sparshi-api.azurewebsites.net`

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

In backend code or Azure configuration:

```javascript
const allowedOrigins = [
  'https://hrudaysparshi.vercel.app',
  'https://your-custom-domain.com'
];
```

### 3. Update Frontend API URL

Vercel automatically deploys on git push. If you need to change API URL:

1. Update `.env` with new backend URL
2. Push to GitHub
3. Vercel redeploys automatically

### 4. Test Application Flow

- [ ] User registration
- [ ] User login
- [ ] Product browsing
- [ ] Add to cart
- [ ] Checkout
- [ ] Order placement
- [ ] Email notification sent
- [ ] Admin dashboard access
- [ ] Order status update

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
# Check logs
vercel logs --tail

# Solutions:
# 1. Verify all env vars are set
# 2. Check node_modules not in .gitignore (but should be)
# 3. Ensure vite.config.js is correct
```

### Azure Container Not Starting

```bash
# Check logs
az container logs \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api

# Common issues:
# - Firebase credentials format
# - Missing environment variables
# - Port conflicts
```

### Firebase Connection Issues

- Verify IP whitelist (Firebase doesn't restrict by IP)
- Check service account key is valid
- Ensure Firestore database region is correct

### Email Not Sending

- Verify Gmail app password
- Check email credentials in Azure settings
- Test with simple email first

---

## Cost Estimate (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | Free |
| Azure Container | - | ~$10-15 |
| Firebase Firestore | 1GB + 50k reads | Free/low usage |
| Gmail SMTP | Unlimited | Free |
| Domain | - | ~$12/year |
| **Total** | **If low traffic** | **~$10-20/month** |

For detailed pricing: https://azure.microsoft.com/en-us/pricing/

---

## Rollback Procedure

If deployment causes issues:

**Vercel**: Click "Deployments" → Select previous version → Click "Promote to Production"

**Azure**:
```bash
# Redeploy previous image
docker tag hrudaysparshi.azurecr.io/hruday-sparshi-backend:previous \
           hrudaysparshi.azurecr.io/hruday-sparshi-backend:latest

docker push hrudaysparshi.azurecr.io/hruday-sparshi-backend:latest

# Restart container
az container restart \
  --resource-group hruday-sparshi-rg \
  --name hruday-sparshi-api
```

---

For additional help, refer to:
- [Vercel Docs](https://vercel.com/docs)
- [Azure Docs](https://docs.microsoft.com/azure)
- [Firebase Docs](https://firebase.google.com/docs)
