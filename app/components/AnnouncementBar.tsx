"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Campaign = {
  id: string;
  title: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  showOnHomepage: boolean;
};

export function AnnouncementBar() {
  const [showBanner, setShowBanner] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.showOnHomepage) {
          setCampaign(data);
        }
      })
      .catch(() => {
        // Fallback to default message
        setCampaign({
          id: "default",
          title: "מבצעים מיוחדים",
          description: "מבצעים מיוחדים לרגל החג! קנה 2 וקבל 3 בחינם.",
          showOnHomepage: true,
        });
      });
  }, []);

  if (!campaign || !showBanner) return null;

  const discountText = campaign.discountPercent
    ? `הנחה ${campaign.discountPercent}%`
    : campaign.discountAmount
    ? `הנחה ${campaign.discountAmount} ₪`
    : "";

  return (
    <div className="bg-gradient-to-r from-foreground via-foreground/95 to-foreground text-background text-[10px] sm:text-xs lg:text-sm py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 flex justify-between items-center border-b border-border/50 shadow-sm">
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4 flex-1 min-w-0">
        <span className="text-[#D4AF37] text-sm sm:text-lg lg:text-xl animate-pulse flex-shrink-0">🎯</span>
        <span className="font-bold tracking-wide truncate">
          {campaign.title} {discountText && `- ${discountText}`}
          {campaign.description && (
            <span className="hidden sm:inline"> - {campaign.description}</span>
          )}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowBanner(false)}
        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 hover:bg-background/20 transition-colors flex-shrink-0"
        aria-label="סגור"
      >
        <X size={14} className="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] opacity-80 hover:opacity-100" />
      </Button>
    </div>
  );
}
