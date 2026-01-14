# إعداد تسجيل الدخول مع Google في Supabase

## الخطوات المطلوبة:

### 1. إعداد Google OAuth في Google Cloud Console:

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. اذهب إلى **APIs & Services** → **Credentials**
4. انقر على **Create Credentials** → **OAuth client ID**
5. اختر **Web application**
6. أضف **Authorized redirect URIs**:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   (استبدل `YOUR_PROJECT_REF` بمعرف مشروع Supabase الخاص بك)
7. انسخ **Client ID** و **Client Secret**

### 2. إعداد Google Provider في Supabase:

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com/)
2. اختر مشروعك
3. اذهب إلى **Authentication** → **Providers**
4. ابحث عن **Google** وانقر على **Enable**
5. أدخل:
   - **Client ID** (من Google Cloud Console)
   - **Client Secret** (من Google Cloud Console)
6. احفظ التغييرات

### 3. إضافة Redirect URL في Supabase:

1. في Supabase Dashboard، اذهب إلى **Authentication** → **URL Configuration**
2. أضف **Redirect URLs**:
   ```
   http://localhost:3002/auth/callback
   https://yourdomain.com/auth/callback
   ```

### 4. التحقق من متغيرات البيئة:

تأكد من وجود هذه المتغيرات في ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. اختبار تسجيل الدخول:

1. شغّل المشروع:
   ```bash
   npm run dev
   ```

2. اذهب إلى `/auth/login`
3. انقر على "تسجيل الدخول مع Google"
4. يجب أن يتم توجيهك إلى Google للموافقة
5. بعد الموافقة، سيتم توجيهك إلى الصفحة الرئيسية

## الملفات المُنشأة:

- `app/contexts/AuthContext.tsx` - Context لإدارة حالة المستخدم
- `app/auth/login/page.tsx` - صفحة تسجيل الدخول
- `app/auth/callback/route.ts` - Route للتعامل مع callback من Google
- `app/components/Navbar.tsx` - تم تحديثه لإضافة زر تسجيل الدخول

## ملاحظات:

- تأكد من أن Redirect URL في Google Cloud Console يطابق URL في Supabase
- في الإنتاج، استخدم HTTPS لجميع URLs
- تأكد من إضافة جميع Domains المطلوبة في Supabase URL Configuration
