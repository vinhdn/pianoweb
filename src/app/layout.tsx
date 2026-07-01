import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/store/cart-context";
import { CompareProvider } from "@/store/compare-context";
import { Toaster } from "@/components/ui/toaster";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://pianobeauty.vn"),
  title: {
    default: "Piano Beauty | Đàn Piano Chính Hãng Tại Việt Nam",
    template: "%s | Piano Beauty",
  },
  description:
    "Piano Beauty - Chuyên phân phối đàn piano acoustic, piano điện, grand piano chính hãng. Yamaha, Kawai, Roland, Casio. Giá tốt nhất, bảo hành chính hãng.",
  keywords: ["đàn piano", "piano acoustic", "piano điện", "grand piano", "yamaha piano", "kawai piano", "roland piano"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Piano Beauty",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="min-h-full antialiased">
        <SessionProvider>
          <CartProvider>
            <CompareProvider>
              {children}
              <Toaster />
            </CompareProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
