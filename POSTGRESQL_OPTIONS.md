# خيارات استضافة PostgreSQL

## البدائل المتاحة:

### 1. Supabase (موصى به) ⭐
- **المميزات:**
  - مجاني للبداية (500MB)
  - سهل الإعداد
  - يتضمن Storage للصور
  - واجهة إدارة جيدة
- **الرابط:** https://supabase.com

### 2. Neon (موصى به) ⭐
- **المميزات:**
  - مجاني للبداية (512MB)
  - سريع جداً
  - Serverless PostgreSQL
  - مناسب لـ Next.js
- **الرابط:** https://neon.tech

### 3. Railway
- **المميزات:**
  - مجاني للبداية ($5 رصيد شهري)
  - سهل النشر
  - يدعم PostgreSQL و MySQL
- **الرابط:** https://railway.app

### 4. Render
- **المميزات:**
  - مجاني للبداية (90 يوم تجريبي)
  - PostgreSQL مستضافة
  - سهل الإعداد
- **الرابط:** https://render.com

### 5. Vercel Postgres (إذا كنت تستخدم Vercel للنشر)
- **المميزات:**
  - متكامل مع Vercel
  - مجاني للبداية
  - سهل الإعداد
- **الرابط:** https://vercel.com/storage/postgres

### 6. PlanetScale (MySQL - ليس PostgreSQL)
- **المميزات:**
  - مجاني للبداية
  - سريع جداً
  - لكنه MySQL وليس PostgreSQL
- **الرابط:** https://planetscale.com

---

## التوصية:

**للبداية:** استخدم **Neon** أو **Supabase**
- كلاهما مجاني
- سهل الإعداد
- يعمل مع Prisma بشكل ممتاز

---

## كيفية الإعداد:

### مع Neon:
1. أنشئ حساب في https://neon.tech
2. أنشئ مشروع جديد
3. انسخ Connection String
4. أضفه إلى `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/database"
   ```

### مع Supabase:
1. أنشئ حساب في https://supabase.com
2. أنشئ مشروع جديد
3. Settings → Database → Connection String
4. أضفه إلى `.env`

---

## بعد الحصول على Connection String:

1. **عدّل `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **شغّل:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **أعد تشغيل السيرفر**
