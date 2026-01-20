import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

// دالة لتنظيف اسم الملف وإزالة الأحرف غير المسموحة
function sanitizeFileName(fileName: string): string {
  // استخراج الامتداد
  const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  // تنظيف الامتداد - إزالة أي أحرف غير مسموحة
  const cleanExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg';
  
  // استخراج اسم الملف بدون الامتداد
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  
  // استبدال الأرقام العربية بالأرقام الإنجليزية
  const arabicToEnglish: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  let processed = nameWithoutExt;
  // استبدال الأرقام العربية
  for (const [arabic, english] of Object.entries(arabicToEnglish)) {
    processed = processed.replace(new RegExp(arabic, 'g'), english);
  }
  
  // إزالة جميع الأحرف غير ASCII والأحرف الخاصة
  let sanitized = processed
    .normalize('NFD') // تحويل الأحرف العربية إلى ASCII
    .replace(/[\u0300-\u036f]/g, '') // إزالة علامات التشكيل
    .replace(/[^a-zA-Z0-9._-]/g, '_') // استبدال الأحرف غير المسموحة بشرطة سفلية
    .replace(/_{2,}/g, '_') // إزالة الشرطات المتعددة
    .replace(/^_+|_+$/g, ''); // إزالة الشرطات من البداية والنهاية
  
  // إذا كان الاسم فارغاً بعد التنظيف، استخدم اسم افتراضي
  if (!sanitized || sanitized.length === 0) {
    sanitized = 'image';
  }
  
  // إضافة timestamp و random string لضمان التفرد
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  // تقليل طول الاسم إذا كان طويلاً جداً
  const maxNameLength = 50;
  const finalName = sanitized.length > maxNameLength 
    ? sanitized.substring(0, maxNameLength) 
    : sanitized;
  
  return `${timestamp}-${random}-${finalName}.${cleanExt}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // تنظيف اسم الملف
    const fileName = sanitizeFileName(file.name);
    console.log("Original filename:", file.name);
    console.log("Sanitized filename:", fileName);

    const { error } = await supabaseAdmin.storage
      .from("products")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { 
          error: "Upload failed",
          message: error.message || "فشل رفع الصورة",
          details: process.env.NODE_ENV === "development" ? error : undefined
        },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      { 
        error: "Server error",
        message: err?.message || "حدث خطأ أثناء رفع الصورة"
      },
      { status: 500 }
    );
  }
}
