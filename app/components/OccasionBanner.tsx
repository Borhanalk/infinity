"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function OccasionBanner() {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-[#C9A961] to-[#D4AF37] text-black py-3 px-4 relative overflow-hidden">
      <div className="container mx-auto flex justify-between items-center text-sm md:text-base relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌙</span>
          <div>
            <span className="font-bold">Special Eid Offers!</span>
            <span className="hidden md:inline ml-3 text-black/80">
              - Up to 50% OFF on Shoes & Suits
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="hover:bg-black/10 p-1 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      {/* Decorative shapes */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-300/30 rounded-full blur-xl"></div>
    </div>
  );
}
