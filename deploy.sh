#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Azure Static Web Apps Deployment"
echo "===================================="
echo ""
echo "ℹ️  For Next.js apps, Azure Static Web Apps deployment works best via GitHub Actions."
echo ""

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo "❌ .env file not found"
  exit 1
fi

echo "Current configuration:"
echo "  • Repository: https://github.com/AustIlphukir/SwarmAI"
echo "  • Branch: main"
echo "  • Deployment: Automatic on push to main"
echo ""

# Check git status
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  You have uncommitted changes:"
  git status --short
  echo ""
  read -p "Commit and push now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    read -p "Commit message: " commit_msg
    git commit -m "${commit_msg:-Update}"
    git push origin $(git branch --show-current)
    echo ""
    echo "✅ Pushed to GitHub!"
  else
    echo "❌ Deployment cancelled - commit your changes first"
    exit 0
  fi
else
  echo "✅ No uncommitted changes"
  echo ""
  read -p "Push current branch to trigger deployment? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
      echo "⚠️  You're on branch '$current_branch', not 'main'"
      read -p "Merge to main and push? (y/n) " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        git pull origin main
        git merge "$current_branch" -m "Merge $current_branch"
        git push origin main
        echo ""
        echo "✅ Merged and pushed to main!"
      else
        echo "Push to $current_branch anyway? (won't trigger Azure deployment)"
        read -p "(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          git push origin "$current_branch"
        fi
      fi
    else
      git push origin main
      echo ""
      echo "✅ Pushed to main!"
    fi
  fi
fi

echo ""
echo "📊 Check deployment status:"
echo "   • GitHub Actions: https://github.com/AustIlphukir/SwarmAI/actions"
echo "   • Azure Portal: https://portal.azure.com"
echo ""
echo "⏱️  Deployment typically takes 5-10 minutes"
