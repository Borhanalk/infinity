# 📋 هيكل الموقع الكامل - Men Store

## 🗂️ قاعدة البيانات (Database Schema)

### Models في Prisma:

#### 1. **Category** (الفئات)
```prisma
- id: Int (Auto-increment)
- name: String
- imageUrl: String? (اختياري)
- createdAt: DateTime
- products: Product[] (علاقة)
```

#### 2. **Product** (المنتجات)
```prisma
- id: String (UUID)
- name: String
- price: Float
- description: String
- categoryId: Int (مرجع للفئة)
- createdAt: DateTime
- isNew: Boolean (منتج جديد)
- isOnSale: Boolean (في عرض)
- discountPercent: Int? (نسبة الخصم 0-100)
- originalPrice: Float? (السعر الأصلي قبل الخصم)
- images: ProductImage[]
- colors: ProductColor[]
- sizes: ProductSize[]
```

#### 3. **ProductImage** (صور المنتج)
```prisma
- id: String (UUID)
- url: String
- productId: String
```

#### 4. **ProductColor** (ألوان المنتج)
```prisma
- id: String (UUID)
- name: String
- hex: String (كود اللون)
- productId: String
```

#### 5. **ProductSize** (مقاسات المنتج)
```prisma
- id: String (UUID)
- size: String
- quantity: Int (الكمية المتوفرة)
- productId: String
```

#### 6. **Campaign** (الحملات/الخصومات)
```prisma
- id: String (UUID)
- title: String
- description: String?
- discountPercent: Int? (نسبة الخصم)
- discountAmount: Float? (مبلغ الخصم الثابت)
- isActive: Boolean
- showOnHomepage: Boolean (عرض في الصفحة الرئيسية)
- startDate: DateTime?
- endDate: DateTime?
- createdAt: DateTime
- updatedAt: DateTime
- products: CampaignProduct[]
```

#### 7. **CampaignProduct** (منتجات الحملة)
```prisma
- id: String (UUID)
- campaignId: String
- productId: String
```

---

## 🌐 الصفحات العامة (Public Pages)

### 1. **الصفحة الرئيسية** `/`
- **الملف**: `app/page.tsx`
- **المكونات المستخدمة**:
  - `AnnouncementBar` - شريط الإعلانات
  - `Hero` - قسم البطل
  - `MarqueeSection` - شريط العروض المتحرك
  - `CategoryGrid` - شبكة الفئات
  - `ProductCard` - بطاقة المنتج
- **البيانات**: يعرض المنتجات الجديدة من `lib/data.ts`

### 2. **صفحة المنتجات** `/products`
- **الملف**: `app/products/page.tsx`
- **الوظيفة**: عرض جميع المنتجات مع إمكانية التصفية حسب الفئة
- **API**: `GET /api/products`

### 3. **صفحة تفاصيل المنتج** `/products/[id]`
- **الملف**: `app/products/[id]/page.tsx`
- **الوظيفة**: عرض تفاصيل منتج معين
- **API**: `GET /api/products/[id]`

### 4. **صفحة الفئة** `/categories/[slug]`
- **الملف**: `app/categories/[slug]/page.tsx`
- **الوظيفة**: عرض منتجات فئة معينة

### 5. **صفحة السلة** `/cart`
- **الملف**: `app/cart/page.tsx`
- **الوظيفة**: عرض المنتجات في السلة
- **Context**: `CartContext`

### 6. **صفحة العروض** `/sale`
- **الملف**: `app/sale/page.tsx`
- **الوظيفة**: عرض المنتجات في العروض

### 7. **صفحة العروض (بديل)** `/sales`
- **الملف**: `app/sales/page.tsx`
- **الوظيفة**: عرض المنتجات المخفضة

### 8. **صفحة المجموعات الجديدة** `/collections/new`
- **الملف**: `app/collections/new/page.tsx`
- **الوظيفة**: عرض المنتجات الجديدة

---

## 🔐 صفحات الإدارة (Admin Pages)

### 1. **لوحة التحكم** `/admin`
- **الملف**: `app/admin/page.tsx`
- **الوظيفة**: عرض إحصائيات المتجر
- **API**: `GET /api/admin/stats`
- **يعرض**:
  - عدد المنتجات
  - عدد الفئات
  - آخر المنتجات المضافة

### 2. **قائمة المنتجات** `/admin/products`
- **الملف**: `app/admin/products/page.tsx`
- **الوظيفة**: عرض جميع المنتجات مع إمكانية التعديل والحذف
- **API**: `GET /api/admin/products`

### 3. **إضافة منتج** `/admin/products/add`
- **الملف**: `app/admin/products/add/page.tsx`
- **الوظيفة**: إضافة منتج جديد
- **API**: `POST /api/admin/products`

