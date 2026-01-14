"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="loader fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-800"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="loader-content flex items-center gap-4 animate-pulse">
        <span className="loader-text text-2xl text-[#C9A961] tracking-[0.3em] serif-font font-light">
          GENTLEMAN'S ATELIER
        </span>
      </div>
    </div>
  );
}
