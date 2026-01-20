# Unit Tests - Men Store

هذا المجلد يحتوي على جميع اختبارات الوحدة (Unit Tests) للموقع.

## 📁 البنية

```
__tests__/
├── api/                    # اختبارات API Routes
│   ├── products/
│   │   ├── route.test.ts
│   │   └── [id]/route.test.ts
│   ├── categories/
│   │   └── route.test.ts
│   └── admin/
│       └── products/
│           └── route.test.ts
├── components/             # اختبارات Components
│   ├── ProductCard.test.tsx
│   ├── Button.test.tsx
│   ├── Navbar.test.tsx
│   └── CategoryGrid.test.tsx
├── contexts/               # اختبارات Contexts
│   └── CartContext.test.tsx
├── hooks/                  # اختبارات Hooks
│   └── useAdminAuth.test.ts
└── lib/                    # اختبارات Utilities
    ├── utils.test.ts
    └── admin-auth.test.ts
```

## 🚀 تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات في وضع Watch (يعيد التشغيل عند التغيير)
npm run test:watch

# تشغيل الاختبارات مع Coverage Report
npm run test:coverage

# تشغيل اختبار محدد
npm test -- ProductCard

# تشغيل اختبارات في ملف محدد
npm test -- __tests__/lib/utils.test.ts
```

## ✅ الاختبارات المتوفرة

### Components (4 ملفات)
- ✅ **ProductCard** - اختبار عرض المنتج، الأسعار، الأيقونات
- ✅ **Button** - اختبار الأزرار، الأحداث، الحالات
- ✅ **Navbar** - اختبار شريط التنقل والروابط
- ✅ **CategoryGrid** - اختبار عرض الفئات

### API Routes (4 ملفات)
- ✅ **GET /api/products** - جلب المنتجات، التصفية، معالجة الأخطاء
- ✅ **GET /api/products/[id]** - جلب منتج محدد، 404 errors
- ✅ **GET /api/categories** - جلب الفئات
- ✅ **POST /api/admin/products** - إنشاء منتج، التحقق من البيانات، المصادقة

### Contexts (1 ملف)
- ✅ **CartContext** - إضافة/حذف/تحديث المنتجات، حساب الإجمالي

### Hooks (1 ملف)
- ✅ **useAdminAuth** - التحقق من المصادقة، إعادة التوجيه

### Utilities (2 ملفات)
- ✅ **cn** - دمج class names
- ✅ **verifyAdminToken** - التحقق من token المسؤول

## 📊 Coverage

الهدف هو الوصول إلى:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

## 🔧 الإعداد

تم إعداد:
- ✅ Jest configuration (`jest.config.js`)
- ✅ Jest setup (`jest.setup.js`)
- ✅ Mock لـ Next.js router
- ✅ Mock لـ localStorage
- ✅ Mock لـ Prisma Client
- ✅ Polyfills لـ Request/Response

## 📝 كتابة اختبارات جديدة

### مثال: اختبار Component

```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/app/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### مثال: اختبار API Route

```typescript
import { GET } from '@/app/api/my-route/route'
import { prisma } from '@/app/lib/prisma'

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    model: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/my-route', () => {
  it('should return data', async () => {
    ;(prisma.model.findMany as jest.Mock).mockResolvedValue([])
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/my-route')
    const response = await GET(request)
    expect(response.status).toBe(200)
  })
})
```

## ⚠️ ملاحظات مهمة

1. **Mock Prisma**: جميع الاختبارات تستخدم Mock لـ Prisma Client
2. **Mock Next.js**: يتم Mock router و navigation
3. **Mock localStorage**: للاختبارات التي تحتاج localStorage
4. **Polyfills**: Request/Response متوفرة في jest.setup.js

## 🐛 استكشاف الأخطاء

إذا واجهت مشاكل:

1. **Request/Response not defined**: تأكد من أن jest.setup.js يتم تحميله
2. **Module not found**: تأكد من أن paths في jest.config.js صحيحة
3. **Prisma errors**: تأكد من Mock Prisma في كل اختبار

## 📚 الموارد

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)
