"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toast } from "../components/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Target } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  isActive: boolean;
  showOnHomepage: boolean;
  startDate?: string;
  endDate?: string;
  products: Array<{ productId: string }>;
  createdAt: string;
};

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/campaigns");
      if (!res.ok) throw new Error("فشل تحميل الخصومات");
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      setError("فشل تحميل الخصومات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const deleteCampaign = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخصم؟")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || "فشل حذف الخصم";
        setToast({ msg: errorMsg, type: "error" });
        setDeletingId(null);
        return;
      }

      setToast({ msg: "تم حذف الخصم بنجاح", type: "success" });
      setDeletingId(null);
      fetchCampaigns();
    } catch (err: any) {
      console.error("Error deleting campaign:", err);
      setToast({ msg: "حدث خطأ أثناء حذف الخصم", type: "error" });
      setDeletingId(null);
    }
  }, [fetchCampaigns]);

  const campaignsCount = useMemo(() => campaigns.length, [campaigns.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-8">
          <div className="text-destructive text-lg font-bold">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">إدارة الخصومات</h1>
          <p className="text-muted-foreground text-lg">إدارة جميع الخصومات والعروض ({campaignsCount} خصم)</p>
        </div>
        <Button variant="gold" size="xl" asChild className="uppercase tracking-wide shadow-xl hover:shadow-2xl">
          <Link href="/admin/campaigns/add">
            <Plus size={20} className="ml-2" />
            إضافة خصم جديد
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-6 opacity-30">🎯</div>
            <p className="text-muted-foreground text-lg mb-6">لا توجد خصومات حالياً</p>
            <Button variant="gold" size="xl" asChild className="uppercase tracking-wide">
              <Link href="/admin/campaigns/add">
                <Plus size={20} className="ml-2" />
                إضافة خصم جديد
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-border hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-black truncate">{campaign.title}</h3>
                      {campaign.isActive && (
                        <Badge className="bg-green-500 text-white text-xs font-black">نشط</Badge>
                      )}
                      {campaign.showOnHomepage && (
                        <Badge variant="secondary" className="text-xs font-black">على الرئيسية</Badge>
                      )}
                    </div>
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{campaign.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm mb-3 pb-3 border-b border-border">
                  {campaign.discountPercent && (
                    <div>
                      <span className="text-muted-foreground">نسبة: </span>
                      <span className="font-black text-destructive">{campaign.discountPercent}%</span>
                    </div>
                  )}
                  {campaign.discountAmount && (
                    <div>
                      <span className="text-muted-foreground">مبلغ: </span>
                      <span className="font-black text-destructive">{campaign.discountAmount} ₪</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">منتجات: </span>
                    <span className="font-black">{campaign.products.length}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 h-9 text-xs">
                    <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                      <Edit size={14} className="ml-1.5" />
                      تعديل
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCampaign(campaign.id)}
                    disabled={deletingId === campaign.id}
                    className="flex-1 h-9 text-xs"
                  >
                    {deletingId === campaign.id ? (
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
