# Monorepo Deployment Guide for AWS App Runner

This repository contains both frontend (Next.js) and backend (Express.js) applications. Here's how to properly deploy both services to AWS App Runner.

## Repository Structure

```
bceoevents/
├── apprunner.yaml          # Frontend configuration
├── package.json            # Frontend dependencies
├── app/                    # Next.js app directory
├── lib/                    # Frontend utilities
├── hooks/                  # React hooks
└── server/
    ├── apprunner.yaml      # Backend configuration
    ├── package.json        # Backend dependencies
    ├── server.js           # Express server
    └── routes/             # API routes
```

## Deployment Steps

### 1. Frontend Service Deployment

1. **Create Frontend App Runner Service:**
   - Go to AWS App Runner Console
   - Click "Create service"
   - Choose "Source code repository"
   - Connect your GitHub repository
   - Select your repository and branch (main)

2. **Configure Frontend Service:**
   - **Source directory**: Leave empty (root directory)
   - **Configuration**: Use configuration file
   - **Configuration file**: `apprunner.yaml` (in root)
   - **Service name**: `bceo-events-frontend`

3. **Review and Deploy:**
   - Review settings
   - Click "Create & deploy"

### 2. Backend Service Deployment

1. **Create Backend App Runner Service:**
   - Go to AWS App Runner Console
   - Click "Create service"
   - Choose "Source code repository"
   - Connect your GitHub repository
   - Select your repository and branch (main)

2. **Configure Backend Service:**
   - **Source directory**: `server` (IMPORTANT!)
   - **Configuration**: Use configuration file
   - **Configuration file**: `apprunner.yaml` (in server directory)
   - **Service name**: `bceo-events-backend`

3. **Review and Deploy:**
   - Review settings
   - Click "Create & deploy"

## Important Configuration Notes

### Frontend Configuration (`apprunner.yaml`)
- **Port**: 3000 (Next.js default)
- **Build**: `npm run build`
- **Start**: `npm start`
- **API URL**: Points to backend service

### Backend Configuration (`server/apprunner.yaml`)
- **Port**: 8080 (Express server port)
- **Build**: `npm run build`
- **Start**: `npm start`
- **Database**: MongoDB connection string

## Environment Variables Update

After both services are deployed, you'll need to update the environment variables:

### 1. Update Frontend API URL
Once your backend is deployed, update the frontend's `NEXT_PUBLIC_API_URL`:

```yaml
# In apprunner.yaml
env:
  - name: NEXT_PUBLIC_API_URL
    value: "https://YOUR-BACKEND-APPRUNNER-URL.com/api"
```

### 2. Update Backend CORS Origins
Update the backend's allowed origins:

```yaml
# In server/apprunner.yaml
env:
  - name: CLIENT_URL
    value: "https://YOUR-FRONTEND-APPRUNNER-URL.com"
  - name: FRONTEND_URL
    value: "https://YOUR-FRONTEND-APPRUNNER-URL.com"
```

## Troubleshooting

### Issue: Both services deploying frontend code
**Solution**: Ensure you set the correct source directory:
- Frontend: Leave source directory empty (root)
- Backend: Set source directory to `server`

### Issue: Backend not starting
**Possible causes**:
1. Wrong port configuration (should be 8080)
2. Missing environment variables
3. Database connection issues

### Issue: CORS errors
**Solution**: Update backend CORS configuration with frontend URL

### Issue: API calls failing
**Solution**: Verify API URL in frontend environment variables

## Verification Steps

### 1. Check Frontend Deployment
- Visit your frontend App Runner URL
- Check browser console for errors
- Verify API calls are working

### 2. Check Backend Deployment
- Visit `https://YOUR-BACKEND-URL.com/health`
- Check API documentation at `https://YOUR-BACKEND-URL.com/api-docs`
- Test API endpoints

### 3. Check Integration
- Test frontend functionality that calls backend APIs
- Verify data is loading correctly
- Check for CORS issues in browser console

## Service URLs

After deployment, you'll have two services:

1. **Frontend**: `https://YOUR-FRONTEND-ID.REGION.awsapprunner.com`
2. **Backend**: `https://YOUR-BACKEND-ID.REGION.awsapprunner.com`

Make sure to update the cross-references between services with the actual URLs.

## Monitoring

- Monitor both services in AWS App Runner console
- Check logs for any deployment or runtime issues
- Set up health checks and alarms as needed

## Cost Optimization

- Use the smallest instance size that meets your needs
- Consider auto-scaling settings
- Monitor usage and adjust resources accordingly