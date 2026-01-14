# إعداد قاعدة البيانات

## المشكلة الحالية
الخطأ "Tenant or user not found" يعني أن قاعدة البيانات غير متصلة أو بيانات الاتصال غير صحيحة.

## الحلول:

### 1. التحقق من Supabase

1. افتح [Supabase Dashboard](https://app.supabase.com)
2. تأكد من أن المشروع نشط
3. اذهب إلى **Settings** → **Database**
4. انسخ **Connection string** من قسم **Connection string** (استخدم **Connection pooling** أو **Direct connection**)

### 2. تحديث ملف `.env`

استبدل `DATABASE_URL` في ملف `.env` بالـ Connection string الصحيح من Supabase.

**مثال:**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres"
```

**ملاحظات مهمة:**
- استبدل `[YOUR-PASSWORD]` بكلمة المرور الفعلية
- إذا كانت كلمة المرور تحتوي على رموز خاصة (مثل `@`, `#`, `%`)، يجب تشفيرها:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`

### 3. إنشاء الجداول

بعد تحديث `DATABASE_URL`، شغّل:

```bash
npx prisma db push
```

أو:

```bash
npx prisma migrate dev --name init
```

### 4. إعادة تشغيل السيرفر

```bash
npm run dev
```

---

## إذا لم يكن لديك قاعدة بيانات:

### خيار 1: إنشاء مشروع جديد في Supabase

1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ حساب جديد أو سجّل الدخول
3. أنشئ مشروع جديد
4. انسخ Connection string
5. أضفه إلى `.env`

### خيار 2: استخدام قاعدة بيانات محلية

1. ثبت PostgreSQL محلياً
2. أنشئ قاعدة بيانات جديدة
3. استخدم:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/menstore"
```

---

## التحقق من الاتصال

بعد إعداد قاعدة البيانات، اختبر الاتصال:

```bash
npx prisma db pull
```

إذا نجح الأمر، يعني أن الاتصال يعمل!
