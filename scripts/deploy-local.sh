#!/bin/bash
set -e

echo "⚠️  Direct local deployment to Azure SWA with Next.js standalone builds"
echo "    is not fully supported by SWA CLI."
echo ""
echo "Recommended approaches:"
echo ""
echo "1. 🚀 Use GitHub Actions (recommended):"
echo "   git add . && git commit -m 'Deploy' && git push origin main"
echo "   → Triggers automatic Azure deployment"
echo ""
echo "2. 🔧 Use Azure CLI (requires Azure subscription access):"
echo "   az staticwebapp create ..."
echo ""
echo "3. 📦 Deploy via GitHub Actions manually:"
echo "   gh workflow run azure-static-web-apps-*.yml"
echo ""
read -p "Continue with GitHub push deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd /Users/LUKARGE/src/swarmai/sai-SwarmAI
  exec ./scripts/deploy.sh
else
  echo "Deployment cancelled."
  exit 0
fi