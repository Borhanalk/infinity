# PowerShell script to setup admin user
# Usage: .\scripts\setup-admin.ps1

Write-Host "🔐 إعداد المسؤول..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "❌ ملف .env.local غير موجود!" -ForegroundColor Red
    Write-Host "📝 يرجى إنشاء ملف .env.local وإضافة:" -ForegroundColor Yellow
    Write-Host "   ADMIN_EMAIL=admin@infinity.com"
    Write-Host "   ADMIN_PASSWORD=A@123"
    Write-Host "   JWT_SECRET=your-secret-key"
    exit 1
}

# Run migration
Write-Host "📦 إنشاء migration..." -ForegroundColor Cyan
npm run prisma:migrate

# Create admin
Write-Host "👤 إنشاء المسؤول..." -ForegroundColor Cyan
npm run create-admin

Write-Host "✅ تم إعداد المسؤول بنجاح!" -ForegroundColor Green
