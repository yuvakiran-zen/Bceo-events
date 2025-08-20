#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script verifies that the application is properly configured for AWS App Runner deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying AWS App Runner deployment configuration...\n');

// Check required files
const requiredFiles = [
  'apprunner.yaml',
  'package.json',
  'next.config.js',
  '.dockerignore'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
});

// Check package.json scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'start'];
  
  console.log('\n📦 Checking package.json scripts:');
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script "${script}" is defined`);
    } else {
      console.log(`❌ Script "${script}" is missing`);
      allFilesExist = false;
    }
  });

  // Check Next.js dependency
  if (packageJson.dependencies && packageJson.dependencies.next) {
    console.log(`✅ Next.js version: ${packageJson.dependencies.next}`);
  } else {
    console.log('❌ Next.js dependency is missing');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  allFilesExist = false;
}

// Check apprunner.yaml configuration
try {
  const apprunnerConfig = fs.readFileSync('apprunner.yaml', 'utf8');
  console.log('\n⚙️  Checking apprunner.yaml configuration:');
  
  if (apprunnerConfig.includes('nodejs18')) {
    console.log('✅ Node.js 18 runtime specified');
  } else {
    console.log('⚠️  Node.js runtime not specified or incorrect');
  }

  if (apprunnerConfig.includes('npm run build')) {
    console.log('✅ Build command configured');
  } else {
    console.log('❌ Build command missing');
    allFilesExist = false;
  }

  if (apprunnerConfig.includes('npm start')) {
    console.log('✅ Start command configured');
  } else {
    console.log('❌ Start command missing');
    allFilesExist = false;
  }

  if (apprunnerConfig.includes('port: 3000')) {
    console.log('✅ Port 3000 configured');
  } else {
    console.log('⚠️  Port configuration may be incorrect');
  }

  if (apprunnerConfig.includes('NEXT_PUBLIC_API_URL')) {
    console.log('✅ API URL environment variable configured');
  } else {
    console.log('⚠️  API URL environment variable not found');
  }
} catch (error) {
  console.log('❌ Error reading apprunner.yaml:', error.message);
  allFilesExist = false;
}

// Check environment variables
console.log('\n🌍 Environment variable configuration:');
if (fs.existsSync('.env.production')) {
  console.log('✅ .env.production file exists');
} else {
  console.log('⚠️  .env.production file not found (optional)');
}

if (fs.existsSync('.env.example')) {
  console.log('✅ .env.example file exists');
} else {
  console.log('⚠️  .env.example file not found (recommended)');
}

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 Configuration verification PASSED!');
  console.log('✅ Your application is ready for AWS App Runner deployment.');
  console.log('\nNext steps:');
  console.log('1. Commit and push your changes to GitHub');
  console.log('2. Create an App Runner service in AWS Console');
  console.log('3. Connect your GitHub repository');
  console.log('4. Use the apprunner.yaml configuration file');
  console.log('5. Deploy and monitor the service');
} else {
  console.log('❌ Configuration verification FAILED!');
  console.log('Please fix the issues above before deploying.');
  process.exit(1);
}