"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Hero } from "./components/Hero";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductCard } from "./components/ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Campaign = {
  id: string;
  title: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  isNew: boolean;
  isOnSale: boolean;
  discountPercent?: number | null;
  originalPrice?: number | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  images: Array<{
    id: string;
    url: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
  }>;
  sizes: Array<{
    id: string;
    size: string;
    quantity: number;
  }>;
};

function MarqueeSection() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.showOnHomepage) {
          setCampaign(data);
        }
      })
      .catch(() => { });
  }, []);

  if (!campaign) {
    // Default marquee
    return (
      <div className="bg-black text-white py-3 sm:py-4 border-t border-gray-800 overflow-hidden relative flex items-center min-h-[48px] sm:min-h-[56px]">
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="whitespace-nowrap px-2 sm:px-4 text-xs sm:text-sm font-bold absolute w-full text-center lg:text-right flex justify-center lg:justify-end gap-4 sm:gap-8">
            <span className="text-yellow-400">★ מבצעי העונה:</span>
            <span>הנחה 20% על נעליים</span>
            <span className="opacity-50">|</span>
            <span className="text-yellow-400">★ חדש:</span>
            <span>חליפות פשתן קיץ</span>
          </div>
        </div>
        <Link
          href="/sale"
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs sm:text-sm font-black px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 z-20 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
        >
          <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform rotate-180" />
          <span className="hidden sm:inline">צפה במבצעים</span>
          <span className="sm:hidden">מבצעים</span>
        </Link>
      </div>
    );
  }

  const discountText = campaign.discountPercent
    ? `הנחה ${campaign.discountPercent}%`
    : campaign.discountAmount
      ? `הנחה ${campaign.discountAmount} ₪`
      : "";

  return (
    <div className="bg-black text-white py-2 sm:py-3 lg:py-4 border-t border-gray-800 overflow-hidden relative flex items-center min-h-[40px] sm:min-h-[48px] lg:min-h-[56px]">
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="whitespace-nowrap px-2 sm:px-3 lg:px-4 text-[10px] sm:text-xs lg:text-sm font-bold absolute w-full text-center md:text-right flex justify-center md:justify-end gap-2 sm:gap-4 lg:gap-8">
          <span className="text-yellow-400">★ {campaign.title}:</span>
          {discountText && <span>{discountText}</span>}
          {campaign.description && (
            <>
              <span className="opacity-50">|</span>
              <span className="hidden sm:inline">{campaign.description}</span>
            </>
          )}
        </div>
      </div>
      <Link
        href="/sale"
        className="group absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-[10px] sm:text-xs lg:text-sm font-black px-3 sm:px-4 lg:px-6 xl:px-8 flex items-center gap-1 sm:gap-2 z-20 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
      >
        <ArrowRight size={12} className="group-hover:-translate-x-1 transition-transform rotate-180 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
        <span className="hidden sm:inline">צפה במבצעים</span>
        <span className="sm:hidden">מבצעים</span>
      </Link>
    </div>
  );
}

export default function Home() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب البضاعة الجديدة من قاعدة البيانات
    fetch("/api/new-arrivals")
      .then((res) => res.json())
      .then((data) => {
        // التحقق من وجود products في الـ response (في حالة وجود خطأ)
        if (data.products) {
          setNewProducts(Array.isArray(data.products) ? data.products : []);
        } else if (Array.isArray(data)) {
          setNewProducts(data);
        } else {
          setNewProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching new arrivals:", err);
        // Fallback إلى المنتجات الجديدة العادية
        fetch("/api/products?filter=new")
          .then((res) => res.json())
          .then((data) => {
            // التحقق من وجود products في الـ response
            if (data.products) {
              setNewProducts(Array.isArray(data.products) ? data.products : []);
            } else if (Array.isArray(data)) {
              setNewProducts(data);
            } else {
              setNewProducts([]);
            }
            setLoading(false);
          })
          .catch(() => {
            setNewProducts([]);
            setLoading(false);
          });
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden" dir="rtl">
      {/* 1) AnnouncementBar (مناسبة/حملة) */}
      <AnnouncementBar />

      {/* 2) Hero */}
      <Hero />

      {/* 3) Marquee Section - Dynamic from Campaign */}
      <MarqueeSection />

      {/* 4) New Collections */}
      {!loading && newProducts.length > 0 && (
        <section className="py-6 sm:py-12 lg:py-16 xl:py-24 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-8 lg:mb-12 xl:mb-16 gap-3 sm:gap-4">
              <Button
                variant="ghost"
                asChild
                size="default"
                className="group text-muted-foreground hover:text-foreground font-semibold"
              >
                <Link href="/collections/new">
                  <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                  <span>הצג הכל</span>
                </Link>
              </Button>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-7xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">חדש</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
              {newProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5) Categories */}
      <section className="py-6 sm:py-12 lg:py-16 xl:py-24 bg-gradient-to-b from-secondary/20 via-background to-background border-t border-border overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-7xl font-black mb-4 sm:mb-8 lg:mb-12 xl:mb-16 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">קניות לפי קטגוריה</h2>
          <CategoryGrid />
        </div>
      </section>

      {/* 6) Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-6 sm:py-12 lg:py-16 border-t border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
            {/* About */}
            <div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-black mb-2 sm:mb-4 text-white">אודותינו</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                חנות בגדי גברים יוקרתית עם איכות גבוהה ועיצוב מודרני.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-black mb-2 sm:mb-4 text-white">קישורים מהירים</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link href="/collections/new" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    חדש
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    מבצעים
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    כל המוצרים
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-black mb-2 sm:mb-4 text-white">צור קשר</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>טלפון: 03-1234567</li>
                <li>אימייל: info@store.co.il</li>
                <li>כתובת: תל אביב, ישראל</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-black mb-2 sm:mb-4 text-white">עקבו אחרינו</h3>
              <div className="flex gap-2 sm:gap-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-xs sm:text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-xs sm:text-sm">in</span>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-xs sm:text-sm">ig</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section with Buttons */}
          <div className="border-t border-gray-800 pt-4 sm:pt-6 lg:pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 lg:gap-6">
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm text-center lg:text-right">
                © {new Date().getFullYear()} כל הזכויות שמורות.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center">
                <Button
                  variant="gold"
                  size="sm"
                  asChild
                  className="uppercase tracking-wide shadow-xl hover:shadow-2xl text-[10px] sm:text-xs lg:text-sm h-8 sm:h-10 lg:h-12"
                >
                  <Link href="/products">
                    כל המוצרים
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  asChild
                  className="uppercase tracking-wide shadow-xl hover:shadow-2xl text-[10px] sm:text-xs lg:text-sm h-8 sm:h-10 lg:h-12"
                >
                  <Link href="/sale">
                    מבצעים
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="uppercase tracking-wide shadow-xl hover:shadow-2xl border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-[10px] sm:text-xs lg:text-sm h-8 sm:h-10 lg:h-12"
                >
                  <Link href="/collections/new">
                    חדש
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
