# 🚀 Monorepo Deployment Solution

## Problem Identified

You were experiencing an issue where both AWS App Runner services (frontend and backend) were deploying the frontend code instead of deploying the backend code to the backend service. This happened because:

1. **Root apprunner.yaml conflict**: App Runner was finding the root `apprunner.yaml` file even when you specified a source directory for the backend
2. **Configuration confusion**: Both services were using similar configurations
3. **Port conflicts**: Backend was configured for wrong port (3000 instead of 8080)

## Solution Implemented

### 1. **Separated Configurations**
- **Frontend**: `apprunner.yaml` in root directory (port 3000, Next.js build)
- **Backend**: `server/apprunner.yaml` in server directory (port 8080, Express build)

### 2. **Added Build Markers**
Each configuration now has unique build markers to help identify which service is building:
- Frontend: `=== FRONTEND BUILD STARTED ===`
- Backend: `=== BACKEND BUILD STARTED ===`

### 3. **Fixed Port Configuration**
- **Frontend**: Port 3000 (Next.js default)
- **Backend**: Port 8080 (Express server port)

### 4. **Updated Environment Variables**
- Backend now has correct CORS origins
- Frontend points to correct backend API URL

## Deployment Steps

### Step 1: Frontend Service
1. Go to AWS App Runner Console
2. Create new service → Source code repository
3. Connect GitHub repository
4. **Configuration**:
   - **Source directory**: (leave empty)
   - **Configuration**: Use configuration file
   - **Service name**: `bceo-events-frontend`

### Step 2: Backend Service
1. Go to AWS App Runner Console
2. Create new service → Source code repository
3. Connect GitHub repository
4. **Configuration**:
   - **Source directory**: `server` ⚠️ **CRITICAL!**
   - **Configuration**: Use configuration file
   - **Service name**: `bceo-events-backend`

## Key Files Modified

### `apprunner.yaml` (Root - Frontend)
```yaml
# Frontend (Next.js) Configuration for AWS App Runner
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - echo "=== FRONTEND BUILD STARTED ==="
      - npm ci --only=production=false
      - npm run build
      - echo "=== FRONTEND BUILD COMPLETED ==="
run:
  command: npm start
  network:
    port: 3000
    env: PORT
  env:
    - name: NEXT_PUBLIC_API_URL
      value: "https://ymeu3ythmr.ap-south-1.awsapprunner.com/api"
```

### `server/apprunner.yaml` (Backend)
```yaml
# Backend (Express.js API) Configuration for AWS App Runner
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - echo "=== BACKEND BUILD STARTED ==="
      - npm ci --only=production
      - npm run build
      - echo "=== BACKEND BUILD COMPLETED ==="
run:
  command: npm start
  network:
    port: 8080
    env: PORT
  env:
    - name: PORT
      value: "8080"
    - name: MONGODB_URI
      value: "mongodb+srv://..."
```

## Verification

Run the verification script to ensure everything is configured correctly:

```bash
npm run verify-monorepo
```

This will check:
- ✅ All required files exist
- ✅ Configurations are different
- ✅ Ports are correct (3000 for frontend, 8080 for backend)
- ✅ Build commands are proper
- ✅ Environment variables are set

## Expected Results

After deployment:

1. **Frontend Service**: 
   - Builds and serves Next.js application on port 3000
   - Logs will show "FRONTEND BUILD STARTED"
   - Accessible at your frontend App Runner URL

2. **Backend Service**:
   - Builds and serves Express API on port 8080
   - Logs will show "BACKEND BUILD STARTED"
   - API accessible at your backend App Runner URL

## Post-Deployment Updates

After both services are deployed, update the cross-references:

1. **Update Frontend API URL** in `apprunner.yaml`:
   ```yaml
   - name: NEXT_PUBLIC_API_URL
     value: "https://YOUR-ACTUAL-BACKEND-URL.com/api"
   ```

2. **Update Backend CORS** in `server/apprunner.yaml`:
   ```yaml
   - name: CLIENT_URL
     value: "https://YOUR-ACTUAL-FRONTEND-URL.com"
   ```

## Troubleshooting

### If backend still deploys frontend:
1. Double-check source directory is set to `server`
2. Verify the backend service is reading `server/apprunner.yaml`
3. Check build logs for the correct build markers

### If services fail to start:
1. Check port configurations (3000 vs 8080)
2. Verify environment variables
3. Check database connections

## Success Indicators

✅ **Frontend logs**: "FRONTEND BUILD STARTED" and "FRONTEND BUILD COMPLETED"
✅ **Backend logs**: "BACKEND BUILD STARTED" and "BACKEND BUILD COMPLETED"
✅ **Frontend accessible**: Next.js app loads correctly
✅ **Backend accessible**: API endpoints respond at `/health`, `/api-docs`
✅ **Integration works**: Frontend can call backend APIs without CORS errors

Your monorepo deployment should now work correctly with each service deploying its respective code!