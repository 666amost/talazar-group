#!/bin/bash

# Talazar Group Deployment Script for Vercel
# This script helps you deploy the application to Vercel with proper setup

echo "🚀 Talazar Group - Vercel Deployment Setup"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add Vercel Storage (Postgres, KV, Blob) in your project dashboard"
echo "2. Set environment variables in Vercel project settings"
echo "3. Run database migrations: npm run db:migrate"
echo "4. Test your deployment"
echo ""
echo "📖 For detailed setup instructions, see README.md"
