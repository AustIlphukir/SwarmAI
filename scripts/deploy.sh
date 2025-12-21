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
    # Trigger a workflow that exists on the default branch
    REPO_SLUG=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
    if [ -z "$REPO_SLUG" ]; then
        echo "❌ Could not determine repository slug for gh CLI."
        echo "   Ensure 'gh auth login' completed successfully."
        exit 1
    fi

    echo "📡 Checking available workflows on default branch for $REPO_SLUG..."
    DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name -R "$REPO_SLUG" 2>/dev/null || echo "")
    if [ -z "$DEFAULT_BRANCH" ]; then
        echo "❌ Could not determine default branch."
        exit 1
    fi

    if gh workflow list -R "$REPO_SLUG" | grep -q "azure-web-app-deploy"; then
        echo "🛠️  Using workflow: azure-web-app-deploy.yml"
        gh workflow run azure-web-app-deploy.yml --ref prod -R "$REPO_SLUG"
    elif gh workflow list -R "$REPO_SLUG" | grep -q "prod_swarm-ai-production"; then
        echo "🛠️  Using workflow: prod_swarm-ai-production.yml"
        gh workflow run prod_swarm-ai-production.yml --ref prod -R "$REPO_SLUG"
    else
        echo "⚠️  No matching workflow found on the default branch ('$DEFAULT_BRANCH')."
        echo "   Desired branch for deployment is 'prod'."
        if [ "${SWITCH_DEFAULT_BRANCH_FOR_DEPLOY:-0}" = "1" ]; then
            echo "🔄 Temporarily switching default branch to 'prod' to allow dispatch..."
            echo "   (original default: $DEFAULT_BRANCH)"
            gh repo edit -R "$REPO_SLUG" --default-branch prod
            echo "🛠️  Using workflow: prod_swarm-ai-production.yml"
            gh workflow run prod_swarm-ai-production.yml --ref prod -R "$REPO_SLUG"
            echo "↩️  Restoring default branch to '$DEFAULT_BRANCH'..."
            gh repo edit -R "$REPO_SLUG" --default-branch "$DEFAULT_BRANCH"
        else
            echo "❌ Cannot dispatch: GitHub only allows triggering workflows present on the default branch."
            echo "   Options:"
            echo "   1) Merge the workflow YAML into '$DEFAULT_BRANCH' (recommended)"
            echo "   2) Re-run this script with default-branch switch enabled:"
            echo "      SWITCH_DEFAULT_BRANCH_FOR_DEPLOY=1 ./scripts/deploy.sh"
            exit 1
        fi
    fi
    echo "✅ Deployment workflow triggered!"
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