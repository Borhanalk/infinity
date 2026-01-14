"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Loader2, Building2 } from "lucide-react";
import { Toast } from "../components/Toast";

type Company = {
  id: number;
  name: string;
  logoUrl?: string | null;
  createdAt: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCompanies = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/admin/companies", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setError("فشل تحميل الشركات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const deleteCompany = useCallback(async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشركة؟")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setToast({ msg: data.error || "فشل حذف الشركة", type: "error" });
        setDeletingId(null);
        return;
      }

      setToast({ msg: "تم حذف الشركة بنجاح", type: "success" });
      setDeletingId(null);
      loadCompanies();
    } catch {
      setToast({ msg: "فشل حذف الشركة", type: "error" });
      setDeletingId(null);
    }
  }, [loadCompanies]);

  const companiesCount = useMemo(() => companies.length, [companies.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">الشركات</h1>
          <p className="text-muted-foreground text-lg">إدارة جميع الشركات ({companiesCount} شركة)</p>
        </div>
        <Button variant="gold" size="xl" asChild className="uppercase tracking-wide shadow-xl hover:shadow-2xl">
          <Link href="/admin/companies/add">
            <Plus size={20} className="ml-2" />
            إضافة شركة
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <div className="text-destructive text-lg font-bold">{error}</div>
          </CardContent>
        </Card>
      )}

      {companies.length === 0 && !loading && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-6 opacity-30">🏢</div>
            <p className="text-muted-foreground text-lg mb-6">لا توجد شركات بعد</p>
            <Button variant="gold" size="xl" asChild className="uppercase tracking-wide">
              <Link href="/admin/companies/add">
                <Plus size={20} className="ml-2" />
                إضافة شركة جديدة
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {companies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="border-border hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      loading="lazy"
                      className="w-16 h-16 object-contain rounded-lg border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C9A961] rounded-lg border border-border flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black mb-1 truncate">{company.name}</h3>
                    <p className="text-xs text-muted-foreground">العلامة التجارية</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" asChild className="flex-1 h-9 text-xs">
                    <Link href={`/admin/companies/edit/${company.id}`}>
                      <Edit size={14} className="ml-1.5" />
                      تعديل
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCompany(company.id)}
                    disabled={deletingId === company.id}
                    className="flex-1 h-9 text-xs"
                  >
                    {deletingId === company.id ? (
                      <Loader2 size={14} className="ml-1.5 animate-spin" />
                    ) : (
                      <Trash2 size={14} className="ml-1.5" />
                    )}
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
