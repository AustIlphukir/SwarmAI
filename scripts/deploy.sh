#!/bin/bash

# SwarmAI Deployment Script
# Deploys via GitHub Actions to Azure Web App

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

if [ "$current_branch" != "prod" ]; then
    echo "⚠️  You are not on the prod branch."
    read -p "Switch to prod and merge? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout prod
        git merge "$current_branch"
    else
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Push to GitHub
echo ""
echo "🚢 Pushing to prod branch..."
git push origin prod

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🚀 Triggering manual deployment workflow..."

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    # Simple, direct trigger of the desired workflow on prod
    REPO_SLUG="AustIlphukir/SwarmAI-Homepage"
    echo "🛠️  Using workflow: prod_swarm-ai-production.yml (ref: prod)"
    if gh workflow run "prod_swarm-ai-production.yml" --ref prod -R "$REPO_SLUG"; then
        echo "✅ Deployment workflow triggered!"
    else
        echo "❌ Failed to trigger workflow 'prod_swarm-ai-production.yml'."
        echo "   Ensure this workflow exists on the repository's default branch,"
        echo "   or trigger it manually from the Actions tab selecting branch 'prod'."
        exit 1
    fi
    echo ""
    echo "🔗 Check deployment status:"
    echo "   gh run watch"
    echo "   or visit: https://github.com/AustIlphukir/SwarmAI-Homepage/actions"
else
    echo "⚠️  GitHub CLI (gh) not installed."
    echo "   Install with: brew install gh"
    echo ""
    echo "📡 Manual trigger required:"
    echo "   Go to: https://github.com/AustIlphukir/SwarmAI-Homepage/actions/workflows/prod_swarm-ai-production.yml"
    echo "   Click: 'Run workflow' → Select 'prod' branch → 'Run workflow'"
fi

echo ""
echo "⏱️  Deployment typically takes 3-5 minutes"
echo ""