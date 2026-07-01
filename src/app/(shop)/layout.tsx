export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  return prisma.category.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    take: 10,
  });
}

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories as never} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
