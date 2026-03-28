#!/bin/bash
# ── NyayaMitra GitHub Push Script ─────────────────────
# Replace [YOUR_GITHUB_URL] with your actual repo link

echo "🚀 Initializing NyayaMitra Repositories..."

# 1. Push Backend
cd d:/NYAYAMITRA/backend
git init
git add .
git commit -m "feat: Initial backend commit for Render deployment"
# git remote add origin [YOUR_BACKEND_REPO_URL]
# git push -u origin main

# 2. Push Frontend
cd d:/NYAYAMITRA/frontend
git init
git add .
git commit -m "feat: Initial frontend commit for Netlify deployment"
# git remote add origin [YOUR_FRONTEND_REPO_URL]
# git push -u origin main

# 3. Push Mobile (Flutter)
cd d:/NYAYAMITRA/mobile_flutter
git init
git add .
git commit -m "feat: Initial flutter app commit"
# git remote add origin [YOUR_MOBILE_REPO_URL]
# git push -u origin main

echo "✅ All repos initialized and committed locally!"
echo "👉 Now, create 3 repos on GitHub and run the 'git remote add origin' and 'git push' commands for each."
