# خيارات تخزين الصور (بدلاً من Supabase)

## الوضع الحالي:
- **Neon:** قاعدة بيانات PostgreSQL ✅ (تم التحويل)
- **Supabase:** Storage للصور فقط ❌ (المشروع غير موجود)

## الخيارات المتاحة:

### الخيار 1: استخدام Supabase فقط للـ Storage (موصى به) ⭐

**المميزات:**
- مجاني 1GB Storage
- سريع وموثوق
- سهل الإعداد
- مناسب للإنتاج

**كيفية الإعداد:**
1. أنشئ مشروع جديد في https://supabase.com
2. Settings → API → انسخ URL و service_role key
3. Storage → Create bucket → أنشئ:
   - `categories` (public)
   - `products` (public)
4. حدّث `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

**لا تحتاج قاعدة بيانات من Supabase** - فقط Storage!

---

### الخيار 2: رفع الصور محلياً (للتطوير فقط)

**المميزات:**
- مجاني تماماً
- لا يحتاج خدمات خارجية
- سريع للتطوير

**العيوب:**
- ❌ لا يعمل مع Serverless (Vercel, Netlify)
- ❌ غير مناسب للإنتاج
- ❌ الملفات تُحذف عند إعادة النشر

---

### الخيار 3: Cloudinary (موصى به للإنتاج) ⭐

**المميزات:**
- مجاني 25GB Storage
- تحسين تلقائي للصور
- CDN سريع
- مناسب للإنتاج

**الرابط:** https://cloudinary.com

---

### الخيار 4: Vercel Blob Storage (إذا كنت تستخدم Vercel)

**المميزات:**
- متكامل مع Vercel
- مجاني للبداية
- سهل الإعداد

---

## التوصية:

**للإنتاج:** استخدم **Supabase Storage** فقط (بدون قاعدة بيانات)
- مجاني 1GB
- سريع وموثوق
- سهل الإعداد

**للتطوير:** يمكنك استخدام رفع محلي مؤقت

---

## ملخص:

- ✅ **Neon:** قاعدة بيانات (تم التحويل)
- ✅ **Supabase:** Storage فقط (أنشئ مشروع جديد)
- ❌ **لا تحتاج قاعدة بيانات من Supabase** - فقط Storage!