### 4. **تعديل منتج** `/admin/products/[id]/edit`
- **الملف**: `app/admin/products/[id]/edit/page.tsx`
- **الوظيفة**: تعديل منتج موجود
- **API**: 
  - `GET /api/admin/products/[id]`
  - `PUT /api/admin/products/[id]`
  - `DELETE /api/admin/products/[id]/images/[imageId]`

### 5. **قائمة الفئات** `/admin/categories`
- **الملف**: `app/admin/categories/page.tsx`
- **الوظيفة**: عرض جميع الفئات
- **API**: `GET /api/admin/categories`

### 6. **إضافة فئة** `/admin/categories/add`
- **الملف**: `app/admin/categories/add/page.tsx`
- **الوظيفة**: إضافة فئة جديدة
- **API**: `POST /api/admin/categories`

### 7. **تعديل فئة** `/admin/categories/edit/[id]`
- **الملف**: `app/admin/categories/edit/[id]/page.tsx`
- **الوظيفة**: تعديل فئة موجودة
- **API**: 
  - `GET /api/admin/categories/[id]`
  - `PUT /api/admin/categories/[id]`
  - `DELETE /api/admin/categories/[id]`

### 8. **صورة الفئة** `/admin/categories/image/[id]`
- **الملف**: `app/admin/categories/image/[id]/page.tsx`
- **الوظيفة**: رفع/تعديل صورة الفئة
- **API**: `PUT /api/admin/categories/image/[id]`

### 9. **قائمة الحملات** `/admin/campaigns`
- **الملف**: `app/admin/campaigns/page.tsx`
- **الوظيفة**: عرض جميع الحملات/الخصومات
- **API**: `GET /api/admin/campaigns`

### 10. **إضافة حملة** `/admin/campaigns/add`
- **الملف**: `app/admin/campaigns/add/page.tsx`
- **الوظيفة**: إضافة حملة خصم جديدة
- **API**: `POST /api/admin/campaigns`

### 11. **تعديل حملة** `/admin/campaigns/[id]/edit`
- **الملف**: `app/admin/campaigns/[id]/edit/page.tsx`
- **الوظيفة**: تعديل حملة موجودة
- **API**: 
  - `GET /api/admin/campaigns/[id]`
  - `PUT /api/admin/campaigns/[id]`
  - `DELETE /api/admin/campaigns/[id]`

---

## 🔌 API Routes (Public)

### 1. **المنتجات**
- `GET /api/products` - جلب جميع المنتجات
- `GET /api/products/[id]` - جلب منتج معين

### 2. **الفئات**
- `GET /api/categories` - جلب جميع الفئات

### 3. **الحملات**
- `GET /api/campaigns` - جلب الحملات النشطة

### 4. **رفع الملفات**
- `POST /api/upload` - رفع صورة إلى Supabase

---

## 🔌 API Routes (Admin)

### 1. **إدارة المنتجات**
- `GET /api/admin/products` - جلب جميع المنتجات
- `POST /api/admin/products` - إضافة منتج جديد
- `GET /api/admin/products/[id]` - جلب منتج معين
- `PUT /api/admin/products/[id]` - تحديث منتج
- `DELETE /api/admin/products/[id]` - حذف منتج
- `GET /api/admin/products/list` - قائمة المنتجات (مبسطة)
- `DELETE /api/admin/products/[id]/images/[imageId]` - حذف صورة منتج

### 2. **إدارة الفئات**
- `GET /api/admin/categories` - جلب جميع الفئات
- `POST /api/admin/categories` - إضافة فئة جديدة
- `GET /api/admin/categories/[id]` - جلب فئة معينة
- `PUT /api/admin/categories/[id]` - تحديث فئة
- `DELETE /api/admin/categories/[id]` - حذف فئة
- `PUT /api/admin/categories/image/[id]` - تحديث صورة الفئة

### 3. **إدارة الحملات**
- `GET /api/admin/campaigns` - جلب جميع الحملات
- `POST /api/admin/campaigns` - إضافة حملة جديدة
- `GET /api/admin/campaigns/[id]` - جلب حملة معينة
- `PUT /api/admin/campaigns/[id]` - تحديث حملة
- `DELETE /api/admin/campaigns/[id]` - حذف حملة

### 4. **الإحصائيات**
- `GET /api/admin/stats` - إحصائيات المتجر

---

## 🧩 المكونات (Components)

### 1. **AnnouncementBar** - `app/components/AnnouncementBar.tsx`
- شريط الإعلانات في أعلى الصفحة
- يعرض الحملات النشطة

### 2. **Hero** - `app/components/Hero.tsx`
- قسم البطل في الصفحة الرئيسية

### 3. **CategoryGrid** - `app/components/CategoryGrid.tsx`
- شبكة عرض الفئات

### 4. **ProductCard** - `app/components/ProductCard.tsx`
- بطاقة عرض المنتج

### 5. **Navbar** - `app/components/Navbar.tsx`
- شريط التنقل الرئيسي

### 6. **FloatingCart** - `app/components/FloatingCart.tsx`
- زر السلة العائم

