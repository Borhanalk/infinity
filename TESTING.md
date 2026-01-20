# دليل الاختبارات - Men Store

## نظرة عامة

تم إعداد نظام اختبار شامل للموقع باستخدام:
- **Jest** - إطار الاختبار
- **React Testing Library** - لاختبار Components
- **@testing-library/jest-dom** - Matchers إضافية

## 📦 الحزم المثبتة

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.1",
    "@testing-library/dom": "^10.4.0",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.4.6",
    "undici": "^7.18.2"
  }
}
```

## 🚀 الأوامر

```bash
# تشغيل جميع الاختبارات
npm test

# Watch mode (يعيد التشغيل عند التغيير)
npm run test:watch

# Coverage report
npm run test:coverage

# تشغيل اختبار محدد
npm test -- ProductCard

# تشغيل اختبارات في ملف محدد
npm test -- __tests__/lib/utils.test.ts
```

## 📁 هيكل الاختبارات

```
__tests__/
├── api/                    # API Routes Tests
│   ├── products/
│   ├── categories/
│   └── admin/
├── components/             # Component Tests
├── contexts/               # Context Tests
├── hooks/                  # Hook Tests
└── lib/                    # Utility Tests
```

## ✅ الاختبارات المتوفرة

### 1. Utilities
- ✅ `lib/utils.test.ts` - دالة `cn` (6 اختبارات)

### 2. Components
- ✅ `components/ProductCard.test.tsx` - بطاقة المنتج (8 اختبارات)
- ✅ `components/Button.test.tsx` - مكون Button (6 اختبارات)
- ✅ `components/Navbar.test.tsx` - شريط التنقل (5 اختبارات)
- ✅ `components/CategoryGrid.test.tsx` - شبكة الفئات (4 اختبارات)

### 3. Contexts
- ✅ `contexts/CartContext.test.tsx` - سياق السلة (6 اختبارات)

### 4. Hooks
- ✅ `hooks/useAdminAuth.test.ts` - hook المصادقة (4 اختبارات)

### 5. API Routes
- ✅ `api/products/route.test.ts` - GET /api/products (3 اختبارات)
- ✅ `api/products/[id]/route.test.ts` - GET /api/products/[id] (3 اختبارات)
- ✅ `api/categories/route.test.ts` - GET /api/categories (3 اختبارات)
- ✅ `api/admin/products/route.test.ts` - POST /api/admin/products (6 اختبارات)

### 6. Lib Functions
- ✅ `lib/admin-auth.test.ts` - verifyAdminToken (4 اختبارات)

**إجمالي**: ~49 اختبار في 12 ملف

## 📊 Coverage Goals

- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## 🔧 الإعدادات

### jest.config.js
- استخدام `next/jest` للإعداد التلقائي
- testEnvironment: `jest-environment-jsdom`
- moduleNameMapper للـ path aliases
- collectCoverageFrom للـ coverage

### jest.setup.js
- إعداد `@testing-library/jest-dom`
- Mock لـ Next.js router
- Mock لـ Next.js Image
- Polyfills لـ Request/Response
- Environment variables

## 📝 أمثلة

### اختبار Component

```typescript
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/app/components/ProductCard'

describe('ProductCard', () => {
  it('should render product name', () => {
    const product = { id: '1', name: 'Test', price: 99.99, ... }
    render(<ProductCard product={product} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### اختبار API Route

```typescript
import { GET } from '@/app/api/products/route'
import { prisma } from '@/app/lib/prisma'

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    product: { findMany: jest.fn() },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

describe('GET /api/products', () => {
  it('should return products', async () => {
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue([])
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    expect(response.status).toBe(200)
  })
})
```

## 🎯 أفضل الممارسات

1. **استخدم Mock للاتصالات الخارجية**: Database, API calls
2. **اختبر السلوك وليس التنفيذ**: ركز على ما يرى المستخدم
3. **استخدم queries مناسبة**: `getByRole`, `getByText`, إلخ
4. **نظف بعد كل اختبار**: `beforeEach`, `afterEach`
5. **اكتب اختبارات مستقلة**: لا تعتمد على ترتيب التنفيذ

## 🐛 استكشاف الأخطاء

### Request/Response not defined
- تأكد من تحميل jest.setup.js
- تحقق من polyfills في jest.setup.js

### Module not found
- تحقق من paths في jest.config.js
- تأكد من baseUrl في tsconfig.json

### Prisma errors
- تأكد من Mock Prisma في كل اختبار
- استخدم `jest.clearAllMocks()` في beforeEach

## 📚 الموارد

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

---

**آخر تحديث**: 2024
