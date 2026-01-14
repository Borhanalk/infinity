# إصلاح مشكلة قاعدة البيانات

## المشكلة الحالية:
المشروع في Supabase غير موجود أو معطل. الخطأ "Tenant or user not found" يعني أن المشروع تم حذفه أو تعطيله.

## الحلول المتاحة:

### الحل 1: استخدام SQLite محلي (موصى به للتطوير) ⭐

هذا الحل أسهل وأسرع ولا يحتاج إعدادات معقدة:

1. **عدّل ملف `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **شغّل:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **حدّث `.env`:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

### الحل 2: إنشاء مشروع جديد في Supabase

1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ حساب جديد أو سجّل الدخول
3. أنشئ مشروع جديد
4. اذهب إلى Settings → Database
5. انسخ Connection string
6. حدّث `DATABASE_URL` في `.env`

### الحل 3: استخدام قاعدة بيانات محلية PostgreSQL

إذا كان لديك PostgreSQL مثبت محلياً:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/menstore"
```

---

## التوصية:
استخدم **SQLite** للتطوير لأنه:
- ✅ لا يحتاج إعدادات
- ✅ يعمل فوراً
- ✅ مناسب للتطوير والاختبار
- ⚠️ غير مناسب للإنتاج (استخدم PostgreSQL في الإنتاج)
