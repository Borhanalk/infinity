"use client";

import { useEffect, useState } from "react";
import { Toast } from "../../components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

type Color = { name: string; hex: string };
type Size = { size: string; quantity: number };
type Category = { id: number; name: string };
type Company = { id: number; name: string };

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  const [colors, setColors] = useState<Color[]>([{ name: "", hex: "#000000" }]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError("");
        const [catRes, compRes] = await Promise.all([
          fetch("/api/admin/categories", { cache: "no-store" }),
          fetch("/api/admin/companies", { cache: "no-store" }),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
          if (catData.length > 0) setCategoryId(catData[0].id);
        }

        if (compRes.ok) {
          const compData = await compRes.json();
          setCompanies(Array.isArray(compData) ? compData : []);
          if (compData.length > 0) setCompanyId(compData[0].id);
        }
      } catch {
        setError("فشل تحميل البيانات");
      }
    }
    loadData();
  }, []);

  function addColor() {
    setColors([...colors, { name: "", hex: "#000000" }]);
  }

  function removeColor(index: number) {
    setColors((prev) => prev.filter((_, i) => i !== index));
  }

  function generateSizes(type: string) {
    let generated: string[] = [];
    if (type === "shoes") generated = ["39", "40", "41", "42", "43", "44", "45"];
    if (type === "pants") generated = ["28", "30", "32", "34", "36", "38"];
    if (type === "clothes") generated = ["S", "M", "L", "XL"];
    setSizes(generated.map(s => ({ size: s, quantity: 0 })));
  }

  function removeSize(index: number) {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadImages() {
    if (imageFiles.length === 0) return [];
    // رفع كل الصور بالتوازي لتحسين السرعة
    const uploads = imageFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch("/api/upload", { method: "POST", body: formData }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "فشل رفع الصورة");
        }
        const data = await res.json();
        return data.url as string;
      });
    });

    return await Promise.all(uploads);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    if (fileArray.length > 3) {
      setToast({ msg: "يمكنك اختيار 3 صور كحد أقصى", type: "error" });
      return;
    }

    setImageFiles(fileArray);
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function saveProduct() {
    try {
      setLoading(true);
      setError("");

      if (!categoryId) {
        setError("يرجى اختيار فئة");
        setLoading(false);
        return;
      }

      if (!companyId) {
        setError("يرجى اختيار الشركة");
        setLoading(false);
        return;
      }

      if (imageFiles.length === 0) {
        setError("يرجى إضافة صورة واحدة على الأقل");
        setLoading(false);
        return;
      }

      if (imageFiles.length > 3) {
        setError("يمكنك إضافة 3 صور كحد أقصى");
        setLoading(false);
        return;
      }

      const imageUrls = await uploadImages();

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          description,
          categoryId,
          companyId,
          images: imageUrls,
          colors,
          sizes,
          isNew,
          isOnSale,
          discountPercent,
          originalPrice,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");

        // تحويل رسائل الأخطاء من السيرفر إلى رسائل مفهومة
        let friendly =
          errorText ||
          "فشل حفظ المنتج. يرجى مراجعة البيانات (الاسم، السعر، الفئة، الشركة، الصور).";

        if (errorText.includes("Name is required")) friendly = "اسم المنتج مطلوب.";
        else if (errorText.includes("Price must be a number"))
          friendly = "السعر يجب أن يكون رقماً صحيحاً.";
        else if (errorText.includes("Description is required"))
          friendly = "الوصف مطلوب.";
        else if (errorText.includes("categoryId must be a number"))
          friendly = "حدث خطأ في الفئة المختارة. حاول اختيار الفئة مرة أخرى.";
        else if (errorText.includes("companyId must be a number"))
          friendly = "حدث خطأ في الشركة المختارة. حاول اختيار الشركة مرة أخرى.";
        else if (errorText.includes("Category not found"))
          friendly = "الفئة المحددة غير موجودة. اختر فئة صحيحة.";
        else if (errorText.includes("Company not found"))
          friendly = "الشركة المحددة غير موجودة. اختر شركة صحيحة.";
        else if (errorText.includes("يجب إضافة صورة واحدة على الأقل"))
          friendly = "يجب إضافة صورة واحدة على الأقل.";
        else if (errorText.includes("يمكنك إضافة 3 صور كحد أقصى"))
          friendly = "يمكنك إضافة 3 صور كحد أقصى.";

        setError(friendly);
        setToast({ msg: friendly, type: "error" });
        return;
      }

      setToast({ msg: "تم حفظ المنتج", type: "success" });
      setName("");
      setPrice(0);
      setDescription("");
      setImageFiles([]);
      setColors([{ name: "", hex: "#000000" }]);
      setSizes([]);
      setIsNew(false);
      setIsOnSale(false);
      setDiscountPercent(null);
      setOriginalPrice(null);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message === "فشل رفع الصورة"
          ? "فشل رفع واحدة من الصور، تأكد من الاتصال وحجم الصورة وحاول مرة أخرى."
          : err?.message || "حدث خطأ غير متوقع أثناء حفظ المنتج.";
      setError(msg);
      setToast({ msg, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">إضافة منتج</h1>
        <p className="text-muted-foreground text-base lg:text-lg">أضف منتج جديد مع جميع التفاصيل</p>
      </div>

      {/* BASIC INFO */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-base font-bold mb-2 block">اسم المنتج</Label>
            <Input
              id="name"
              placeholder="اسم المنتج"
              className="h-14 text-base rounded-xl"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-base font-bold mb-2 block">الفئة</Label>
            <select
              id="category"
              className="h-14 w-full px-4 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
              value={categoryId ?? ""}
              onChange={e => setCategoryId(Number(e.target.value))}
              disabled={!categories.length}
            >
              <option value="" disabled>
                {categories.length ? "اختر الفئة" : "جاري تحميل الفئات..."}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="company" className="text-base font-bold mb-2 block">الشركة *</Label>
            <select
              id="company"
              className="h-14 w-full px-4 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
              value={companyId ?? ""}
              onChange={e => setCompanyId(Number(e.target.value))}
              required
              disabled={!companies.length}
            >
              <option value="" disabled>
                {companies.length ? "اختر الشركة" : "جاري تحميل الشركات..."}
              </option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="price" className="text-base font-bold mb-2 block">السعر</Label>
            <Input
              id="price"
              placeholder="السعر"
              type="number"
              className="h-14 text-base rounded-xl"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-bold mb-2 block">الوصف</Label>
            <textarea
              id="description"
              placeholder="الوصف"
              className="w-full min-h-[120px] px-4 py-3 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* NEW & SALE FIELDS */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={e => setIsNew(e.target.checked)}
                className="w-5 h-5 rounded border-input"
              />
              <span className="text-base font-bold">علامة جديدة</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isOnSale}
                onChange={e => setIsOnSale(e.target.checked)}
                className="w-5 h-5 rounded border-input"
              />
              <span className="text-base font-bold">عرض خاص</span>
            </label>
          </div>

          {isOnSale && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div>
                <Label htmlFor="originalPrice" className="text-sm font-bold mb-2 block">السعر الأصلي</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="السعر الأصلي"
                  className="h-12 rounded-xl"
                  value={originalPrice || ""}
                  onChange={e => setOriginalPrice(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              <div>
                <Label htmlFor="discountPercent" className="text-sm font-bold mb-2 block">نسبة الخصم %</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  placeholder="نسبة الخصم"
                  className="h-12 rounded-xl"
                  min="0"
                  max="100"
                  value={discountPercent || ""}
                  onChange={e => setDiscountPercent(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* IMAGES */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">الصور</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">صورة واحدة إجبارية، صورتان اختياريتان (حد أقصى 3 صور)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* معاينة الصور المختارة */}
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl border-2 border-border"
                  />
                  <div className="absolute top-2 right-2">
                    {index === 0 ? (
                      <span className="bg-green-500 text-white text-xs font-black px-2 py-1 rounded">إجبارية</span>
                    ) : (
                      <span className="bg-blue-500 text-white text-xs font-black px-2 py-1 rounded">اختيارية</span>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    disabled={index === 0 && imageFiles.length === 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input للصور */}
          <div>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="h-14 text-base rounded-xl cursor-pointer"
              disabled={imageFiles.length >= 3}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {imageFiles.length === 0 && "يرجى اختيار صورة واحدة على الأقل"}
              {imageFiles.length > 0 && imageFiles.length < 3 && `تم اختيار ${imageFiles.length} من 3 صور`}
              {imageFiles.length === 3 && "تم الوصول للحد الأقصى (3 صور)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* COLORS */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">الألوان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {colors.map((c, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Input
                placeholder="اسم اللون"
                className="flex-1 h-12 rounded-xl"
                value={c.name}
                onChange={e => {
                  const copy = [...colors];
                  copy[i].name = e.target.value;
                  setColors(copy);
                }}
              />
              <input
                type="color"
                value={c.hex}
                onChange={e => {
                  const copy = [...colors];
                  copy[i].hex = e.target.value;
                  setColors(copy);
                }}
                className="w-16 h-12 rounded-xl cursor-pointer"
              />
              <div
                className="w-12 h-12 rounded-full border-2 border-border"
                style={{ backgroundColor: c.hex }}
              />
              {colors.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeColor(i)}
                  className="rounded-xl"
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="lg" onClick={addColor} className="rounded-xl">
            <Plus size={18} className="ml-2" />
            إضافة لون
          </Button>
        </CardContent>
      </Card>

      {/* SIZES */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">المقاسات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <select
            onChange={e => generateSizes(e.target.value)}
            className="h-14 w-full px-4 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">اختر نوع المقاس</option>
            <option value="shoes">أحذية (39–45)</option>
            <option value="pants">بناطيل (28–38)</option>
            <option value="clothes">ملابس (S–XL)</option>
          </select>

          {sizes.map((s, i) => (
            <div key={i} className="flex gap-4 items-center">
              <span className="w-20 text-center font-bold text-lg">{s.size}</span>
              <Input
                type="number"
                placeholder="الكمية"
                className="flex-1 h-12 rounded-xl"
                onChange={e => {
                  const copy = [...sizes];
                  copy[i].quantity = Number(e.target.value);
                  setSizes(copy);
                }}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeSize(i)}
                className="rounded-xl"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SAVE */}
      <div className="flex gap-4">
        <Button
          variant="gold"
          size="xl"
          onClick={saveProduct}
          disabled={loading}
          className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save size={20} className="ml-2" />
              حفظ المنتج
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive font-bold">{error}</p>
          </CardContent>
        </Card>
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
