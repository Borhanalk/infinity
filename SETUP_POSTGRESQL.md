# إعداد PostgreSQL مع Prisma

## الخطوات:

### 1. اختر خدمة استضافة PostgreSQL:

**الخيارات المجانية:**

#### أ) Neon (موصى به) ⭐
- **الرابط:** https://neon.tech
- **المميزات:**
  - مجاني 512MB
  - Serverless PostgreSQL
  - سريع جداً
  - مناسب لـ Next.js

**كيفية الإعداد:**
1. أنشئ حساب في https://neon.tech
2. أنشئ مشروع جديد (New Project)
3. اختر اسم المشروع والمنطقة
4. بعد الإنشاء، انسخ **Connection String**
5. أضفه إلى `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

#### ب) Supabase
- **الرابط:** https://supabase.com
- **المميزات:**
  - مجاني 500MB
  - يتضمن Storage للصور
  - واجهة إدارة جيدة

**كيفية الإعداد:**
1. أنشئ حساب في https://supabase.com
2. أنشئ مشروع جديد
3. اذهب إلى Settings → Database
4. انسخ **Connection String** (استخدم Direct connection)
5. أضفه إلى `.env`

#### ج) Railway
- **الرابط:** https://railway.app
- **المميزات:**
  - $5 رصيد شهري مجاني
  - سهل الإعداد

#### د) Render
- **الرابط:** https://render.com
- **المميزات:**
  - 90 يوم تجريبي مجاني
  - PostgreSQL مستضافة

---

### 2. بعد الحصول على Connection String:

**أضف إلى ملف `.env`:**
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**ملاحظات مهمة:**
- إذا كانت كلمة المرور تحتوي على رموز خاصة، شفّرها:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`

---

### 3. أنشئ الجداول:

```bash
npx prisma generate
npx prisma db push
```

---

### 4. أعد تشغيل السيرفر:

```bash
npm run dev
```

---

## التوصية:

**استخدم Neon** - أسهل وأسرع للبداية:
1. سجّل في https://neon.tech
2. أنشئ مشروع
3. انسخ Connection String
4. أضفه إلى `.env`
5. شغّل `npx prisma db push`

---

## إذا واجهت مشاكل:

- تأكد من أن Connection String صحيح
- تأكد من تشفير الرموز الخاصة في كلمة المرور
- تأكد من إضافة `?sslmode=require` في نهاية الـ URL
