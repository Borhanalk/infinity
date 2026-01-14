# إصلاح خطأ: "Unsupported provider: provider is not enabled"

## المشكلة:
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

هذا الخطأ يعني أن **Google provider غير مفعّل** في Supabase Dashboard.

---

## الحل خطوة بخطوة:

### الخطوة 1: فتح Supabase Dashboard

1. اذهب إلى: https://app.supabase.com/
2. سجّل الدخول إلى حسابك
3. اختر المشروع الخاص بك

### الخطوة 2: تفعيل Google Provider

1. من القائمة الجانبية، انقر على **Authentication**
2. انقر على **Providers** (أو **Auth Providers**)
3. ابحث عن **Google** في القائمة
4. انقر على **Toggle** أو **Enable** بجانب Google
5. ستظهر لك حقول لإدخال:
   - **Client ID (for OAuth)**
   - **Client Secret (for OAuth)**

### الخطوة 3: الحصول على Google OAuth Credentials

إذا لم يكن لديك Client ID و Client Secret من Google:

#### أ) إنشاء مشروع في Google Cloud Console:

1. اذهب إلى: https://console.cloud.google.com/
2. انقر على **Select a project** → **New Project**
3. أدخل اسم المشروع (مثلاً: "Men Store Auth")
4. انقر على **Create**

#### ب) تفعيل Google+ API:

1. من القائمة الجانبية، اذهب إلى **APIs & Services** → **Library**
2. ابحث عن **Google+ API** أو **Google Identity**
3. انقر على **Enable**

#### ج) إنشاء OAuth 2.0 Credentials:

1. اذهب إلى **APIs & Services** → **Credentials**
2. انقر على **Create Credentials** → **OAuth client ID**
3. إذا طُلب منك، أكمل **OAuth consent screen**:
   - اختر **External** (للتطوير)
   - أدخل **App name** (مثلاً: "Men Store")
   - أدخل **User support email**
   - أدخل **Developer contact email**
   - انقر على **Save and Continue**
   - في **Scopes**، انقر على **Save and Continue**
   - في **Test users**، انقر على **Save and Continue**
   - في **Summary**، انقر على **Back to Dashboard**

4. الآن أنشئ **OAuth client ID**:
   - **Application type**: اختر **Web application**
   - **Name**: أدخل أي اسم (مثلاً: "Men Store Web")
   - **Authorized redirect URIs**: أضف:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (استبدل `YOUR_PROJECT_REF` بمعرف مشروع Supabase - تجده في Supabase Dashboard → Settings → API → Project URL)
   - انقر على **Create**
   - **انسخ Client ID و Client Secret** (ستحتاجهما في الخطوة التالية)

### الخطوة 4: إدخال Credentials في Supabase

1. ارجع إلى Supabase Dashboard → Authentication → Providers → Google
2. الصق **Client ID** في حقل **Client ID (for OAuth)**
3. الصق **Client Secret** في حقل **Client Secret (for OAuth)**
4. انقر على **Save**

### الخطوة 5: إضافة Redirect URLs في Supabase

1. في Supabase Dashboard، اذهب إلى **Authentication** → **URL Configuration**
2. في قسم **Redirect URLs**، أضف:
   ```
   http://localhost:3002/auth/callback
   ```
   (للتطوير المحلي)
   
   وإذا كان لديك domain للإنتاج:
   ```
   https://yourdomain.com/auth/callback
   ```
3. انقر على **Save**

### الخطوة 6: التحقق من متغيرات البيئة

تأكد من وجود هذه المتغيرات في ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**كيف تجد هذه القيم:**
- في Supabase Dashboard → **Settings** → **API**
- **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key = `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### الخطوة 7: إعادة تشغيل السيرفر

```bash
# أوقف السيرفر (Ctrl+C)
npm run dev
```

### الخطوة 8: اختبار تسجيل الدخول

1. اذهب إلى: http://localhost:3002/auth/login
2. انقر على "تسجيل الدخول مع Google"
3. يجب أن يتم توجيهك إلى Google للموافقة
4. بعد الموافقة، سيتم توجيهك إلى الصفحة الرئيسية

---

## ملاحظات مهمة:

### ⚠️ Authorized redirect URI في Google Cloud Console:

يجب أن يكون بالضبط:
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

**لا تضيف:**
- `http://localhost:3002/auth/callback` (هذا يضاف في Supabase فقط)
- أي شيء آخر

### ⚠️ Redirect URLs في Supabase:

هذه هي URLs التي سيتم توجيه المستخدم إليها **بعد** تسجيل الدخول من Google:
```
http://localhost:3002/auth/callback
https://yourdomain.com/auth/callback
```

---

## إذا استمرت المشكلة:

### 1. تحقق من أن Google Provider مفعّل:

- في Supabase Dashboard → Authentication → Providers
- تأكد من أن **Google** يظهر كـ **Enabled** (أخضر)

### 2. تحقق من Client ID و Client Secret:

- تأكد من نسخهما بشكل صحيح (بدون مسافات إضافية)
- تأكد من أنهما من نفس المشروع في Google Cloud Console

### 3. تحقق من Redirect URI في Google Cloud Console:

- يجب أن يكون بالضبط: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- استبدل `YOUR_PROJECT_REF` بمعرف مشروعك من Supabase

### 4. تحقق من متغيرات البيئة:

- تأكد من أن `.env.local` موجود في جذر المشروع
- أعد تشغيل السيرفر بعد تغيير `.env.local`

### 5. افحص Console في المتصفح:

- افتح Developer Tools (F12)
- اذهب إلى Console
- ابحث عن أي أخطاء إضافية

---

## الدعم:

إذا استمرت المشكلة بعد اتباع جميع الخطوات:
1. تحقق من [Supabase Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
2. تحقق من [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
