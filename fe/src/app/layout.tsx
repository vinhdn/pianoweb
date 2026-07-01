import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Piano Beauty - Đàn Piano Chất Lượng Cao",
    template: "%s | Piano Beauty",
  },
  description:
    "Cửa hàng đàn piano chính hãng: Yamaha, Kawai, Roland, Steinway. Bảo hành uy tín, giao hàng toàn quốc.",
  keywords: ["đàn piano", "mua đàn piano", "piano yamaha", "piano kawai", "piano roland"],
  openGraph: {
    siteName: "Piano Beauty",
    type: "website",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
