#!/usr/bin/env node

/**
 * This script creates a fallback manifest for Next.js builds
 * to prevent MODULE_NOT_FOUND errors during the build process
 */

const fs = require('fs');
const path = require('path');

// Create the .next directory if it doesn't exist
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
  console.log('✓ Created .next directory');
}

// Create a fallback static manifest
const staticDir = path.join(nextDir, 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Create a simple fallback manifest to prevent build errors
const manifestPath = path.join(nextDir, 'static', 'build-manifest.json');
const fallbackManifest = {
  version: '1.0.0',
  polyfills: [],
  pages: {
    '/': ['static/chunks/pages/index-*.js'],
    '/_app': ['static/chunks/pages/_app-*.js'],
    '/_document': ['static/chunks/pages/_document-*.js'],
    '/_error': ['static/chunks/pages/_error-*.js']
  },
  ampFirstPages: []
};

try {
  fs.writeFileSync(manifestPath, JSON.stringify(fallbackManifest, null, 2));
  console.log('✓ Fallback manifest created successfully');
} catch (error) {
  console.warn('⚠ Could not create fallback manifest:', error.message);
  // This is non-fatal, the build can continue
}

console.log('✓ Build preparation completed');