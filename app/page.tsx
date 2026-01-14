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
      <div className="bg-black text-white py-4 border-t border-gray-800 overflow-hidden relative flex items-center min-h-[56px]">
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="whitespace-nowrap px-4 text-sm font-bold absolute w-full text-center md:text-right flex justify-center md:justify-end gap-8">
            <span className="text-yellow-400">★ מבצעי העונה:</span>
            <span>הנחה 20% על נעליים</span>
            <span className="opacity-50">|</span>
            <span className="text-yellow-400">★ חדש:</span>
            <span>חליפות פשתן קיץ</span>
          </div>
        </div>
        <Link
          href="/sale"
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs md:text-sm font-black px-8 flex items-center gap-2 z-20 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
        >
          <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
          <span>צפה במבצעים</span>
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
    <div className="bg-black text-white py-4 border-t border-gray-800 overflow-hidden relative flex items-center min-h-[56px]">
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="whitespace-nowrap px-4 text-sm font-bold absolute w-full text-center md:text-right flex justify-center md:justify-end gap-8">
          <span className="text-yellow-400">★ {campaign.title}:</span>
          {discountText && <span>{discountText}</span>}
          {campaign.description && (
            <>
              <span className="opacity-50">|</span>
              <span>{campaign.description}</span>
            </>
          )}
        </div>
      </div>
      <Link
        href="/sale"
        className="group absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs md:text-sm font-black px-8 flex items-center gap-2 z-20 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
      >
        <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
        <span>צפה במבצעים</span>
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
        if (Array.isArray(data)) {
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
            if (Array.isArray(data)) {
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
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {/* 1) AnnouncementBar (مناسبة/حملة) */}
      <AnnouncementBar />

      {/* 2) Hero */}
      <Hero />

      {/* 3) Marquee Section - Dynamic from Campaign */}
      <MarqueeSection />

      {/* 4) New Collections */}
      {!loading && newProducts.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <Button
                variant="ghost"
                asChild
                size="lg"
                className="group text-muted-foreground hover:text-foreground font-bold text-base uppercase tracking-wide"
              >
                <Link href="/collections/new">
                  <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                  <span>הצג הכל</span>
                </Link>
              </Button>
              <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">חדש</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5) Categories */}
      <section className="py-24 bg-gradient-to-b from-secondary/20 via-background to-background border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-16 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">קניות לפי קטגוריה</h2>
          <CategoryGrid />
        </div>
      </section>

      {/* 6) Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div>
              <h3 className="text-xl font-black mb-4 text-white">אודותינו</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                חנות בגדי גברים יוקרתית עם איכות גבוהה ועיצוב מודרני.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-black mb-4 text-white">קישורים מהירים</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/collections/new" className="text-gray-400 hover:text-white transition-colors text-sm">
                    חדש
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="text-gray-400 hover:text-white transition-colors text-sm">
                    מבצעים
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                    כל המוצרים
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-black mb-4 text-white">צור קשר</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>טלפון: 03-1234567</li>
                <li>אימייל: info@store.co.il</li>
                <li>כתובת: תל אביב, ישראל</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-black mb-4 text-white">עקבו אחרינו</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-sm">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  <span className="text-sm">ig</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section with Buttons */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} כל הזכויות שמורות.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  variant="gold"
                  size="xl"
                  asChild
                  className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
                >
                  <Link href="/products">
                    כל המוצרים
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="xl"
                  asChild
                  className="uppercase tracking-wide shadow-xl hover:shadow-2xl"
                >
                  <Link href="/sale">
                    מבצעים
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  asChild
                  className="uppercase tracking-wide shadow-xl hover:shadow-2xl border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
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
