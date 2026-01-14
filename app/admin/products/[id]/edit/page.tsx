"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Toast } from "../../../components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X, Trash2, ArrowLeft } from "lucide-react";

type Company = { id: number; name: string };

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [productRes, companiesRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch("/api/admin/companies"),
        ]);

        if (!productRes.ok) throw new Error("فشل تحميل المنتج");
        const productData = await productRes.json();
        setProduct(productData);

        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(Array.isArray(companiesData) ? companiesData : []);
        }

        setLoading(false);
      } catch {
        setError("فشل تحميل البيانات");
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function uploadNewImages() {
    if (newImages.length === 0) return [];
    const urls: string[] = [];
    for (const file of newImages) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("فشل رفع الصورة");
      const data = await res.json();
      urls.push(data.url);
    }
    return urls;
  }

  function handleNewImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const currentImagesCount = product.images?.length || 0;
    const totalCount = currentImagesCount + newImages.length + fileArray.length;
    
    if (totalCount > 3) {
      setToast({ msg: "يمكنك إضافة 3 صور كحد أقصى للمنتج", type: "error" });
      return;
    }
    
    setNewImages(prev => [...prev, ...fileArray]);
  }

  function removeNewImage(index: number) {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  }

  async function deleteImage(imageId: string) {
    if (!confirm("هل تريد حذف هذه الصورة؟")) return;
    const res = await fetch(`/api/admin/products/${id}/images/${imageId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setToast({ msg: "فشل حذف الصورة", type: "error" });
      return;
    }
    setProduct({
      ...product,
      images: product.images.filter((img: any) => img.id !== imageId),
    });
    setToast({ msg: "تم حذف الصورة", type: "success" });
  }

  async function save() {
    try {
      setError("");
      
      const currentImagesCount = product.images?.length || 0;
      const totalCount = currentImagesCount + newImages.length;
      
      if (totalCount === 0) {
        setError("يجب أن يكون للمنتج صورة واحدة على الأقل");
        setToast({ msg: "يجب أن يكون للمنتج صورة واحدة على الأقل", type: "error" });
        return;
      }
      
      if (totalCount > 3) {
        setError("يمكنك إضافة 3 صور كحد أقصى للمنتج");
        setToast({ msg: "يمكنك إضافة 3 صور كحد أقصى للمنتج", type: "error" });
        return;
      }
      
      setUploading(true);
      const newImageUrls = await uploadNewImages();
      const allImages = [
        ...(product.images || []).map((img: any) => img.url),
        ...newImageUrls,
      ];
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          description: product.description,
          companyId: product.companyId,
          images: allImages,
        }),
      });
      if (!res.ok) {
        setError("فشل حفظ التغييرات");
        setToast({ msg: "فشل الحفظ", type: "error" });
        return;
      }
      setToast({ msg: "تم الحفظ بنجاح", type: "success" });
      setNewImages([]);
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch (err) {
      setError("خطأ في الحفظ");
      setToast({ msg: "خطأ في الحفظ", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">تعديل المنتج</h1>
        <p className="text-muted-foreground text-lg">عدّل معلومات المنتج</p>
      </div>

      <div className="space-y-6">
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
                value={product.name}
                onChange={e => setProduct({ ...product, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-base font-bold mb-2 block">السعر</Label>
              <Input
                id="price"
                type="number"
                placeholder="السعر"
                className="h-14 text-base rounded-xl"
                value={product.price}
                onChange={e =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-bold mb-2 block">الوصف</Label>
              <textarea
                id="description"
                placeholder="الوصف"
                className="w-full min-h-[120px] px-4 py-3 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                value={product.description}
                onChange={e =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-base font-bold mb-2 block">الشركة (اختياري)</Label>
              <select
                id="company"
                className="h-14 w-full px-4 bg-background border border-input rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
                value={product.companyId ?? ""}
                onChange={e =>
                  setProduct({ ...product, companyId: Number(e.target.value) })
                }
                required
              >
                <option value="" disabled>اختر الشركة</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-black">الصور</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">صورة واحدة إجبارية، صورتان اختياريتان (حد أقصى 3 صور)</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Images */}
            {product.images && product.images.length > 0 && (
              <div>
                <Label className="text-base font-bold mb-4 block">الصور الحالية ({product.images.length} من 3):</Label>
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((img: any, index: number) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.url}
                        alt="Product"
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
                        onClick={() => deleteImage(img.id)}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                        disabled={product.images.length === 1 && index === 0}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* معاينة الصور الجديدة */}
            {newImages.length > 0 && (
              <div>
                <Label className="text-base font-bold mb-4 block">الصور الجديدة المضافة:</Label>
                <div className="grid grid-cols-3 gap-4">
                  {newImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-40 object-cover rounded-xl border-2 border-border"
                      />
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-black px-2 py-1 rounded">جديدة</span>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeNewImage(index)}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div>
              <Label className="text-base font-bold mb-4 block">إضافة صور جديدة:</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                className="h-14 text-base rounded-xl cursor-pointer"
                disabled={(product.images?.length || 0) + newImages.length >= 3}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {(() => {
                  const current = product.images?.length || 0;
                  const total = current + newImages.length;
                  if (total === 0) return "يرجى إضافة صورة واحدة على الأقل";
                  if (total < 3) return `يمكنك إضافة ${3 - total} صورة أخرى`;
                  return "تم الوصول للحد الأقصى (3 صور)";
                })()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <div className="flex gap-4">
          <Button
            variant="gold"
            size="xl"
            onClick={save}
            disabled={uploading}
            className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={20} className="ml-2" />
                حفظ التغييرات
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => router.push("/admin/products")}
            className="uppercase tracking-wide"
          >
            <ArrowLeft size={20} className="ml-2" />
            إلغاء
          </Button>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-6">
              <p className="text-destructive font-bold">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

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
