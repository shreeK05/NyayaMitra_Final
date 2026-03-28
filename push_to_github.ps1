# ── NyayaMitra GitHub Push Script (PowerShell Version) ──
# This script initializes local git repositories for Backend, Frontend, and Flutter.

Write-Host "🚀 Initializing NyayaMitra Repositories..." -ForegroundColor Cyan

# Define base path
$basePath = "d:\NYAYAMITRA"

# 1. Push Backend
Write-Host "`n📁 Initializing Backend..." -ForegroundColor Yellow
cd "$basePath\backend"
git init
git add .
git commit -m "feat: Initial backend commit for Render deployment"

# 2. Push Frontend
Write-Host "`n📁 Initializing Frontend..." -ForegroundColor Yellow
cd "$basePath\frontend"
git init
git add .
git commit -m "feat: Initial frontend commit for Netlify deployment"

# 3. Push Mobile (Flutter)
Write-Host "`n📁 Initializing Flutter App..." -ForegroundColor Yellow
cd "$basePath\mobile_flutter"
git init
git add .
git commit -m "feat: Initial flutter app commit"

Write-Host "`n✅ All repositories initialized and committed locally!" -ForegroundColor Green
Write-Host "`n👉 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Go to GitHub and create 3 new repositories."
Write-Host "2. Copy the 'git remote add origin' and 'git push' commands for each folder."
Write-Host "3. Run them individually in the Backend, Frontend, and Mobile_Flutter folders."
