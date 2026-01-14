import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "./components/Navbar";
import { FloatingCart } from "./components/FloatingCart";

export const metadata: Metadata = {
  title: "הגבר האלגנטי | חנות בגדי גברים",
  description: "חנות בגדי גברים עם עיצוב יוקרתי ומחירים נוחים.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <FloatingCart />
        </Providers>
      </body>
    </html>
  );
}
