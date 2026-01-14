 "use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export function Toast({ message, type = "success", onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const color =
    type === "success"
      ? "bg-emerald-600 text-white"
      : "bg-red-600 text-white";

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className={`${color} px-4 py-3 rounded shadow-lg min-w-[200px]`}>
        {message}
      </div>
    </div>
  );
}
