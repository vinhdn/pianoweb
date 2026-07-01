import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@pianobeauty.vn" },
    update: {},
    create: {
      email: "admin@pianobeauty.vn",
      name: "Admin Piano Beauty",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // Create categories
  const categories = [
    { name: "Đàn Piano Cơ", slug: "dan-piano-co", description: "Đàn piano cơ acoustic chính hãng" },
    { name: "Đàn Piano Điện", slug: "dan-piano-dien", description: "Đàn piano điện và digital piano" },
    { name: "Đàn Grand Piano", slug: "dan-grand-piano", description: "Grand piano cao cấp" },
    { name: "Đàn Organ", slug: "dan-organ", description: "Đàn organ điện và phụ kiện" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        ...cat,
        metaTitle: `${cat.name} | Piano Beauty`,
        metaDesc: cat.description,
      },
    });
  }
  console.log("Categories created");

  // Settings
  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: {},
    create: { key: "site_name", value: "Piano Beauty" },
  });
  await prisma.setting.upsert({
    where: { key: "site_description" },
    update: {},
    create: { key: "site_description", value: "Chuyên phân phối đàn piano chính hãng tại Việt Nam" },
  });
  await prisma.setting.upsert({
    where: { key: "phone" },
    update: {},
    create: { key: "phone", value: "0909 123 456" },
  });
  await prisma.setting.upsert({
    where: { key: "address" },
    update: {},
    create: { key: "address", value: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" },
  });

  console.log("Settings created");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