### 7. **FiltersBar** - `app/components/FiltersBar.tsx`
- شريط التصفية

### 8. **EventBar** - `app/components/EventBar.tsx`
- شريط الأحداث

### 9. **OccasionBanner** - `app/components/OccasionBanner.tsx`
- بانر المناسبات

### 10. **SectionTitle** - `app/components/SectionTitle.tsx`
- عنوان القسم

### 11. **Loader** - `app/components/Loader.tsx`
- مؤشر التحميل

### 12. **Toast** - `app/admin/components/Toast.tsx`
- إشعارات في لوحة الإدارة

---

## 📦 البيانات الافتراضية (Mock Data)

### الملف: `lib/data.ts`

#### الفئات (6 فئات):
1. Pants (بناطيل)
2. Shirts (قمصان)
3. Jackets (جاكيتات)
4. Suits (بدلات)
5. Accessories (إكسسوارات)
6. Shoes (أحذية)

#### المنتجات (8 منتجات):
1. Classic Denim Jeans - ₪120 (خصم 20%)
2. Linen Shirt Beige - ₪90
3. Black Leather Jacket - ₪350 (خصم 30%)
4. Formal Pants - ₪150
5. White Sneakers - ₪200 (خصم 29%)
6. Cotton T-Shirt - ₪60
7. Full Suit - ₪600 (خصم 33%)
8. Checkered Shirt - ₪110

---

## 🎨 التصميم والأنماط

### الملف: `app/globals.css`
- **الألوان**: أبيض، أسود، رمادي، ذهبي (#D4AF37)
- **الخطوط**: 
  - Playfair Display (عناوين)
  - Inter (نصوص)
  - Cormorant Garamond (عناوين بديلة)
- **الأنماط المخصصة**:
  - `.btn-gold` - زر ذهبي
  - `.btn-outline` - زر بحدود
  - `.product-card` - بطاقة منتج
  - `.badge-new` - شارة جديد
  - `.badge-sale` - شارة عرض
  - `.floating-bag` - سلة عائمة

---

## 🔧 الإعدادات والتكوين

### 1. **Prisma** - `prisma/schema.prisma`
- قاعدة البيانات: PostgreSQL
- Provider: Prisma Client

### 2. **Supabase** - `app/lib/supabase.ts`
- رفع الصور والتخزين

### 3. **Next.js Config** - `next.config.ts`
- إعدادات Next.js

### 4. **TypeScript** - `tsconfig.json`
- إعدادات TypeScript

### 5. **Tailwind CSS** - `postcss.config.mjs`
- إعدادات Tailwind CSS v4

---

## 📱 Contexts

### 1. **CartContext** - `app/contexts/CartContext.tsx`
- إدارة حالة السلة
- الوظائف:
  - `addToCart(product)`
  - `removeFromCart(productId)`
  - `clearCart()`
  - `getTotalPrice()`

---

## 🚀 الأوامر المتاحة

```bash
# تشغيل السيرفر
npm run dev          # على المنفذ 3002

# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start

# Prisma
npm run prisma:generate   # توليد Prisma Client
npm run prisma:migrate    # تشغيل migrations
npm run prisma:studio     # فتح Prisma Studio
npm run db:push           # دفع التغييرات للقاعدة

# Linting
npm run lint
```

---

## 📊 ملخص الصفحات

### الصفحات العامة: 8 صفحات
1. `/` - الصفحة الرئيسية
2. `/products` - قائمة المنتجات
3. `/products/[id]` - تفاصيل المنتج
4. `/categories/[slug]` - صفحة الفئة
5. `/cart` - السلة
6. `/sale` - العروض
7. `/sales` - العروض (بديل)
8. `/collections/new` - المجموعات الجديدة

### صفحات الإدارة: 11 صفحة
1. `/admin` - لوحة التحكم
2. `/admin/products` - قائمة المنتجات
3. `/admin/products/add` - إضافة منتج
4. `/admin/products/[id]/edit` - تعديل منتج
5. `/admin/categories` - قائمة الفئات
6. `/admin/categories/add` - إضافة فئة
7. `/admin/categories/edit/[id]` - تعديل فئة
8. `/admin/categories/image/[id]` - صورة الفئة
9. `/admin/campaigns` - قائمة الحملات
10. `/admin/campaigns/add` - إضافة حملة
11. `/admin/campaigns/[id]/edit` - تعديل حملة

### API Routes: 19 route
- Public: 4 routes
- Admin: 15 routes

### Components: 12 مكون
- Public: 11 مكون
- Admin: 1 مكون

---

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: PostgreSQL (يحتاج `DATABASE_URL` في `.env`)
2. **التخزين**: Supabase (لرفع الصور)
3. **المنفذ**: 3002
4. **اللغة**: العربية (RTL)
5. **التصميم**: أبيض/أسود/ذهبي
6. **البيانات الافتراضية**: موجودة في `lib/data.ts` كـ fallback

---

**آخر تحديث**: 2024
