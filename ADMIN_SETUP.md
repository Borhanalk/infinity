# إعداد المسؤول (Admin Setup)

## الخطوات المطلوبة:

### 1. إضافة متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع وأضف:

```env
ADMIN_EMAIL=admin@infinity.com
ADMIN_PASSWORD=A@123
JWT_SECRET=your-secret-jwt-key-change-in-production-min-32-characters
```

⚠️ **مهم جداً:**
- لا تضع هذه المعلومات في الكود
- لا تشارك ملف `.env.local` مع أي شخص
- استخدم `JWT_SECRET` قوي (32 حرف على الأقل)
- في الإنتاج، استخدم متغيرات بيئة آمنة

### 2. إنشاء Migration

```bash
npm run prisma:migrate
```

أو إذا كنت تستخدم `db push`:

```bash
npm run db:push
```

### 3. إنشاء المسؤول

```bash
npm run create-admin
```

هذا الأمر سيقوم بـ:
- ✅ حذف جميع المسؤولين السابقين
- ✅ إنشاء مسؤول جديد بالبريد الإلكتروني وكلمة المرور المحددة
- ✅ تشفير كلمة المرور باستخدام bcrypt

### 4. التحقق من إنشاء المسؤول

يمكنك التحقق من خلال:

```bash
npm run prisma:studio
```

ثم افتح جدول `Admin` للتحقق من البيانات.

---

## الأمان:

### ✅ ما تم تطبيقه:

1. **تشفير كلمات المرور:** استخدام bcrypt مع 12 salt rounds
2. **JWT Tokens:** للتحقق من المسؤولين
3. **حماية المعلومات:** جميع البيانات الحساسة في `.env.local`
4. **عدم عرض كلمات المرور:** لا يتم إرجاع كلمات المرور في أي API response

### ⚠️ نصائح أمنية:

1. استخدم كلمة مرور قوية في الإنتاج
2. غيّر `JWT_SECRET` في الإنتاج
3. لا تضع `.env.local` في Git (يجب أن يكون في `.gitignore`)
4. استخدم HTTPS في الإنتاج
5. راجع صلاحيات قاعدة البيانات بانتظام

---

## استخدام API:

### تسجيل الدخول:

```bash
POST /api/admin/auth
Content-Type: application/json

{
  "email": "admin@infinity.com",
  "password": "A@123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "admin": {
    "id": "uuid",
    "email": "admin@infinity.com"
  }
}
```

### استخدام Token:

أضف Token في Header:

```
Authorization: Bearer <your-jwt-token>
```

---

## ملاحظات:

- كلمة المرور **مشفرة** في قاعدة البيانات ولا يمكن استرجاعها
- إذا نسيت كلمة المرور، يجب إنشاء مسؤول جديد
- يمكنك تعديل `scripts/create-admin.ts` لإضافة مسؤولين إضافيين
