#!/bin/bash

# SwarmAI Deployment Script
# Deploys via GitHub Actions to Azure Static Web Apps

set -e

echo "🚀 SwarmAI Deployment Helper"
echo "=============================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes."
    echo ""
    git status --short
    echo ""
    read -p "Commit and push these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
    else
        echo "❌ Deployment cancelled. Please commit your changes first."
        exit 1
    fi
fi

# Check current branch
current_branch=$(git branch --show-current)
echo "📍 Current branch: $current_branch"

if [ "$current_branch" != "main" ]; then
    echo "⚠️  You are not on the main branch."
    read -p "Merge to main and deploy? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        git merge "$current_branch"
    else
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Push to GitHub (triggers Actions)
echo ""
echo "🚢 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📡 GitHub Actions will now:"
echo "   1. Run tests"
echo "   2. Build the Next.js app"
echo "   3. Deploy to Azure Static Web Apps"
echo ""
echo "🔗 Check deployment status:"
echo "   https://github.com/AustIlphukir/SwarmAI/actions"
echo ""
echo "🌐 Your site (after deployment):"
echo "   https://happy-pond-0cc717910.4.azurestaticapps.net"
echo ""