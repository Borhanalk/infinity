"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../contexts/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  images: { url: string }[];
  isOnSale?: boolean;
  discountPercent?: number | null;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?onSale=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data.filter((p: Product) => p.isOnSale) : []);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to load products:", errorData);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "10-20" && p.discountPercent && p.discountPercent >= 10 && p.discountPercent < 20) return true;
    if (filter === "20-40" && p.discountPercent && p.discountPercent >= 20 && p.discountPercent < 40) return true;
    if (filter === "40+" && p.discountPercent && p.discountPercent >= 40) return true;
    if (filter === "under99" && p.price < 99) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] pt-24">
      <section className="py-20 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#C9A961] text-xs tracking-[0.3em] uppercase block mb-3 font-light">מבצעים</span>
            <h1 className="text-5xl md:text-6xl serif-font mb-4 font-light">LAST CHANCE</h1>
            <p className="text-gray-400 font-light">Limited time offers on premium pieces</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 border text-sm tracking-wider uppercase transition-colors ${
                filter === "all"
                  ? "border-[#C9A961] bg-[#C9A961] text-black"
                  : "border-[#2a2a2a] text-gray-400 hover:border-[#C9A961]"
              }`}
            >
              All Sales
            </button>
            <button
              onClick={() => setFilter("10-20")}
              className={`px-6 py-2 border text-sm tracking-wider uppercase transition-colors ${
                filter === "10-20"
                  ? "border-[#C9A961] bg-[#C9A961] text-black"
                  : "border-[#2a2a2a] text-gray-400 hover:border-[#C9A961]"
              }`}
            >
              10-20% OFF
            </button>
            <button
              onClick={() => setFilter("20-40")}
              className={`px-6 py-2 border text-sm tracking-wider uppercase transition-colors ${
                filter === "20-40"
                  ? "border-[#C9A961] bg-[#C9A961] text-black"
                  : "border-[#2a2a2a] text-gray-400 hover:border-[#C9A961]"
              }`}
            >
              20-40% OFF
            </button>
            <button
              onClick={() => setFilter("40+")}
              className={`px-6 py-2 border text-sm tracking-wider uppercase transition-colors ${
                filter === "40+"
                  ? "border-[#C9A961] bg-[#C9A961] text-black"
                  : "border-[#2a2a2a] text-gray-400 hover:border-[#C9A961]"
              }`}
            >
              40%+ OFF
            </button>
            <button
              onClick={() => setFilter("under99")}
              className={`px-6 py-2 border text-sm tracking-wider uppercase transition-colors ${
                filter === "under99"
                  ? "border-[#C9A961] bg-[#C9A961] text-black"
                  : "border-[#2a2a2a] text-gray-400 hover:border-[#C9A961]"
              }`}
            >
              Under $99
            </button>
          </div>

          {loading && (
            <div className="text-center py-20 text-gray-500 font-light">Loading...</div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const img = p.images?.[0]?.url;
                const originalPrice = p.originalPrice || p.price;
                const discount = p.discountPercent || 0;

                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="art-card group cursor-pointer reveal-text"
                  >
                    <div className="relative overflow-hidden aspect-[3/4] mb-4">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          className="product-img w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#141414] to-[#0a0a0a] flex items-center justify-center border border-[#2a2a2a]">
                          <span className="text-5xl opacity-30">⚜</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 tracking-wider uppercase font-semibold">
                        -{discount}%
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/80 backdrop-blur-sm border-t border-[#2a2a2a]">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addItem({
                              id: p.id,
                              name: p.name,
                              price: p.price,
                              image: img,
                            });
                          }}
                          className="w-full text-white text-xs tracking-[0.2em] uppercase border border-white/20 py-3 hover:bg-white hover:text-black transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base mb-2 serif-font font-light">{p.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through text-sm">${originalPrice}</span>
                        <span className="text-[#C9A961] serif-font italic text-lg">${p.price}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 opacity-30">⚜</div>
              <div className="text-gray-400 text-lg font-light">No products found</div>
              <div className="text-gray-500 text-sm mt-2 font-light">Try different filters</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
