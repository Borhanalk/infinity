"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type Campaign = {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
};

export function EventBar() {
  const pathname = usePathname();
  
  // Don't show in admin pages
  if (pathname?.startsWith("/admin")) return null;

  // For now, hardcoded. Later can be fetched from API
  const activeCampaign: Campaign | null = {
    id: "1",
    title: "Ramadan Offer",
    subtitle: "Up to 30% OFF + Free shipping over $199",
    ctaText: "Shop Now",
    ctaLink: "/sales",
    isActive: true,
  };

  if (!activeCampaign || !activeCampaign.isActive) return null;

  return (
    <div className="bg-gradient-to-r from-[#C9A961] to-[#D4AF37] text-black py-3 px-4 text-center relative overflow-hidden">
      <div className="container mx-auto flex justify-between items-center text-sm md:text-base relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌙</span>
          <div>
            <span className="font-bold">{activeCampaign.title}</span>
            <span className="hidden md:inline ml-3 text-black/80">
              {activeCampaign.subtitle}
            </span>
          </div>
        </div>
        <Link
          href={activeCampaign.ctaLink}
          className="px-4 py-1 bg-black text-[#C9A961] text-xs font-semibold tracking-wider uppercase hover:bg-gray-900 transition-colors rounded"
        >
          {activeCampaign.ctaText}
        </Link>
      </div>
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-300/30 rounded-full blur-xl"></div>
    </div>
  );
}
