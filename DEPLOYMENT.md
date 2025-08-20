# AWS App Runner Deployment Guide

This guide explains how to deploy the Buddha CEO Events frontend application to AWS App Runner using GitHub integration.

## Prerequisites

1. AWS Account with App Runner access
2. GitHub repository with your code
3. AWS CLI configured (optional, for troubleshooting)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the following files:
- `apprunner.yaml` (configuration file)
- `package.json` (dependencies and scripts)
- `.dockerignore` (optimization)
- `.env.production` (production environment variables)

### 2. Create App Runner Service

1. **Go to AWS App Runner Console**
   - Navigate to AWS App Runner in your AWS Console
   - Click "Create service"

2. **Configure Source**
   - Choose "Source code repository"
   - Select "GitHub"
   - Connect your GitHub account if not already connected
   - Select your repository: `bceoevents`
   - Choose branch: `main` (or your default branch)
   - Select "Automatic" for deployment trigger

3. **Configure Build**
   - Choose "Use a configuration file"
   - Configuration file: `apprunner.yaml`

4. **Configure Service**
   - Service name: `bceo-events-frontend`
   - Virtual CPU: 0.25 vCPU
   - Virtual memory: 0.5 GB
   - Port: 3000
   - Environment variables (if not in apprunner.yaml):
     - `NODE_ENV`: `production`
     - `NEXT_PUBLIC_API_URL`: `https://ymeu3ythmr.ap-south-1.awsapprunner.com/api`

5. **Configure Auto Scaling** (Optional)
   - Min size: 1
   - Max size: 3
   - Max concurrency: 100

6. **Configure Health Check**
   - Protocol: HTTP
   - Path: `/`
   - Interval: 10 seconds
   - Timeout: 5 seconds
   - Healthy threshold: 1
   - Unhealthy threshold: 5

### 3. Deploy

1. Click "Create & deploy"
2. Wait for the service to be created and deployed
3. Monitor the deployment logs in the App Runner console

## Configuration Details

### apprunner.yaml Explanation

```yaml
version: 1.0
runtime: nodejs18                    # Node.js 18 runtime
build:
  commands:
    build:
      - npm ci --only=production=false  # Install all dependencies
      - npm run build                   # Build Next.js app
run:
  command: npm start                    # Start production server
  network:
    port: 3000                         # Application port
    env: PORT                          # Port environment variable
  env:
    - name: NODE_ENV
      value: "production"              # Production environment
    - name: NEXT_PUBLIC_API_URL
      value: "https://ymeu3ythmr.ap-south-1.awsapprunner.com/api"
    - name: NEXT_TELEMETRY_DISABLED
      value: "1"                       # Disable Next.js telemetry
```

### Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to "production" for production builds
- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NEXT_TELEMETRY_DISABLED`: Disables Next.js telemetry for faster builds
- `PORT`: Application port (automatically set by App Runner)

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are listed in package.json
   - Ensure TypeScript compilation passes locally
   - Verify environment variables are correctly set

2. **Runtime Errors**
   - Check App Runner logs in the AWS Console
   - Verify API URL is accessible from App Runner
   - Ensure CORS is configured on your backend

3. **Performance Issues**
   - Consider increasing vCPU/memory allocation
   - Enable auto-scaling if needed
   - Optimize your Next.js build

### Monitoring

- Use AWS CloudWatch for detailed metrics
- Monitor App Runner service health in the console
- Set up CloudWatch alarms for critical metrics

## Post-Deployment

1. **Test the Application**
   - Visit your App Runner service URL
   - Test all functionality
   - Verify API connections work

2. **Configure Custom Domain** (Optional)
   - Add custom domain in App Runner console
   - Update DNS records
   - Configure SSL certificate

3. **Set Up Monitoring**
   - Configure CloudWatch alarms
   - Set up log aggregation
   - Monitor performance metrics

## Updating the Application

App Runner will automatically deploy when you push to your configured branch. To manually trigger a deployment:

1. Go to App Runner console
2. Select your service
3. Click "Deploy" to trigger a new deployment

## Cost Optimization

- Use appropriate vCPU/memory sizing
- Configure auto-scaling based on actual usage
- Monitor costs in AWS Cost Explorer
- Consider using reserved capacity for predictable workloads

## Security Best Practices

- Use environment variables for sensitive configuration
- Enable AWS WAF if needed
- Configure VPC connector for private resources
- Regularly update dependencies
- Monitor security advisories

## Support

For issues with:
- AWS App Runner: Check AWS documentation and support
- Next.js: Refer to Next.js documentation
- Application bugs: Check application logs and GitHub issues