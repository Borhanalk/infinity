import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "INFINITY MOTAGEM SEVEN | חנות בגדי גברים יוקרתית",
  description: "ברוכים הבאים לחנות INFINITY MOTAGEM SEVEN - עיצובים מודרניים ואיכותיים לגבר המודרני.",
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
        </Providers>
      </body>
    </html>
  );
}
