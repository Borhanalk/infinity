# إصلاح مشاكل Supabase

## المشكلة:
الاتصال بقاعدة البيانات قد يفشل بسبب:
1. استخدام Pooler connection (port 6543)
2. كلمة المرور تحتوي على `@`

## الحلول:

### الحل 1: استخدام Direct Connection (موصى به)

بدلاً من:
```
postgresql://...@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

استخدم:
```
postgresql://...@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**الفرق:** Port 5432 بدلاً من 6543

### الحل 2: الحصول على Connection String الصحيح من Supabase

1. اذهب إلى Supabase Dashboard
2. Settings → Database
3. Connection string → **URI** (وليس Session mode)
4. انسخ الرابط الكامل
5. تأكد من تشفير `@` في كلمة المرور إلى `%40`

### الحل 3: التحقق من Service Role Key

تأكد من أن `SUPABASE_SERVICE_ROLE_KEY` في `.env` صحيح:
- Settings → API → service_role key (Secret key)

---

## بعد التحديث:

```bash
npx prisma generate
npx prisma db push
```

---

## إذا استمرت المشكلة:

1. تأكد من أن المشروع في Supabase نشط
2. تأكد من أن كلمة المرور صحيحة
3. جرب Direct connection (port 5432)
