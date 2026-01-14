# بدائل Supabase لقواعد البيانات

## الخيارات المتاحة:

### 1. **Neon** ⭐ (موصى به)
- **النوع:** PostgreSQL مستضافة
- **المميزات:**
  - ✅ مجاني للبداية (512MB)
  - ✅ سريع جداً
  - ✅ يدعم Serverless
  - ✅ واجهة بسيطة
  - ✅ نسخ احتياطي تلقائي
- **الرابط:** https://neon.tech
- **السعر:** مجاني حتى 512MB، ثم من $19/شهر

---

### 2. **PlanetScale** ⭐ (موصى به)
- **النوع:** MySQL مستضافة
- **المميزات:**
  - ✅ مجاني للبداية (5GB)
  - ✅ سريع جداً
  - ✅ Branching (مثل Git)
  - ✅ Scaling تلقائي
- **الرابط:** https://planetscale.com
- **السعر:** مجاني حتى 5GB، ثم من $29/شهر
- **ملاحظة:** يحتاج تغيير Schema من PostgreSQL إلى MySQL

---

### 3. **Railway**
- **النوع:** PostgreSQL مستضافة
- **المميزات:**
  - ✅ مجاني للبداية ($5 رصيد شهري)
  - ✅ سهل الإعداد
  - ✅ يدعم قواعد بيانات متعددة
- **الرابط:** https://railway.app
- **السعر:** $5 رصيد مجاني شهري، ثم حسب الاستخدام

---

### 4. **Vercel Postgres**
- **النوع:** PostgreSQL مستضافة
- **المميزات:**
  - ✅ متكامل مع Vercel (إذا كنت تستخدم Vercel للنشر)
  - ✅ سهل الإعداد
  - ✅ مجاني للبداية
- **الرابط:** https://vercel.com/storage/postgres
- **السعر:** مجاني حتى 256MB، ثم من $20/شهر

---

### 5. **Render**
- **النوع:** PostgreSQL مستضافة
- **المميزات:**
  - ✅ مجاني للبداية (90 يوم)
  - ✅ سهل الإعداد
  - ✅ يدعم قواعد بيانات متعددة
- **الرابط:** https://render.com
- **السعر:** مجاني 90 يوم، ثم من $7/شهر

---

### 6. **Supabase** (الخيار الأصلي)
- **النوع:** PostgreSQL مستضافة
- **المميزات:**
  - ✅ مجاني للبداية (500MB)
  - ✅ Storage مدمج (لرفع الصور)
  - ✅ Authentication مدمج
  - ✅ Realtime مدمج
- **الرابط:** https://supabase.com
- **السعر:** مجاني حتى 500MB، ثم من $25/شهر

---

### 7. **Turso** (SQLite في السحابة)
- **النوع:** SQLite مستضافة
- **المميزات:**
  - ✅ مجاني للبداية (500 databases)
  - ✅ سريع جداً
  - ✅ مناسب للـ Serverless
- **الرابط:** https://turso.tech
- **السعر:** مجاني حتى 500 databases، ثم من $29/شهر
- **ملاحظة:** يحتاج تغيير Schema من PostgreSQL إلى SQLite

---

## التوصيات حسب الحالة:

### إذا كنت تريد:
- **أسهل إعداد:** Neon أو Railway
- **أكبر مساحة مجانية:** PlanetScale (5GB)
- **ميزات إضافية (Storage, Auth):** Supabase
- **متكامل مع Vercel:** Vercel Postgres
- **SQLite في السحابة:** Turso

---

## كيف تستخدم أي منها؟

جميعها تعمل بنفس الطريقة:

1. **أنشئ حساب**
2. **أنشئ قاعدة بيانات جديدة**
3. **انسخ Connection String**
4. **حدّث `.env`:**
   ```env
   DATABASE_URL="postgresql://..."
   ```

5. **عدّل `prisma/schema.prisma` (إذا لزم):**
   - لـ PostgreSQL: `provider = "postgresql"`
   - لـ MySQL: `provider = "mysql"`
   - لـ SQLite: `provider = "sqlite"`

6. **شغّل:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## الخلاصة:

**أفضل خيارات مجانية:**
1. **Neon** - PostgreSQL سريع وسهل
2. **PlanetScale** - أكبر مساحة مجانية (5GB)
3. **Supabase** - إذا كنت تحتاج Storage و Auth

**التوصية:** جرب **Neon** - سريع وسهل ومجاني!
