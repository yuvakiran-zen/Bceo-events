#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Monorepo Deployment Configuration...\n');

// Check if required files exist
const requiredFiles = [
  { path: 'apprunner.yaml', description: 'Frontend App Runner config' },
  { path: 'server/apprunner.yaml', description: 'Backend App Runner config' },
  { path: 'package.json', description: 'Frontend package.json' },
  { path: 'server/package.json', description: 'Backend package.json' }
];

let allFilesExist = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.log(`✅ ${file.description}: ${file.path}`);
  } else {
    console.log(`❌ ${file.description}: ${file.path} (MISSING)`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the file paths.');
  process.exit(1);
}

console.log('\n🔧 Analyzing configurations...');

try {
  // Read frontend config
  const frontendConfigContent = fs.readFileSync('apprunner.yaml', 'utf8');
  console.log('\n📱 Frontend Configuration:');
  console.log('   ✅ apprunner.yaml exists in root directory');
  
  // Check for key frontend indicators
  if (frontendConfigContent.includes('npm run build') && frontendConfigContent.includes('npm start')) {
    console.log('   ✅ Has Next.js build and start commands');
  }
  
  if (frontendConfigContent.includes('port: 3000')) {
    console.log('   ✅ Configured for port 3000');
  } else {
    console.log('   ❌ Should be configured for port 3000');
  }
  
  if (frontendConfigContent.includes('NEXT_PUBLIC_API_URL')) {
    console.log('   ✅ API URL environment variable configured');
  }

  // Read backend config
  const backendConfigContent = fs.readFileSync('server/apprunner.yaml', 'utf8');
  console.log('\n🖥️  Backend Configuration:');
  console.log('   ✅ apprunner.yaml exists in server directory');
  
  // Check for key backend indicators
  if (backendConfigContent.includes('npm run build') && backendConfigContent.includes('npm start')) {
    console.log('   ✅ Has Express build and start commands');
  }
  
  if (backendConfigContent.includes('port: 8080')) {
    console.log('   ✅ Configured for port 8080');
  } else {
    console.log('   ❌ Should be configured for port 8080');
  }
  
  if (backendConfigContent.includes('MONGODB_URI')) {
    console.log('   ✅ Database connection configured');
  }

  // Check for BACKEND BUILD markers
  if (backendConfigContent.includes('BACKEND BUILD STARTED')) {
    console.log('   ✅ Backend-specific build markers present');
  }

  // Check for FRONTEND BUILD markers
  if (frontendConfigContent.includes('FRONTEND BUILD STARTED')) {
    console.log('   ✅ Frontend-specific build markers present');
  }

  console.log('\n🔍 Key Differences Verification:');
  
  // Verify they are different configurations
  if (frontendConfigContent !== backendConfigContent) {
    console.log('✅ Frontend and backend have different configurations');
  } else {
    console.log('❌ WARNING: Frontend and backend configurations are identical!');
  }

  console.log('\n📋 AWS App Runner Deployment Instructions:');
  console.log('\n1. 🎨 Frontend Service Setup:');
  console.log('   • Service name: bceo-events-frontend');
  console.log('   • Source directory: (leave empty - uses root)');
  console.log('   • Configuration file: apprunner.yaml');
  console.log('   • Expected port: 3000');
  
  console.log('\n2. 🔧 Backend Service Setup:');
  console.log('   • Service name: bceo-events-backend');
  console.log('   • Source directory: server (CRITICAL!)');
  console.log('   • Configuration file: apprunner.yaml');
  console.log('   • Expected port: 8080');

  console.log('\n⚠️  IMPORTANT NOTES:');
  console.log('   • Backend MUST have "server" as source directory');
  console.log('   • Frontend should have empty/root source directory');
  console.log('   • Both services will use their respective apprunner.yaml files');
  console.log('   • After deployment, update cross-service URLs');

  console.log('\n✅ Configuration verification completed successfully!');
  console.log('📖 For detailed deployment steps, see MONOREPO_DEPLOYMENT.md');

} catch (error) {
  console.error('\n❌ Error reading configuration files:', error.message);
  process.exit(1);
}