#!/bin/bash

# Script to setup admin user
# Usage: ./scripts/setup-admin.sh

echo "🔐 إعداد المسؤول..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ ملف .env.local غير موجود!"
    echo "📝 يرجى إنشاء ملف .env.local وإضافة:"
    echo "   ADMIN_EMAIL=admin@infinity.com"
    echo "   ADMIN_PASSWORD=A@123"
    echo "   JWT_SECRET=your-secret-key"
    exit 1
fi

# Run migration
echo "📦 إنشاء migration..."
npm run prisma:migrate

# Create admin
echo "👤 إنشاء المسؤول..."
npm run create-admin

echo "✅ تم إعداد المسؤول بنجاح!"
